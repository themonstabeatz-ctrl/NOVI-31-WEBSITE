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

# Discount Settings Model - PER SERVICE
class ServiceDiscount(BaseModel):
    service_name: str  # e.g., "Tradicionalna tajlandska masaža - 60 min"
    discount_percentage: int = Field(default=0, ge=0, le=100)  # 0, 5, 10, 15, etc.

class AllDiscounts(BaseModel):
    discounts: dict  # service_name -> discount_percentage mapping

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
    duration_type: Optional[int] = None  # For couples massage total duration

# Couple Booking Model
class CoupleBooking(BaseModel):
    client_first_name: str
    client_last_name: str
    client_phone: str
    client_email: Optional[str] = ""
    start_time: str  # ISO datetime format
    duration_type: int  # 60, 90, or 120 minutes per person
    person1_services: List[str]  # List of service IDs for person 1
    person2_services: List[str]  # List of service IDs for person 2
    discount_couples_massage: float = 0.0  # NO discount - already applied in frontend
    language: Optional[str] = "sr"  # Default to Serbian

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/discounts")
async def get_all_discounts():
    """Get all service discounts"""
    try:
        settings = await db.settings.find_one({"_id": "service_discounts"})
        if settings and "discounts" in settings:
            return {"discounts": settings["discounts"]}
        else:
            # Default: no discounts
            return {"discounts": {}}
    except Exception as e:
        logger.error(f"Error fetching discounts: {e}")
        return {"discounts": {}}

@api_router.post("/discount/set")
async def set_service_discount(discount: ServiceDiscount):
    """Set discount for a specific service (0, 5, 10, 15)"""
    try:
        # Get current discounts
        settings = await db.settings.find_one({"_id": "service_discounts"})
        discounts = settings.get("discounts", {}) if settings else {}
        
        # Update discount for this service
        discounts[discount.service_name] = discount.discount_percentage
        
        # Save back to database
        await db.settings.update_one(
            {"_id": "service_discounts"},
            {"$set": {"discounts": discounts}},
            upsert=True
        )
        
        logger.info(f"✅ Discount for '{discount.service_name}' set to {discount.discount_percentage}%")
        return {"success": True, "service_name": discount.service_name, "discount_percentage": discount.discount_percentage}
    except Exception as e:
        logger.error(f"Error setting discount: {e}")
        raise HTTPException(status_code=500, detail="Failed to set discount")

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


