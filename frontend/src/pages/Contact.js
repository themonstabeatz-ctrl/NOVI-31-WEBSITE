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
    setIsSubmitting(true);

    // Mock form submission
    setTimeout(() => {
      toast({
        title: "Poruka poslata!",
        description: "Hvala vam na poruci. Kontaktiraćemo vas uskoro.",
        variant: "success"
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="contact-container">
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">{translate("contactTitle")}</h1>
          <p className="page-subtitle">
            Kontaktirajte nas za rezervacije ili dodatne informacije o našim uslugama
          </p>
        </div>
        <div className="page-decoration">
          <img 
            src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/1yzb8w71_%E2%80%94Pngtree%E2%80%94luxury%20mandala%20gold%20vintage%20frame_8780829.png"
            alt="Mandala decoration"
            className="decoration-image"
          />
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="contact-section">
        <div className="contact-grid">
          {/* Contact Form */}
          <Card className="contact-form-card">
            <CardHeader>
              <CardTitle className="form-title">Pošaljite nam poruku</CardTitle>
              <p className="form-subtitle">
                Popunite formu ispod i kontaktiraćemo vas u najkraćem roku
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="contact-form">
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
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="contact-info">
            <Card className="info-card">
              <CardHeader>
                <CardTitle className="info-title">Kontakt informacije</CardTitle>
              </CardHeader>
              <CardContent className="info-content">
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div className="info-details">
                    <h4>Email</h4>
                    <a href="mailto:bualuangthailandspa@gmail.com" className="info-link">
                      bualuangthailandspa@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="info-item">
                  <Phone className="info-icon" />
                  <div className="info-details">
                    <h4>Telefon</h4>
                    <a href="tel:+381111234567" className="info-link">
                      +381 11 123 4567
                    </a>
                  </div>
                </div>
                
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div className="info-details">
                    <h4>Adresa</h4>
                    <p className="info-text">Knez Mihailova 15<br />Beograd 11000, Srbija</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div className="info-details">
                    <h4>Radno vreme</h4>
                    <div className="working-hours">
                      <p>Ponedeljak - Nedelja</p>
                      <p className="hours">09:00 - 21:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="social-card">
              <CardHeader>
                <CardTitle className="social-title">{translate("followUs")}</CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://www.instagram.com/bualuang_thai_spa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Instagram className="social-icon" />
                  <div className="social-info">
                    <h4>Instagram</h4>
                    <p>@bualuang_thai_spa</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card className="map-card">
              <CardHeader>
                <CardTitle className="map-title">Lokacija</CardTitle>
              </CardHeader>
              <CardContent className="map-content">
                <div className="map-placeholder">
                  <MapPin className="map-icon" />
                  <p>Knez Mihailova 15, Beograd</p>
                  <p className="map-note">
                    U centru grada, blizu glavne pešačke zone
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="additional-info">
        <Card className="booking-info-card">
          <CardContent className="booking-info">
            <h3 className="booking-title">Informacije o rezervaciji</h3>
            <div className="booking-details">
              <div className="booking-item">
                <h4>Otkazivanje</h4>
                <p>Molimo vas da otkazujete termine najmanje 4 sata unapred</p>
              </div>
              <div className="booking-item">
                <h4>Kasnjenje</h4>
                <p>Kasnjenje duže od 15 minuta može rezultovati skraćivanjem tretmana</p>
              </div>
              <div className="booking-item">
                <h4>Grupne rezervacije</h4>
                <p>Za grupe veće od 4 osobe, molimo vas da nas kontaktirate direktno</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;