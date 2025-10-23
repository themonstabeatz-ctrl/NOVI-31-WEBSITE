import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Sparkles, Leaf, Star, Shield, Target } from "lucide-react";

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
            <source src="/Woman_Exit_The_Sauna_uhd_1051801.mp4" type="video/mp4" />
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

      {/* Story Section */}
      <section className="about-story-section">
        <div className="about-section-inner">
          <div className="story-grid-about">
            <div className="story-text-area">
              <span className="about-section-label">Naša Priča</span>
              <h2 className="about-section-title">Kraljevski Lotos</h2>
              <div className="story-paragraphs">
                <p>
                  "Bua Luang" znači "kraljevski lotos" na tajlandskom - simbol čistoće, transformacije i unutrašnjeg mira. 
                  Baš kao što lotos cveta iz vode, mi verujemo da svako može pronaći svoj unutrašnji mir kroz naše tretmane.
                </p>
                <p>
                  Naša priča počinje u Bangkoku, gde je naša osnivačica provela godine učeći tradicionalne tehnike masaže 
                  direktno od tajlandskih majstora. Nakon što je stekla duboko razumevanje ove drevne umetnosti, 
                  donela je tu mudrost u Srbiju.
                </p>
                <p>
                  Danas, Bua Luang Thai Spa je mesto gde se hiljadugodišnja tajlandska tradicija spaja sa modernim 
                  pristupom wellness-u. Svaki tretman je dizajniran da transformiše telo, um i duh.
                </p>
              </div>
              
              <div className="story-stats-row">
                <div className="stat-box">
                  <Award className="stat-icon-about" />
                  <div className="stat-number-about">15+</div>
                  <div className="stat-label-about">Godina Iskustva</div>
                </div>
                <div className="stat-box">
                  <Users className="stat-icon-about" />
                  <div className="stat-number-about">5000+</div>
                  <div className="stat-label-about">Zadovoljnih Gostiju</div>
                </div>
                <div className="stat-box">
                  <Star className="stat-icon-about" />
                  <div className="stat-number-about">100%</div>
                  <div className="stat-label-about">Autentično</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="about-section-inner">
          <div className="values-header-about">
            <span className="about-section-label">Naše Vrednosti</span>
            <h2 className="about-section-title">Šta Nas Definiše</h2>
            <p className="values-description">
              Tri stuba na kojima gradimo svako iskustvo u Bua Luang Thai Spa
            </p>
          </div>
          
          <div className="values-grid-about">
            <div className="value-card-about">
              <div className="value-icon-circle">
                <Heart className="value-icon-about" />
              </div>
              <h3 className="value-card-title">Tradicionalnost</h3>
              <p className="value-card-text">
                Naše tehnike su prenesene kroz generacije direktno iz Tajlanda, 
                čuvajući autentičnost svakog pokreta i rituala.
              </p>
            </div>

            <div className="value-card-about">
              <div className="value-icon-circle">
                <Shield className="value-icon-about" />
              </div>
              <h3 className="value-card-title">Kvalitet</h3>
              <p className="value-card-text">
                Koristimo isključivo prirodne proizvode i aromatična ulja 
                najvišeg kvaliteta direktno iz Tajlanda.
              </p>
            </div>

            <div className="value-card-about">
              <div className="value-icon-circle">
                <Target className="value-icon-about" />
              </div>
              <h3 className="value-card-title">Posvećenost</h3>
              <p className="value-card-text">
                Svaki tretman je prilagođen vašim individualnim potrebama 
                za optimalne rezultate i potpuno opuštanje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Quote Section */}
      <section className="about-philosophy-section">
        <div className="about-section-inner">
          <div className="philosophy-box">
            <Sparkles className="philosophy-sparkle-icon" />
            <h2 className="philosophy-quote-title">Naša Filozofija</h2>
            <blockquote className="philosophy-quote-text">
              "Verujemo da je pravi luksuz u jednostavnosti. Svaki pokret, svaki miris, 
              svaki trenutak u našem spa-u dizajniran je da vas vrati u sklad sa sobom. 
              Tajlandska masaža nije samo fizički tretman - to je meditacija, 
              putovanje i transformacija."
            </blockquote>
            <div className="philosophy-signature-line">
              <span className="signature-text-about">— Bua Luang Thai Spa</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-section-inner">
          <div className="cta-content-about">
            <h2 className="cta-title-about">Spremni Za Transformaciju?</h2>
            <p className="cta-subtitle-about">
              Rezervišite svoj tretman i započnite putovanje ka unutrašnjem miru
            </p>
            <div className="cta-buttons-about">
              <Button asChild className="cta-button-primary-about">
                <Link to="/contact">Kontaktirajte Nas</Link>
              </Button>
              <Button asChild className="cta-button-secondary-about">
                <Link to="/massage">Pogledajte Naše Usluge</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      </div> {/* Close parallax-content */}
    </div>
  );
};

export default About;
