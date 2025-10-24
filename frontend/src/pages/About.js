import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

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

  return (
    <div className="about-container">
      {/* Fixed Video Hero Section - Prazan za postavljanje videa */}
      <section className="about-hero-fixed">
        <div className="about-hero-video-container">
          {/* Ovde postavite video */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="about-hero-video"
          >
            <source src="https://customer-assets.emergentagent.com/job_a9e89e7a-058d-490d-923c-38f5cc2b3a04/artifacts/rarokw26_Woman_Drinking_Tea_In_Spa_fhd_2012921.mp4" type="video/mp4" />
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

      {/* About Content Section with 3D Effects */}
      <div className="about-content-parallax">
        <section className="about-story-section">
          <div className="about-story-container">
            <div className="about-story-card-3d">
              <h2 className="about-story-title">Dobrodošli u Bua Luang Thai Spa</h2>
              <p className="about-story-text">
                Oazu mira u srcu Beograda, gde drevna tradicija Tajlanda susreće savremeni duh blagostanja.
              </p>
            </div>

            <div className="about-story-card-3d">
              <p className="about-story-text">
                Naša filozofija počiva na umeću tradicionalne tajlandske masaže, starom više od 2.500 godina. 
                Njen tvorac, dr Jivaka Kumar Bhaccha, legendarni lekar kraljevske porodice i prijatelj Bude, 
                spojio je znanja ajurvede, joge i meditacije u jedinstvenu tehniku koja obnavlja telo, um i energiju.
              </p>
            </div>

            <div className="about-story-card-3d">
              <p className="about-story-text">
                Kroz vekove, ova umetnost negovana je u hramovima širom Tajlanda, naročito u čuvenom Wat Pho hramu u Bangkoku, 
                danas poznatom kao svetsko središte tradicionalne masaže.
              </p>
            </div>

            <div className="about-story-card-3d">
              <p className="about-story-text">
                U našem spa centru sa ponosom čuvamo tu autentičnu tradiciju, uz dašak modernog luksuza i pažnje prema svakom detalju. 
                Naši terapeuti, školovani u renomiranim tajlandskim institucijama, pristupaju svakom tretmanu s potpunom posvećenošću, 
                unoseći u svaki dodir energiju, smirenost i poštovanje prema vašem telu i duši.
              </p>
            </div>

            <div className="about-story-card-3d">
              <p className="about-story-text">
                Uđite u prostor gde miris eteričnih ulja, toplina dodira i tišina trenutka buđe vaša čula i vraćaju vas sebi. 
                Doživite snagu tradicije, lepotu dodira i harmoniju koja traje vekovima.
              </p>
            </div>

            <div className="about-story-card-3d about-story-card-final">
              <h3 className="about-story-subtitle">Bua Luang Thai Spa</h3>
              <p className="about-story-text-highlight">
                Vaše putovanje ka unutrašnjem miru i savršenoj ravnoteži.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;