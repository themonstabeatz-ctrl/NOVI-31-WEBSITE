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
async def book_appointment(booking: AppointmentBooking):
    """
    Proxy endpoint to forward booking requests to spa booking system
    Automatically rotates through web slot therapists to allow multiple simultaneous bookings
    """
    try:
        # Log the booking data for debugging
        logger.info(f"📌 BOOKING REQUEST - Service ID: {booking.service_id}, Client: {booking.client_first_name} {booking.client_last_name}, Time: {booking.start_time}")
        
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
            for therapist in web_slot_therapists:
                booking.therapist_id = therapist['id']
                
                response = await client.post(
                    'https://pozdrav-kako-si.emergent.host/api/appointments',
                    json=booking.model_dump(),
                    headers={'Content-Type': 'application/json'}
                )
                
                # If booking succeeds, return the response
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Booking successful with {therapist['name']} (ID: {therapist['id']})")
                    return response.json()
                
                # If this therapist is not available, try the next one
                if response.status_code == 400:
                    error_text = response.text.lower()
                    if 'not available' in error_text or 'unavailable' in error_text:
                        logger.info(f"⚠️ {therapist['name']} not available, trying next...")
                        continue
                
                # For other errors, log and continue to next therapist
                logger.warning(f"Error with {therapist['name']}: {response.status_code} - {response.text}")
            
            # If no therapist is available
            logger.error(f"❌ All Web Slot therapists busy for {booking.start_time}")
            raise HTTPException(
                status_code=400,
                detail="Svi termini su zauzeti za izabrano vreme. Molimo izaberite drugo vreme."
            )
            
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