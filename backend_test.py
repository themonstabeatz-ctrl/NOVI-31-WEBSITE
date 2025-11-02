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
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://spa-booking-pro-1.preview.emergentagent.com')

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

    async def test_specific_services_from_review(self):
        """Test specific services mentioned in the review request"""
        
        # Specific services from review request
        test_services = [
            # Primary test case
            {"name": "Aroma terapija - 60 min", "id": "f81ee187-1d45-4942-abf3-4b83f147bf85", "type": "massage"},
            
            # Massage services (3-4 random)
            {"name": "Tradicionalna tajlandska masaža - 90 min", "id": "39f8c583-a780-4e54-9bab-f693a51287c2", "type": "massage"},
            {"name": "Masaža stopala - 60 min", "id": "c4f3d344-73f9-4a0d-ae39-6f2be718ef19", "type": "massage"},
            {"name": "Sportska masaža - 120 min", "id": "d3e8684a-2bbc-4a15-835e-8e43d231074a", "type": "massage"},
            
            # Spa services (3-4 services)
            {"name": "Tretman lica - 60 min", "id": "75c1c431-b9aa-4ed6-acc5-b2498eb8ccaf", "type": "spa"},
            {"name": "Zlatni tretman lica - 90 min", "id": "7cc4d292-5d54-42f0-b511-1fb4263f6353", "type": "spa"},
            {"name": "Kraljevski spa paket - 120 min", "id": "4a390175-9f3a-4c94-bce3-082623a7a4ce", "type": "spa"}
        ]
        
        therapist_id = "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f"  # Marko Markovic
        
        all_passed = True
        successful_bookings = []
        failed_bookings = []
        
        for i, service in enumerate(test_services):
            # Use realistic client data as requested
            booking_data = {
                "client_first_name": "Ana",
                "client_last_name": "Petrovic",
                "client_phone": "+381621234567",
                "client_email": f"ana.petrovic{i+1}@gmail.com",
                "appointment_date": "2025-01-25",  # Tomorrow as requested
                "start_time": f"2025-01-25T{14+i}:00:00",  # Starting at 14:00 as requested
                "service_id": service["id"],
                "therapist_id": therapist_id,
                "notes": f"Test booking for {service['name']} - {service['type']} service"
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
                        successful_bookings.append({
                            "service": service["name"],
                            "service_id": service["id"],
                            "response": response_data
                        })
                        self.log_result(
                            f"Comprehensive Test - {service['name']}",
                            True,
                            f"Successfully booked {service['name']}",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "status_code": response.status_code,
                                "appointment_id": response_data.get('id', 'N/A') if response_data else 'N/A'
                            }
                        )
                    else:
                        self.log_result(
                            f"Comprehensive Test - {service['name']}",
                            False,
                            f"Failed to book {service['name']} - Status {response.status_code}",
                            {
                                "service_name": service['name'],
                                "service_id": service["id"],
                                "status_code": response.status_code,
                                "response": response.text[:200]
                            }
                        )
                        all_passed = False
                        
            except Exception as e:
                self.log_result(
                    f"Comprehensive Test - {service['name']}",
                    False,
                    f"Error testing {service['name']}: {str(e)}",
                    {"error": str(e), "service_id": service["id"]}
                )
                all_passed = False
        
        # Summary of successful bookings
        if successful_bookings:
            self.log_result(
                "Comprehensive Test Summary",
                True,
                f"Successfully created {len(successful_bookings)} bookings out of {len(all_services)} services",
                {"successful_bookings": successful_bookings}
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
        
        # Test 5: Comprehensive Service ID Testing (only if proxy is working)
        comprehensive_test_working = False
        if backend_healthy and proxy_working:
            comprehensive_test_working = await self.test_all_service_ids()
        else:
            self.log_result(
                "Comprehensive Service ID Test",
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
        
        if backend_healthy and proxy_working and service_mapping_working and comprehensive_test_working:
            print("🎉 ALL BOOKING API TESTS PASSED - Integration working correctly!")
        elif backend_healthy and proxy_working and (service_mapping_working or comprehensive_test_working):
            print("✅ BOOKING INTEGRATION WORKING - Some service IDs tested successfully")
        elif backend_healthy and not external_api_working and not proxy_working:
            print("⚠️  Backend proxy is working but external booking API is unavailable")
        elif not backend_healthy:
            print("🚨 Backend service is not accessible - Check backend configuration")
        else:
            print("⚠️  Some tests failed - Check individual test results above")
        
        return self.results

async def main():
    """Main test execution"""
    tester = BookingAPITester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())