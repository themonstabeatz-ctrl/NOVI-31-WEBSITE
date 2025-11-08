import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, Send, X, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import CustomCalendarModal from "../components/CustomCalendarModal";
import CustomTimePickerModal from "../components/CustomTimePickerModal";
import { massageServices, spaServices, durations, bookingSystemNames } from "../data/servicesList";
import "react-datepicker/dist/react-datepicker.css";

const Contact = () => {
  const { translate, language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    preferredDate: null, // Changed to null for DatePicker
    preferredTime: "",
    source: "message" // 'booking', 'voucher', or 'message'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [error, setError] = useState(null); // Error message state
  const submitTimeoutRef = React.useRef(null);
  
  // Dynamic service mapping from booking system
  const [serviceMapping, setServiceMapping] = useState({});
  const [servicesLoaded, setServicesLoaded] = useState(false);

  // Load services from booking system on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://buluang-spa-fix.preview.emergentagent.com';
        const response = await fetch(`${backendUrl}/api/services`);
        const services = await response.json();
        
        // Build service mapping: "Service Name - Duration" -> ID
        const mapping = {};
        services.forEach(service => {
          mapping[service.name] = service.id;
        });
        
        console.log('✅ Loaded service mapping:', Object.keys(mapping).length, 'services');
        setServiceMapping(mapping);
        setServicesLoaded(true);
      } catch (error) {
        console.error('❌ Failed to load services from booking system:', error);
        setServicesLoaded(true); // Set to true anyway to prevent blocking
      }
    };
    
    loadServices();
  }, []);

  // Safety: Reset isSubmitting on component mount to prevent stuck disabled state
  useEffect(() => {
    setIsSubmitting(false);
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Map language codes to HTML lang attribute - force sr-RS for date format
  const getHtmlLang = () => {
    // Always use sr-RS for Serbian date format (DD.MM.YYYY)
    return 'sr-RS';
  };

  // Set HTML lang attribute for native date picker localization
  useEffect(() => {
    document.documentElement.lang = getHtmlLang();
  }, [language]);

  // Scroll to top when component mounts and check for service parameter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Get service parameter from URL
    const searchParams = new URLSearchParams(location.search);
    const service = searchParams.get('service');
    const source = searchParams.get('source'); // 'voucher', 'massage', 'spa', or null
    const couplesData = searchParams.get('couplesData');
    
    if (service) {
      let message = `Izabrali ste ${service}`;
      
      // Special handling for couples massage
      if (couplesData) {
        try {
          const data = JSON.parse(decodeURIComponent(couplesData));
          // Use totalDuration (sum of all massages) instead of duration (category)
          const displayDuration = data.totalDuration || data.duration;
          message = `Masaža za parove - UKUPNO TRAJANJE: ${displayDuration} min\n\n`;
          message += `OSOBA 1:\n`;
          if (data.person1.massage1) {
            message += `- ${data.person1.massage1.name} (${data.person1.massage1.duration} min) - ${data.person1.massage1.price} RSD\n`;
          }
          if (data.person1.massage2) {
            message += `- ${data.person1.massage2.name} (${data.person1.massage2.duration} min) - ${data.person1.massage2.price} RSD\n`;
          }
          message += `\nOSOBA 2:\n`;
          if (data.person2.massage1) {
            message += `- ${data.person2.massage1.name} (${data.person2.massage1.duration} min) - ${data.person2.massage1.price} RSD\n`;
          }
          if (data.person2.massage2) {
            message += `- ${data.person2.massage2.name} (${data.person2.massage2.duration} min) - ${data.person2.massage2.price} RSD\n`;
          }
          message += `\nPOPUST: -${data.discount}\n`;
          message += `UKUPNA CENA SA POPUSTOM: ${data.totalPrice.toLocaleString()} RSD`;
        } catch (e) {
          console.error('Error parsing couples data:', e);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        message: message,
        source: source || 'booking' // Store source for success message
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        source: source || 'message' // Default to message if no service
      }));
    }
  }, [location, translate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      preferredDate: date
    }));
  };

  const clearDate = () => {
    setFormData(prev => ({
      ...prev,
      preferredDate: null
    }));
  };

  const clearTime = () => {
    setFormData(prev => ({
      ...prev,
      preferredTime: ""
    }));
  };

  // Format date for display as DD/MM/YYYY
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'Nije navedeno';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Safety timeout: Auto-reset after 30 seconds if stuck
    submitTimeoutRef.current = setTimeout(() => {
      console.warn('⚠️ Submit timeout - resetting isSubmitting');
      setIsSubmitting(false);
    }, 30000);
    
    try {
      // Validate required fields with detailed error messages
      const missingFields = [];
      
      if (!formData.firstName) missingFields.push('firstName');
      if (!formData.lastName) missingFields.push('lastName');
      if (!formData.phone) missingFields.push('phone');
      if (!formData.email) missingFields.push('email');
      
      // Check if this is a booking (has service parameter)
      const queryParams = new URLSearchParams(location.search);
      const serviceName = queryParams.get('service') || formData.service || '';
      const isBooking = !!serviceName;
      
      // For bookings, date and time are required
      if (isBooking) {
        if (!formData.preferredDate) missingFields.push('date');
        if (!formData.preferredTime) missingFields.push('time');
      }
      
      // If there are missing fields, show error and scroll to first missing field
      if (missingFields.length > 0) {
        // Create error message based on missing fields
        let errorMessage = translate('fillAllFields') || 'Molimo popunite sva obavezna polja: ';
        const fieldNames = {
          firstName: translate('firstName') || 'Ime',
          lastName: translate('lastName') || 'Prezime',
          phone: translate('phone') || 'Telefon',
          email: translate('email') || 'Email',
          date: translate('selectDate') || 'Datum',
          time: translate('selectTime') || 'Vreme'
        };
        
        const missingFieldNames = missingFields.map(field => fieldNames[field]);
        errorMessage += missingFieldNames.join(', ');
        
        // Show error toast
        toast({
          title: translate('error') || 'Greška',
          description: errorMessage,
          variant: "destructive",
        });
        
        // Scroll to first missing field
        const firstMissingField = missingFields[0];
        let fieldElement = null;
        
        if (firstMissingField === 'date') {
          fieldElement = document.querySelector('.calendar-input-trigger');
        } else if (firstMissingField === 'time') {
          fieldElement = document.querySelector('.time-input-trigger');
        } else {
          fieldElement = document.querySelector(`input[name="${firstMissingField}"]`);
        }
        
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add visual indication (red border)
          fieldElement.style.border = '2px solid #dc2626';
          fieldElement.style.animation = 'shake 0.5s';
          
          // Remove red border after 3 seconds
          setTimeout(() => {
            fieldElement.style.border = '';
            fieldElement.style.animation = '';
          }, 3000);
        }
        
        setIsSubmitting(false);
        return;
      }
      
      // serviceName and queryParams already defined in validation above - no need to redeclare
      
      // Special handling for "Masaža za parove" - use original duration for service_id lookup
      let serviceLookupName = serviceName;
      const couplesDataParam = queryParams.get('couplesData');
      
      
      if (couplesDataParam && serviceName.includes('Masaža za parove')) {
        try {
          // Try to decode - might already be decoded by browser
          let decodedParam = couplesDataParam;
          try {
            decodedParam = decodeURIComponent(couplesDataParam);
          } catch (decodeError) {
            console.warn('⚠️ Could not decode URI, using as-is:', decodeError);
            // Parameter might already be decoded by browser
          }
          
          const couplesData = JSON.parse(decodedParam);
          
          // Use original duration (60, 90, 120) for service_id lookup, not total duration
          serviceLookupName = `Masaža za parove - ${couplesData.duration} min`;
          console.log('🔍 Couples Booking Debug:', {
            originalServiceName: serviceName,
            couplesData: couplesData,
            lookupName: serviceLookupName
          });
        } catch (e) {
          console.error('❌ Error parsing couples data for service lookup:', e);
          console.error('❌ Raw couplesDataParam:', couplesDataParam);
        }
      }
      
      // Get service UUID from dynamically loaded mapping (use serviceLookupName for couples massage)
      const serviceId = serviceMapping[serviceLookupName];
      
      console.log('🔍 Service lookup:', {
        serviceName,
        serviceLookupName,
        foundId: serviceId || 'NOT FOUND',
        mappingLoaded: servicesLoaded,
        availableKeys: Object.keys(serviceMapping).length
      });
      
      // CRITICAL: Validate service exists in mapping
      if (!serviceId) {
        console.error('❌ SERVICE NOT FOUND IN MAPPING!', {
          serviceName,
          serviceLookupName,
          availableServices: Object.keys(serviceMapping).filter(k => k.includes(serviceName.split(' - ')[0])),
          couplesDataParam,
          parsedCouplesData: couplesDataParam ? JSON.parse(decodeURIComponent(couplesDataParam)) : null
        });
        setError(translate("error") || "Usluga nije pronađena u sistemu. Molimo pokušajte ponovo.");
        setIsSubmitting(false);
        return;
      }
      
      // Debug logging
      console.log('📌 Booking Debug:', {
        serviceName,
        serviceLookupName,
        serviceId,
        found: true
      });
      
      // Only send to booking API if we have date and time
      if (formData.preferredDate && formData.preferredTime) {
        // Convert Date object to YYYY-MM-DD format using local time (Belgrade timezone)
        let dateStr;
        if (formData.preferredDate instanceof Date) {
          const year = formData.preferredDate.getFullYear();
          const month = String(formData.preferredDate.getMonth() + 1).padStart(2, '0');
          const day = String(formData.preferredDate.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = formData.preferredDate;
        }
        
        // Check if this is a couple booking
        const isCoupleBooking = couplesDataParam && serviceName.includes('Masaža za parove');
        
        let appointmentData;
        let bookingEndpoint;
        
        if (isCoupleBooking) {
          // Parse couples data for couple endpoint
          let decodedParam = couplesDataParam;
          try {
            decodedParam = decodeURIComponent(couplesDataParam);
          } catch (decodeError) {
            console.warn('⚠️ Could not decode couplesData URI, using as-is');
          }
          const couplesData = JSON.parse(decodedParam);
          
          console.log('🔍 Couples Data:', couplesData);
          
          // Fetch services directly from booking system for couple booking
          console.log('📥 Fetching current services from booking system...');
          let bookingServices;
          try {
            const servicesResponse = await fetch('https://buluang-spa-fix.preview.emergentagent.com/api/services');
            bookingServices = await servicesResponse.json();
            console.log(`✅ Loaded ${bookingServices.length} services from booking system`);
          } catch (error) {
            console.error('❌ Failed to load services:', error);
            toast({
              title: translate('error') || 'Greška',
              description: 'Ne mogu da učitam trenutne usluge. Molimo pokušajte ponovo.',
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          
          // Build fresh service mapping
          const freshMapping = {};
          bookingServices.forEach(service => {
            freshMapping[service.name] = service.id;
          });
          
          // Extract service IDs from massage selections using fresh mapping
          const person1Services = [];
          const person2Services = [];
          
          if (couplesData.person1?.massage1) {
            const massage1Name = `${couplesData.person1.massage1.name} - ${couplesData.person1.massage1.duration} min`;
            console.log('🔍 Looking for Person 1 Massage 1:', massage1Name);
            const service1Id = freshMapping[massage1Name];
            console.log('  → Found ID:', service1Id || 'NOT FOUND');
            if (service1Id) {
              person1Services.push(service1Id);
            } else {
              console.error(`❌ Service ID not found for: ${massage1Name}`);
            }
          }
          if (couplesData.person1?.massage2) {
            const massage2Name = `${couplesData.person1.massage2.name} - ${couplesData.person1.massage2.duration} min`;
            console.log('🔍 Looking for Person 1 Massage 2:', massage2Name);
            const service2Id = freshMapping[massage2Name];
            console.log('  → Found ID:', service2Id || 'NOT FOUND');
            if (service2Id) {
              person1Services.push(service2Id);
            } else {
              console.error(`❌ Service ID not found for: ${massage2Name}`);
            }
          }
          
          if (couplesData.person2?.massage1) {
            const massage1Name = `${couplesData.person2.massage1.name} - ${couplesData.person2.massage1.duration} min`;
            console.log('🔍 Looking for Person 2 Massage 1:', massage1Name);
            const service1Id = freshMapping[massage1Name];
            console.log('  → Found ID:', service1Id || 'NOT FOUND');
            if (service1Id) {
              person2Services.push(service1Id);
            } else {
              console.error(`❌ Service ID not found for: ${massage1Name}`);
            }
          }
          if (couplesData.person2?.massage2) {
            const massage2Name = `${couplesData.person2.massage2.name} - ${couplesData.person2.massage2.duration} min`;
            console.log('🔍 Looking for Person 2 Massage 2:', massage2Name);
            const service2Id = freshMapping[massage2Name];
            console.log('  → Found ID:', service2Id || 'NOT FOUND');
            if (service2Id) {
              person2Services.push(service2Id);
            } else {
              console.error(`❌ Service ID not found for: ${massage2Name}`);
            }
          }
          
          console.log('📋 Final Service Arrays:', {
            person1Services,
            person2Services
          });
          
          // Validate that we have service IDs
          if (person1Services.length === 0 || person2Services.length === 0) {
            console.error('❌ Missing service IDs for couple booking!');
            console.error('Person 1 services:', person1Services);
            console.error('Person 2 services:', person2Services);
            console.error('Available services:', Object.keys(freshMapping));
            
            toast({
              title: translate('error') || 'Greška',
              description: 'Ne mogu da pronađem usluge za rezervaciju. Molimo kontaktirajte nas direktno.',
              variant: "destructive",
            });
            
            setIsSubmitting(false);
            return;
          }
          
          // Prepare couple booking data
          appointmentData = {
            client_first_name: formData.firstName,
            client_last_name: formData.lastName,
            client_phone: formData.phone,
            client_email: formData.email,
            start_time: `${dateStr}T${formData.preferredTime}:00`,
            duration_type: parseInt(couplesData.duration), // 60, 90, or 120 per person
            person1_services: person1Services,
            person2_services: person2Services,
            discount_couples_massage: 15.0,
            language: language
          };
          
          bookingEndpoint = 'https://buluang-spa-fix.preview.emergentagent.com/api/book-couple-appointment';
          console.log('📌 Couple booking data:', appointmentData);
          console.log('📤 Calling DIRECT booking system endpoint:', bookingEndpoint);
        } else {
          // Regular booking data
          appointmentData = {
            client_first_name: formData.firstName,
            client_last_name: formData.lastName,
            client_phone: formData.phone,
            client_email: formData.email,
            appointment_date: dateStr,
            start_time: `${dateStr}T${formData.preferredTime}:00`,
            service_id: serviceId,
            therapist_id: "1490364f-31c8-49a6-a370-2e19fed34e81",
            notes: formData.message || "",
            language: language,
            service_name: serviceName
          };
          
          bookingEndpoint = '/api/book-appointment';
        }
        // Add connectivity health check before booking
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        
        
        // Health check first
        try {
          console.log('🏥 Performing health check...');
          const healthResponse = await fetch(`${backendUrl}/api/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!healthResponse.ok) {
            console.error('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
            throw new Error(`Backend not available (${healthResponse.status})`);
          }
          
          console.log('✅ Health check passed');
        } catch (healthError) {
          console.error('❌ Health check error:', healthError);
          setError(`Greška u komunikaciji sa serverom: ${healthError.message}`);
          setIsSubmitting(false);
          return;
        }

        // Use backend proxy for booking (or direct for couple booking)
        const finalEndpoint = bookingEndpoint.startsWith('http') 
          ? bookingEndpoint  // Direct URL for couple booking
          : `${backendUrl}${bookingEndpoint}`; // Backend proxy for regular booking
          
        console.log(`📤 Sending ${isCoupleBooking ? 'couple' : 'regular'} booking request to:`, finalEndpoint);
        const response = await fetch(finalEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Booking API error:', response.status, errorText);
          throw new Error(`Booking failed: ${response.status} - ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log('✅ Booking successful:', responseData);
      }

      // Success - show green checkmark with appropriate message
      setSubmitStatus('success');
      
      // Format date for email
      const emailDate = formData.preferredDate instanceof Date
        ? formatDate(formData.preferredDate.toISOString().split('T')[0])
        : (formData.preferredDate ? formatDate(formData.preferredDate) : 'Nije navedeno');
      
      // Also send email as backup
      const subject = encodeURIComponent(`Rezervacija tretmana - ${formData.firstName} ${formData.lastName}`);
      const body = encodeURIComponent(
        `Ime: ${formData.firstName} ${formData.lastName}\n` +
        `Telefon: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Usluga: ${serviceName}\n` +
        `Željeni datum: ${emailDate}\n` +
        `Željeno vreme: ${formData.preferredTime || 'Nije navedeno'}\n\n` +
        `Poruka:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:bualuangthailandspa@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
          preferredDate: null,
          preferredTime: "",
          source: "message"
        });
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('🚨 DETAILED BOOKING ERROR:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      });
      
      // Detailed error handling with specific messages
      let errorMessage = 'Došlo je do greške';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Greška u komunikaciji sa serverom. Proverite internet konekciju.';
      } else if (error.message.includes('Backend not available')) {
        errorMessage = 'Server trenutno nije dostupan. Pokušajte ponovo za nekoliko minuta.';
      } else if (error.message.includes('Booking failed')) {
        errorMessage = `Greška pri rezervaciji: ${error.message}`;
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Greška mreže. Proverite internet konekciju.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Greška u konfiguraciji. Kontaktirajte podršku.';
      } else {
        errorMessage = `Neočekivana greška: ${error.message}`;
      }
      
      // Show specific error message to user
      setError(errorMessage);
      
      // Error - show red X
      setSubmitStatus('error');
      
      // Hide error after 5 seconds (longer for detailed messages)
      setTimeout(() => {
        setSubmitStatus(null);
        setError(null);
      }, 5000);

    } finally {
      // ALWAYS reset isSubmitting, even if error occurs
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
      setIsSubmitting(false);
      console.log('✅ isSubmitting reset to false');
    }
  };

  return (
    <div className="contact-container">
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">BOOKING</h1>
        </div>
        <div className="page-decoration contact-logo-animation">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/r2vm59ex_Bualuang%20logo%20senka.png"
            alt="Bua Luang Thai Spa Logo"
            className="contact-animated-logo"
          />
        </div>
      </section>

      {/* Unified Contact Card */}
      <section className="contact-section">
        <Card className="unified-contact-card">
          <CardContent className="unified-contact-content" style={{ padding: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              {/* Contact Form Section - Left Side */}
              <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>
                <form onSubmit={handleSubmit} className="unified-contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="firstName">{translate("firstName")}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder={translate("firstName")}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="lastName">{translate("lastName")}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder={translate("lastName")}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="phone">{translate("phone")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder={translate("phone")}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="email">{translate("email")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder={translate("email")}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="preferredDate">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {translate("preferredDate")}
                    </Label>
                    <div style={{ width: '100%' }}>
                      <CustomCalendarModal
                        value={formData.preferredDate}
                        onChange={handleDateChange}
                        name="preferredDate"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="preferredTime">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {translate("preferredTime")}
                    </Label>
                    <div style={{ width: '100%' }}>
                      <CustomTimePickerModal
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        name="preferredTime"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Service Dropdown - if no service selected from card */}
                {!new URLSearchParams(location.search).get('service') && (
                  <div className="form-group">
                    <Label htmlFor="serviceDropdown">
                      <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                        {translate("selectService") || "Izaberite uslugu"}
                      </span>
                    </Label>
                    <select
                      id="serviceDropdown"
                      name="serviceDropdown"
                      value={formData.service || ''}
                      onChange={(e) => {
                        const selectedValue = e.target.value; // This is "serviceKey|duration"
                        if (selectedValue) {
                          const [serviceKey, duration] = selectedValue.split('|');
                          const bookingName = bookingSystemNames[serviceKey];
                          const fullServiceName = `${bookingName} - ${duration} min`;
                          const displayName = e.target.options[e.target.selectedIndex].text;
                          
                          setFormData(prev => ({
                            ...prev,
                            service: fullServiceName, // Serbian name for booking API
                            message: `${translate('wantToBook')} ${displayName}`
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            service: '',
                            message: ''
                          }));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#d4af37',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <option value="" style={{ background: '#1a1a1a', color: '#999' }}>
                        -- {translate("chooseService") || "Odaberite uslugu"} --
                      </option>
                      
                      <optgroup label={translate("massages") || "MASAŽE"} style={{ background: '#1a1a1a', color: '#d4af37', fontWeight: 'bold' }}>
                        {massageServices.map(service => {
                          // Special handling for Aroma duboko tkivo (couplesMassage) - only 60 and 90 min
                          let availableDurations = durations;
                          if (service.key === 'couplesMassage') {
                            availableDurations = [
                              { minutes: 60, price: 4900 },
                              { minutes: 90, price: 6000 }
                            ];
                          }
                          
                          return availableDurations.map(dur => {
                            const serviceName = bookingSystemNames[service.key];
                            const displayValue = `${serviceName} - ${dur.minutes} min - ${dur.price.toLocaleString()} RSD`;
                            const dataValue = `${service.key}|${dur.minutes}`; // key|duration
                            return (
                              <option 
                                key={`${service.key}-${dur.minutes}`}
                                value={dataValue}
                                data-display={displayValue}
                                style={{ background: '#1a1a1a', color: '#d4af37' }}
                              >
                                {displayValue}
                              </option>
                            );
                          });
                        })}
                      </optgroup>
                      
                      <optgroup label={translate("spaTreatments") || "SPA TRETMANI"} style={{ background: '#1a1a1a', color: '#d4af37', fontWeight: 'bold' }}>
                        {spaServices.map(service => (
                          durations.map(dur => {
                            const serviceName = translate(service.key);
                            const displayValue = `${serviceName} - ${dur.minutes} min - ${dur.price.toLocaleString()} RSD`;
                            const dataValue = `${service.key}|${dur.minutes}`; // key|duration
                            return (
                              <option 
                                key={`${service.key}-${dur.minutes}`}
                                value={dataValue}
                                data-display={displayValue}
                                style={{ background: '#1a1a1a', color: '#d4af37' }}
                              >
                                {displayValue}
                              </option>
                            );
                          })
                        ))}
                      </optgroup>
                    </select>
                  </div>
                )}
                
                <div className="form-group">
                  <Label htmlFor="message">{translate("message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="form-textarea"
                    placeholder={translate("messagePlaceholder")}
                  />
                </div>
                
                {/* Success/Error Feedback */}
                {submitStatus && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: submitStatus === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `2px solid ${submitStatus === 'success' ? '#22c55e' : '#ef4444'}`,
                    marginBottom: '1rem'
                  }}>
                    {submitStatus === 'success' ? (
                      <>
                        <svg style={{ width: '32px', height: '32px', color: '#22c55e', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {formData.source === 'voucher' ? translate("successVoucher") : 
                           formData.source === 'booking' ? translate("successBooking") : 
                           translate("successMessage")}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg style={{ width: '32px', height: '32px', color: '#ef4444', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          Greška! Molimo pokušajte ponovo.
                        </span>
                      </>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Šalje se..." : translate("send")}
                </Button>
              </form>
            </div>

            {/* Booking Information Section - Right Side */}
            <div style={{ flex: '0 0 40%', maxWidth: '40%' }}>
              <h3 style={{ 
                color: 'var(--spa-gold)', 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                fontWeight: 'bold'
              }}>
                {translate("bookingInfoTitle")}
              </h3>
              <div className="unified-booking-details">
                <div className="unified-booking-item" style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  borderLeft: '3px solid var(--spa-gold)',
                  borderRadius: '4px'
                }}>
                  <h4 style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {translate("cancellationTitle")}
                  </h4>
                  <p style={{ color: 'rgba(245, 242, 232, 0.9)', lineHeight: '1.6' }}>
                    {translate("cancellationText")}
                  </p>
                </div>
                <div className="unified-booking-item" style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  borderLeft: '3px solid var(--spa-gold)',
                  borderRadius: '4px'
                }}>
                  <h4 style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {translate("lateArrivalTitle")}
                  </h4>
                  <p style={{ color: 'rgba(245, 242, 232, 0.9)', lineHeight: '1.6' }}>
                    {translate("lateArrivalText")}
                  </p>
                </div>
                <div className="unified-booking-item" style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  borderLeft: '3px solid var(--spa-gold)',
                  borderRadius: '4px'
                }}>
                  <h4 style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {translate("groupBookingTitle")}
                  </h4>
                  <p style={{ color: 'rgba(245, 242, 232, 0.9)', lineHeight: '1.6' }}>
                    {translate("groupBookingText")}
                  </p>
                </div>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;