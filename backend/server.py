from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger

# Import email service
from email_service import send_confirmation_email, send_reminder_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize scheduler for reminder emails
scheduler = BackgroundScheduler()
scheduler.start()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Booking Models
class AppointmentBooking(BaseModel):
    client_first_name: str
    client_last_name: str
    client_phone: str
    client_email: str
    appointment_date: str
    start_time: str  # ISO datetime format
    service_id: str
    therapist_id: str = ""  # Empty string by default
    notes: Optional[str] = ""
    language: Optional[str] = "sr"  # Default to Serbian
    service_name: Optional[str] = ""  # For email display

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Booking Proxy Endpoint
@api_router.post("/book-appointment")
async def book_appointment(booking: AppointmentBooking, background_tasks: BackgroundTasks):
    """
    Proxy endpoint to forward booking requests to spa booking system
    Automatically rotates through web slot therapists to allow multiple simultaneous bookings
    Sends confirmation email immediately and schedules reminder 2h before appointment
    Special handling for "Masaža za parove" with custom duration and discounted price in notes
    """
    try:
        # Log the booking data for debugging
        logger.info(f"📌 BOOKING REQUEST - Service ID: {booking.service_id}, Service Name: {booking.service_name}, Client: {booking.client_first_name} {booking.client_last_name}, Time: {booking.start_time}")
        
        # Special handling for "Masaža za parove" - calculate total duration from notes
        is_couples_massage = "Masaža za parove" in (booking.service_name or "")
        couples_total_duration = None
        couples_final_price = None
        
        if is_couples_massage and booking.notes:
            # Extract total duration and final price from notes
            # Notes format includes "UKUPNA CENA SA POPUSTOM: X,XXX RSD"
            import re
            price_match = re.search(r'UKUPNA CENA SA POPUSTOM:\s*([\d,]+)\s*RSD', booking.notes)
            if price_match:
                couples_final_price = price_match.group(1).replace(',', '')
                logger.info(f"💰 Couples massage final price: {couples_final_price} RSD")
            
            # Calculate duration from notes (count massage durations)
            duration_matches = re.findall(r'\((\d+) min\)', booking.notes)
            if duration_matches:
                couples_total_duration = sum(int(d) for d in duration_matches)
                logger.info(f"⏱️ Couples massage total duration: {couples_total_duration} min")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get all therapists and filter for "Web Slot" therapists
            therapists_response = await client.get('https://pozdrav-kako-si.emergent.host/api/therapists')
            
            if therapists_response.status_code != 200:
                logger.error(f"Failed to get therapists: {therapists_response.status_code}")
                raise HTTPException(status_code=503, detail="Cannot access therapist list")
            
            therapists = therapists_response.json()
            web_slot_therapists = [t for t in therapists if t.get('name', '').startswith('Web Slot') and t.get('is_active', True)]
            
            if not web_slot_therapists:
                logger.error("No Web Slot therapists found")
                raise HTTPException(status_code=500, detail="Web booking system not configured")
            
            logger.info(f"Found {len(web_slot_therapists)} Web Slot therapists")
            
            # Try each Web Slot therapist until one is available
            booking_result = None
            for therapist in web_slot_therapists:
                booking.therapist_id = therapist['id']
                
                # Prepare booking payload
                booking_payload = booking.model_dump()
                
                # For couples massage, enhance notes with total duration and final price info
                if is_couples_massage and couples_total_duration and couples_final_price:
                    original_notes = booking_payload['notes']
                    booking_payload['notes'] = (
                        f"⭐ MASAŽA ZA PAROVE - UKUPNO TRAJANJE: {couples_total_duration} min ⭐\n"
                        f"💰 FINALNA CENA SA POPUSTOM (-15%): {couples_final_price} RSD 💰\n\n"
                        f"DETALJI:\n{original_notes}"
                    )
                    logger.info(f"📝 Enhanced couples massage notes with duration: {couples_total_duration}min, price: {couples_final_price} RSD")
                
                response = await client.post(
                    'https://pozdrav-kako-si.emergent.host/api/appointments',
                    json=booking_payload,
                    headers={'Content-Type': 'application/json'}
                )
                
                # If booking succeeds
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Booking successful with {therapist['name']} (ID: {therapist['id']})")
                    booking_result = response.json()
                    break
                
                # If this therapist is not available, try the next one
                if response.status_code == 400:
                    error_text = response.text.lower()
                    if 'not available' in error_text or 'unavailable' in error_text:
                        logger.info(f"⚠️ {therapist['name']} not available, trying next...")
                        continue
                
                # For other errors, log and continue to next therapist
                logger.warning(f"Error with {therapist['name']}: {response.status_code} - {response.text}")
            
            # If no therapist is available
            if not booking_result:
                logger.error(f"❌ All Web Slot therapists busy for {booking.start_time}")
                raise HTTPException(
                    status_code=400,
                    detail="Svi termini su zauzeti za izabrano vreme. Molimo izaberite drugo vreme."
                )
            
            # Send confirmation email immediately (in background)
            background_tasks.add_task(
                send_confirmation_email,
                client_email=booking.client_email,
                client_name=f"{booking.client_first_name} {booking.client_last_name}",
                client_phone=booking.client_phone,
                service_name=booking.service_name or "Tretman",
                appointment_datetime=booking.start_time,
                language=booking.language or 'sr'
            )
            logger.info(f"📧 Confirmation email scheduled for {booking.client_email}")
            
            # Schedule reminder email 2 hours before appointment
            try:
                appointment_dt = datetime.fromisoformat(booking.start_time.replace('Z', ''))
                # Make appointment_dt timezone-aware if it's naive
                if appointment_dt.tzinfo is None:
                    appointment_dt = appointment_dt.replace(tzinfo=timezone.utc)
                
                reminder_time = appointment_dt - timedelta(hours=2)
                
                # Only schedule if reminder time is in the future
                now = datetime.now(timezone.utc)
                if reminder_time > now:
                    scheduler.add_job(
                        send_reminder_email,
                        trigger=DateTrigger(run_date=reminder_time),
                        args=[
                            booking.client_email,
                            f"{booking.client_first_name} {booking.client_last_name}",
                            booking.service_name or "Tretman",
                            booking.start_time,
                            booking.language or 'sr'
                        ],
                        id=f"reminder_{booking_result['id']}",
                        replace_existing=True
                    )
                    logger.info(f"⏰ Reminder email scheduled for {reminder_time} (2h before appointment)")
                else:
                    logger.info(f"⚠️ Appointment too soon - no reminder scheduled")
                    
            except Exception as e:
                logger.error(f"Failed to schedule reminder: {e}")
            
            return booking_result
            
    except httpx.RequestError as e:
        logger.error(f"Booking API request error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Booking service unavailable"
        )
            
    except httpx.RequestError as e:
        logger.error(f"Booking API request error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Booking service unavailable"
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()