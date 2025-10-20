import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const Home = () => {
  const { translate } = useLanguage();

  const services = [
    {
      title: translate("traditionalMassage"),
      description: "60 min - 4,500 RSD",
      image: "https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/2lsuft76_6286005458adf.png"
    },
    {
      title: translate("oilMassage"),
      description: "60 min - 5,000 RSD",
      image: "https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/1yzb8w71_%E2%80%94Pngtree%E2%80%94luxury%20mandala%20gold%20vintage%20frame_8780829.png"
    },
    {
      title: translate("aromatherapy"),
      description: "90 min - 6,500 RSD",
      image: "https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/lghkaqzq_%E2%80%94Pngtree%E2%80%94thai%20retro%20pattern%20exotic%20border_9031382.png"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{translate("heroTitle")}</h1>
            <h2 className="hero-subtitle">{translate("heroSubtitle")}</h2>
            <p className="hero-description">
              {translate("heroDescription")}
            </p>
            <div className="hero-buttons">
              <Button asChild className="hero-button-primary">
                <Link to="/contact">{translate("bookNow")}</Link>
              </Button>
              <Button asChild variant="outline" className="hero-button-secondary">
                <Link to="/about">{translate("about")}</Link>
              </Button>
            </div>
          </div>
          <div className="hero-mandala">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/2lsuft76_6286005458adf.png" 
              alt="Thai Mandala" 
              className="mandala-image"
            />
          </div>
        </div>
      </section>

      <Separator className="section-separator" />

      {/* Services Preview */}
      <section className="services-preview">
        <div className="services-header">
          <h2 className="services-title">Naše Usluge</h2>
          <p className="services-subtitle">Otkrijte širokog spektar spa tretmana</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <Card key={index} className="service-card">
              <div className="service-image-container">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="service-image"
                />
              </div>
              <CardContent className="service-content">
                <h3 className="service-name">{service.title}</h3>
                <p className="service-price">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="services-cta">
          <Button asChild className="services-button">
            <Link to="/massage">Pogledajte sve masaže</Link>
          </Button>
          <Button asChild variant="outline" className="services-button">
            <Link to="/spa">Spa tretmani</Link>
          </Button>
        </div>
      </section>

      <Separator className="section-separator" />

      {/* About Preview */}
      <section className="about-preview">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">{translate("aboutTitle")}</h2>
            <p className="about-description">
              {translate("aboutText")}
            </p>
            <Button asChild className="about-button">
              <Link to="/about">Sažnajte više</Link>
            </Button>
          </div>
          <div className="about-pattern">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/i03j5uou_podloga.jpg"
              alt="Thai Pattern"
              className="pattern-image"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;