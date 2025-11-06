#!/usr/bin/env python3
"""
Script to recreate the couples massage services for 180 and 240 minute durations.
These services are needed for the CouplesMassageCard component.
"""

import httpx
import asyncio

BOOKING_API_BASE = 'https://pozdrav-kako-si.emergent.host/api'

# Service IDs that Contact.js expects (from serviceMapping)
COUPLES_180_ID = "d99f9199-058d-42c5-a955-26713830e7e6"
COUPLES_240_ID = "ec8ea649-0f90-40bc-a119-7d0a04dd12a0"

# Correct prices based on CouplesMassageCard logic
# These are approximate prices for the most expensive combinations
# Actual price varies based on user selections and 15% discount
COUPLES_180_PRICE = 9520   # ~2 * 5600 (Aroma 90min) * 0.85 discount
COUPLES_240_PRICE = 11560  # ~2 * 6800 (Aroma 120min) * 0.85 discount


async def create_service(service_id: str, name: str, duration: int, price: int):
    """Create a new service in the booking system with specific ID"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            payload = {
                "id": service_id,
                "name": name,
                "duration": duration,
                "price": price,
                "description": "Masaža za parove sa popustom od 15%"
            }
            
            response = await client.post(
                f'{BOOKING_API_BASE}/services',
                json=payload
            )
            response.raise_for_status()
            print(f"✓ Created: {name} (ID: {service_id}, Price: {price} RSD)")
            return True
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 409:  # Service already exists
                print(f"⚠ Service already exists: {name}. Updating instead...")
                return await update_service(service_id, name, duration, price)
            else:
                print(f"✗ Error creating {name}: {e}")
                return False
        except Exception as e:
            print(f"✗ Error creating {name}: {e}")
            return False


async def update_service(service_id: str, name: str, duration: int, price: int):
    """Update an existing service"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            payload = {
                "name": name,
                "duration": duration,
                "price": price,
                "description": "Masaža za parove sa popustom od 15%"
            }
            
            response = await client.put(
                f'{BOOKING_API_BASE}/services/{service_id}',
                json=payload
            )
            response.raise_for_status()
            print(f"✓ Updated: {name} (ID: {service_id}, Price: {price} RSD)")
            return True
        except Exception as e:
            print(f"✗ Error updating {name}: {e}")
            return False


async def main():
    print("=" * 80)
    print("RECREATING COUPLES MASSAGE SERVICES")
    print("=" * 80)
    
    # Create 180 min service
    print("\n[1/2] Creating 'Masaža za parove - 180 min'...")
    await create_service(
        service_id=COUPLES_180_ID,
        name="Masaža za parove - 180 min",
        duration=180,
        price=COUPLES_180_PRICE
    )
    
    # Create 240 min service
    print("\n[2/2] Creating 'Masaža za parove - 240 min'...")
    await create_service(
        service_id=COUPLES_240_ID,
        name="Masaža za parove - 240 min",
        duration=240,
        price=COUPLES_240_PRICE
    )
    
    print("\n" + "=" * 80)
    print("COUPLES MASSAGE SERVICES RECREATED")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(main())
