#!/usr/bin/env python3
"""
Backend Test for Bua Luang Thai Spa - Review Request Testing
Testing the booking appointment endpoint as specified in the review request.
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Backend URL from review request
BACKEND_URL = "https://therapy-booking-21.preview.emergentagent.com"

def test_services_loading():
    """
    Test 1: Verify services are loading
    Expected: List of services with prices
    """
    print("🔍 TEST 1: Verifying services are loading...")
    
    try:
        url = f"{BACKEND_URL}/api/services/single/list"
        print(f"📡 Making request to: {url}")
        
        response = requests.get(url, timeout=10)
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            services = response.json()
            print(f"✅ SUCCESS: Received {len(services)} services")
            
            # Verify structure
            if services and isinstance(services, list):
                sample_service = services[0]
                print(f"📋 Sample service structure:")
                print(f"   - ID: {sample_service.get('id', 'N/A')}")
                print(f"   - Name: {sample_service.get('name', 'N/A')}")
                print(f"   - Price: {sample_service.get('price', 'N/A')}")
                print(f"   - Category: {sample_service.get('category', 'N/A')}")
                
                # Look for the specific service mentioned in test 2
                target_service_id = "98249336-b9d9-4685-b70c-81971d3cf216"
                target_service = next((s for s in services if s.get('id') == target_service_id), None)
                
                if target_service:
                    print(f"🎯 Found target service for Test 2: {target_service.get('name')}")
                    return True, services, target_service
                else:
                    print(f"⚠️  Target service ID {target_service_id} not found in services list")
                    print(f"📋 Available service IDs: {[s.get('id') for s in services[:5]]}...")
                    return True, services, None
            else:
                print(f"❌ FAIL: Invalid response format - expected list, got {type(services)}")
                return False, None, None
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"📄 Response: {response.text[:500]}")
            return False, None, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Network error - {e}")
        return False, None, None
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {e}")
        return False, None, None

def test_booking_submission(target_service=None):
    """
    Test 2: Submit a test booking
    Expected: 200/201 with booking confirmation
    """
    print("\n🔍 TEST 2: Submitting test booking...")
    
    # Use target service if found, otherwise use the ID from review request
    service_id = target_service.get('id') if target_service else "98249336-b9d9-4685-b70c-81971d3cf216"
    service_name = target_service.get('name') if target_service else "Test Service"
    
    # Calculate future date (tomorrow)
    tomorrow = datetime.now() + timedelta(days=1)
    appointment_date = tomorrow.strftime("%Y-%m-%d")
    start_time = f"{appointment_date}T14:00:00"
    
    booking_data = {
        "client_first_name": "Test",
        "client_last_name": "User", 
        "client_phone": "0641234567",
        "client_email": "test@example.com",
        "appointment_date": appointment_date,
        "start_time": start_time,
        "service_id": service_id,
        "duration": 60,
        "notes": "Test booking via API",
        "service_name": service_name
    }
    
    try:
        url = f"{BACKEND_URL}/api/appointments"
        print(f"📡 Making POST request to: {url}")
        print(f"📦 Booking data:")
        print(f"   - Service ID: {service_id}")
        print(f"   - Service Name: {service_name}")
        print(f"   - Client: {booking_data['client_first_name']} {booking_data['client_last_name']}")
        print(f"   - Date/Time: {start_time}")
        print(f"   - Phone: {booking_data['client_phone']}")
        print(f"   - Email: {booking_data['client_email']}")
        
        response = requests.post(
            url,
            json=booking_data,
            headers={'Content-Type': 'application/json'},
            timeout=15
        )
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ SUCCESS: Booking created successfully")
            print(f"📋 Booking details:")
            print(f"   - Appointment ID: {result.get('id', 'N/A')}")
            print(f"   - Status: {result.get('status', 'N/A')}")
            print(f"   - Start Time: {result.get('start_time', 'N/A')}")
            print(f"   - End Time: {result.get('end_time', 'N/A')}")
            return True, result
        else:
            print(f"❌ FAIL: HTTP {response.status_code}")
            print(f"📄 Response: {response.text[:500]}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Network error - {e}")
        return False, None
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {e}")
        return False, None

def test_cors_and_connectivity():
    """
    Test 3: Verify CORS and backend connectivity
    """
    print("\n🔍 TEST 3: Verifying CORS and backend connectivity...")
    
    try:
        # Test basic connectivity with health check or root endpoint
        health_url = f"{BACKEND_URL}/api/health"
        print(f"📡 Testing health endpoint: {health_url}")
        
        response = requests.get(health_url, timeout=10)
        print(f"📊 Health check status: {response.status_code}")
        
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Backend is healthy: {health_data.get('status', 'unknown')}")
            print(f"📅 Timestamp: {health_data.get('timestamp', 'N/A')}")
        else:
            print(f"⚠️  Health check returned: {response.status_code}")
        
        # Check CORS headers
        headers = response.headers
        cors_headers = {
            'Access-Control-Allow-Origin': headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': headers.get('Access-Control-Allow-Headers')
        }
        
        print(f"🌐 CORS Headers:")
        for header, value in cors_headers.items():
            if value:
                print(f"   - {header}: {value}")
            else:
                print(f"   - {header}: Not set")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: Connectivity error - {e}")
        return False
    except Exception as e:
        print(f"❌ FAIL: Unexpected error - {e}")
        return False

def main():
    """
    Main test execution following the review request specifications
    """
    print("🎯 BUA LUANG THAI SPA - BOOKING ENDPOINT TESTING")
    print("=" * 60)
    print(f"🔗 Backend URL: {BACKEND_URL}")
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Track test results
    test_results = []
    
    # Test 1: Services loading
    services_success, services_data, target_service = test_services_loading()
    test_results.append(("Services Loading", services_success))
    
    # Test 2: Booking submission
    booking_success, booking_result = test_booking_submission(target_service)
    test_results.append(("Booking Submission", booking_success))
    
    # Test 3: CORS and connectivity
    cors_success = test_cors_and_connectivity()
    test_results.append(("CORS & Connectivity", cors_success))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, success in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\n🎯 OVERALL RESULT: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Booking endpoint is working properly!")
        return True
    else:
        print("⚠️  SOME TESTS FAILED - Issues detected with booking endpoint")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)