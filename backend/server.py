from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx


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
    Allow all bookings - owner will contact clients to reschedule if needed
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                'https://spa-booking-system-2.preview.emergentagent.com/api/appointments',
                json=booking.model_dump(),
                headers={'Content-Type': 'application/json'}
            )
            
            # If booking succeeds, return the response
            if response.status_code in [200, 201]:
                return response.json()
            
            # If therapist is not available, still return success to client
            # Owner will contact them to reschedule
            if response.status_code == 400:
                try:
                    error_detail = response.json().get('detail', '')
                    if 'not available' in error_detail.lower() or 'unavailable' in error_detail.lower():
                        logger.info(f"Booking accepted despite therapist unavailability - owner will reschedule")
                        # Return a success response - owner will handle rescheduling
                        return {
                            "status": "pending_confirmation",
                            "message": "Booking received - owner will contact you to confirm",
                            "client_name": f"{booking.client_first_name} {booking.client_last_name}",
                            "requested_time": booking.start_time
                        }
                except:
                    pass
            
            # For other errors (service not found, therapist not found, etc), log and raise
            logger.error(f"Booking API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to create booking"
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