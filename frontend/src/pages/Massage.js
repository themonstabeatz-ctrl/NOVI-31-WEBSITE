import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Massage = () => {
  const { translate } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const galleryImages = [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwbWFzc2FnZXxlbnwwfHx8fDE3NjEwODYwNTB8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1611073615848-d6ff6215931f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxUaGFpJTIwbWFzc2FnZXxlbnwwfHx8fDE3NjEwODYwNTB8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxUaGFpJTIwbWFzc2FnZXxlbnwwfHx8fDE3NjEwODYwNTB8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHxUaGFpJTIwbWFzc2FnZXxlbnwwfHx8fDE3NjEwODYwNTB8MA&ixlib=rb-4.1.0&q=85",
    "https://images.pexels.com/photos/161477/treatment-finger-keep-hand-161477.jpeg",
    "https://images.pexels.com/photos/6187421/pexels-photo-6187421.jpeg",
    "https://images.unsplash.com/photo-1669989179415-6b92170d193a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxzcGElMjB0aGVyYXB5fGVufDB8fHx8MTc2MTA4NjA1Nnww&ixlib=rb-4.1.0&q=85",
    "https://images.pexels.com/photos/3230236/pexels-photo-3230236.jpeg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

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
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">{translate("massage")}</h1>
          <p className="page-subtitle">
            Otkrijte moć tradicionalnih tajlandskih masaža za potpuno opuštanje tela i duha
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

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h2 className="gallery-title">Galerija Masaža</h2>
          <p className="gallery-subtitle">Doživite atmosferu našeg spa centra</p>
        </div>
        
        {/* Main Carousel */}
        <div className="gallery-carousel">
          <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <div className="carousel-image-container">
            <img 
              src={galleryImages[currentImageIndex]} 
              alt={`Massage ${currentImageIndex + 1}`}
              className="carousel-main-image"
            />
          </div>
          
          <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className={`gallery-item ${currentImageIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img src={image} alt={`Massage thumbnail ${index + 1}`} />
              <div className="gallery-overlay"></div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
};

export default Massage;