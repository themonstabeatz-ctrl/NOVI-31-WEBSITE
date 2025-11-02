#!/usr/bin/env python3
"""
Backend API Testing for Thai Spa Booking System
Tests the booking API integration and proxy functionality
"""

import asyncio
import httpx
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://thaispa-booking.preview.emergentagent.com')

class BookingAPITester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.api_base = f"{self.backend_url}/api"
        self.results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'details': details or {}
        }
        self.results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    async def verify_booking_in_external_system(self, appointment_id):
        """Verify if booking actually appears in external system"""
        if not appointment_id or appointment_id == 'N/A':
            return "❌ No appointment ID to verify"
            
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Try to get the specific appointment
                response = await client.get(
                    f"https://pozdrav-kako-si.emergent.host/api/appointments/{appointment_id}",
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    return "✅ Found in external system"
                elif response.status_code == 404:
                    return "❌ NOT found in external system"
                else:
                    return f"⚠️ External system returned {response.status_code}"
                    
        except Exception as e:
            return f"⚠️ Cannot verify: {str(e)}"

    async def test_backend_health(self):
        """Test if backend service is accessible"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.api_base}/")
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(
                        "Backend Health Check",
                        True,
                        f"Backend accessible at {self.api_base}",
                        {"response": data, "status_code": response.status_code}
                    )
                    return True
                else:
                    self.log_result(
                        "Backend Health Check",
                        False,
                        f"Backend returned status {response.status_code}",
                        {"status_code": response.status_code, "response": response.text}
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Backend Health Check",
                False,
                f"Cannot connect to backend: {str(e)}",
                {"error": str(e), "backend_url": self.api_base}
            )
            return False

    async def test_external_booking_api_direct(self):
        """Test direct access to external booking API"""
        external_url = "https://pozdrav-kako-si.emergent.host/api/appointments"
        
        # Sample booking data with real service IDs provided by user
        booking_data = {
            "client_first_name": "Test",
            "client_last_name": "User",
            "client_phone": "+381621234567",
            "client_email": "test@example.com",
            "appointment_date": "2025-02-25",
            "start_time": "2025-02-25T15:00:00",
            "service_id": "057c8535-bb25-4712-9014-60e378d06b6d",  # Klasicna Tajlandska masaza
            "therapist_id": "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f",  # Marko Markovic
            "notes": "Backend test booking"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    external_url,
                    json=booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    self.log_result(
                        "External Booking API Direct Access",
                        True,
                        f"External API accessible and returned 200",
                        {
                            "status_code": response.status_code,
                            "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "External Booking API Direct Access",
                        False,
                        f"External API returned status {response.status_code}",
                        {
                            "status_code": response.status_code,
                            "response": response.text[:200],
                            "headers": dict(response.headers)
                        }
                    )
                    return False
                    
        except httpx.TimeoutException:
            self.log_result(
                "External Booking API Direct Access",
                False,
                "External API request timed out (30s)",
                {"external_url": external_url}
            )
            return False
        except Exception as e:
            self.log_result(
                "External Booking API Direct Access",
                False,
                f"Cannot connect to external API: {str(e)}",
                {"error": str(e), "external_url": external_url}
            )
            return False

    async def test_booking_proxy_endpoint(self):
        """Test the backend proxy endpoint for booking"""
        
        # Sample booking data with real service IDs provided by user
        booking_data = {
            "client_first_name": "Test",
            "client_last_name": "User",
            "client_phone": "+381621234567",
            "client_email": "test@example.com",
            "appointment_date": "2025-02-25",
            "start_time": "2025-02-25T15:00:00",
            "service_id": "057c8535-bb25-4712-9014-60e378d06b6d",  # Klasicna Tajlandska masaza
            "therapist_id": "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f",  # Marko Markovic
            "notes": "Backend test booking"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.api_base}/book-appointment",
                    json=booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    self.log_result(
                        "Booking Proxy Endpoint",
                        True,
                        "Proxy endpoint successfully forwarded request and got 200 response",
                        {
                            "status_code": response.status_code,
                            "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
                        }
                    )
                    return True
                elif response.status_code == 503:
                    self.log_result(
                        "Booking Proxy Endpoint",
                        False,
                        "Proxy endpoint returned 503 - External booking service unavailable",
                        {
                            "status_code": response.status_code,
                            "response": response.text,
                            "meaning": "Backend proxy is working but external service is down"
                        }
                    )
                    return False
                else:
                    self.log_result(
                        "Booking Proxy Endpoint",
                        False,
                        f"Proxy endpoint returned status {response.status_code}",
                        {
                            "status_code": response.status_code,
                            "response": response.text[:200]
                        }
                    )
                    return False
                    
        except httpx.TimeoutException:
            self.log_result(
                "Booking Proxy Endpoint",
                False,
                "Proxy endpoint request timed out (30s)",
                {"proxy_url": f"{self.api_base}/book-appointment"}
            )
            return False
        except Exception as e:
            self.log_result(
                "Booking Proxy Endpoint",
                False,
                f"Cannot connect to proxy endpoint: {str(e)}",
                {"error": str(e), "proxy_url": f"{self.api_base}/book-appointment"}
            )
            return False

    async def test_service_id_mapping(self):
        """Test multiple service IDs to verify mapping works correctly"""
        
        # Test with different service IDs provided by user
        service_tests = [
            {
                "name": "Klasicna Tajlandska masaza",
                "service_id": "057c8535-bb25-4712-9014-60e378d06b6d"
            },
            {
                "name": "Relax masaža celog tela", 
                "service_id": "e7ee5fb3-1688-41fb-9c74-a2e0d0b79fbf"
            },
            {
                "name": "Sportska masaža",
                "service_id": "d6cf94e7-5eac-4a8a-8a33-c92e18830021"
            }
        ]
        
        test_therapist_id = "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f"  # Marko Markovic
        
        all_passed = True
        
        for i, service_test in enumerate(service_tests):
            booking_data = {
                "client_first_name": "ServiceTest",
                "client_last_name": "User",
                "client_phone": "+381621234567",
                "client_email": f"servicetest{i+1}@example.com",
                "appointment_date": f"2025-02-2{6+i}",
                "start_time": f"2025-02-2{6+i}T{15+i}:00:00",
                "service_id": service_test["service_id"],
                "therapist_id": test_therapist_id,
                "notes": f"Service ID mapping test for {service_test['name']}"
            }
        
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.api_base}/book-appointment",
                        json=booking_data,
                        headers={'Content-Type': 'application/json'}
                    )
                    
                    if response.status_code in [200, 201]:
                        response_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                        self.log_result(
                            f"Service ID Mapping - {service_test['name']}",
                            True,
                            f"Service ID {service_test['service_id']} accepted by booking system",
                            {
                                "service_name": service_test['name'],
                                "service_id": service_test["service_id"],
                                "therapist_id": test_therapist_id,
                                "status_code": response.status_code,
                                "response": response_data
                            }
                        )
                    elif response.status_code == 400:
                        self.log_result(
                            f"Service ID Mapping - {service_test['name']}",
                            False,
                            f"Service ID {service_test['service_id']} rejected - Invalid service or therapist ID",
                            {
                                "service_name": service_test['name'],
                                "service_id": service_test["service_id"],
                                "therapist_id": test_therapist_id,
                                "status_code": response.status_code,
                                "response": response.text
                            }
                        )
                        all_passed = False
                    else:
                        self.log_result(
                            f"Service ID Mapping - {service_test['name']}",
                            False,
                            f"Unexpected response status {response.status_code}",
                            {
                                "service_name": service_test['name'],
                                "service_id": service_test["service_id"],
                                "status_code": response.status_code,
                                "response": response.text[:200]
                            }
                        )
                        all_passed = False
                        
            except Exception as e:
                self.log_result(
                    f"Service ID Mapping - {service_test['name']}",
                    False,
                    f"Error testing service ID mapping: {str(e)}",
                    {"error": str(e), "service_id": service_test["service_id"]}
                )
                all_passed = False
        
        return all_passed

    async def test_critical_user_booking_scenarios(self):
        """Test EXACT scenarios from review request - WEB SLOT ROTATION TEST"""
        
        # EXACT services and date/time from review request
        test_services = [
            {
                "name": "Partnerska masaža - 120 min", 
                "id": "114600d6-3960-41e4-b453-32012cb6400a", 
                "type": "massage",
                "client_first_name": "Denis",
                "client_last_name": "Alijevic", 
                "client_email": "denis.real@example.com",
                "client_phone": "+381621111111"
            },
            {
                "name": "Tradicionalna tajlandska masaža - 90 min", 
                "id": "39f8c583-a780-4e54-9bab-f693a51287c2", 
                "type": "massage",
                "client_first_name": "Andrijana",
                "client_last_name": "Vulic",
                "client_email": "andrijana.real@example.com",
                "client_phone": "+381622222222"
            },
            {
                "name": "Tretman lica - 60 min", 
                "id": "75c1c431-b9aa-4ed6-acc5-b2498eb8ccaf", 
                "type": "spa",
                "client_first_name": "Marko",
                "client_last_name": "Petrovic",
                "client_email": "marko.test@example.com", 
                "client_phone": "+381623333333"
            }
        ]
        
        # EXACT date/time from review request: 02.11.2025 at 14:00
        test_date = "2025-11-02"
        test_time = "2025-11-02T14:00:00"
        # NOTE: Backend should automatically assign Web Slot therapists, not hardcoded therapist
        
        all_passed = True
        successful_bookings = []
        failed_bookings = []
        
        print(f"\n🚨 WEB SLOT ROTATION TEST - Date: {test_date} at 14:00")
        print("Testing 3 SIMULTANEOUS bookings with Web Slot therapist rotation...")
        print("Backend should automatically assign different Web Slot therapists")
        print()
        
        for i, service in enumerate(test_services):
            booking_data = {
                "client_first_name": service["client_first_name"],
                "client_last_name": service["client_last_name"],
                "client_phone": service["client_phone"],
                "client_email": service["client_email"],
                "appointment_date": test_date,
                "start_time": test_time,  # Same time for all - testing simultaneous bookings
                "service_id": service["id"],
                "therapist_id": "",  # Empty - let backend assign Web Slot therapist
                "notes": f"WEB SLOT TEST #{i+1}: Multiple simultaneous bookings at same time"
            }
            
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.api_base}/book-appointment",
                        json=booking_data,
                        headers={'Content-Type': 'application/json'}
                    )
                    
                    if response.status_code in [200, 201]:
                        response_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                        appointment_id = response_data.get('id', 'N/A') if response_data else 'N/A'
                        
                        successful_bookings.append({
                            "service": service["name"],
                            "service_id": service["id"],
                            "service_type": service["type"],
                            "response": response_data,
                            "appointment_id": appointment_id,
                            "client": f"{service['client_first_name']} {service['client_last_name']}",
                            "client_email": service["client_email"]
                        })
                        
                        # CRITICAL: Verify booking appears in external system
                        external_verification = await self.verify_booking_in_external_system(appointment_id)
                        
                        self.log_result(
                            f"🚨 CRITICAL TEST - {service['name']} ({service['type']})",
                            True,
                            f"✅ BOOKING SUCCESSFUL - ID: {appointment_id} | External verification: {external_verification}",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "service_type": service["type"],
                                "status_code": response.status_code,
                                "appointment_id": appointment_id,
                                "client": f"{service['client_first_name']} {service['client_last_name']}",
                                "client_email": service["client_email"],
                                "date_time": test_time,
                                "external_verification": external_verification,
                                "external_system_url": "https://pozdrav-kako-si.emergent.host/"
                            }
                        )
                    elif response.status_code == 400:
                        # CRITICAL: 400 errors are what user is experiencing
                        try:
                            error_detail = response.json().get('detail', '') if response.headers.get('content-type', '').startswith('application/json') else response.text
                        except:
                            error_detail = response.text
                            
                        failed_bookings.append({
                            "service": service["name"],
                            "service_id": service["id"],
                            "service_type": service["type"],
                            "error": error_detail,
                            "status_code": response.status_code,
                            "client": f"{service['client_first_name']} {service['client_last_name']}"
                        })
                        
                        self.log_result(
                            f"🚨 CRITICAL FAILURE - {service['name']} ({service['type']})",
                            False,
                            f"❌ 400 ERROR (User Issue): {error_detail}",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "service_type": service["type"],
                                "status_code": response.status_code,
                                "error_detail": error_detail,
                                "client": f"{service['client_first_name']} {service['client_last_name']}",
                                "client_email": service["client_email"],
                                "date_time": test_time,
                                "user_issue": "This is the exact error user is experiencing - backend was returning fake success"
                            }
                        )
                        all_passed = False
                    elif response.status_code == 404:
                        failed_bookings.append({
                            "service": service["name"],
                            "service_id": service["id"],
                            "service_type": service["type"],
                            "error": "Service not found",
                            "status_code": response.status_code
                        })
                        self.log_result(
                            f"Review Test - {service['name']} ({service['type']})",
                            False,
                            f"❌ 404 Service Not Found - This should not happen after duplicate fix",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "service_type": service["type"],
                                "status_code": response.status_code,
                                "response": response.text[:200]
                            }
                        )
                        all_passed = False
                    else:
                        failed_bookings.append({
                            "service": service["name"],
                            "service_id": service["id"],
                            "service_type": service["type"],
                            "error": f"HTTP {response.status_code}",
                            "status_code": response.status_code
                        })
                        self.log_result(
                            f"Review Test - {service['name']} ({service['type']})",
                            False,
                            f"❌ Unexpected response status {response.status_code}",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "service_type": service["type"],
                                "status_code": response.status_code,
                                "response": response.text[:200]
                            }
                        )
                        all_passed = False
                        
            except Exception as e:
                failed_bookings.append({
                    "service": service["name"],
                    "service_id": service["id"],
                    "service_type": service["type"],
                    "error": str(e),
                    "status_code": "Exception"
                })
                self.log_result(
                    f"Review Test - {service['name']} ({service['type']})",
                    False,
                    f"❌ Exception: {str(e)}",
                    {"error": str(e), "service_id": service["id"]}
                )
                all_passed = False
        
        # CRITICAL SUMMARY for user issue
        massage_success = len([b for b in successful_bookings if b["service_type"] == "massage"])
        spa_success = len([b for b in successful_bookings if b["service_type"] == "spa"])
        total_success = len(successful_bookings)
        total_tests = len(test_services)
        
        # Check if any of the critical services worked
        partnerska_masaza_worked = any(b["service"] == "Partnerska masaža - 120 min" for b in successful_bookings)
        tretman_lica_worked = any(b["service"] == "Tretman lica - 60 min" for b in successful_bookings)
        tradicionalna_worked = any(b["service"] == "Tradicionalna tajlandska masaža - 90 min" for b in successful_bookings)
        
        self.log_result(
            "🚨 CRITICAL USER ISSUE TEST SUMMARY",
            total_success == total_tests,  # Only pass if ALL work
            f"USER DATE/TIME TEST: {total_success}/{total_tests} services work on 2025-11-02 at 14:00",
            {
                "test_date": "2025-11-02",
                "test_time": "14:00",
                "total_success": total_success,
                "total_tests": total_tests,
                "massage_success": massage_success,
                "spa_success": spa_success,
                "successful_bookings": successful_bookings,
                "failed_bookings": failed_bookings,
                "partnerska_masaza_worked": partnerska_masaza_worked,
                "tretman_lica_worked": tretman_lica_worked,
                "tradicionalna_worked": tradicionalna_worked,
                "user_issue_resolved": total_success == total_tests and len(failed_bookings) == 0
            }
        )
        
        return all_passed

    async def run_all_tests(self):
        """Run all booking API tests"""
        print("=" * 60)
        print("BOOKING API INTEGRATION TESTING")
        print("=" * 60)
        print(f"Backend URL: {self.backend_url}")
        print(f"API Base: {self.api_base}")
        print()
        
        # Test 1: Backend Health Check
        backend_healthy = await self.test_backend_health()
        
        # Test 2: External API Direct Access
        external_api_working = await self.test_external_booking_api_direct()
        
        # Test 3: Booking Proxy Endpoint (only if backend is healthy)
        proxy_working = False
        if backend_healthy:
            proxy_working = await self.test_booking_proxy_endpoint()
        else:
            self.log_result(
                "Booking Proxy Endpoint",
                False,
                "Skipped - Backend not accessible",
                {"reason": "Backend health check failed"}
            )
        
        # Test 4: Service ID Mapping (only if proxy is working)
        service_mapping_working = False
        if backend_healthy and proxy_working:
            service_mapping_working = await self.test_service_id_mapping()
        else:
            self.log_result(
                "Service ID Mapping",
                False,
                "Skipped - Proxy endpoint not working",
                {"reason": "Proxy endpoint failed or backend not accessible"}
            )
        
        # Test 5: CRITICAL USER BOOKING TEST (only if proxy is working)
        critical_user_test_working = False
        if backend_healthy and proxy_working:
            critical_user_test_working = await self.test_critical_user_booking_scenarios()
        else:
            self.log_result(
                "Critical User Booking Test",
                False,
                "Skipped - Proxy endpoint not working",
                {"reason": "Proxy endpoint failed or backend not accessible"}
            )
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if "✅ PASS" in r['status'])
        total = len(self.results)
        
        for result in self.results:
            print(f"{result['status']}: {result['test']}")
        
        print()
        print(f"Tests Passed: {passed}/{total}")
        
        if backend_healthy and proxy_working and critical_user_test_working:
            print("🎉 CRITICAL USER ISSUE RESOLVED - All bookings work on user's date/time!")
            print("✅ Bookings on 2025-11-02 at 14:00 are working correctly")
            print("✅ External system verification completed")
        elif backend_healthy and proxy_working and not critical_user_test_working:
            print("🚨 CRITICAL USER ISSUE CONFIRMED - Bookings failing on user's date/time")
            print("❌ User's reported issue is REAL - bookings get 400 errors")
            print("🔧 Main agent needs to investigate why these specific services/times fail")
        elif backend_healthy and proxy_working and (service_mapping_working or critical_user_test_working):
            print("⚠️ PARTIAL SUCCESS - Some bookings work but user's specific scenario may still fail")
        elif backend_healthy and not external_api_working and not proxy_working:
            print("⚠️ Backend proxy is working but external booking API is unavailable")
        elif not backend_healthy:
            print("🚨 Backend service is not accessible - Check backend configuration")
        else:
            print("⚠️ Some tests failed - Check individual test results above")
        
        return self.results

async def main():
    """Main test execution"""
    tester = BookingAPITester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())