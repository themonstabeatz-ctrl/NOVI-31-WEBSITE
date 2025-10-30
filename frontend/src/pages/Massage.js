import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { throttle } from "../utils/debounce";

const Massage = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [selectedTraditionalDuration, setSelectedTraditionalDuration] = useState('60'); // Default 60 min

  // Get traditional massage price and duration based on selection
  const getTraditionalMassageDetails = () => {
    const options = {
      '60': { duration: '60 min', price: '3,000 RSD', serviceId: 'Tradicionalna tajlandska masaža - 60 min' },
      '90': { duration: '90 min', price: '4,000 RSD', serviceId: 'Tradicionalna tajlandska masaža - 90 min' },
      '120': { duration: '120 min', price: '5,000 RSD', serviceId: 'Tradicionalna tajlandska masaža - 120 min' }
    };
    return options[selectedTraditionalDuration];
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Card slide-in animation on scroll
  useEffect(() => {
    const cards = document.querySelectorAll('.massage-card');
    const cardsGrid = document.querySelector('.services-grid');
    
    if (!cardsGrid || cards.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Desktop and landscape mode - Original animation with roll-out effect
    const gridStyle = window.getComputedStyle(cardsGrid);
    const gridColumns = gridStyle.gridTemplateColumns;
    const columns = gridColumns.split(' ').length;
    
    cards.forEach((card, index) => {
      let slideDirection;
      let transformStart;
      
      if (isMobile || columns === 1) {
        const pattern = index % 3;
        const slideDistance = 200;
        const tiltAngle = 25;
        
        if (pattern === 0) {
          slideDirection = 'from-left';
          transformStart = `translateX(-${slideDistance}px) rotateY(-${tiltAngle}deg)`;
        } else if (pattern === 1) {
          slideDirection = 'from-bottom';
          transformStart = 'translateY(150px)';
        } else {
          slideDirection = 'from-right';
          transformStart = `translateX(${slideDistance}px) rotateY(${tiltAngle}deg)`;
        }
        card.style.transition = 'opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        const columnPosition = index % columns;
        const slideDistance = 300;
        const tiltAngle = 30;
        
        if (columnPosition === 0) {
          slideDirection = 'from-left';
          transformStart = `translateX(-${slideDistance}px) rotateY(-${tiltAngle}deg)`;
        } else if (columnPosition === columns - 1) {
          slideDirection = 'from-right';
          transformStart = `translateX(${slideDistance}px) rotateY(${tiltAngle}deg)`;
        } else {
          slideDirection = 'from-bottom';
          transformStart = 'translateY(150px)';
        }
        card.style.transition = 'opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      card.setAttribute('data-slide-direction', slideDirection);
      card.setAttribute('data-transform-start', transformStart);
      card.style.transformStyle = 'preserve-3d';
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const transformStart = entry.target.getAttribute('data-transform-start');
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (entry.isIntersecting) {
          // Card entering viewport - show it
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate(0, 0) rotateY(0deg)';
        } else if (!isPortrait) {
          // Card leaving viewport - hide ONLY on desktop/landscape (not portrait)
          entry.target.style.opacity = '0';
          entry.target.style.transform = transformStart;
        }
        // If portrait mode: do nothing when card leaves viewport (keep it visible)
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [translate]);

  // Logo transformation and parallax effects on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const massageHeroSection = document.querySelector('.massage-hero-fixed');
      const massageHeroLogo = document.querySelector('.massage-hero-logo');
      const massageHeroTitle = document.querySelector('.massage-hero-title');
      const massageHeroSubtitle = document.querySelector('.massage-hero-subtitle');
      
      if (!massageHeroSection || !massageHeroLogo) return;
      
      const heroHeight = massageHeroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        // Scroll down - transform logo with fade and blur
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        massageHeroLogo.style.opacity = opacity;
        massageHeroLogo.style.transform = `scale(${scale})`;
        massageHeroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
        
        // Fade out title and subtitle
        if (massageHeroTitle) {
          massageHeroTitle.style.opacity = opacity;
          massageHeroTitle.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
        if (massageHeroSubtitle) {
          massageHeroSubtitle.style.opacity = opacity;
          massageHeroSubtitle.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
      } else {
        // Scroll up - restore logo
        massageHeroLogo.style.opacity = 1;
        massageHeroLogo.style.transform = 'scale(1)';
        massageHeroLogo.style.filter = 'blur(0px)';
        
        // Restore title and subtitle
        if (massageHeroTitle) {
          massageHeroTitle.style.opacity = 1;
          massageHeroTitle.style.transform = 'translateY(0)';
        }
        if (massageHeroSubtitle) {
          massageHeroSubtitle.style.opacity = 1;
          massageHeroSubtitle.style.transform = 'translateY(0)';
        }
      }
      
      // Fade in CTA section after cards
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection) {
        const ctaOffset = ctaSection.offsetTop;
        const windowHeight = window.innerHeight;
        const ctaScrollPercent = Math.max(0, Math.min(1, (scrollPosition + windowHeight - ctaOffset) / windowHeight));
        
        if (ctaScrollPercent > 0) {
          ctaSection.style.opacity = ctaScrollPercent;
          ctaSection.style.transform = `translateY(${(1 - ctaScrollPercent) * 50}px)`;
        }
      }
    };
    
    const throttledHandleScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Parallax effect for content sections
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.scrollY;
      const massageHeroSection = document.querySelector('.massage-hero-fixed');
      
      if (!massageHeroSection) return;
      
      const heroHeight = massageHeroSection.offsetHeight;
      
      // Apply parallax to sections after hero
      if (scrolled > heroHeight * 0.3) {
        const parallaxContent = document.querySelector('.massage-parallax-content');
        if (parallaxContent) {
          const speed = 0.5;
          const yPos = -(scrolled - heroHeight * 0.3) * speed;
          parallaxContent.style.transform = `translateY(${yPos}px)`;
        }
      }
    };

    const throttledHandleParallaxScroll = throttle(handleParallaxScroll, 16);
    window.addEventListener('scroll', throttledHandleParallaxScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleParallaxScroll);
  }, []);

  const traditionalDetails = getTraditionalMassageDetails();
  
  const massageServices = [
    {
      name: translate("traditionalMassage"),
      duration: traditionalDetails.duration,
      price: traditionalDetails.price,
      serviceId: traditionalDetails.serviceId,
      description: translate("traditionalMassageDesc"),
      benefits: [translate("traditionalBenefit1"), translate("traditionalBenefit2"), translate("traditionalBenefit3")],
      popular: true,
      hasDurationOptions: true // Mark this service as having duration options
    },
    {
      name: translate("oilMassage"),
      duration: "60 min",
      price: "5,000 RSD",
      description: translate("oilMassageDesc"),
      benefits: [translate("oilBenefit1"), translate("oilBenefit2"), translate("oilBenefit3")],
      popular: false
    },
    {
      name: translate("hotStone"),
      duration: "90 min", 
      price: "7,500 RSD",
      description: translate("hotStoneDesc"),
      benefits: [translate("hotStoneBenefit1"), translate("hotStoneBenefit2"), translate("hotStoneBenefit3")],
      popular: false
    },
    {
      name: translate("royalMassage"),
      duration: "120 min",
      price: "9,500 RSD",
      description: translate("royalMassageDesc"),
      benefits: [translate("royalBenefit1"), translate("royalBenefit2"), translate("royalBenefit3")],
      popular: true
    },
    {
      name: translate("footMassage"),
      duration: "45 min",
      price: "3,500 RSD",
      description: translate("footMassageDesc"),
      benefits: [translate("footBenefit1"), translate("footBenefit2"), translate("footBenefit3")],
      popular: false
    },
    {
      name: translate("coupleMassage"),
      duration: "60 min",
      price: "8,500 RSD",
      description: translate("coupleMassageDesc"),
      benefits: [translate("coupleBenefit1"), translate("coupleBenefit2"), translate("coupleBenefit3")],
      popular: false
    }
  ];

  return (
    <div className="massage-container">
      {/* Fixed Video Hero Section */}
      <section className="massage-hero-fixed">
        <div className="massage-hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="massage-hero-video"
          >
            <source src="https://customer-assets.emergentagent.com/job_goldenlinesdesign/artifacts/jkumv1ek_MASAZE.mp4" type="video/mp4" />
          </video>
          <div className="massage-hero-overlay"></div>
        </div>
        
        <div className="massage-hero-content">
          <div className="massage-hero-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="hero-logo-image"
            />
          </div>
          <h1 className="massage-hero-title">{translate("massageHeroTitle")}</h1>
          <div className="massage-hero-divider"></div>
          <p className="massage-hero-subtitle">
            {translate("massageHeroSubtitle")}
          </p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div className="massage-parallax-content">

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-grid">
          {massageServices.map((service, index) => (
            <Card key={index} className="massage-card">
              {service.popular && (
                <Badge className="popular-badge">
                  <Star className="w-3 h-3 mr-1" />
                  {translate("mostPopular")}
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="massage-name">{service.name}</CardTitle>
                
                {/* Duration selection buttons - only for traditional massage */}
                {service.hasDurationOptions && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <button
                      onClick={() => setSelectedTraditionalDuration('60')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: selectedTraditionalDuration === '60' ? '2px solid #d4af37' : '1px solid #444',
                        backgroundColor: selectedTraditionalDuration === '60' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                        color: '#d4af37',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: selectedTraditionalDuration === '60' ? 'bold' : 'normal',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      60 min
                    </button>
                    <button
                      onClick={() => setSelectedTraditionalDuration('90')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: selectedTraditionalDuration === '90' ? '2px solid #d4af37' : '1px solid #444',
                        backgroundColor: selectedTraditionalDuration === '90' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                        color: '#d4af37',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: selectedTraditionalDuration === '90' ? 'bold' : 'normal',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      90 min
                    </button>
                    <button
                      onClick={() => setSelectedTraditionalDuration('120')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: selectedTraditionalDuration === '120' ? '2px solid #d4af37' : '1px solid #444',
                        backgroundColor: selectedTraditionalDuration === '120' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                        color: '#d4af37',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: selectedTraditionalDuration === '120' ? 'bold' : 'normal',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      120 min
                    </button>
                  </div>
                )}
                
                <div className="massage-meta">
                  <div className="duration">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="price">{service.price}</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="massage-description">{service.description}</p>
                
                <div className="benefits">
                  <h4 className="benefits-title">{translate("benefits")}</h4>
                  <ul className="benefits-list">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="benefit-item">{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="book-button w-full">
                  <Link to={`/contact?service=${encodeURIComponent(service.name)}`}>{translate("bookAppointment")}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">{translate("massageCtaTitle")}</h2>
          <p className="cta-subtitle">{translate("massageCtaSubtitle")}</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">{translate("massageCtaButtonPrimary")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/spa">{translate("massageCtaButtonSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Empty parallax section for spacing - like Home page */}
      <section className="massage-testimonial">
        {/* Empty section for consistent spacing */}
      </section>

      </div> {/* Close parallax-content */}
    </div>
  );
};

export default Massage;