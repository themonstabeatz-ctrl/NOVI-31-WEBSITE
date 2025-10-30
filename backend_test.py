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
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://thaimassage-web.preview.emergentagent.com')

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
        external_url = "https://thaimassage-web.preview.emergentagent.com/api/appointments"
        
        # Sample booking data as provided by user
        booking_data = {
            "client_first_name": "Test",
            "client_last_name": "Korisnik",
            "client_phone": "+381621234567",
            "client_email": "test@example.com",
            "appointment_date": "2025-02-15",
            "start_time": "2025-02-15T14:00:00",
            "service_id": "44826422-d4b4-4ca0-971b-1c91b0a6ccdd",
            "therapist_id": "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f",
            "notes": "Test rezervacija"
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
        
        # Sample booking data as provided by user
        booking_data = {
            "client_first_name": "Test",
            "client_last_name": "Korisnik",
            "client_phone": "+381621234567",
            "client_email": "test@example.com",
            "appointment_date": "2025-02-15",
            "start_time": "2025-02-15T14:00:00",
            "service_id": "44826422-d4b4-4ca0-971b-1c91b0a6ccdd",
            "therapist_id": "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f",
            "notes": "Test rezervacija"
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
        """Test if the service ID mapping is working correctly"""
        
        # Test with the provided service ID
        test_service_id = "44826422-d4b4-4ca0-971b-1c91b0a6ccdd"
        test_therapist_id = "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f"
        
        booking_data = {
            "client_first_name": "ServiceTest",
            "client_last_name": "User",
            "client_phone": "+381621234567",
            "client_email": "servicetest@example.com",
            "appointment_date": "2025-02-16",
            "start_time": "2025-02-16T15:00:00",
            "service_id": test_service_id,
            "therapist_id": test_therapist_id,
            "notes": "Service ID mapping test"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.api_base}/book-appointment",
                    json=booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    response_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                    self.log_result(
                        "Service ID Mapping",
                        True,
                        f"Service ID {test_service_id} accepted by booking system",
                        {
                            "service_id": test_service_id,
                            "therapist_id": test_therapist_id,
                            "status_code": response.status_code,
                            "response": response_data
                        }
                    )
                    return True
                elif response.status_code == 400:
                    self.log_result(
                        "Service ID Mapping",
                        False,
                        f"Service ID {test_service_id} rejected - Invalid service or therapist ID",
                        {
                            "service_id": test_service_id,
                            "therapist_id": test_therapist_id,
                            "status_code": response.status_code,
                            "response": response.text
                        }
                    )
                    return False
                else:
                    self.log_result(
                        "Service ID Mapping",
                        False,
                        f"Unexpected response status {response.status_code}",
                        {
                            "service_id": test_service_id,
                            "status_code": response.status_code,
                            "response": response.text[:200]
                        }
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Service ID Mapping",
                False,
                f"Error testing service ID mapping: {str(e)}",
                {"error": str(e), "service_id": test_service_id}
            )
            return False

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
        
        if backend_healthy and proxy_working and service_mapping_working:
            print("🎉 ALL BOOKING API TESTS PASSED - Integration working correctly!")
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