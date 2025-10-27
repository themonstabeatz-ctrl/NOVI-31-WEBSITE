import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Home = () => {
  const { translate } = useLanguage();
  const heroTitleRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  // Ensure video plays
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => console.log('Video autoplay:', err));
    }
  }, []);

  // Hide video background when scrolling past Hero section
  useEffect(() => {
    const handleScroll = () => {
      const videoBackground = document.querySelector('.fixed-video-background');
      const heroSection = document.querySelector('.pim-hero');
      
      if (videoBackground && heroSection) {
        const heroBottom = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Hide video when scrolled past hero section
        if (scrollPosition > heroBottom - 100) {
          videoBackground.style.opacity = '0';
          videoBackground.style.visibility = 'hidden';
        } else {
          videoBackground.style.opacity = '1';
          videoBackground.style.visibility = 'visible';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    window.addEventListener('scroll', handleParallaxScroll);
    return () => window.removeEventListener('scroll', handleParallaxScroll);
  }, []);

  return (
    <div className="pim-style-homepage">
      {/* Fixed Video Background - No overlay filter */}
      <div className="fixed-video-background">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          className="global-fixed-video"
        >
          <source src="https://customer-assets.emergentagent.com/job_goldenlinesdesign/artifacts/flpuvnqw_POCETNA.mp4" type="video/mp4" />
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

        {/* Welcome Section - Normal */}
        <section className="pim-welcome">
        <div className="pim-welcome-container">
          <h3 className="pim-welcome-subtitle">Dobrodošli u Bua Luang Thai Spa-Beograd</h3>
          <h2 className="pim-welcome-title">UMETNOST TAJLANDSKE MASAŽE</h2>
          <div className="pim-welcome-content">
            <div className="pim-welcome-text">
              <p>
                Bua Luang Thai Spa je posvećen spajanju tradicionalnih tajlandskih tehnika masaže sa 
                savremenim wellness praksama. Naš tim je posvećen pružanju pomoći u postizanju opuštanja, 
                ublažavanju napetosti mišića i poboljšanju opšteg blagostanja. Zalažemo se za holistički 
                pristup lečenju koji integriše um, telo i duh.
              </p>
              <p>Pronađite nas na adresi Abebe Bikile 10A, Zemun, Beograd 11080, Srbija.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Normal */}
      <section className="pim-quote">
        <div className="pim-quote-content">
          <p className="pim-quote-text">Osetite harmoniju tela i duha</p>
          <p className="pim-quote-author">Bua Luang Thai Spa-Beograd</p>
          <Button asChild className="pim-quote-button">
            <Link to="/contact">Rezervišite Online</Link>
          </Button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="pim-philosophy">
        <h2 className="pim-philosophy-title">NAŠA UMETNOST TAJLANDSKE MASAŽE</h2>
        <div className="pim-philosophy-content">
          <div className="pim-philosophy-text">
            <p>
              Tajlandska masaža nije samo tretman, to je poštovanje prema telu, umu i duhu.
              U njenim korenima leži drevna mudrost joge, ajurvede i budističke prakse.
              Verujemo da kroz dodir i harmoničan ritam terapeut ne samo da opušta mišiće, već oslobađa puteve energije, vraća protok i uspostavlja balans u telu i duhu.
            </p>
            <p>
              Svaki pritisak, opušta mišiće i istezanje postaje komunikacija tela sa sobom.
              Terapeut ne vodi samo pokret ruku, vodi pažnju, saosećanje i prisutnost.
              Kroz to putovanje, napetosti se pretvaraju u olakšanje, a telo u prostor obnove.
            </p>
            <p>
              Naš cilj je da svaki klijent iz spa-prostora izađe ne samo opušteniji, već osnaženiji, povezaniji sa sobom i inspirisan tišinom, jer prava masaža je susret između energije koju dolazite da primite i harmonije koju otkrijete u sebi.
            </p>
          </div>
        </div>
      </section>

      {/* Gift Voucher Section */}
      <section className="pim-gift">
        <h2 className="pim-gift-title">
          Počastite voljenu osobu ili tretiraje kolegu sa poklonom opuštanja. 
          Nema potrebe da se stresiraž vožnja okolo da pronađete savršen poklon. 
          Sa samo nekoliko klikova, možete kupiti savršen poklon od nas. 
          Kliknite "KUPITE SADA" da razmaziž voljenu osobu divnim poklonom opuštanja.
        </h2>
        <div className="pim-gift-voucher-showcase">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-thai-spa/artifacts/1uemvsqg_Poklon%20vaucer%20sa%20kovertom%20srpski.png" 
            alt="Poklon Vaucer"
            className="pim-gift-voucher-breathing"
          />
        </div>
        <Button asChild className="pim-gift-button-bottom">
          <Link to="/contact">KUPITE SADA</Link>
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