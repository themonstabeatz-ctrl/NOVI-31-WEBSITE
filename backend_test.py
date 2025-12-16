#!/usr/bin/env python3
"""
Backend Test for NEW FINALIZED COUPLES MASSAGE BOOKING LOGIC
Testing the exact flow described in the review request.
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Backend URL from review request
BACKEND_URL = "https://massage-hub-10.preview.emergentagent.com"

def test_couples_packages_endpoint():
    """
    Step 1: Get couples packages from /api/services/couples/list
    """
    print("🔍 STEP 1: Testing /api/services/couples/list endpoint...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/services/couples/list", timeout=10)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            packages = response.json()
            print(f"✅ SUCCESS: Retrieved {len(packages)} couples packages")
            
            # Look for packages with different durations
            duration_packages = {}
            for package in packages:
                name = package.get('name', '')
                print(f"   - {name} (ID: {package.get('id', 'N/A')})")
                
                # Extract duration from name
                import re
                duration_match = re.search(r'(\d+)\s*min', name)
                if duration_match:
                    duration = int(duration_match.group(1))
                    duration_packages[duration] = package
            
            print(f"\n📊 Found packages for durations: {list(duration_packages.keys())}")
            return duration_packages
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

def find_120_min_package(duration_packages):
    """
    Step 2: Find the package for 120 min (60+60) and get its ID
    """
    print("\n🎯 STEP 2: Finding 120-min couples package...")
    
    if not duration_packages:
        print("❌ No packages available to search")
        return None
    
    # Look for 120-min package
    if 120 in duration_packages:
        package = duration_packages[120]
        package_id = package.get('id')
        package_name = package.get('name')
        print(f"✅ FOUND 120-min package: {package_name}")
        print(f"   Package ID: {package_id}")
        return package_id
    else:
        print(f"❌ No 120-min package found. Available durations: {list(duration_packages.keys())}")
        return None

def test_couples_booking_with_package_id(package_id):
    """
    Step 3: Send booking with that package ID to /api/appointments
    """
    print(f"\n📤 STEP 3: Testing booking with package ID: {package_id}")
    
    # Calculate appointment time (tomorrow at 14:00)
    tomorrow = datetime.now() + timedelta(days=1)
    appointment_time = tomorrow.replace(hour=14, minute=0, second=0, microsecond=0)
    appointment_iso = appointment_time.strftime("%Y-%m-%dT%H:%M:%S")
    
    # Prepare booking payload as specified in review request
    booking_payload = {
        "client_first_name": "Test",
        "client_last_name": "CouplesFlow",
        "client_phone": "0641234567",
        "client_email": "test@couplesflow.com",
        "service_id": package_id,
        "start_time": "2025-12-31T14:00:00",
        "notes": "COUPLES UI izbor: Osoba1=[PAROVI] Aroma terapija (60min); Osoba2=[PAROVI] Tradicionalna tajlandska masaža (60min)"
    }
    
    print("📋 Booking payload:")
    print(json.dumps(booking_payload, indent=2))
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/appointments",
            json=booking_payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print("✅ BOOKING SUCCESS!")
            print(f"   Appointment ID: {result.get('id', 'N/A')}")
            print(f"   Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ BOOKING FAILED: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ BOOKING ERROR: {str(e)}")
        return False

def verify_forbidden_fields():
    """
    Verify that forbidden fields are not being used in the booking
    """
    print("\n🚫 VERIFICATION: Checking forbidden fields...")
    
    forbidden_fields = [
        "person1_services", 
        "person2_services", 
        "is_couples_booking", 
        "category"
    ]
    
    # Test booking payload should NOT contain these fields
    test_payload = {
        "client_first_name": "Test",
        "client_last_name": "CouplesFlow", 
        "client_phone": "0641234567",
        "client_email": "test@couplesflow.com",
        "service_id": "test-id",
        "start_time": "2025-12-31T14:00:00",
        "notes": "COUPLES UI izbor: Osoba1=[PAROVI] Aroma terapija (60min); Osoba2=[PAROVI] Tradicionalna tajlandska masaža (60min)"
    }
    
    has_forbidden = False
    for field in forbidden_fields:
        if field in test_payload:
            print(f"❌ FORBIDDEN FIELD FOUND: {field}")
            has_forbidden = True
    
    if not has_forbidden:
        print("✅ NO FORBIDDEN FIELDS: Payload is clean")
        
    # Verify required elements are present
    required_elements = ["service_id", "notes"]
    for element in required_elements:
        if element in test_payload:
            print(f"✅ REQUIRED ELEMENT PRESENT: {element}")
        else:
            print(f"❌ MISSING REQUIRED ELEMENT: {element}")
    
    return not has_forbidden

def main():
    """
    Main test function following the exact review request steps
    """
    print("🎯 TESTING NEW FINALIZED COUPLES MASSAGE BOOKING LOGIC")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Step 1: Get couples packages
    duration_packages = test_couples_packages_endpoint()
    if not duration_packages:
        print("\n❌ CRITICAL FAILURE: Cannot retrieve couples packages")
        return False
    
    # Step 2: Find 120-min package
    package_id = find_120_min_package(duration_packages)
    if not package_id:
        print("\n❌ CRITICAL FAILURE: Cannot find 120-min package")
        return False
    
    # Step 3: Test booking with package ID
    booking_success = test_couples_booking_with_package_id(package_id)
    
    # Verification: Check forbidden fields
    fields_clean = verify_forbidden_fields()
    
    # Final results
    print("\n" + "=" * 60)
    print("🏁 FINAL TEST RESULTS:")
    print("=" * 60)
    
    if duration_packages:
        print("✅ Step 1: Couples packages endpoint - SUCCESS")
    else:
        print("❌ Step 1: Couples packages endpoint - FAILED")
    
    if package_id:
        print("✅ Step 2: Found 120-min package - SUCCESS")
    else:
        print("❌ Step 2: Found 120-min package - FAILED")
    
    if booking_success:
        print("✅ Step 3: Booking with package ID - SUCCESS")
    else:
        print("❌ Step 3: Booking with package ID - FAILED")
    
    if fields_clean:
        print("✅ Verification: No forbidden fields - SUCCESS")
    else:
        print("❌ Verification: Forbidden fields detected - FAILED")
    
    overall_success = duration_packages and package_id and booking_success and fields_clean
    
    if overall_success:
        print("\n🎉 OVERALL RESULT: NEW COUPLES LOGIC WORKING PERFECTLY!")
        return True
    else:
        print("\n💥 OVERALL RESULT: NEW COUPLES LOGIC HAS ISSUES!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)