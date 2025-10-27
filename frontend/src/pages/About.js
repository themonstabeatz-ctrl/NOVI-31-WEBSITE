import React, { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { throttle } from "../utils/debounce";

const About = () => {
  const { translate } = useLanguage();
  const parallaxSection1Ref = useRef(null);
  const parallaxSection2Ref = useRef(null);
  const textRowsRef = useRef([]);

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

  // Advanced Parallax Text Animation System
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const textRows = section.querySelectorAll('.parallax-text-row');
        
        if (entry.isIntersecting) {
          // Calculate animation progress based on intersection ratio
          const progress = entry.intersectionRatio;
          
          textRows.forEach((row, index) => {
            const delay = index * 200; // 200ms delay between rows
            const shouldAnimate = progress > (index * 0.15); // Staggered trigger points
            
            if (shouldAnimate && !row.classList.contains('animated')) {
              setTimeout(() => {
                row.classList.add('slide-in-active');
                row.classList.add('animated');
              }, delay);
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe both parallax sections
    if (parallaxSection1Ref.current) {
      observer.observe(parallaxSection1Ref.current);
    }
    if (parallaxSection2Ref.current) {
      observer.observe(parallaxSection2Ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Smooth parallax scrolling effect
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg-layer');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1); // Different speeds for layers
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
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
            <source src="https://customer-assets.emergentagent.com/job_goldenlinesdesign/artifacts/9eowsbkd_CAJ.mp4" type="video/mp4" />
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

      {/* Simple Parallax Content Section */}
      <div className="about-simple-parallax">
        <div className="about-text-container">
          <div className="about-parallax-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
            />
          </div>
          
          <p className="about-text-paragraph">
            <span className="about-intro-highlight">Mi smo Bua Luang Thai Spa</span> — mesto gde vreme usporava, a telo i duh pronalaze svoj prirodni ritam.
            U srcu Beograda negujemo istinsku umetnost tajlandskog dodira, zasnovanu na drevnoj tradiciji isceljenja koja traje više od dva i po milenijuma. Ovde svaka masaža nije samo tretman, već ritual ravnoteže, energije i tišine.
          </p>
          
          <p className="about-text-paragraph">
            Naša filozofija počiva na umeću tradicionalne tajlandske masaže, starom više od 2.500 godina. Njen tvorac, dr Jivaka Kumar Bhaccha, legendarni lekar kraljevske porodice i prijatelj Bude, spojio je znanja ajurvede, joge i meditacije u jedinstvenu tehniku koja obnavlja telo, um i energiju.
          </p>
          
          <p className="about-text-paragraph">
            Kroz vekove, ova umetnost negovana je u hramovima širom Tajlanda, naročito u čuvenom Wat Pho hramu u Bangkoku, danas poznatom kao svetsko središte tradicionalne masaže.
          </p>
          
          <p className="about-text-paragraph">
            U našem spa centru sa ponosom čuvamo tu autentičnu tradiciju, uz dašak modernog luksuza i pažnje prema svakom detalju.
            Naši terapeuti, školovani u renomiranim tajlandskim institucijama, pristupaju svakom tretmanu s potpunom posvećenošću, unoseći u svaki dodir energiju, smirenost i poštovanje prema vašem telu i duhu.
          </p>
          
          <p className="about-text-paragraph">
            Uđite u prostor gde miris eteričnih ulja, toplina dodira i tišina trenutka buđe vaša čula i vraćaju vas sebi.
            Doživite snagu tradicije, lepotu dodira i harmoniju koja traje vekovima.
          </p>
          
          <p className="about-text-paragraph about-text-final">
            Bua Luang Thai Spa — vaše putovanje ka unutrašnjem miru i savršenoj ravnoteži.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
