import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { throttle } from "../utils/debounce";
import { getSEO } from "../utils/seoConfig";

const Home = () => {
  const { translate } = useLanguage();
  const homeSEO = getSEO('home');
  const heroTitleRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device for video optimization
  useEffect(() => {
    const checkMobile = () => {
      const width = window.visualViewport ? window.visualViewport.width : window.screen.width;
      setIsMobile(width < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure video plays
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => console.log('Video autoplay:', err));
    }
  }, []);

  useEffect(() => {
    const heroLogo = document.getElementById('hero-logo');
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroSection = document.getElementById('hero-section');
      
      if (!heroSection || !heroLogo) return;
      
      const heroHeight = heroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        // Scroll down - transform logo to lotus IMMEDIATELY and FASTER
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        heroLogo.style.opacity = opacity;
        heroLogo.style.transform = `scale(${scale})`;
        heroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
        
        // Add lotus petals effect immediately
        if (scrollPercent > 0.1 && !heroLogo.classList.contains('lotus-transform')) {
          heroLogo.classList.add('lotus-transform');
        }
      } else {
        // Scroll up - restore logo
        heroLogo.style.opacity = 1;
        heroLogo.style.transform = 'scale(1)';
        heroLogo.style.filter = 'blur(0px)';
        heroLogo.classList.remove('lotus-transform');
      }
    };
    
    const throttledHandleScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Parallax effect for sections after Buddha
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.scrollY;
      const heroSection = document.getElementById('hero-section');
      const buddhaHero = document.getElementById('buddha-hero');
      const buddhaOverlay = document.getElementById('buddha-overlay');
      
      if (!heroSection) return;
      
      const heroHeight = 110 * window.innerHeight / 100; // 110vh in pixels
      const buddhaStartTrigger = heroHeight * 0.5; // Buddha starts moving at 50%
      
      // Buddha movement - FASTER movement
      if (scrolled > buddhaStartTrigger) {
        // Calculate how much to move - FASTER now
        const moveAmount = (scrolled - buddhaStartTrigger) * 1.2; // 1.2 for FASTER movement (was 0.6)
        
        // Move Buddha hero up FAST (NO FADE)
        heroSection.style.transform = `translateY(-${moveAmount}px)`;
        heroSection.style.opacity = 1; // Keep full opacity
      } else {
        // Reset Buddha when scrolling back to top
        heroSection.style.transform = 'translateY(0)';
        heroSection.style.opacity = 1;
      }
      
      // Apply parallax only to sections after hero
      if (scrolled > heroHeight) {
        // Quote section moves faster up
        const quoteSection = document.querySelector('.pim-quote');
        if (quoteSection) {
          const quoteFastSpeed = 0.8; // Faster parallax for quote section
          const quoteYPos = -(scrolled - heroHeight) * quoteFastSpeed;
          quoteSection.style.transform = `translateY(${quoteYPos}px)`;
        }
        
        // Other sections move at normal speed
        const otherSections = document.querySelectorAll('.pim-welcome, .pim-philosophy');
        otherSections.forEach((section) => {
          const speed = 0.5; // Normal parallax speed
          const yPos = -(scrolled - heroHeight) * speed;
          section.style.transform = `translateY(${yPos}px)`;
        });
      }
    };

    const throttledHandleParallaxScroll = throttle(handleParallaxScroll, 16);
    window.addEventListener('scroll', throttledHandleParallaxScroll);
    return () => window.removeEventListener('scroll', throttledHandleParallaxScroll);
  }, []);

  return (
    <div className="pim-style-homepage">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Bua Luang Thai Spa Beograd | #1 Tradicionalna Thai Masaža & Luksuzni SPA</title>
        <meta name="description" content="Bua Luang Thai Spa - autentičan tajlandski spa centar u Beogradu. Tradicionalne thai masaže, luksuzni SPA rituali, aroma terapija. Rezervišite termin online! ☎️ Najbolja masaža u Beogradu." />
        <meta name="keywords" content="masaža beograd, spa beograd, tajlandska masaža, thai masaža, wellness beograd, relaks masaža, bua luang, thai spa beograd" />
        <link rel="canonical" href="https://www.bualuangthaispa.rs/" />
        <meta property="og:title" content="Bua Luang Thai Spa Beograd | #1 Tradicionalna Thai Masaža" />
        <meta property="og:url" content="https://www.bualuangthaispa.rs/" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Fixed Video Background - No overlay filter */}
      <div className="fixed-video-background">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="global-fixed-video"
        >
          {/* Mobile gets optimized smaller video (2.62 MB vs 4.09 MB) */}
          {isMobile ? (
            <source src="https://customer-assets.emergentagent.com/job_thaispa-mobile/artifacts/fmiknawg_POCETNA.mp4" type="video/mp4" />
          ) : (
            <source src="https://customer-assets.emergentagent.com/job_goldenlinesdesign/artifacts/flpuvnqw_POCETNA.mp4" type="video/mp4" />
          )}
        </video>
      </div>

      {/* Hero Banner */}
      <section className="pim-hero" id="hero-section">
        <div className="pim-hero-overlay" id="buddha-overlay"></div>
        <div className="pim-hero-content">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/r2vm59ex_Bualuang%20logo%20senka.png"
            alt="Bua Luang Thai Spa Logo"
            className="hero-logo-animated"
            id="hero-logo"
          />
        </div>
      </section>

      {/* Second Hero section removed as requested */}

      {/* Container for parallax sections that go over hero */}
      <div style={{position: 'relative', zIndex: 20, marginTop: '110vh'}}>
        {/* Transparent footer bar below Buddha */}
        <div className="transparent-footer-bar"></div>

        {/* Welcome Section - Dobro došli */}
        <section className="pim-welcome" id="welcome-section">
          <div className="pim-welcome-container">
            <h3 className="pim-welcome-subtitle">{translate("welcomeSubtitle")}</h3>
            <h2 className="pim-welcome-title">{translate("welcomeTitle")}</h2>
            <div className="pim-welcome-content">
              <div className="pim-welcome-text">
                <p>{translate("welcomeText1")}</p>
                <p>{translate("welcomeText2")}</p>
              </div>
            </div>
          </div>
        </section>

      {/* Quote Section - Normal */}
      <section className="pim-quote">
        <div className="pim-quote-content">
          <p className="pim-quote-text">{translate("quoteText")}</p>
          <p className="pim-quote-author">{translate("quoteAuthor")}</p>
          <Button asChild className="pim-quote-button">
            <Link to="/contact">{translate("reserveOnline")}</Link>
          </Button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="pim-philosophy">
        <h2 className="pim-philosophy-title">{translate("philosophyTitle")}</h2>
        <div className="pim-philosophy-content">
          <div className="pim-philosophy-text">
            <p>{translate("philosophyText1")}</p>
            <p>{translate("philosophyText2")}</p>
            <p>{translate("philosophyText3")}</p>
          </div>
        </div>
      </section>

      {/* Gift Voucher Section */}
      <section className="pim-gift">
        <h2 className="pim-gift-title">{translate("giftTitle")}</h2>
        <div className="pim-gift-voucher-showcase">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-thai-spa/artifacts/1uemvsqg_Poklon%20vaucer%20sa%20kovertom%20srpski.png" 
            alt="Poklon Vaucer"
            className="pim-gift-voucher-breathing"
          />
        </div>
        <Button asChild className="pim-gift-button-bottom">
          <Link to="/contact?source=voucher">{translate("buyNow")}</Link>
        </Button>
      </section>

      {/* Testimonial - Empty with transparent background */}
      <section className="pim-testimonial">
        {/* Content removed */}
      </section>
      </div> {/* Close parallax container */}
    </div>
  );
};

export default Home;