import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Home = () => {
  const { translate } = useLanguage();
  const heroTitleRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const treatments = [
    {
      name: "Aromaterapijska masaža",
      description: "Uronite u duboku relaksaciju kod Bua Luang Thai Spa sa Aromaterapijskom masažom u Beogradu. Udišite lečilišne arome prilagođenih mešavina eteričnih ulja, napravljenih od strane naših stručnih terapeuta prema vašim specifičnim potrebama. Osetite kako se napetost topi dok vas obuzima spokoj, ostavljajući vas osvežene i podmlađene.",
      duration: "60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Švedska masaža", 
      description: "Opustite se kao nikada pre sa Švedskom masažom kod Bua Luang Thai Spa u Beogradu. Naši stručni terapeuti će koristiti nežne pokrete i tehnike gnječenja da rastope napetost i smire vaš um. Ova klasična masaža je dizajnirana da promoviše opšte blagostanje.",
      duration: "60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Masaža vrućim kamenjem",
      description: "Uronite u čisto blaženstvo sa masažom vrućim kamenjem kod Bua Luang Thai Spa u Beogradu. Topli, glatki kamen klizi po vašem telu, vešto korišćen od strane naših vešti terapeuta da rastopi napetost. Duboka, umirujuća toplota prodire u mišiće.",
      duration: "30min 4,200 RSD / 60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Masaža stopala",
      description: "Pobegnite u spokoj sa masažom stopala kod Bua Luang Thai Spa u Beogradu. Naši vešti terapeuti će raditi svoju magiju na vašim stopalima i donjim nogama, primenjujući pritisak na specifične tačke koje revitalizuju celo vaše telo.",
      duration: "30min 4,200 RSD / 60min 5,900 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png", 
      link: "/contact"
    },
    {
      name: "Duboka masaža tkiva",
      description: "Želite da rastopite stres i napetost? Duboka masaža tkiva kod Bua Luang Thai Spa u Beogradu nudi podmlađujući bekstvo. Naši terapeuti spajaju klasične tajlandske tehnike sa dubokim pritiskom, specifično ciljajući vaše potrebe.",
      duration: "60min 7,200 RSD / 90min 10,200 RSD / 120min 12,000 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Tradicionalna tajlandska masaža",
      description: "Zatvorite oči i budite odvedeni u Tajland sa tradicionalnom tajlandskom masažom kod Bua Luang Thai Spa u Beogradu. Naši vešti terapeuti koriste drevne tehnike, kombinujući ritmični pritisak i nežno istezanje.",
      duration: "30min 4,200 RSD / 60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Masaža trudnica",
      description: "Prigrlistie udobnost i negu za vas i vaše malo dete sa masažom trudnica kod Bua Luang Thai Spa u Beogradu. Naši iskusni terapeuti specijalizovani su za podršku buduće majke nežnim, negujućim tehnikama.",
      duration: "60min 7,200 RSD / 90min 10,200 RSD / 120min 12,000 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Glava, vrat, leđa, rame",
      description: "Opustite se i napunite baterije sa masažom glave, vrata, leđa i ramena kod Bua Luang Thai Spa u Beogradu. Naši stručni terapeuti ciljaju na napetost u ključnim tačkama koristeći fuziju tajlandskih tehnika.",
      duration: "30min 4,200 RSD / 60min 5,900 RSD", 
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    },
    {
      name: "Kombinovana tajlandska masaža",
      description: "Uronite u ultimativnu relaksaciju sa kombinovanom tajlandskom masažom kod Bua Luang Thai Spa u Beogradu. To je savršena mešavina svetova! Naši vešti terapeuti besprekorno spajaju moćne tehnike tajlandske masaže.",
      duration: "60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/bcuah843_6286005458adf.png",
      link: "/contact"
    }
  ];

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
      const secondaryHero = document.getElementById('hero-secondary');
      const buddhaHero = document.getElementById('buddha-hero');
      const buddhaOverlay = document.getElementById('buddha-overlay');
      
      if (!heroSection || !secondaryHero) return;
      
      const heroHeight = 110 * window.innerHeight / 100; // 110vh in pixels
      const buddhaStartTrigger = heroHeight * 0.5; // Buddha starts moving at 50%
      const herbalStartTrigger = heroHeight * 1.1; // Herbal appears AFTER Welcome section
      
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
      
      // Herbal compress - appears AFTER Welcome section text
      if (scrolled > herbalStartTrigger) {
        const herbalMove = (scrolled - herbalStartTrigger) * 0.3; // Gentle movement
        secondaryHero.style.transform = `translateY(-${herbalMove}px)`;
        
        // Calculate fade in for herbal
        const fadeDistance = heroHeight * 0.3;
        const fadePercent = Math.min((scrolled - herbalStartTrigger) / fadeDistance, 1);
        secondaryHero.style.opacity = Math.min(fadePercent * 0.9, 0.9);
      } else {
        // Reset herbal when scrolling back
        secondaryHero.style.transform = 'translateY(0)';
        secondaryHero.style.opacity = 0;
      }
      
      // Apply parallax only to sections after hero
      if (scrolled > heroHeight) {
        const parallaxSections = document.querySelectorAll('.pim-welcome, .pim-quote, .pim-philosophy, .pim-treatments');
        parallaxSections.forEach((section) => {
          const speed = 0.5; // Parallax speed
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
      {/* Hero Banner with Original Buddha */}
      <section className="pim-hero" id="hero-section">
        <div className="pim-hero-image" id="buddha-hero">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/6u1f3zhj_vecteezy_buddha-statue-meditating-with-lotus-flowers-and-burning-candles_47024342.jpeg" 
            alt="Buddha Meditation - Bua Luang Thai Spa"
          />
        </div>
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

      {/* Second Hero - Herbal Compress (appears when Buddha scrolls away) */}
      <section className="pim-hero-secondary" id="hero-secondary">
        <div className="pim-hero-image">
          <img 
            src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/9liwcjtb_herbal-compress-herbal-spa-treatment-equipments-put-dark-floor.jpg" 
            alt="Herbal Spa Treatment - Bua Luang Thai Spa"
          />
        </div>
        <div className="pim-hero-overlay"></div>
      </section>

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
          <p className="pim-quote-text">"Doživite lečilišne benefite tajlandske masaže"</p>
          <p className="pim-quote-author">- Bua Luang Thai Spa-Beograd</p>
          <Button asChild className="pim-quote-button">
            <Link to="/contact">Rezervišite Online</Link>
          </Button>
        </div>
      </section>

      {/* Philosophy Section - With Video Background */}
      <section className="pim-philosophy">
        <div className="pim-philosophy-video-background">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="pim-philosophy-video"
          >
            <source src="https://customer-assets.emergentagent.com/job_serene-thai-spa/artifacts/mt6zy81k_261255.mp4" type="video/mp4" />
          </video>
          <div className="pim-philosophy-video-overlay"></div>
        </div>
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

      {/* Services Section */}
      <section className="pim-services">
        <h2 className="pim-services-title">Naši Tretmani</h2>
        <div className="pim-services-grid">
          {treatments.map((treatment, index) => (
            <Card key={index} className="pim-treatment-card">
              <div className="pim-treatment-image">
                <img src={treatment.image} alt={treatment.name} />
              </div>
              <CardContent className="pim-treatment-content">
                <h3 className="pim-treatment-name">{treatment.name}</h3>
                <p className="pim-treatment-description">{treatment.description}</p>
                <p className="pim-treatment-duration">{treatment.duration}</p>
                <Button className="pim-treatment-button" asChild>
                  <Link to={treatment.link}>Rezervišite Sada</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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
            src="https://customer-assets.emergentagent.com/job_serene-thai-spa/artifacts/gwespm5l_Poklon%20vaucer%20sa%20kovertom%20srpski.png" 
            alt="Poklon Vaucer"
            className="pim-gift-voucher-image"
          />
        </div>
        <Button asChild className="pim-gift-button-bottom">
          <Link to="/contact">KUPITE SADA</Link>
        </Button>
      </section>

      {/* Testimonial */}
      <section className="pim-testimonial">
        <blockquote className="pim-testimonial-quote">
          "Blaženo i lečilišno. Naš tim je topao, dobrodošao, profesionalan i briljantan u svom poslu. 
          Prilagođavaju se pritisku koji želite, ciljaju oblasti koje trebate, i brinu o vama svaki trenutak. 
          Snažne ruke, um, duša. 5★ i 10/10 snažno preporučujem!"
        </blockquote>
        <cite className="pim-testimonial-author">Marija</cite>
      </section>
      </div> {/* Close parallax container */}
    </div>
  );
};

export default Home;