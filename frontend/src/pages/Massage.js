import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";

const Massage = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const massageServices = [
    {
      name: translate("traditionalMassage"),
      duration: "60 min",
      price: "4,500 RSD",
      description: "Tradicionalna tajlandska masaža koja kombinuje akupresuru, joga pozi i istezanje za potpuno oslobođanje napetosti.",
      benefits: ["Poboljšava cirkulaciju", "Smanjuje stres", "Povećava fleksibilnost"],
      popular: true
    },
    {
      name: translate("oilMassage"),
      duration: "60 min",
      price: "5,000 RSD",
      description: "Nežna masaža sa aromatičnim uljima koja duboko opušta mišiće i uma.",
      benefits: ["Hidrira kožu", "Smiruje nervni sistem", "Poboljšava san"],
      popular: false
    },
    {
      name: translate("hotStone"),
      duration: "90 min", 
      price: "7,500 RSD",
      description: "Terapeutska masaža sa vrućim vulkanskim kamenjem koji otpušta duboke mišićne napetosti.",
      benefits: ["Poboljšava cirkulaciju", "Smanjuje bolove", "Detoksikuje telo"],
      popular: false
    },
    {
      name: "Kraljevska tajlandska masaža",
      duration: "120 min",
      price: "9,500 RSD",
      description: "Luksuzno iskustvo koje kombinuje tradiciju sa modernim tehnikama za ultimativno opuštanje.",
      benefits: ["Kompletno opuštanje", "Energetska ravnoteža", "Mentalna jasnoća"],
      popular: true
    },
    {
      name: "Masaža stopala",
      duration: "45 min",
      price: "3,500 RSD",
      description: "Refleksoterapija koja stimuliše akupresurne tačke na stopalima za celokupno blagostanje.",
      benefits: ["Smanjuje umor", "Poboljšava san", "Jača imunitet"],
      popular: false
    },
    {
      name: "Partnerska masaža",
      duration: "60 min",
      price: "8,500 RSD",
      description: "Romantična masaža za dva u istoj prostoriji sa sveći i umirujućom muzikom.",
      benefits: ["Deljeno iskustvo", "Romantična atmosfera", "Dublje povezivanje"],
      popular: false
    }
  ];

  return (
    <div className="massage-container">
      {/* Fixed Video Hero Section */}
      <section className="massage-hero-fixed">
        <div className="massage-hero-video-container">
          {/* Placeholder for video - you can replace with actual video */}
          <div className="video-placeholder">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="massage-hero-video"
            >
              <source src="/path-to-your-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="massage-hero-overlay"></div>
        </div>
        
        <div className="massage-hero-content">
          <div className="massage-hero-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="hero-logo-image"
            />
          </div>
          <h1 className="massage-hero-title">Masaže sa Bua Luang</h1>
          <div className="massage-hero-divider"></div>
          <p className="massage-hero-subtitle">
            Otkrijte moć tradicionalnih tajlandskih masaža za potpuno opuštanje tela i duha
          </p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div 
        className="massage-parallax-content"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-grid">
          {massageServices.map((service, index) => (
            <Card key={index} className="massage-card">
              {service.popular && (
                <Badge className="popular-badge">
                  <Star className="w-3 h-3 mr-1" />
                  Najpopularnija
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="massage-name">{service.name}</CardTitle>
                <div className="massage-meta">
                  <div className="duration">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="price">{service.price}</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="massage-description">{service.description}</p>
                
                <div className="benefits">
                  <h4 className="benefits-title">Benefiti:</h4>
                  <ul className="benefits-list">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="benefit-item">{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="book-button w-full">
                  <Link to="/contact">Rezervišite</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Spremni za ultimativno opuštanje?</h2>
          <p className="cta-subtitle">Kontaktirajte nas i rezervišite vašu masažu danas</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">Rezervišite sada</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/spa">Pogledajte SPA tretmane</Link>
            </Button>
          </div>
        </div>
      </section>
      </div> {/* Close parallax-content */}
    </div>
  );
};

export default Massage;