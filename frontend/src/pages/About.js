import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Users, Award } from "lucide-react";

const About = () => {
  const { translate } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Logo transformation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      const aboutHeroLogo = document.querySelector('.about-hero-logo');
      
      if (!aboutHeroSection || !aboutHeroLogo) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        aboutHeroLogo.style.opacity = opacity;
        aboutHeroLogo.style.transform = `scale(${scale})`;
        aboutHeroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
      } else {
        aboutHeroLogo.style.opacity = 1;
        aboutHeroLogo.style.transform = 'scale(1)';
        aboutHeroLogo.style.filter = 'blur(0px)';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      
      if (!aboutHeroSection) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      
      if (scrolled > heroHeight * 0.3) {
        const parallaxContent = document.querySelector('.about-parallax-content');
        if (parallaxContent) {
          const speed = 0.5;
          const yPos = -(scrolled - heroHeight * 0.3) * speed;
          parallaxContent.style.transform = `translateY(${yPos}px)`;
        }
      }

      // Hide hero content when scrolling to bottom (to prevent showing over footer)
      const heroContent = document.querySelector('.about-hero-content');
      if (heroContent) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;
        
        // If user is near bottom (within 400px of footer)
        if (scrollHeight - scrollTop - clientHeight < 400) {
          heroContent.style.opacity = '0';
          heroContent.style.pointerEvents = 'none';
        } else {
          heroContent.style.opacity = '1';
          heroContent.style.pointerEvents = 'auto';
        }
      }
    };

    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleParallaxScroll);
  }, []);

  const aboutCards = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Naša Priča",
      description: "Bua Luang Thai Spa je osnovan iz duboke strasti prema autentičnoj tajlandskoj wellness tradiciji. Naš tim posvećen je vašem blagostanju."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Naša Filozofija",
      description: "Verujemo da je prava lepota odraz unutrašnjeg mira. Svaki tretman je dizajniran da donese harmoniju telu, umu i duhu."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Naš Tim",
      description: "Naš stručni tim terapeuta obučen je direktno u Tajlandu, garantujući autentično iskustvo tradicionalnog wellness-a."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Naše Vrednosti",
      description: "Sa preko 15 godina iskustva, kombinujemo tradiciju sa modernim pristupom za jedinstveno iskustvo relaksacije."
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

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-grid">
          {aboutCards.map((card, index) => (
            <Card key={index} className="about-service-card">
              <CardContent className="about-card-content">
                <div className="about-icon-wrapper">
                  {card.icon}
                </div>
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-description">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Spremni za transformaciju?</h2>
          <p className="cta-subtitle">Rezervišite svoj tretman i započnite putovanje ka unutrašnjem miru</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">Kontaktirajte nas</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/massage">Pogledajte naše usluge</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Empty testimonial section for spacing */}
      <section className="about-testimonial">
        {/* Empty section for consistent spacing */}
      </section>

      </div> {/* Close parallax-content */}
    </div>
  );
};

export default About;
