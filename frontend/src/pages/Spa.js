import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Sparkles, Leaf, ChevronLeft, ChevronRight } from "lucide-react";

const Spa = () => {
  const { translate } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const spaServices = [
    {
      name: translate("facialTreatment"),
      duration: "75 min",
      price: "6,500 RSD",
      description: "Luksuzni tretman lica sa prirodnim tajlandskim sastojcima koji čini kožu mekom i blistavu.",
      benefits: ["Dubinsko čišćenje", "Hidracija kože", "Anti-aging efekat"],
      category: "Lice",
      popular: true
    },
    {
      name: translate("bodyWrap"),
      duration: "90 min",
      price: "7,000 RSD",
      description: "Detoksikujući tretman tela sa blaćenjem i aromatičnim uljima za regeneraciju kože.",
      benefits: ["Detoksikacija", "Zatezanje kože", "Poboljšanje teksture"],
      category: "Telo",
      popular: false
    },
    {
      name: "Zlatni tretman lica",
      duration: "90 min",
      price: "12,000 RSD",
      description: "Ekskluzivni tretman sa 24k zlatom koji pruza anti-aging efekat i prirodan sjaj.",
      benefits: ["Lift efekat", "Prirodan sjaj", "Anti-aging"],
      category: "Premium",
      popular: true
    },
    {
      name: translate("aromatherapy"),
      duration: "60 min",
      price: "5,500 RSD",
      description: "Relaksacijski tretman sa eterisćnim uljima koji balansira um, telo i duh.",
      benefits: ["Smanjuje stres", "Poboljšava raspošenje", "Duboko opušta"],
      category: "Relaksacija",
      popular: false
    },
    {
      name: "Parno kupatilo",
      duration: "30 min",
      price: "2,500 RSD",
      description: "Tradicionalno tajlandsko parno kupatilo sa lečiljskim biljkama.",
      benefits: ["Čišćenje pora", "Detoksikacija", "Poboljšanje cirkulacije"],
      category: "Telo",
      popular: false
    },
    {
      name: "Kraljevski spa paket",
      duration: "180 min",
      price: "15,000 RSD",
      description: "Kompletno spa iskustvo: parno kupatilo, masaža, tretman lica i aromaterapija.",
      benefits: ["Celokupno opuštanje", "Kompletna regeneracija", "Luksuzno iskustvo"],
      category: "Premium",
      popular: true
    }
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case "Premium":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "Relaksacija":
        return <Leaf className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Premium":
        return "bg-gradient-to-r from-amber-500 to-yellow-600";
      case "Relaksacija":
        return "bg-gradient-to-r from-green-500 to-teal-600";
      case "Lice":
        return "bg-gradient-to-r from-pink-500 to-rose-600";
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
  };

  return (
    <div className="spa-container">
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">{translate("spa")}</h1>
          <p className="page-subtitle">
            Luksuzni spa tretmani koji spajaju tradicionalnu tajlandsku mudrost sa modernim tehnikama
          </p>
        </div>
        <div className="page-decoration">
          <img 
            src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/lghkaqzq_%E2%80%94Pngtree%E2%80%94thai%20retro%20pattern%20exotic%20border_9031382.png"
            alt="Thai decoration"
            className="decoration-image"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-grid">
          {spaServices.map((service, index) => (
            <Card key={index} className="spa-card">
              {service.popular && (
                <Badge className="popular-badge">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Najželjeniji
                </Badge>
              )}
              
              <CardHeader>
                <div className="spa-category">
                  <Badge className={`category-badge ${getCategoryColor(service.category)}`}>
                    {getCategoryIcon(service.category)}
                    <span className="ml-1">{service.category}</span>
                  </Badge>
                </div>
                
                <CardTitle className="spa-name">{service.name}</CardTitle>
                <div className="spa-meta">
                  <div className="duration">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="price">{service.price}</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="spa-description">{service.description}</p>
                
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

      {/* Spa Packages Section */}
      <section className="packages-section">
        <div className="packages-header">
          <h2 className="packages-title">Spa Paketi za Posebne Prilike</h2>
          <p className="packages-subtitle">Savršeni paketi za proslave, godisnjice i posebne trenutke</p>
        </div>
        
        <div className="packages-grid">
          <Card className="package-card">
            <CardHeader>
              <CardTitle className="package-name">Romantični paket za parove</CardTitle>
              <div className="package-price">18,000 RSD za dvoje</div>
            </CardHeader>
            <CardContent>
              <p className="package-description">
                Partnerska masaža + tretmani lica + šampanjac i voće
              </p>
              <div className="package-duration">3 sata</div>
            </CardContent>
          </Card>
          
          <Card className="package-card">
            <CardHeader>
              <CardTitle className="package-name">Devojacka veče</CardTitle>
              <div className="package-price">12,000 RSD po osobi</div>
            </CardHeader>
            <CardContent>
              <p className="package-description">
                Grupni spa dan sa masažama, tretmanima lica i kokteilima
              </p>
              <div className="package-duration">4 sata</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Spremni za luksuzno iskustvo?</h2>
          <p className="cta-subtitle">Kontaktirajte nas i rezervišite vaš spa tretman</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">Rezervišite sada</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/massage">Pogledajte masaže</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spa;