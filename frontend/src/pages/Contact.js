import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, Send } from "lucide-react";

const Contact = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Kontakt forma - ${formData.firstName} ${formData.lastName}`);
    const body = encodeURIComponent(
      `Ime: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n\n` +
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
        message: ""
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
              <h2 className="unified-section-title">Pošaljite nam poruku</h2>
              <p className="unified-section-subtitle">
                Popunite formu ispod i kontaktiraćemo vas u najkraćem roku
              </p>
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
              <h3 className="unified-section-title">Informacije o rezervaciji</h3>
              <div className="unified-booking-details">
                <div className="unified-booking-item">
                  <h4>Otkazivanje</h4>
                  <p>Molimo vas da otkazujete termine najmanje 4 sata unapred</p>
                </div>
                <div className="unified-booking-item">
                  <h4>Kasnjenje</h4>
                  <p>Kasnjenje duže od 15 minuta može rezultovati skraćivanjem tretmana</p>
                </div>
                <div className="unified-booking-item">
                  <h4>Grupne rezervacije</h4>
                  <p>Za grupe veće od 4 osobe, molimo vas da nas kontaktirate direktno</p>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="unified-info-section">
              <h3 className="unified-section-title">Kontakt informacije</h3>
              <div className="unified-info-items">
                <div className="unified-info-item">
                  <Mail className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>Email</h4>
                    <a href="mailto:bualuangthailandspa@gmail.com" className="info-link">
                      bualuangthailandspa@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <Phone className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>Telefon</h4>
                    <a href="tel:+381626625500" className="info-link">
                      +381 62 625 500
                    </a>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <MapPin className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>Adresa</h4>
                    <p className="info-text">Abebe Bikile 10A, Zemun<br />Beograd 11080, Srbija</p>
                  </div>
                </div>
                
                <div className="unified-info-item">
                  <Clock className="unified-info-icon" />
                  <div className="unified-info-details">
                    <h4>Radno vreme</h4>
                    <div className="working-hours">
                      <p>Ponedeljak - Nedelja</p>
                      <p className="hours">10:00 - 22:00</p>
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
                  <h4>Instagram</h4>
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