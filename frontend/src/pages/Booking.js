import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
  const { language, translate } = useLanguage();
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    appointmentDate: null,
    appointmentTime: "",
    serviceId: ""
  });

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('https://pozdrav-kako-si.emergent.host/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    loadServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const formatDateForAPI = (date, time) => {
    if (!date || !time) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}T${time}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.appointmentDate || !formData.appointmentTime || !formData.serviceId) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    try {
      const bookingData = {
        client_first_name: formData.firstName,
        client_last_name: formData.lastName,
        client_phone: formData.phone,
        client_email: formData.email || "",
        start_time: formatDateForAPI(formData.appointmentDate, formData.appointmentTime),
        service_id: formData.serviceId,
        therapist_id: "4cd2ce85-3e9e-41cd-83fc-81a4a48dda2f", // Default therapist
        status: "scheduled"
      };

      const response = await fetch('https://pozdrav-kako-si.emergent.host/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            appointmentDate: null,
            appointmentTime: "",
            serviceId: ""
          });
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="page-title" style={{ 
          textAlign: 'center', 
          color: 'var(--spa-gold)', 
          marginBottom: '2rem',
          fontSize: '2.5rem'
        }}>
          {translate("bookingTitle") || "Zakažite Termin"}
        </h1>

        <Card style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          border: '1px solid var(--spa-gold)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              {/* Success/Error Message */}
              {submitStatus && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  backgroundColor: submitStatus === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `2px solid ${submitStatus === 'success' ? '#22c55e' : '#ef4444'}`
                }}>
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle style={{ width: '24px', height: '24px', color: '#22c55e', marginRight: '0.5rem' }} />
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        Hvala! Vaš termin je uspešno zakazan. Očekujte potvrdu na email.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle style={{ width: '24px', height: '24px', color: '#ef4444', marginRight: '0.5rem' }} />
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        Došlo je do greške pri zakazivanju. Molimo pokušajte ponovo.
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="firstName" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <User className="w-4 h-4 inline mr-2" />
                    Ime *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <User className="w-4 h-4 inline mr-2" />
                    Prezime *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="phone" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefon *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="email" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="appointmentDate" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Datum *
                  </Label>
                  <DatePicker
                    selected={formData.appointmentDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="DD/MM/YYYY"
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="appointmentTime" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                    <Clock className="w-4 h-4 inline mr-2" />
                    Vreme (10:00-22:00) *
                  </Label>
                  <Input
                    id="appointmentTime"
                    name="appointmentTime"
                    type="time"
                    min="10:00"
                    max="22:00"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
              </div>

              {/* Service Dropdown */}
              <div style={{ marginBottom: '2rem' }}>
                <Label htmlFor="serviceId" style={{ color: 'var(--spa-gold)', marginBottom: '0.5rem', display: 'block' }}>
                  Izaberite uslugu *
                </Label>
                {isLoadingServices ? (
                  <p style={{ color: 'var(--spa-gold)' }}>Učitavanje usluga...</p>
                ) : (
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--spa-gold)',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">-- Izaberite uslugu --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration} min) - {service.price} RSD
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'var(--spa-gold)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Zakazivanje...' : 'Zakažite Termin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
