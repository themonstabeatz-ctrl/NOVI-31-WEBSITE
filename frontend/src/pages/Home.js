import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Home = () => {
  const { translate } = useLanguage();

  useEffect(() => {
    const handleGlobalParallaxScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5; // Speed for all parallax layers
      
      // Global parallax layers - all move at same speed but in different sections
      const parallaxLayers = [
        'parallax-layer',      // Hero section
        'tagline-overlay',     // Tagline section
        'welcome-overlay',     // Welcome section
        'quote-overlay',       // Quote section
        'philosophy-overlay'   // Philosophy section
      ];
      
      parallaxLayers.forEach(layerId => {
        const layer = document.getElementById(layerId);
        if (layer) {
          layer.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
      });
      
      // Fade hero content as we scroll
      const heroContent = document.querySelector('.pim-hero-content');
      if (heroContent) {
        const heroHeight = window.innerHeight;
        const contentOpacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.2);
        heroContent.style.opacity = contentOpacity;
      }
      
      // Create depth by changing background positions at different speeds
      const backgrounds = document.querySelectorAll('.pim-tagline-bg, .pim-welcome-bg, .pim-quote-bg, .pim-philosophy-bg');
      backgrounds.forEach((bg, index) => {
        const speed = 0.3 + (index * 0.1); // Different speeds for each background
        bg.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll listener with passive option for performance
    window.addEventListener('scroll', handleGlobalParallaxScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleGlobalParallaxScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

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

  return (
    <div className="pim-style-homepage">
      {/* Hero Banner with Fixed Background */}
      <section className="pim-hero" id="hero-section">
        <div className="pim-hero-image">
          <img 
            src="https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/lbd6sac9_vecteezy_buddha-statue-meditating-with-lotus-flowers-and-burning-candles_47024342.jpeg" 
            alt="Buddha Meditation - Bua Luang Thai Spa"
          />
        </div>
        <div className="pim-hero-overlay"></div>
        <div className="pim-parallax-layer" id="parallax-layer"></div>
        <div className="pim-hero-content">
          <h1 className="pim-hero-title">POSTAVITE VAŠE TELO U DOBRE RUKE</h1>
          <Button asChild className="pim-hero-button">
            <Link to="/contact">Rezervišite Online</Link>
          </Button>
        </div>
      </section>

      {/* Tagline with Parallax */}
      <section className="pim-tagline" id="tagline-section">
        <div className="pim-tagline-bg"></div>
        <div className="pim-tagline-overlay" id="tagline-overlay"></div>
        <div className="pim-tagline-content">
          <h2>Tajlandska masaža, duša tradicije i tela</h2>
        </div>
      </section>

      {/* Welcome Section with Parallax */}
      <section className="pim-welcome" id="welcome-section">
        <div className="pim-welcome-bg"></div>
        <div className="pim-welcome-overlay" id="welcome-overlay"></div>
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
              <p>Pronađite nas na adresi Knez Mihailova 15, Beograd 11000, Srbija.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section with Parallax */}
      <section className="pim-quote" id="quote-section">
        <div className="pim-quote-bg"></div>
        <div className="pim-quote-overlay" id="quote-overlay"></div>
        <div className="pim-quote-content">
          <p className="pim-quote-text">"Doživite lečilišne benefite tajlandske masaže"</p>
          <p className="pim-quote-author">- Bua Luang Thai Spa-Beograd</p>
          <Button asChild className="pim-quote-button">
            <Link to="/contact">Rezervišite Online</Link>
          </Button>
        </div>
      </section>

      {/* Philosophy Section with Parallax */}
      <section className="pim-philosophy" id="philosophy-section">
        <div className="pim-philosophy-bg"></div>
        <div className="pim-philosophy-overlay" id="philosophy-overlay"></div>
        <div className="pim-philosophy-content">
          <h2>FILOSOFIJA</h2>
          <div className="pim-philosophy-image">
            <img 
              src="https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/cgds8iwm_%E2%80%94Pngtree%E2%80%94thai%20retro%20pattern%20exotic%20border_9031382.png" 
              alt="Thai Philosophy"
            />
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
        <Button asChild className="pim-gift-button">
          <Link to="/contact">KUPITE SADA</Link>
        </Button>
        <div className="pim-gift-image">
          <img 
            src="https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/cgds8iwm_%E2%80%94Pngtree%E2%80%94thai%20retro%20pattern%20exotic%20border_9031382.png" 
            alt="Gift Voucher"
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
    </div>
  );
};

export default Home;