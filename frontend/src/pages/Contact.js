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
import DatePicker from "react-datepicker";
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
    
    if (service) {
      setFormData(prev => ({
        ...prev,
        message: `Izabrali ste ${service}`,
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
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        throw new Error('All fields are required');
      }
      
      // Get service name from URL parameter
      const queryParams = new URLSearchParams(location.search);
      const serviceName = queryParams.get('service') || '';
      
      // Service Mapping - All 54 services with proper durations
      const serviceMapping = {
        'Anti-age tretman - 120 min': '8ee6b874-4b3e-4981-a69f-0eeb50bc31bd',
        'Anti-age tretman - 60 min': 'f335f1f3-c16f-4c11-bca3-08e4d0bd0484',
        'Anti-age tretman - 90 min': '855ca3d1-a03b-4dc4-b24a-77f97e8f594e',
        'Antistres masaža - 120 min': 'bf892ffc-52d3-4344-95ef-28ed56ca3328',
        'Antistres masaža - 60 min': '720b91c4-acef-45de-ac87-ed95f5f9f1a3',
        'Antistres masaža - 90 min': '831c0549-c02b-4509-ace8-f59ee650cf60',
        'Aroma terapija - 120 min': 'aabed0b8-798b-413f-8874-138c8c2b9c7c',
        'Aroma terapija - 60 min': 'f81ee187-1d45-4942-abf3-4b83f147bf85',
        'Aroma terapija - 90 min': '006d97e0-409d-4d85-966e-99aacc908510',
        'Aromaterapija - 120 min': 'febb7a5c-7217-4455-8264-9e1ee7f87a40',
        'Aromaterapija - 60 min': '3c2b95c4-0aa4-4b3f-afc1-fe385d7d6749',
        'Aromaterapija - 90 min': '2b34a053-66d8-495d-aee3-fb0061303337',
        'Body wrap - 120 min': '48af7be0-98f5-4594-80e1-51bb6ea8d081',
        'Body wrap - 60 min': '945b4e8a-bdda-4fc4-bd0c-5990be9e291b',
        'Body wrap - 90 min': '46499099-253f-4666-9122-1de3a64bf78e',
        'Detox tretman - 120 min': '71835956-0766-4db8-8ffd-bac47e79d283',
        'Detox tretman - 60 min': '9d29cdaf-6cca-4ed2-a2f1-43f8bc5341b0',
        'Detox tretman - 90 min': '58324e77-2523-43b2-9a30-4f029056b6ed',
        'Hidratantni tretman - 120 min': 'f0318f18-4b1b-4a19-a853-a86fc835d97f',
        'Hidratantni tretman - 60 min': '25e1da03-5b91-4b55-88ee-9e0e1c4e00a2',
        'Hidratantni tretman - 90 min': 'ce67e4f0-a26c-4d64-a79e-47fc7c0d9ea5',
        'Kraljevska tajlandska masaža - 120 min': '62e7de22-d09c-4d44-996e-0ecc5c1ecf3f',
        'Kraljevska tajlandska masaža - 60 min': 'e6a2e050-caa0-4fd8-918e-5bed2e0f1d8d',
        'Kraljevska tajlandska masaža - 90 min': '13dab055-7c9e-4b8f-ab9b-6a49f88d40b6',
        'Kraljevski spa paket - 120 min': '29b1d26e-87a9-4326-8c3e-0d4b41f51c91',
        'Kraljevski spa paket - 60 min': '1d9e71f4-5f7f-4b20-b5a1-c451c25c9b68',
        'Kraljevski spa paket - 90 min': 'ec9c7d4d-c5c7-4ab4-9be8-2aa1e76aa22b',
        'Masaža leđa i vrata - 120 min': '95ffce9e-f02e-4cb7-b1a4-4a57e83b0f1d',
        'Masaža leđa i vrata - 60 min': '88e0eb1b-41cc-49b4-a8f6-7df1b95c9c6e',
        'Masaža leđa i vrata - 90 min': '1d1cd1fa-fcfa-4d8e-9c93-0ef91f3ae41b',
        'Masaža stopala - 120 min': '9bccfcd1-7b8a-42ee-badb-2e4b37f65db6',
        'Masaža stopala - 60 min': '7b9a3d6d-6aaa-4ba3-9f59-4bd4bc92f40b',
        'Masaža stopala - 90 min': '6c4c8a4d-aca4-4b5f-a8ec-60c78c07fcdf',
        'Masaža vrućim kamenjem - 120 min': '2f03e08b-1adc-446f-8f99-d95cb52b6bb9',
        'Masaža vrućim kamenjem - 60 min': '4c12f17e-c2b2-499e-ad5c-a10d0ecf3c6c',
        'Masaža vrućim kamenjem - 90 min': 'a7e24394-44dc-4c02-9bee-d1f1f13dc11f',
        'Parno kupatilo - 120 min': 'c5dbcba5-8fab-43c1-99d7-30e4c1a16a8e',
        'Parno kupatilo - 60 min': '7ab33d7a-1f84-4fb5-a01c-92af9d14ba0b',
        'Parno kupatilo - 90 min': '80e5b3ff-8879-4c2e-be95-0866cba6d8cf',
        'Partnerska masaža - 120 min': '069c91e2-81b3-43cf-8d47-7cf4dcadff7c',
        'Partnerska masaža - 60 min': '6ddc4bb8-de7b-4ce3-a4aa-bc1f0ed61ebc',
        'Partnerska masaža - 90 min': '3fb7dce2-a7ab-44e9-be08-b729d969b49c',
        'Sportska masaža - 120 min': '20c13e82-0aec-405e-9a5b-d3bb30f42d7d',
        'Sportska masaža - 60 min': 'c3fb1ec8-2bc0-4d6d-b91e-55e0c1fd8a39',
        'Sportska masaža - 90 min': 'ace20ca5-a4c3-4555-b1fe-13fc64cd7c1c',
        'Tradicionalna tajlandska masaža - 120 min': 'e63ab8fb-7156-478f-8a21-bb21e6d28b42',
        'Tradicionalna tajlandska masaža - 60 min': 'bbd6d6f4-4b46-4d36-8a08-99dbea1b2ca1',
        'Tradicionalna tajlandska masaža - 90 min': '25dbdd34-cf12-4d0e-b89a-e37c43e11ede',
        'Tretman lica - 120 min': 'f0f5c025-2bc8-4c3b-9de5-b16f3d4e2bb0',
        'Tretman lica - 60 min': '75c157e8-e7ab-4ab8-8b26-56ea39ce0638',
        'Tretman lica - 90 min': 'e65e8d8e-c1de-4bea-a66f-8c25a6be22e6',
        'Zlatni tretman lica - 120 min': '61c29ee4-9e8b-4b1d-afca-6d4e58ba0ac7',
        'Zlatni tretman lica - 60 min': 'b23d5c77-9d79-4c44-9cb4-8c1e0a8acf14',
        'Zlatni tretman lica - 90 min': '6a9e7e04-a009-437b-9b90-8b9cd5c12de5',
      };
      
      // Get service UUID from mapping, or use default (Tradicionalna tajlandska masaža - 60 min)
      const serviceId = serviceMapping[serviceName] || 'bbd6d6f4-4b46-4d36-8a08-99dbea1b2ca1';
      
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
        
        // Prepare data for API
        const appointmentData = {
          client_first_name: formData.firstName,
          client_last_name: formData.lastName,
          client_phone: formData.phone,
          client_email: formData.email,
          appointment_date: dateStr,
          start_time: `${dateStr}T${formData.preferredTime}:00`, // Combine date and time
          service_id: serviceId,
          therapist_id: "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f", // Default therapist
          notes: formData.message || ""
        };

        // Use backend proxy for booking
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/api/book-appointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
          throw new Error('Failed to book appointment');
        }
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
      console.error('Booking error:', error);
      // Error - show red X
      setSubmitStatus('error');
      
      // Hide error after 2 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 2000);
    } finally {
      setIsSubmitting(false);
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
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="preferredDate">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {translate("preferredDate")}
                    </Label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <DatePicker
                        selected={formData.preferredDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        placeholderText="DD/MM/YYYY"
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          color: 'var(--spa-gold)',
                          fontSize: '1rem'
                        }}
                      />
                      {formData.preferredDate && (
                        <Button 
                          type="button" 
                          onClick={clearDate}
                          className="clear-button"
                          style={{ 
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.85rem',
                            minWidth: 'auto',
                            background: 'rgba(212, 175, 55, 0.2)',
                            border: '1px solid var(--spa-gold)',
                            color: 'var(--spa-gold)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <X className="w-4 h-4" />
                          {translate("clearDate")}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="preferredTime">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {translate("preferredTime")}
                    </Label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Input
                        id="preferredTime"
                        name="preferredTime"
                        type="time"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="form-input"
                        lang={getHtmlLang()}
                      />
                      {formData.preferredTime && (
                        <Button 
                          type="button" 
                          onClick={clearTime}
                          className="clear-button"
                          style={{ 
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.85rem',
                            minWidth: 'auto',
                            background: 'rgba(212, 175, 55, 0.2)',
                            border: '1px solid var(--spa-gold)',
                            color: 'var(--spa-gold)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <X className="w-4 h-4" />
                          {translate("clearDate")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
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