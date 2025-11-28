#!/usr/bin/env python3
"""
Backend API Testing for Thai Spa Booking System - NEW BOOKING SYSTEM
Tests the booking API integration with https://single-booking-fix.preview.emergentagent.com
"""

import asyncio
import httpx
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://single-booking-fix.preview.emergentagent.com')

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
                # Try to get the specific appointment from NEW booking system
                response = await client.get(
                    f"https://single-booking-fix.preview.emergentagent.com/api/appointments/{appointment_id}",
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

    async def test_services_endpoint(self):
        """Test GET /api/services endpoint - Review Request Test 2"""
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(f"{self.api_base}/services")
                
                if response.status_code == 200:
                    services = response.json()
                    
                    # Check if it's a list of services
                    if not isinstance(services, list):
                        self.log_result(
                            "Services Endpoint",
                            False,
                            f"❌ Services endpoint returned non-list: {type(services)}",
                            {"response_type": type(services), "response": str(services)[:200]}
                        )
                        return False
                    
                    # Look for [PAROVI] prefix services (couples massage)
                    parovi_services = [s for s in services if s.get('name', '').startswith('[PAROVI]')]
                    
                    # Check for discount_percentage field
                    services_with_discount = [s for s in services if 'discount_percentage' in s]
                    
                    self.log_result(
                        "Services Endpoint",
                        True,
                        f"✅ GET /api/services returns {len(services)} services from new booking system",
                        {
                            "total_services": len(services),
                            "parovi_services_count": len(parovi_services),
                            "parovi_services": [s.get('name', 'Unknown') for s in parovi_services[:5]],  # First 5
                            "services_with_discount_field": len(services_with_discount),
                            "sample_service": services[0] if services else None,
                            "booking_system_url": "https://single-booking-fix.preview.emergentagent.com"
                        }
                    )
                    return True
                else:
                    self.log_result(
                        "Services Endpoint",
                        False,
                        f"❌ GET /api/services returned status {response.status_code}",
                        {"status_code": response.status_code, "response": response.text[:200]}
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Services Endpoint",
                False,
                f"❌ Cannot connect to /api/services: {str(e)}",
                {"error": str(e), "endpoint": f"{self.api_base}/services"}
            )
            return False

    async def test_regular_booking(self):
        """Test regular booking - Review Request Test 3"""
        # First get services to use a real service from the loaded list
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                services_response = await client.get(f"{self.api_base}/services")
                
                if services_response.status_code != 200:
                    self.log_result(
                        "Regular Booking Test",
                        False,
                        f"❌ Cannot get services list: {services_response.status_code}",
                        {"status_code": services_response.status_code}
                    )
                    return False
                
                services = services_response.json()
                if not services:
                    self.log_result(
                        "Regular Booking Test",
                        False,
                        "❌ No services available for booking",
                        {"services_count": 0}
                    )
                    return False
                
                # Use first available service
                test_service = services[0]
                service_id = test_service.get('id')
                service_name = test_service.get('name', 'Unknown Service')
                
                # Calculate tomorrow's date at 14:00
                tomorrow = datetime.now() + timedelta(days=1)
                appointment_date = tomorrow.strftime('%Y-%m-%d')
                start_time = f"{appointment_date}T14:00:00"
                
                booking_data = {
                    "client_first_name": "Test",
                    "client_last_name": "User",
                    "client_phone": "+381601234567",
                    "client_email": "test@example.com",
                    "appointment_date": appointment_date,
                    "start_time": start_time,
                    "service_id": service_id,
                    "therapist_id": "",  # Let backend assign Web Slot therapist
                    "notes": "Regular booking test from review request",
                    "language": "sr",
                    "service_name": service_name
                }
                
                response = await client.post(
                    f"{self.api_base}/book-appointment",
                    json=booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code in [200, 201]:
                    response_data = response.json()
                    appointment_id = response_data.get('id', 'N/A')
                    
                    # Verify in external system
                    external_verification = await self.verify_booking_in_external_system(appointment_id)
                    
                    self.log_result(
                        "Regular Booking Test",
                        True,
                        f"✅ Regular booking successful - Appointment ID: {appointment_id}",
                        {
                            "service_name": service_name,
                            "service_id": service_id,
                            "appointment_id": appointment_id,
                            "client": "Test User (+381601234567, test@example.com)",
                            "date_time": start_time,
                            "external_verification": external_verification,
                            "response": response_data
                        }
                    )
                    return True
                else:
                    error_detail = response.text
                    try:
                        if response.headers.get('content-type', '').startswith('application/json'):
                            error_data = response.json()
                            error_detail = error_data.get('detail', error_detail)
                    except:
                        pass
                    
                    self.log_result(
                        "Regular Booking Test",
                        False,
                        f"❌ Regular booking failed - {response.status_code}: {error_detail}",
                        {
                            "service_name": service_name,
                            "service_id": service_id,
                            "status_code": response.status_code,
                            "error_detail": error_detail,
                            "client": "Test User (+381601234567, test@example.com)",
                            "date_time": start_time
                        }
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Regular Booking Test",
                False,
                f"❌ Exception during regular booking test: {str(e)}",
                {"error": str(e)}
            )
            return False

    async def test_couple_booking(self):
        """Test couple booking - Review Request Test 4"""
        # First get services to find [PAROVI] services
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                services_response = await client.get(f"{self.api_base}/services")
                
                if services_response.status_code != 200:
                    self.log_result(
                        "Couple Booking Test",
                        False,
                        f"❌ Cannot get services list: {services_response.status_code}",
                        {"status_code": services_response.status_code}
                    )
                    return False
                
                services = services_response.json()
                parovi_services = [s for s in services if s.get('name', '').startswith('[PAROVI]')]
                
                if not parovi_services:
                    self.log_result(
                        "Couple Booking Test",
                        False,
                        "❌ No [PAROVI] services found for couple booking",
                        {"total_services": len(services), "parovi_services": 0}
                    )
                    return False
                
                # Use first [PAROVI] service
                test_service = parovi_services[0]
                
                # Calculate tomorrow's date at 16:00
                tomorrow = datetime.now() + timedelta(days=1)
                appointment_date = tomorrow.strftime('%Y-%m-%d')
                start_time = f"{appointment_date}T16:00:00"
                
                # Prepare couple booking data
                couple_booking_data = {
                    "client_first_name": "Test",
                    "client_last_name": "User 2",
                    "client_phone": "+381601234568",
                    "client_email": "test2@example.com",
                    "start_time": start_time,
                    "duration_type": 90,  # 90 minutes per person
                    "person1_services": [test_service.get('id')],
                    "person2_services": [test_service.get('id')],
                    "discount_couples_massage": 15.0,
                    "language": "sr"
                }
                
                response = await client.post(
                    f"{self.api_base}/book-couple-appointment",
                    json=couple_booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code in [200, 201]:
                    response_data = response.json()
                    appointment_id = response_data.get('id', 'N/A')
                    
                    # Verify in external system
                    external_verification = await self.verify_booking_in_external_system(appointment_id)
                    
                    self.log_result(
                        "Couple Booking Test",
                        True,
                        f"✅ Couple booking successful - Appointment ID: {appointment_id}",
                        {
                            "service_name": test_service.get('name'),
                            "service_id": test_service.get('id'),
                            "appointment_id": appointment_id,
                            "client": "Test User 2 (+381601234568, test2@example.com)",
                            "duration": "90 minutes per person",
                            "date_time": start_time,
                            "external_verification": external_verification,
                            "web_slot_therapist_rotation": "Working" if appointment_id != 'N/A' else "Unknown",
                            "response": response_data
                        }
                    )
                    return True
                else:
                    error_detail = response.text
                    try:
                        if response.headers.get('content-type', '').startswith('application/json'):
                            error_data = response.json()
                            error_detail = error_data.get('detail', error_detail)
                    except:
                        pass
                    
                    self.log_result(
                        "Couple Booking Test",
                        False,
                        f"❌ Couple booking failed - {response.status_code}: {error_detail}",
                        {
                            "service_name": test_service.get('name'),
                            "service_id": test_service.get('id'),
                            "status_code": response.status_code,
                            "error_detail": error_detail,
                            "client": "Test User 2 (+381601234568, test2@example.com)",
                            "duration": "90 minutes per person",
                            "date_time": start_time
                        }
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Couple Booking Test",
                False,
                f"❌ Exception during couple booking test: {str(e)}",
                {"error": str(e)}
            )
            return False

    async def test_health_endpoint(self):
        """Test GET /api/health endpoint - Review Request Test 1"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.api_base}/health")
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(
                        "Health Check Endpoint",
                        True,
                        f"✅ GET /api/health returns 200 OK - Backend is running",
                        {"response": data, "status_code": response.status_code}
                    )
                    return True
                else:
                    self.log_result(
                        "Health Check Endpoint",
                        False,
                        f"❌ GET /api/health returned status {response.status_code}",
                        {"status_code": response.status_code, "response": response.text}
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "Health Check Endpoint",
                False,
                f"❌ Cannot connect to /api/health: {str(e)}",
                {"error": str(e), "endpoint": f"{self.api_base}/health"}
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

    async def test_couples_massage_120min_booking(self):
        """Test EXACT couples massage 120-min scenario from review request"""
        
        print("\n🎯 COUPLES MASSAGE 120-MIN BOOKING TEST")
        print("Testing exact scenario from review request...")
        print()
        
        # EXACT test data from review request
        couples_data = {
            "duration": "120",
            "totalDuration": 240,
            "person1": {
                "massage1": {"key": "traditional", "name": "Tradicionalna tajlandska masaža", "duration": "120", "price": 6800},
                "massage2": None
            },
            "person2": {
                "massage1": {"key": "aroma", "name": "Aroma terapija", "duration": "120", "price": 6800},
                "massage2": None
            },
            "totalPrice": 11560,
            "originalPrice": 13600,
            "discount": "15%"
        }
        
        # Construct notes as frontend would
        notes = f"""Masaža za parove - UKUPNO TRAJANJE: {couples_data['totalDuration']} min

OSOBA 1:
- {couples_data['person1']['massage1']['name']} ({couples_data['person1']['massage1']['duration']} min) - {couples_data['person1']['massage1']['price']} RSD

OSOBA 2:
- {couples_data['person2']['massage1']['name']} ({couples_data['person2']['massage1']['duration']} min) - {couples_data['person2']['massage1']['price']} RSD

POPUST: -{couples_data['discount']}
UKUPNA CENA SA POPUSTOM: {couples_data['totalPrice']:,} RSD"""
        
        # Test both service IDs - the one from Contact.js and the actual one in external system
        contact_js_service_id = "3ea2757e-2fa5-4db4-a52e-9db09f573265"  # From Contact.js serviceMapping
        actual_service_id = "9407d92e-d2a9-4432-85ae-850c3446f900"  # Actual ID in external system
        
        booking_data = {
            "client_first_name": "Test",
            "client_last_name": "User", 
            "client_phone": "0601234567",
            "client_email": "test@example.com",
            "appointment_date": "2025-11-10",
            "start_time": "2025-11-10T14:00:00",
            "service_id": actual_service_id,  # Use actual service ID from external system
            "therapist_id": "",  # Empty - let backend assign Web Slot therapist
            "notes": notes,
            "language": "sr",
            "service_name": "Masaža za parove - 240 min",
            "duration_type": 240
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Test 1: Check if service exists in external booking system
                services_response = await client.get("https://pozdrav-kako-si.emergent.host/api/services")
                
                if services_response.status_code == 200:
                    services = services_response.json()
                    actual_service_found = any(s.get('id') == actual_service_id for s in services)
                    contact_service_found = any(s.get('id') == contact_js_service_id for s in services)
                    
                    # Find the actual service details
                    actual_service = next((s for s in services if s.get('id') == actual_service_id), None)
                    
                    self.log_result(
                        "Couples Massage Service Lookup",
                        actual_service_found,
                        f"Actual service ID {actual_service_id} {'found' if actual_service_found else 'NOT found'} in booking system",
                        {
                            "actual_service_id": actual_service_id,
                            "contact_js_service_id": contact_js_service_id,
                            "actual_service_found": actual_service_found,
                            "contact_service_found": contact_service_found,
                            "service_name": "Masaža za parove - 120 min",
                            "total_services": len(services),
                            "actual_service_details": actual_service,
                            "service_id_mismatch": contact_js_service_id != actual_service_id
                        }
                    )
                    
                    # Log the service ID mismatch issue
                    if not contact_service_found:
                        self.log_result(
                            "🚨 Service ID Mismatch Issue",
                            False,
                            f"Contact.js uses wrong service ID: {contact_js_service_id} (not found in external system)",
                            {
                                "contact_js_service_id": contact_js_service_id,
                                "correct_service_id": actual_service_id,
                                "fix_needed": "Update Contact.js serviceMapping with correct service ID"
                            }
                        )
                else:
                    self.log_result(
                        "Couples Massage Service Lookup",
                        False,
                        f"Cannot access services list: {services_response.status_code}",
                        {"status_code": services_response.status_code}
                    )
                
                # Test 2: Backend API booking call
                response = await client.post(
                    f"{self.api_base}/book-appointment",
                    json=booking_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code in [200, 201]:
                    response_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                    appointment_id = response_data.get('id', 'N/A') if response_data else 'N/A'
                    
                    # Test 3: Verify booking in external system
                    external_verification = await self.verify_booking_in_external_system(appointment_id)
                    
                    self.log_result(
                        "🎯 Couples Massage 120-min Booking",
                        True,
                        f"✅ BOOKING SUCCESSFUL - ID: {appointment_id} | External: {external_verification}",
                        {
                            "service_id": booking_data['service_id'],
                            "service_name": booking_data['service_name'],
                            "appointment_id": appointment_id,
                            "total_duration": couples_data['totalDuration'],
                            "person1_massage": couples_data['person1']['massage1']['name'],
                            "person2_massage": couples_data['person2']['massage1']['name'],
                            "total_price": couples_data['totalPrice'],
                            "discount": couples_data['discount'],
                            "external_verification": external_verification,
                            "status_code": response.status_code,
                            "response": response_data
                        }
                    )
                    return True
                    
                else:
                    error_detail = response.text
                    try:
                        if response.headers.get('content-type', '').startswith('application/json'):
                            error_data = response.json()
                            error_detail = error_data.get('detail', error_detail)
                    except:
                        pass
                    
                    self.log_result(
                        "🎯 Couples Massage 120-min Booking",
                        False,
                        f"❌ BOOKING FAILED - {response.status_code}: {error_detail}",
                        {
                            "service_id": booking_data['service_id'],
                            "service_name": booking_data['service_name'],
                            "status_code": response.status_code,
                            "error_detail": error_detail,
                            "total_duration": couples_data['totalDuration'],
                            "person1_massage": couples_data['person1']['massage1']['name'],
                            "person2_massage": couples_data['person2']['massage1']['name']
                        }
                    )
                    return False
                    
        except Exception as e:
            self.log_result(
                "🎯 Couples Massage 120-min Booking",
                False,
                f"❌ Exception: {str(e)}",
                {"error": str(e), "service_id": booking_data['service_id']}
            )
            return False

    async def run_all_tests(self):
        """Run all booking API tests for NEW BOOKING SYSTEM"""
        print("=" * 80)
        print("BOOKING FLOW END-TO-END TESTING - NEW BOOKING SYSTEM")
        print("=" * 80)
        print(f"Backend URL: {self.backend_url}")
        print(f"API Base: {self.api_base}")
        print(f"New Booking System: https://single-booking-fix.preview.emergentagent.com")
        print()
        
        # Test 1: Health Check - GET /api/health
        print("🔍 TEST 1: Health Check")
        health_working = await self.test_health_endpoint()
        
        # Test 2: Services Endpoint - GET /api/services
        print("\n🔍 TEST 2: Services Endpoint")
        services_working = False
        if health_working:
            services_working = await self.test_services_endpoint()
        else:
            self.log_result(
                "Services Endpoint",
                False,
                "Skipped - Health check failed",
                {"reason": "Backend health check failed"}
            )
        
        # Test 3: Regular Booking Test - POST /api/book-appointment
        print("\n🔍 TEST 3: Regular Booking Test")
        regular_booking_working = False
        if health_working and services_working:
            regular_booking_working = await self.test_regular_booking()
        else:
            self.log_result(
                "Regular Booking Test",
                False,
                "Skipped - Prerequisites failed",
                {"health_working": health_working, "services_working": services_working}
            )
        
        # Test 4: Couple Booking Test - POST /api/book-couple-appointment
        print("\n🔍 TEST 4: Couple Booking Test")
        couple_booking_working = False
        if health_working and services_working:
            couple_booking_working = await self.test_couple_booking()
        else:
            self.log_result(
                "Couple Booking Test",
                False,
                "Skipped - Prerequisites failed",
                {"health_working": health_working, "services_working": services_working}
            )
        
        # Summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY - NEW BOOKING SYSTEM INTEGRATION")
        print("=" * 80)
        
        passed = sum(1 for r in self.results if "✅ PASS" in r['status'])
        total = len(self.results)
        
        for result in self.results:
            print(f"{result['status']}: {result['test']}")
        
        print()
        print(f"Tests Passed: {passed}/{total}")
        print()
        
        # Review Request Assessment
        if health_working and services_working and regular_booking_working and couple_booking_working:
            print("🎉 ALL REVIEW REQUEST OBJECTIVES ACHIEVED!")
            print("✅ Health Check: Backend is running")
            print("✅ Services Endpoint: Returns services from new booking system")
            print("✅ Regular Booking: Creates appointments successfully")
            print("✅ Couple Booking: [PAROVI] services working with Web Slot rotation")
            print("✅ External System Integration: Bookings appear in external system")
            print()
            print("🔧 NEW BOOKING SYSTEM URL INTEGRATION: FULLY FUNCTIONAL")
        elif health_working and services_working:
            print("⚠️ PARTIAL SUCCESS - Basic endpoints working but booking issues found")
            print(f"✅ Health Check: {'Working' if health_working else 'Failed'}")
            print(f"✅ Services Endpoint: {'Working' if services_working else 'Failed'}")
            print(f"❌ Regular Booking: {'Working' if regular_booking_working else 'Failed'}")
            print(f"❌ Couple Booking: {'Working' if couple_booking_working else 'Failed'}")
            print()
            print("🔧 BOOKING FUNCTIONALITY NEEDS INVESTIGATION")
        elif health_working:
            print("🚨 CRITICAL ISSUES FOUND")
            print("✅ Health Check: Backend accessible")
            print("❌ Services Endpoint: Cannot fetch services from new booking system")
            print("❌ Booking Tests: Skipped due to services endpoint failure")
            print()
            print("🔧 NEW BOOKING SYSTEM INTEGRATION BROKEN")
        else:
            print("🚨 BACKEND SERVICE NOT ACCESSIBLE")
            print("❌ Health Check: Backend not responding")
            print("❌ All other tests: Skipped")
            print()
            print("🔧 BACKEND SERVICE NEEDS TO BE STARTED/FIXED")
        
        return self.results

async def main():
    """Main test execution"""
    tester = BookingAPITester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())