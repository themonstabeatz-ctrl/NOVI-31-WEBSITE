import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, Send, X, Calendar } from "lucide-react";
import { LOCKDOWN } from "../lockdown";
import { API_BASE } from "../config/api";

const EXPECTED = "BL_LOCK_2025_12_16";
if (LOCKDOWN.MASAZE_LOCKED && LOCKDOWN.LOCK_TOKEN !== EXPECTED) {
  throw new Error("LOCKDOWN VIOLATION: MASAŽE su zaključane.");
}
import { useLocation } from "react-router-dom";
import CustomCalendarModal from "../components/CustomCalendarModal";
import CustomTimePickerModal from "../components/CustomTimePickerModal";
import { getSEO } from "../utils/seoConfig";
import "react-datepicker/dist/react-datepicker.css";

const Contact = () => {
  const { translate, language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  
  // Helper function to translate massage names
  const translateMassageName = (massageName) => {
    // Remove [PAROVI] prefix if present
    const cleanName = massageName.replace(/^\[PAROVI\]\s*/, '');
    
    // Remove duration suffix like " - 60 min", " - 90 min", etc.
    const nameWithoutDuration = cleanName.replace(/\s*-\s*\d+\s*min\s*$/i, '').trim();
    
    const nameMap = {
      'Tradicionalna tajlandska masaža': 'massageTraditionalThai',
      'Aroma terapija': 'massageAromaTherapy',
      'Masaža toplim uljem': 'massageHotOil',
      'Glava, vrat, ramena i leđa': 'massageHeadNeckShoulders',
      'Masaža stopala': 'massageFoot',
      'Aroma duboko tkivo': 'massageAromaDeepTissue',
      'Aromaterapija & topli kamen': 'massageAromaHotStone',
      'Aroma sa toplim biljnim kompresama': 'massageAromaThaiHerbal',
      'Thai masaža sa toplim biljnim kompresama': 'massageThaiHerbal',
      'Masaža za parove': 'couplesMassage'
    };
    
    const translationKey = nameMap[nameWithoutDuration];
    if (translationKey) {
      return translate(translationKey);
    }
    
    // If no mapping found, return original name
    return massageName;
  };
  
  // Helper function to check if service is couples massage (works in all languages)
  const isCouplesMassage = (serviceName) => {
    if (!serviceName) return false;
    
    // Couples massages have [PAROVI] prefix
    if (serviceName.includes('[PAROVI]')) {
      return true;
    }
    
    // Also check against language variations for backwards compatibility
    const couplesTranslations = [
      'Masaža za parove',           // Serbian
      'Couples Massage',             // English
      'Массаж для пар',              // Russian
      'นวดสำหรับคู่รัก'              // Thai
    ];
    
    return couplesTranslations.some(translation => 
      serviceName.includes(translation)
    );
  };
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    preferredDate: null, // Changed to null for DatePicker
    preferredTime: "",
    source: "message" // 'booking', 'voucher', 'message', or 'spa'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [error, setError] = useState(null); // Error message state
  const submitTimeoutRef = React.useRef(null);
  
  // SPA booking metadata
  const [spaBookingMeta, setSpaBookingMeta] = useState(null);
  
  // Dynamic service mapping from booking system
  const [serviceMapping, setServiceMapping] = useState({});
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [availableServices, setAvailableServices] = useState({ single: [], couples: [] });

  // Load services from booking system on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const backendUrlRaw = getBackendUrl();
        
        if (!backendUrlRaw) {
          throw new Error('❌ REACT_APP_BACKEND_URL IS NOT DEFINED');
        }
        
        const backendUrl = backendUrlRaw.replace(/\/$/, '');
        console.log('📍 Loading services from Contact page:', backendUrl);

        const [singleResponse, couplesResponse] = await Promise.all([
          fetch(`${backendUrl}/api/services/single/list`),
          fetch(`${backendUrl}/api/services/couples/list`)
        ]);
        
        const singleServices = await singleResponse.json();
        const couplesServices = await couplesResponse.json();
        
        // Combine all services
        const allServices = [...singleServices, ...couplesServices];
        
        // Build service mapping: "Service Name - Duration" -> ID
        // Store both exact name AND normalized name for flexible matching
        const mapping = {};
        allServices.forEach(service => {
          // Store with exact name
          mapping[service.name] = service.id;
          
          // Also store with normalized name (without duration, trimmed)
          const normalized = service.name
            .replace(/\s*[-–—]\s*\d+\s*min\s*$/i, '') // Remove "- 60 min", "– 90 min", etc.
            .trim();
          
          // Don't overwrite if normalized name already exists (keep first match)
          if (!mapping[normalized] || mapping[normalized] === service.id) {
            mapping[normalized] = service.id;
          }
          
          console.log(`   📝 Mapped: "${service.name}" -> ${service.id.substring(0, 8)}...`);
          if (service.name !== normalized) {
            console.log(`      Also: "${normalized}" -> ${service.id.substring(0, 8)}...`);
          }
        });
        
        console.log('✅ Loaded service mapping:', Object.keys(mapping).length, 'keys for', allServices.length, 'services');
        console.log('   Single:', singleServices.length, 'Couples:', couplesServices.length);
        setServiceMapping(mapping);
        setAvailableServices({ single: singleServices, couples: couplesServices });
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
    
    // SPA BOOKING – URL format:
    // /contact?source=spa&spaPackageId=...&spaPackageName=...&variantId=...&variantLabel=...&spaZoneId=...&spaZoneLabel=...&totalMinutes=...&totalPrice=...
    if (source === "spa") {
      const spaPackageId   = searchParams.get("spaPackageId");
      const spaPackageName = searchParams.get("spaPackageName");
      const variantId      = searchParams.get("variantId");
      const variantLabel   = searchParams.get("variantLabel");
      const spaZoneId      = searchParams.get("spaZoneId");
      const spaZoneLabel   = searchParams.get("spaZoneLabel");
      const totalMinutes   = searchParams.get("totalMinutes");
      const totalPriceRaw  = searchParams.get("totalPrice");

      // Format price for sr-RS
      const totalPriceNumber = Number(totalPriceRaw ?? 0);
      const totalPriceFormatted = totalPriceNumber.toLocaleString("sr-RS");

      console.log('🔍 SPA booking detected:', { spaPackageId, spaPackageName, variantId, variantLabel, spaZoneId, spaZoneLabel, totalMinutes, totalPriceNumber });

      // 1) Save all SPA metadata (for handleSubmit)
      setSpaBookingMeta({
        spaPackageId,
        spaPackageName,
        variantId,
        variantLabel,
        spaZoneId,
        spaZoneLabel,
        totalMinutes: Number(totalMinutes),
        totalPrice: totalPriceNumber
      });

      // 2) Pre-populate form message and serviceName
      const message = `
SPA paket: ${spaPackageName}
Varijanta: ${variantLabel}
SPA zona: ${spaZoneLabel}
Ukupno trajanje: ${totalMinutes} min
Ukupna cena: ${totalPriceFormatted} RSD
      `.trim();

      setFormData(prev => ({
        ...prev,
        serviceName: `SPA: ${spaPackageName} (${variantLabel})`,
        message: message,
        source: "spa"
      }));

      console.log('✅ SPA form pre-populated');
      return; // Exit early, don't process regular service logic
    }
    
    if (service) {
      // Translate the service name
      const translatedService = translateMassageName(service);
      let message = `${translate('youSelected')} ${translatedService}`;
      
      console.log('🔍 Contact page - service:', service);
      console.log('🔍 Contact page - couplesData param:', couplesData);
      
      // Special handling for couples massage
      if (couplesData) {
        try {
          // Try to decode, but if it fails, use the raw string
          let decodedData = couplesData;
          try {
            decodedData = decodeURIComponent(couplesData);
          } catch (decodeError) {
            console.warn('⚠️ Could not decode URI, using raw string:', decodeError);
          }
          
          const data = JSON.parse(decodedData);
          console.log('✅ Parsed couples data:', data);
          
          // ✅ Build message using ARRAYS (person1_services, person2_services)
          message = `${translate('couplesMassageBooking')}\n\n`;
          
          // Person 1 - show ALL services
          const p1Services = data.person1_services || (data.person1 ? [data.person1] : []);
          message += `${translate('person1')}:\n`;
          p1Services.forEach(s => {
            const translatedMassage = translateMassageName(s.name);
            message += `  • ${translatedMassage} (${s.duration} min)\n`;
          });
          
          // Person 2 - show ALL services
          const p2Services = data.person2_services || (data.person2 ? [data.person2] : []);
          message += `\n${translate('person2')}:\n`;
          p2Services.forEach(s => {
            const translatedMassage = translateMassageName(s.name);
            message += `  • ${translatedMassage} (${s.duration} min)\n`;
          });
          
          // ✅ Use new couplesData structure (pair_discount_percentage, pair_original_price, pair_final_price)
          const discountText = data.pair_discount_percentage 
            ? `${data.pair_discount_percentage}%` 
            : (data.discount || 'N/A');
          const originalPriceValue = data.pair_original_price || data.originalPrice || 0;
          const finalPriceValue = data.pair_final_price || data.totalPrice || 0;
          
          message += `\n${translate('discount')}: ${discountText}\n`;
          message += `${translate('originalPrice')}: ${originalPriceValue.toLocaleString()} RSD\n`;
          message += `${translate('priceWithDiscount')}: ${finalPriceValue.toLocaleString()} RSD`;
          
          console.log('📝 Final message:', message);
        } catch (e) {
          console.error('❌ Error parsing couples data:', e);
        }
      } else if (isCouplesMassage(service)) {
        console.log('⚠️ Couples service but no couplesData param - checking for service in name');
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
  }, [location, translate, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 handleInputChange: ${name} = ${value}`);
    console.log(`🔄 Event object:`, { name, value, targetType: typeof e.target });
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log(`🔄 Updated formData after ${name} change:`, updated);
      return updated;
    });
  };

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    console.log('📅 handleDateChange called with:', date, 'Type:', typeof date);
    console.log('📅 Date details:', { 
      isDate: date instanceof Date, 
      value: date, 
      toString: date ? date.toString() : 'null' 
    });
    
    // Ensure we're getting a valid date or null
    const dateValue = date instanceof Date ? date : null;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        preferredDate: dateValue
      };
      console.log('📅 Updated formData.preferredDate:', updated.preferredDate);
      console.log('📅 Full formData after date change:', updated);
      return updated;
    });
    
    // Log after state update (with slight delay to see updated state)
    setTimeout(() => {
      console.log('📅 formData.preferredDate after setState (check):', formData.preferredDate);
    }, 100);
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

  // 🔒 DO NOT MODIFY — STABLE VERIFIED BOOKING LOGIC (Bua Luang - SNAPSHOT: BuaLuang-FRONTEND-STABLE-01)
  // This handleSubmit function works correctly with backend /api/book-appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmit called!');
    console.log('📍 Backend URL is:', getBackendUrl());
    
    // 🔒 LOCKDOWN PROTECTION: Warn if booking goes to wrong domain (don't crash app)
    const BACKEND = getBackendUrl();
    const expected = "massage-scheduler-4.preview.emergentagent.com";
    const actual = (BACKEND || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    if (actual !== expected) {
      console.warn(`⚠️ MISCONFIG WARNING: REACT_APP_BACKEND_URL should be ${expected}, got: ${actual}`);
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Safety timeout: Auto-reset after 30 seconds if stuck
    submitTimeoutRef.current = setTimeout(() => {
      console.warn('⚠️ Submit timeout - resetting isSubmitting');
      setIsSubmitting(false);
    }, 30000);
    
    try {
      console.log('✅ Entered try block');
      console.log('📋 Form data:', { 
        firstName: formData.firstName, 
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      
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
      
      console.log('🔍 Booking check:', { serviceName, isBooking });
      
      // For bookings, date and time are required
      if (isBooking) {
        if (!formData.preferredDate) missingFields.push('date');
        if (!formData.preferredTime) missingFields.push('time');
      }
      
      console.log('⚠️ Missing fields:', missingFields);
      
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
      
      // SPA BOOKING GRANA – Handle before single/couples logic
      if (formData.source === "spa" && spaBookingMeta) {
        console.log("🚀 SPA handleSubmit called!");
        console.log("🔍 spaBookingMeta:", spaBookingMeta);

        // 🔒 LOCKDOWN: Use BACKEND variable (already validated at top of handleSubmit)
        const bookingEndpoint = `${BACKEND}/api/appointments`; // SPA uses same endpoint as single
        
        console.log('🔥 FINAL BOOKING ENDPOINT:', bookingEndpoint);
        console.log('🔒 LOCKDOWN CHECK: URL must contain massage-scheduler-4:', bookingEndpoint.includes('massage-scheduler-4'));

        // Convert Date object to YYYY-MM-DD format
        let dateStr;
        if (formData.preferredDate instanceof Date) {
          const year = formData.preferredDate.getFullYear();
          const month = String(formData.preferredDate.getMonth() + 1).padStart(2, '0');
          const day = String(formData.preferredDate.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = formData.preferredDate;
        }
        
        const startTimeIso = `${dateStr}T${formData.preferredTime}:00`;

        const payload = {
          client_first_name: formData.firstName,
          client_last_name: formData.lastName,
          client_phone: formData.phone,
          client_email: formData.email,
          appointment_date: dateStr,
          start_time: startTimeIso,

          // SPA specific fields
          category: "SPA",
          service_id: spaBookingMeta.variantId || spaBookingMeta.spaPackageId, // Use variant ID (will be assigned by reception later)
          duration: spaBookingMeta.totalMinutes,
          duration_type: spaBookingMeta.totalMinutes,
          notes: formData.message,
          service_name: `SPA: ${spaBookingMeta.spaPackageName} (${spaBookingMeta.variantLabel})`,

          // Snapshot prices for analytics
          final_price: spaBookingMeta.totalPrice,
          original_price: spaBookingMeta.totalPrice,
          discount_percentage: 0,
          discount_amount: 0
        };

        console.log("📦 SPA appointment payload:", payload);
        console.log("📤 Sending SPA booking request to:", bookingEndpoint);

        const response = await fetch(bookingEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        // Read response body ONCE
        const responseText = await response.text();
        
        console.log("📥 SPA booking response status:", response.status);
        console.log("📥 Response body:", responseText);

        if (!response.ok) {
          console.error("❌ SPA booking API error:", response.status, responseText);
          setError("Došlo je do greške pri zakazivanju SPA tretmana. Molimo pokušajte ponovo.");
          setSubmitStatus("error");
          return;
        }

        // Parse JSON from text
        let data = {};
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.warn("⚠️ Response nije validan JSON, nastavljam bez parsiranja.");
        }

        console.log("✅ SPA booking successful:", data);
        setSubmitStatus("success");
        setIsSubmitting(false);
        
        // CRITICAL: Exit early to not fall into single/couples logic
        return;
      }
      
      // serviceName and queryParams already defined in validation above - no need to redeclare
      
      // Normalize service name for lookup
      // Try exact match first, then try normalized (without duration)
      let serviceLookupName = serviceName;
      
      // If exact match not found, try normalized version
      if (!serviceMapping[serviceLookupName]) {
        const normalized = serviceName
          .replace(/\s*[-–—]\s*\d+\s*min\s*$/i, '') // Remove "- 60 min", "– 90 min", etc.
          .trim();
        
        console.log('🔍 Trying normalized lookup:', { original: serviceName, normalized });
        serviceLookupName = normalized;
      }
      
      // Special handling for couples massage - use original duration for service_id lookup
      let couplesData = null;
      
      // Try to get couples data from localStorage first, then fall back to URL param
      if (isCouplesMassage(serviceName)) {
        try {
          const storedData = localStorage.getItem('couplesBookingData');
          if (storedData) {
            couplesData = JSON.parse(storedData);
            console.log('✅ Loaded couples data from localStorage:', couplesData);
          } else {
            // Fallback to URL param for backwards compatibility
            const couplesDataParam = queryParams.get('couplesData');
            if (couplesDataParam) {
              let decodedParam = couplesDataParam;
              try {
                decodedParam = decodeURIComponent(couplesDataParam);
              } catch (decodeError) {
                console.warn('⚠️ Could not decode URI, using as-is:', decodeError);
              }
              couplesData = JSON.parse(decodedParam);
              console.log('✅ Loaded couples data from URL param:', couplesData);
            }
          }
          
          if (couplesData) {
            // For couples booking, we don't need single service ID lookup
            // We'll use couple-specific endpoint with individual service names
            console.log('🔍 Couples Booking Debug:', {
              originalServiceName: serviceName,
              couplesData: couplesData
            });
          }
        } catch (e) {
          console.error('❌ Error parsing couples data:', e);
        }
      }
      
      // Get service UUID from dynamically loaded mapping (skip for couples - they use different endpoint)
      const isCouplesBooking = couplesData && isCouplesMassage(serviceName);
      const serviceId = isCouplesBooking ? null : serviceMapping[serviceLookupName];
      
      console.log('🔍 Service lookup:', {
        serviceName,
        serviceLookupName,
        isCouplesBooking,
        foundId: serviceId || (isCouplesBooking ? 'COUPLES BOOKING - NO ID NEEDED' : 'NOT FOUND'),
        mappingLoaded: servicesLoaded,
        availableKeys: Object.keys(serviceMapping).length
      });
      
      // CRITICAL: Validate service exists in mapping (skip for couples booking)
      if (!isCouplesBooking && !serviceId) {
        console.error('❌ SERVICE NOT FOUND IN MAPPING!', {
          serviceName,
          serviceLookupName,
          availableServices: Object.keys(serviceMapping).filter(k => k.includes(serviceName.split(' - ')[0]))
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
        
        // Check if this is a couple booking and get couples data
        let couplesBookingData = null;
        if (isCouplesMassage(serviceName)) {
          // Try localStorage first
          const storedData = localStorage.getItem('couplesBookingData');
          if (storedData) {
            couplesBookingData = JSON.parse(storedData);
          } else {
            // Fallback to URL param
            const couplesDataParam = queryParams.get('couplesData');
            if (couplesDataParam) {
              let decodedParam = couplesDataParam;
              try {
                decodedParam = decodeURIComponent(couplesDataParam);
              } catch (decodeError) {
                console.warn('⚠️ Could not decode couplesData URI, using as-is');
              }
              couplesBookingData = JSON.parse(decodedParam);
            }
          }
        }
        
        const isCoupleBooking = couplesBookingData && isCouplesMassage(serviceName);
        
        let appointmentData;
        let bookingEndpoint;
        
        if (isCoupleBooking) {
          const couplesData = couplesBookingData;
          
          // ✅ COUPLES BOOKING - ARRAY SUPPORT
          // Pravilo: UI cena = zbir SVIH izabranih [PAROVI] servisa (Person1 + Person2)
          // Slati person1_services i person2_services kao ARRAY-e
          
          // ✅ FIX: Koristi ARRAY-e umesto single values
          const person1Services = couplesData.person1_services || 
            (couplesData.person1 ? [couplesData.person1] : []);
          const person2Services = couplesData.person2_services || 
            (couplesData.person2 ? [couplesData.person2] : []);
          
          // Calculate totals from ALL services in arrays
          const p1Total = person1Services.reduce((sum, s) => sum + (s.final_price || s.price || 0), 0);
          const p2Total = person2Services.reduce((sum, s) => sum + (s.final_price || s.price || 0), 0);
          const uiTotalPrice = p1Total + p2Total;
          
          // Calculate total duration
          const p1Duration = person1Services.reduce((sum, s) => sum + parseInt(s.duration || 60), 0);
          const p2Duration = person2Services.reduce((sum, s) => sum + parseInt(s.duration || 60), 0);
          const totalMinutes = p1Duration + p2Duration;
          
          console.log('🔍 COUPLES ARRAY MODE:', {
            person1_services: person1Services,
            person2_services: person2Services,
            p1_count: person1Services.length,
            p2_count: person2Services.length,
            p1_total: p1Total,
            p2_total: p2Total,
            ui_total: uiTotalPrice,
            duration: totalMinutes
          });
          
          // Validacija: sve masaže moraju biti [PAROVI]
          const allServices = [...person1Services, ...person2Services];
          const invalidService = allServices.find(s => s.name && !s.name.includes('[PAROVI]'));
          if (invalidService) {
            console.error('❌ COUPLES STRICT: svi servisi moraju biti [PAROVI]', invalidService);
            setError('Greška: Izaberite samo [PAROVI] masaže.');
            setIsSubmitting(false);
            return;
          }
          
          if (person1Services.length === 0 || person2Services.length === 0) {
            console.error('❌ Missing services for couples booking');
            setError('Molimo izaberite masažu za obe osobe.');
            setIsSubmitting(false);
            return;
          }
          
          // Build display strings with all services joined by " + "
          const p1Display = person1Services.map(s => `${s.name} (${s.duration}min, ${s.final_price || s.price} RSD)`).join(' + ');
          const p2Display = person2Services.map(s => `${s.name} (${s.duration}min, ${s.final_price || s.price} RSD)`).join(' + ');
          
          // PRICING_DEBUG u notes (za backend dev) - with all services
          const p1Debug = person1Services.map(s => `{id:${s.service_id}, name:${s.name}, price:${s.final_price || s.price}}`).join(', ');
          const p2Debug = person2Services.map(s => `{id:${s.service_id}, name:${s.name}, price:${s.final_price || s.price}}`).join(', ');
          const pricingDebug = `PRICING_DEBUG: ui_total=${uiTotalPrice}; p1_count=${person1Services.length}; p2_count=${person2Services.length}; p1=[${p1Debug}]; p2=[${p2Debug}]`;
          
          const notesText = `COUPLES [PAROVI]: Osoba1=${p1Display}; Osoba2=${p2Display}; UKUPNO=${uiTotalPrice} RSD\n${pricingDebug}`;
          
          // 🔍 DEBUG CONSOLE LOG pre POST-a
          console.log('🔍 PRICING DEBUG INFO (ARRAYS):', {
            person1_services: person1Services,
            person2_services: person2Services,
            ui_total_price: uiTotalPrice,
            duration: totalMinutes
          });
          
          // ✅ PAYLOAD ZA /api/appointments/couple
          // Backend očekuje: person1_services i person2_services kao liste ID-eva
          const p1ServiceIds = person1Services.map(s => s.service_id);
          const p2ServiceIds = person2Services.map(s => s.service_id);
          
          // ✅ FIX: Koristi duration_type iz couplesData (paralelno trajanje, ne sabiraj!)
          // Za [PAROVI] tretmane, obe osobe se tretiraju paralelno
          const durationTypeValue = couplesBookingData.duration_type || '60';
          
          appointmentData = {
            client_first_name: formData.firstName,
            client_last_name: formData.lastName,
            client_phone: formData.phone,
            client_email: formData.email,
            // ✅ Šaljemo liste ID-eva (ne objekte)
            person1_services: p1ServiceIds,
            person2_services: p2ServiceIds,
            // ✅ duration_type
            duration_type: durationTypeValue,
            // ✅ start_time
            start_time: `${dateStr}T${formData.preferredTime}:00`,
            // ✅ discount ako je aktivan
            discount_couples_massage: couplesBookingData.pair_discount_percentage || 0,
            // ✅ notes za debug
            notes: notesText
            // ❌ NE šaljemo therapist_id
          };
          
          console.log('✅ COUPLES PAYLOAD for /api/appointments/couple:', appointmentData);
          console.log('📤 person1_services IDs:', p1ServiceIds);
          console.log('📤 person2_services IDs:', p2ServiceIds);
          
          // ❌ ZABRANJENO: "package by duration" lookup
          // ✅ Komponente ([PAROVI] servisi) su jedini izvor istine
          
          // ✅ COUPLES MORA IĆI NA /api/appointments/couple
          bookingEndpoint = '/api/appointments/couple';
          console.log('✅ Couples booking payload (STRICT MODE):', appointmentData);
          console.log('📤 Couples endpoint:', bookingEndpoint);
        } else {
          // Regular booking data
          // Extract duration from service name (e.g., "Masaža - 90 min" -> 90)
          let duration = 60; // default
          const durationMatch = serviceName.match(/(\d+)\s*min/i);
          if (durationMatch) {
            duration = parseInt(durationMatch[1]);
            console.log(`📏 Extracted duration: ${duration} min from "${serviceName}"`);
          }
          
          appointmentData = {
            client_first_name: formData.firstName,
            client_last_name: formData.lastName,
            client_phone: formData.phone,
            client_email: formData.email,
            appointment_date: dateStr,
            start_time: `${dateStr}T${formData.preferredTime}:00`,
            service_id: serviceId,
            // therapist_id removed - backend will auto-assign or leave null
            duration: duration,  // Service duration in minutes
            duration_type: duration,  // Also send as duration_type for backwards compatibility
            notes: formData.message || "",
            language: language,
            service_name: serviceName
          };
          
          // ✅ ISPRAVNO prema backendu recepcije - obične masaže koriste /api/appointments
          bookingEndpoint = '/api/appointments';
          console.log('✅ SETTING bookingEndpoint to:', bookingEndpoint);
        }
        // 🔒 LOCKDOWN: Use BACKEND variable from top of handleSubmit (already validated)
        const url = `${BACKEND}${bookingEndpoint}`;
        const finalEndpoint = url;
        
        console.log('🔥 FINAL BOOKING ENDPOINT:', finalEndpoint);
        console.log('🔒 LOCKDOWN CHECK: URL must contain massage-scheduler-4:', url.includes('massage-scheduler-4'));
        console.log('📦 FULL PAYLOAD being sent:', JSON.stringify(appointmentData, null, 2));
        
        // ✅ DOKAZ: Eksplicitni log za discount/price polja
        console.log('💰 PRICE PROOF:', {
          discount_percentage: appointmentData.discount_percentage ?? 'NOT_SET',
          original_price: appointmentData.original_price ?? 'NOT_SET',
          final_price: appointmentData.final_price ?? 'NOT_SET'
        });
        
        const res = await fetch(finalEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        });

        const text = await res.text(); // SAMO JEDNOM

        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('JSON parse error:', e, text);
        }

        if (!res.ok) {
          console.error('❌ BOOKING FAILED', res.status, data);
          // ✅ FIX C: Better error message extraction
          const errorMsg = data?.error || data?.message || data?.detail || 'Rezervacija nije uspela.';
          setError(errorMsg);
          setSubmitStatus('error');
          setIsSubmitting(false);
          return;
        }

        console.log('✅ BOOKING SUCCESS', data);
      }

      // Success - show green checkmark with appropriate message
      setSubmitStatus('success');
      console.log('🎉 SUCCESS STATUS SET - green checkmark should appear now!');
      
      // Clear couples booking data from localStorage after successful booking
      localStorage.removeItem('couplesBookingData');
      console.log('✅ Cleared couples booking data from localStorage');
      
      // Backend already sends confirmation email via SMTP
      // No need for mailto: link
      
      // Reset form after 3 seconds to allow user to see success message
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
      }, 3000);
      
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

  const contactSEO = getSEO('contact');

  return (
    <div className="contact-container">
      <Helmet>
        <title>{contactSEO.title}</title>
        <meta name="description" content={contactSEO.description} />
        <meta name="keywords" content={contactSEO.keywords} />
        <link rel="canonical" href={contactSEO.canonical} />
      </Helmet>

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
                        const selectedValue = e.target.value;
                        if (selectedValue) {
                          const displayName = e.target.options[e.target.selectedIndex].text;
                          
                          setFormData(prev => ({
                            ...prev,
                            service: displayName,
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
                      
                      {availableServices.single.length > 0 && (
                        <optgroup label={translate("massages") || "MASAŽE"} style={{ background: '#1a1a1a', color: '#d4af37', fontWeight: 'bold' }}>
                          {availableServices.single.map(service => {
                            const hasDiscount = service.discount_percentage > 0;
                            const displayPrice = hasDiscount 
                              ? `${service.original_price?.toLocaleString('sr-RS')} → ${service.final_price?.toLocaleString('sr-RS')} RSD (-${service.discount_percentage}%)`
                              : `${service.final_price?.toLocaleString('sr-RS')} RSD`;
                            
                            return (
                              <option
                                key={service.id}
                                value={service.name}
                                style={{ background: '#1a1a1a', color: '#d4af37' }}
                              >
                                {service.name} - {displayPrice}
                              </option>
                            );
                          })}
                        </optgroup>
                      )}
                      
                      {availableServices.couples.length > 0 && (
                        <optgroup label={translate("couplesMassage") || "MASAŽE ZA PAROVE"} style={{ background: '#1a1a1a', color: '#d4af37', fontWeight: 'bold' }}>
                          {availableServices.couples.map(service => {
                            const hasDiscount = service.discount_percentage > 0;
                            const displayPrice = hasDiscount 
                              ? `${service.original_price?.toLocaleString('sr-RS')} → ${service.final_price?.toLocaleString('sr-RS')} RSD (-${service.discount_percentage}%)`
                              : `${service.final_price?.toLocaleString('sr-RS')} RSD`;
                            
                            return (
                              <option
                                key={service.id}
                                value={service.name}
                                style={{ background: '#1a1a1a', color: '#d4af37' }}
                              >
                                {service.name} - {displayPrice}
                              </option>
                            );
                          })}
                        </optgroup>
                      )}
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