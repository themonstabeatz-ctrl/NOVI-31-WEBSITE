import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Sparkles, Leaf } from "lucide-react";
import { throttle } from "../utils/debounce";

const Spa = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Card slide-in animation on scroll
  useEffect(() => {
    const cards = document.querySelectorAll('.spa-card');
    const cardsGrid = document.querySelector('.services-grid');
    
    if (!cardsGrid) return;
    
    // Determine grid columns by checking computed style
    const gridStyle = window.getComputedStyle(cardsGrid);
    const columns = gridStyle.gridTemplateColumns.split(' ').length;
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    
    // Skip animation for mobile portrait carousel mode
    if (isMobile && isPortrait) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }
    
    cards.forEach((card, index) => {
      let slideDirection;
      let transformStart;
      
      if (isMobile || columns === 1) {
        // Mobile Landscape - Alternate pattern with tilt
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
        // Desktop - use column position with full effects
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
        
        if (entry.isIntersecting) {
          // Card entering viewport - slide in from bottom
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate(0, 0) rotateY(0deg)';
        } else {
          // Card leaving viewport - slide back down
          entry.target.style.opacity = '0';
          entry.target.style.transform = transformStart;
        }
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
      const spaHeroSection = document.querySelector('.spa-hero-fixed');
      const spaHeroLogo = document.querySelector('.spa-hero-logo');
      const spaHeroTitle = document.querySelector('.spa-hero-title');
      const spaHeroSubtitle = document.querySelector('.spa-hero-subtitle');
      
      if (!spaHeroSection || !spaHeroLogo) return;
      
      const heroHeight = spaHeroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        // Scroll down - transform logo with fade and blur
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        spaHeroLogo.style.opacity = opacity;
        spaHeroLogo.style.transform = `scale(${scale})`;
        spaHeroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
        
        // Fade out title and subtitle
        if (spaHeroTitle) {
          spaHeroTitle.style.opacity = opacity;
          spaHeroTitle.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
        if (spaHeroSubtitle) {
          spaHeroSubtitle.style.opacity = opacity;
          spaHeroSubtitle.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
      } else {
        // Scroll up - restore logo
        spaHeroLogo.style.opacity = 1;
        spaHeroLogo.style.transform = 'scale(1)';
        spaHeroLogo.style.filter = 'blur(0px)';
        
        // Restore title and subtitle
        if (spaHeroTitle) {
          spaHeroTitle.style.opacity = 1;
          spaHeroTitle.style.transform = 'translateY(0)';
        }
        if (spaHeroSubtitle) {
          spaHeroSubtitle.style.opacity = 1;
          spaHeroSubtitle.style.transform = 'translateY(0)';
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
      const spaHeroSection = document.querySelector('.spa-hero-fixed');
      
      if (!spaHeroSection) return;
      
      const heroHeight = spaHeroSection.offsetHeight;
      
      // Apply parallax to sections after hero
      if (scrolled > heroHeight * 0.3) {
        const parallaxContent = document.querySelector('.spa-parallax-content');
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

  const spaServices = [
    {
      name: translate("facialTreatment"),
      duration: "75 min",
      price: "6,500 RSD",
      description: translate("facialTreatmentDesc"),
      benefits: [translate("facialBenefit1"), translate("facialBenefit2"), translate("facialBenefit3")],
      category: "face",
      categoryDisplay: translate("categoryFace"),
      popular: true
    },
    {
      name: translate("bodyWrap"),
      duration: "90 min",
      price: "7,000 RSD",
      description: translate("bodyWrapDesc"),
      benefits: [translate("bodyWrapBenefit1"), translate("bodyWrapBenefit2"), translate("bodyWrapBenefit3")],
      category: "body",
      categoryDisplay: translate("categoryBody"),
      popular: false
    },
    {
      name: translate("goldenFacialTreatment"),
      duration: "90 min",
      price: "12,000 RSD",
      description: translate("goldenFacialDesc"),
      benefits: [translate("goldenBenefit1"), translate("goldenBenefit2"), translate("goldenBenefit3")],
      category: "premium",
      categoryDisplay: translate("categoryPremium"),
      popular: true
    },
    {
      name: translate("aromatherapy"),
      duration: "60 min",
      price: "5,500 RSD",
      description: translate("aromatherapyDesc"),
      benefits: [translate("aromaBenefit1"), translate("aromaBenefit2"), translate("aromaBenefit3")],
      category: "relaxation",
      categoryDisplay: translate("categoryRelaxation"),
      popular: false
    },
    {
      name: translate("steamBath"),
      duration: "30 min",
      price: "2,500 RSD",
      description: translate("steamBathDesc"),
      benefits: [translate("steamBenefit1"), translate("steamBenefit2"), translate("steamBenefit3")],
      category: "body",
      categoryDisplay: translate("categoryBody"),
      popular: false
    },
    {
      name: translate("royalSpaPackage"),
      duration: "180 min",
      price: "15,000 RSD",
      description: translate("royalSpaDesc"),
      benefits: [translate("royalSpaBenefit1"), translate("royalSpaBenefit2"), translate("royalSpaBenefit3")],
      category: "premium",
      categoryDisplay: translate("categoryPremium"),
      popular: true
    }
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case "premium":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "relaxation":
        return <Leaf className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "premium":
        return "bg-gradient-to-r from-amber-500 to-yellow-600";
      case "relaxation":
        return "bg-gradient-to-r from-green-500 to-teal-600";
      case "face":
        return "bg-gradient-to-r from-pink-500 to-rose-600";
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
  };

  return (
    <div className="spa-container">
      {/* Fixed Video Hero Section */}
      <section className="spa-hero-fixed">
        <div className="spa-hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="spa-hero-video"
          >
            <source src="https://customer-assets.emergentagent.com/job_goldenlinesdesign/artifacts/r2ulb3u9_SPA.mp4" type="video/mp4" />
          </video>
          <div className="spa-hero-overlay"></div>
        </div>
        
        <div className="spa-hero-content">
          <div className="spa-hero-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="hero-logo-image"
            />
          </div>
          <h1 className="spa-hero-title">{translate("spaHeroTitle")}</h1>
          <div className="spa-hero-divider"></div>
          <p className="spa-hero-subtitle">{translate("spaHeroSubtitle")}</p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div className="spa-parallax-content">

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-grid">
          {spaServices.map((service, index) => (
            <Card key={index} className="spa-card">
              {service.popular && (
                <Badge className="popular-badge">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {translate("mostPopular")}
                </Badge>
              )}
              
              <CardHeader>
                <div className="spa-category">
                  <Badge className={`category-badge ${getCategoryColor(service.category)}`}>
                    {getCategoryIcon(service.category)}
                    <span className="ml-1">{service.categoryDisplay}</span>
                  </Badge>
                </div>
                
                <CardTitle className="spa-name">{service.name}</CardTitle>
                <div className="spa-meta">
                  <div className="duration">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="price">{service.price}</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="spa-description">{service.description}</p>
                
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

      {/* Spa Packages Section */}
      <section className="packages-section">
        <div className="packages-header">
          <h2 className="packages-title">{translate("spaPackagesTitle")}</h2>
          <p className="packages-subtitle">{translate("spaPackagesSubtitle")}</p>
        </div>
        
        <div className="packages-grid">
          <Card className="package-card">
            <CardHeader>
              <CardTitle className="package-name">{translate("romanticPackage")}</CardTitle>
              <div className="package-price">{translate("romanticPackagePrice")}</div>
            </CardHeader>
            <CardContent>
              <p className="package-description">{translate("romanticPackageDesc")}</p>
              <div className="package-duration">{translate("romanticPackageDuration")}</div>
            </CardContent>
          </Card>
          
          <Card className="package-card">
            <CardHeader>
              <CardTitle className="package-name">{translate("bridalPackage")}</CardTitle>
              <div className="package-price">{translate("bridalPackagePrice")}</div>
            </CardHeader>
            <CardContent>
              <p className="package-description">{translate("bridalPackageDesc")}</p>
              <div className="package-duration">{translate("bridalPackageDuration")}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">{translate("ctaTitle")}</h2>
          <p className="cta-subtitle">{translate("ctaSubtitle")}</p>
          <div className="cta-buttons">
            <Button asChild size="lg" className="cta-button-primary">
              <Link to="/contact">{translate("ctaButtonPrimary")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button-secondary">
              <Link to="/massage">{translate("ctaButtonSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Empty parallax section for spacing - like Home page */}
      <section className="spa-testimonial">
        {/* Empty section for consistent spacing */}
      </section>

      </div> {/* Close parallax-content */}
    </div>
  );
};

export default Spa;