# Health Check Endpoint
@api_router.get("/health")
async def health_check():
    """
    Simple health check endpoint to verify backend connectivity
    """
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Services Proxy Endpoint
@api_router.get("/services")
async def get_services():
    """
    Proxy endpoint to fetch services from booking system
    """
    # Use preview booking system
    booking_api_url = os.environ.get('BOOKING_API_URL', 'https://thai-reserve.preview.emergentagent.com')
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{booking_api_url}/api/services")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Error fetching services from booking system: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch services: {str(e)}")

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
        logger.info(f"📌 BOOKING REQUEST - Service ID: {booking.service_id}, Service Name: {booking.service_name}, Client: {booking.client_first_name} {booking.client_last_name}, Time: {booking.start_time}, Language: {booking.language}")
        
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
            booking_api_url = os.environ.get('BOOKING_API_URL', 'https://thai-reserve.preview.emergentagent.com')
            therapists_response = await client.get(f'{booking_api_url}/api/therapists')
            
            if therapists_response.status_code != 200:
                logger.error(f"Failed to get therapists: {therapists_response.status_code}")
                raise HTTPException(status_code=503, detail="Cannot access therapist list")
            
            therapists = therapists_response.json()
            # Support both "Web Slot" and "Web Rezervacije" therapist names
            web_slot_therapists = [t for t in therapists if (t.get('name', '').startswith('Web Slot') or t.get('name', '').startswith('Web Rezervacije')) and t.get('is_active', True)]
            
            if not web_slot_therapists:
                logger.error("No Web Slot or Web Rezervacije therapists found")
                raise HTTPException(status_code=500, detail="Web booking system not configured")
            
            logger.info(f"Found {len(web_slot_therapists)} web booking therapists")
            
            # Try each Web Slot therapist until one is available
            booking_result = None
            for therapist in web_slot_therapists:
                booking.therapist_id = therapist['id']
                
                # Prepare booking payload
                booking_payload = booking.model_dump()
                
                # For couples massage, enhance notes with total duration and final price info
                if is_couples_massage and couples_total_duration and couples_final_price:
                    original_notes = booking_payload['notes']
                    
                    # OVERRIDE service_name to show actual total duration
                    booking_payload['service_name'] = f"Masaža za parove - {couples_total_duration} min"
                    
                    # Set duration_type to total duration (120, 180, or 240)
                    booking_payload['duration_type'] = couples_total_duration
                    
                    booking_payload['notes'] = (
                        f"⭐ MASAŽA ZA PAROVE - UKUPNO TRAJANJE: {couples_total_duration} min ⭐\n"
                        f"💰 FINALNA CENA SA POPUSTOM (-15%): {couples_final_price} RSD 💰\n\n"
                        f"DETALJI:\n{original_notes}"
                    )
                    logger.info(f"📝 Enhanced couples massage: service_name={booking_payload['service_name']}, duration_type={couples_total_duration}, price: {couples_final_price} RSD")
                
                response = await client.post(
                    f'{booking_api_url}/api/appointments',
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
                logger.error(f"❌ All web booking therapists busy for {booking.start_time}")
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
                    logger.info("⚠️ Appointment too soon - no reminder scheduled")
                    
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

# Couple Booking Endpoint
@api_router.post("/book-couple-appointment")
async def book_couple_appointment(booking: CoupleBooking, background_tasks: BackgroundTasks):
    """
    Proxy endpoint for couple massage bookings
    Forwards to booking system's /api/appointments/couple endpoint
    """
    try:
        logger.info(f"📌 COUPLE BOOKING REQUEST - Client: {booking.client_first_name} {booking.client_last_name}, Duration: {booking.duration_type}min per person")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get available therapists
            booking_api_url = os.environ.get('BOOKING_API_URL', 'https://thai-reserve.preview.emergentagent.com')
            therapists_response = await client.get(f'{booking_api_url}/api/therapists')
            
            if therapists_response.status_code != 200:
                logger.error(f"Failed to get therapists: {therapists_response.status_code}")
                raise HTTPException(status_code=503, detail="Cannot access therapist list")
            
            therapists = therapists_response.json()
            # Support both "Web Slot" and "Web Rezervacije" therapist names
            web_slot_therapists = [t for t in therapists if (t.get('name', '').startswith('Web Slot') or t.get('name', '').startswith('Web Rezervacije')) and t.get('is_active', True)]
            
            if not web_slot_therapists:
                logger.error("No Web Slot or Web Rezervacije therapists found")
                raise HTTPException(status_code=500, detail="Web booking system not configured")
            
            logger.info(f"Found {len(web_slot_therapists)} web booking therapists")
            
            # Try each Web Slot therapist until one is available
            booking_result = None
            for therapist in web_slot_therapists:
                # Prepare booking payload for couple endpoint
                couple_payload = {
                    "client_first_name": booking.client_first_name,
                    "client_last_name": booking.client_last_name,
                    "client_phone": booking.client_phone,
                    "client_email": booking.client_email or None,
                    "therapist_id": therapist['id'],
                    "duration_type": booking.duration_type,
                    "person1_services": booking.person1_services,
                    "person2_services": booking.person2_services,
                    "start_time": booking.start_time,
                    "status": "scheduled",
                    "discount_couples_massage": booking.discount_couples_massage
                }
                
                logger.info(f"🔄 Trying {therapist['name']} (ID: {therapist['id']})")
                
                response = await client.post(
                    f'{booking_api_url}/api/appointments/couple',
                    json=couple_payload,
                    headers={'Content-Type': 'application/json'}
                )
                
                # If booking succeeds
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Couple booking successful with {therapist['name']} (ID: {therapist['id']})")
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
                logger.error(f"❌ All web booking therapists busy for {booking.start_time}")
                raise HTTPException(
                    status_code=400,
                    detail="Svi termini su zauzeti za izabrano vreme. Molimo izaberite drugo vreme."
                )
            
            # Send confirmation email (construct detailed service name with massage choices)
            # Get service names from booking system
            services_response = await client.get(f'{booking_api_url}/api/services')
            all_services = services_response.json() if services_response.status_code == 200 else []
            
            # Create service name lookup
            service_names = {s['id']: s['name'] for s in all_services}
            
            # Build detailed service description with massage choices
            total_duration = booking.duration_type * 2
            service_display_name = f"Masaža za parove - Ukupno {total_duration} min\n\n"
            service_display_name += "Osoba 1:\n"
            for service_id in booking.person1_services:
                service_name = service_names.get(service_id, service_id)
                service_display_name += f"  • {service_name}\n"
            service_display_name += "\nOsoba 2:\n"
            for service_id in booking.person2_services:
                service_name = service_names.get(service_id, service_id)
                service_display_name += f"  • {service_name}\n"
            
            background_tasks.add_task(
                send_confirmation_email,
                client_email=booking.client_email or "",
                client_name=f"{booking.client_first_name} {booking.client_last_name}",
                client_phone=booking.client_phone,
                service_name=service_display_name,
                appointment_datetime=booking.start_time,
                language=booking.language or 'sr'
            )
            logger.info(f"📧 Confirmation email scheduled for {booking.client_email}")
            
            # Schedule reminder email 2 hours before appointment
            try:
                appointment_dt = datetime.fromisoformat(booking.start_time.replace('Z', ''))
                if appointment_dt.tzinfo is None:
                    appointment_dt = appointment_dt.replace(tzinfo=timezone.utc)
                
                reminder_time = appointment_dt - timedelta(hours=2)
                
                if reminder_time > datetime.now(timezone.utc):
                    scheduler.add_job(
                        send_reminder_email,
                        DateTrigger(run_date=reminder_time),
                        args=[
                            booking.client_email or "",
                            f"{booking.client_first_name} {booking.client_last_name}",
                            booking.client_phone,
                            service_display_name,
                            booking.start_time,
                            booking.language or 'sr'
                        ],
                        id=f"reminder_{booking_result['id']}",
                        replace_existing=True
                    )
                    logger.info(f"⏰ Reminder email scheduled for {reminder_time} (2h before appointment)")
                else:
                    logger.info("⚠️ Appointment too soon - no reminder scheduled")
                    
            except Exception as e:
                logger.error(f"Failed to schedule reminder: {e}")
            
            return booking_result
            
    except httpx.RequestError as e:
        logger.error(f"Couple booking API request error: {str(e)}")
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