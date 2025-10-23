import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Sparkles, Leaf, Star, Shield, Target, Mail, Phone, MapPin, Clock, Instagram } from "lucide-react";

const About = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Logo transformation and parallax effects on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      const aboutHeroLogo = document.querySelector('.about-hero-logo');
      
      if (!aboutHeroSection || !aboutHeroLogo) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        // Scroll down - transform logo with fade and blur
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        aboutHeroLogo.style.opacity = opacity;
        aboutHeroLogo.style.transform = `scale(${scale})`;
        aboutHeroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
      } else {
        // Scroll up - restore logo
        aboutHeroLogo.style.opacity = 1;
        aboutHeroLogo.style.transform = 'scale(1)';
        aboutHeroLogo.style.filter = 'blur(0px)';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for content sections
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      
      if (!aboutHeroSection) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      
      // Apply parallax to sections after hero
      if (scrolled > heroHeight * 0.3) {
        const parallaxContent = document.querySelector('.about-parallax-content');
        if (parallaxContent) {
          const speed = 0.5;
          const yPos = -(scrolled - heroHeight * 0.3) * speed;
          parallaxContent.style.transform = `translateY(${yPos}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleParallaxScroll);
  }, []);

  const aboutCards = [
    {
      title: "Naša Priča",
      icon: <Leaf className="w-6 h-6" />,
      description: "Bua Luang Thai Spa je nastao iz duboke strasti prema autentičnoj tajlandskoj wellness tradiciji. Naša osnivačica je provela godine učeći tradicionalne tehnike direktno od majstora u Bangkoku.",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Kraljevski Lotos",
      icon: <Sparkles className="w-6 h-6" />,
      description: "\"Bua Luang\" znači \"kraljevski lotos\" - simbol čistoće i transformacije. Baš kao što lotos cveta iz vode, verujemo da svako može pronaći unutrašnji mir kroz naše tretmane.",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Tradicionalnost",
      icon: <Heart className="w-6 h-6" />,
      description: "Naše tehnike su prenesene kroz generacije direktno iz Tajlanda, čuvajući autentičnost svakog pokreta i rituala hiljadugodišnje tajlandske mudrosti.",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Kvalitet",
      icon: <Shield className="w-6 h-6" />,
      description: "Koristimo isključivo prirodne proizvode i aromatična ulja najvišeg kvaliteta, direktno uvezena iz Tajlanda za vaše potpuno zadovoljstvo.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Posvećenost",
      icon: <Target className="w-6 h-6" />,
      description: "Svaki tretman je prilagođen vašim individualnim potrebama. Naš tim stručnjaka posvećen je vašem blagostanju i transformaciji tela, uma i duha.",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Iskustvo",
      icon: <Award className="w-6 h-6" />,
      description: "Sa preko 15 godina iskustva i više od 5000 zadovoljnih gostiju, kombinujemo tradiciju sa modernim pristupom wellness-u za jedinstveno iskustvo.",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="about-container">
      {/* Fixed Video Hero Section */}
      <section className="about-hero-fixed">
        <div className="about-hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="about-hero-video"
          >
            <source src="/Woman_Drinking_Tea_In_Spa_fhd_2012921.mp4" type="video/mp4" />
          </video>
          <div className="about-hero-overlay"></div>
        </div>
        
        <div className="about-hero-content">
          <div className="about-hero-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="hero-logo-image"
            />
          </div>
          <h1 className="about-hero-title">O Nama</h1>
          <div className="about-hero-divider"></div>
          <p className="about-hero-subtitle">
            Priča o strasti, tradiciji i transformaciji kroz autentični tajlandski wellness
          </p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div className="about-parallax-content">

      {/* Cards Grid Section */}
      <section className="services-section">
        <div className="services-grid">
          {aboutCards.map((card, index) => (
            <Card key={index} className="about-card">
              <CardHeader>
                <div className="about-category">
                  <Badge className={`category-badge bg-gradient-to-r ${card.color}`}>
                    {card.icon}
                    <span className="ml-1">{card.title}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="about-description">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy Quote Section */}
      <section className="about-philosophy-quote">
        <div className="philosophy-quote-container">
          <div className="philosophy-logo-wrapper">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="philosophy-bua-logo"
            />
          </div>
          <h2 className="philosophy-quote-title">Naša Filozofija</h2>
          <blockquote className="philosophy-quote-text">
            "Verujemo da je pravi luksuz u jednostavnosti. Svaki pokret, svaki miris, 
            svaki trenutak u našem spa-u dizajniran je da vas vrati u sklad sa sobom. 
            Tajlandska masaža nije samo fizički tretman - to je meditacija, 
            putovanje i transformacija."
          </blockquote>
          <div className="philosophy-signature">
            <span>— Bua Luang Thai Spa</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Spremni Za Transformaciju?</h2>
          <p className="cta-subtitle">Rezervišite svoj tretman i započnite putovanje ka unutrašnjem miru</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">Kontaktirajte Nas</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/massage">Pogledajte Naše Usluge</Link>
            </Button>
          </div>
        </div>
      </section>

      </div> {/* Close parallax-content */}

      {/* Contact & Social Section */}
      <section className="about-contact-social-section">
        <div className="about-contact-container">
          <div className="about-contact-grid">
            
            {/* Contact Information */}
            <div className="about-contact-info-card">
              <h3 className="about-contact-title">Kontaktirajte Nas</h3>
              <div className="about-contact-items">
                <div className="about-contact-item">
                  <Mail className="about-contact-icon" />
                  <div className="about-contact-details">
                    <h4>Email</h4>
                    <a href="mailto:bualuangthailandspa@gmail.com" className="about-info-link">
                      bualuangthailandspa@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="about-contact-item">
                  <Phone className="about-contact-icon" />
                  <div className="about-contact-details">
                    <h4>Telefon</h4>
                    <a href="tel:+381626625500" className="about-info-link">
                      +381 62 662 5500
                    </a>
                  </div>
                </div>
                
                <div className="about-contact-item">
                  <MapPin className="about-contact-icon" />
                  <div className="about-contact-details">
                    <h4>Adresa</h4>
                    <p className="about-info-text">Abebe Bikile 10A, Zemun<br />Beograd 11080, Srbija</p>
                  </div>
                </div>
                
                <div className="about-contact-item">
                  <Clock className="about-contact-icon" />
                  <div className="about-contact-details">
                    <h4>Radno vreme</h4>
                    <div className="about-working-hours">
                      <p>Ponedeljak - Nedelja</p>
                      <p className="about-hours">10:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="about-social-card">
              <h3 className="about-contact-title">Pratite Nas</h3>
              <a 
                href="https://www.instagram.com/bualuang_thai_spa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about-social-link"
              >
                <Instagram className="about-social-icon" />
                <div className="about-social-info">
                  <h4>Instagram</h4>
                  <p>@bualuang_thai_spa</p>
                  <span className="about-social-cta">Pratite nas za ekskluzivne ponude</span>
                </div>
              </a>
            </div>

          </div>
        </div>
        
        {/* Copyright */}
        <div className="about-contact-copyright">
          © 2025 Bua Luang Thai Spa. Sva prava zadržana.
        </div>
      </section>

      {/* Empty parallax section for spacing - like Home page */}
      <section className="about-testimonial">
        {/* Empty section for consistent spacing */}
      </section>

    </div>
  );
};

export default About;
