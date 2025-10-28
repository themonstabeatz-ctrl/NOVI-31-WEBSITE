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

const Contact = () => {
  const { translate, language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    preferredDate: "",
    preferredTime: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map language codes to HTML lang attribute
  const getHtmlLang = () => {
    const langMap = {
      'sr': 'sr-RS',
      'en': 'en-US',
      'ru': 'ru-RU',
      'th': 'th-TH'
    };
    return langMap[language] || 'sr-RS';
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
    
    if (service) {
      setFormData(prev => ({
        ...prev,
        message: `${translate("wantToBook")} ${service}`
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

  const clearDate = () => {
    setFormData(prev => ({
      ...prev,
      preferredDate: ""
    }));
  };

  const clearTime = () => {
    setFormData(prev => ({
      ...prev,
      preferredTime: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Rezervacija tretmana - ${formData.firstName} ${formData.lastName}`);
    const body = encodeURIComponent(
      `Ime: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Željeni datum: ${formData.preferredDate || 'Nije navedeno'}\n` +
      `Željeno vreme: ${formData.preferredTime || 'Nije navedeno'}\n\n` +
      `Poruka:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:bualuangthailandspa@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setTimeout(() => {
      toast({
        title: "Email klijent otvoren!",
        description: "Molimo vas završite slanje poruke u vašem email klijentu.",
        variant: "success"
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        preferredDate: "",
        preferredTime: ""
      });
    }, 500);
  };

  return (
    <div className="contact-container">
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">{translate("contactTitle")}</h1>
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
          <CardContent className="unified-contact-content">
            {/* Contact Form Section */}
            <div className="unified-form-section">
              <h2 className="unified-section-title">{translate("contactFormTitle")}</h2>
              <p className="unified-section-subtitle">{translate("contactFormSubtitle")}</p>
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
                
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="preferredDate">{translate("preferredDate")}</Label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <DateTimePicker
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="form-input"
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
                    <Label htmlFor="preferredTime">{translate("preferredTime")}</Label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <DateTimePicker
                        type="time"
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="form-input"
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
                    placeholder="Opišite kako možemo da vam pomognemo..."
                  />
                </div>
                
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

            {/* Booking Information Section */}
            <div className="unified-booking-section">
              <h3 className="unified-section-title">{translate("bookingInfoTitle")}</h3>
              <div className="unified-booking-details">
                <div className="unified-booking-item">
                  <h4>{translate("cancellationTitle")}</h4>
                  <p>{translate("cancellationText")}</p>
                </div>
                <div className="unified-booking-item">
                  <h4>{translate("lateArrivalTitle")}</h4>
                  <p>{translate("lateArrivalText")}</p>
                </div>
                <div className="unified-booking-item">
                  <h4>{translate("groupBookingTitle")}</h4>
                  <p>{translate("groupBookingText")}</p>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="unified-info-section">
              <h3 className="unified-section-title">{translate("contactInfoTitle")}</h3>
              <div className="unified-info-items">
                <div className="unified-info-item">
                  <Mail className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>{translate("emailLabel")}</h4>
                    <a href="mailto:bualuangthailandspa@gmail.com" className="info-link">
                      bualuangthailandspa@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <Phone className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>{translate("phoneLabel")}</h4>
                    <a href="tel:+381626625500" className="info-link">
                      +381 62 625 500
                    </a>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <MapPin className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>{translate("addressLabel")}</h4>
                    <p className="info-text">Abebe Bikile 10A, Zemun<br />Beograd 11080, Srbija</p>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <Clock className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>{translate("workingHoursLabel")}</h4>
                    <div className="working-hours">
                      <p>{translate("mondaySunday")}</p>
                      <p className="hours">{translate("hours")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="unified-social-section">
              <h3 className="unified-section-title">{translate("followUs")}</h3>
              <a 
                href="https://www.instagram.com/bualuang_thai_spa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="unified-social-link"
              >
                <Instagram className="unified-social-icon" />
                <div className="unified-social-info">
                  <h4>{translate("instagramLabel")}</h4>
                  <p>@bualuang_thai_spa</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;