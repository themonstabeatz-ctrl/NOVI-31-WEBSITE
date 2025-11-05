import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { throttle } from "../utils/debounce";
import CouplesMassageCard from "../components/CouplesMassageCard";

const Massage = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  
  // State for each massage service duration - all default to 60 min
  const [durations, setDurations] = useState({
    traditional: '60',
    aroma: '60',
    hotStone: '60',
    royal: '60',
    foot: '60',
    couple: '60',
    sports: '60',
    shiatsu: '60',
    reflexology: '60',
    backShoulder: '60',
    antiStress: '60',
    prenatal: '60',
    deepTissue: '60',
    bamboo: '60',
    lymphatic: '60'
  });

  // State for "Masaža za parove" (couples massage) selections
  const [couplesSelections, setCouplesSelections] = useState({
    duration: '60',
    person1Massage1: null,
    person1Massage2: null, // Second 60 min massage for person 1 in 120 min mode
    person2Massage1: null,
    person2Massage2: null  // Second 60 min massage for person 2 in 120 min mode
  });

  const [dropdownOpen, setDropdownOpen] = useState({ person1: false, person2: false });

  // Generic function to get massage details based on duration
  const getMassageDetails = (serviceKey, serviceName) => {
    const duration = durations[serviceKey];
    
    // Special pricing for Tradicionalna tajlandska masaža and Aroma terapija
    if (serviceKey === 'traditional' || serviceKey === 'aroma') {
      const options = {
        '60': { duration: '60 min', price: '4,400 RSD', serviceId: `${serviceName} - 60 min` },
        '90': { duration: '90 min', price: '5,600 RSD', serviceId: `${serviceName} - 90 min` },
        '120': { duration: '120 min', price: '6,800 RSD', serviceId: `${serviceName} - 120 min` }
      };
      return options[duration];
    }
    
    // Special pricing for Hot oil (no 120 min option)
    if (serviceKey === 'hotStone') {
      const options = {
        '60': { duration: '60 min', price: '4,600 RSD', serviceId: `${serviceName} - 60 min` },
        '90': { duration: '90 min', price: '5,800 RSD', serviceId: `${serviceName} - 90 min` }
      };
      return options[duration] || options['60']; // Default to 60 if 120 is selected
    }
    
    // Special pricing and duration for Glava, vrat, ramena i leđa
    if (serviceKey === 'royal') {
      const options = {
        '60': { duration: '30 min', price: '2,400 RSD', serviceId: `${serviceName} - 30 min` },
        '90': { duration: '45 min', price: '3,200 RSD', serviceId: `${serviceName} - 45 min` },
        '120': { duration: '60 min', price: '3,900 RSD', serviceId: `${serviceName} - 60 min` }
      };
      return options[duration];
    }
    
    // Special pricing and duration for Masaža stopala
    if (serviceKey === 'foot') {
      const options = {
        '60': { duration: '30 min', price: '2,400 RSD', serviceId: `${serviceName} - 30 min` },
        '90': { duration: '45 min', price: '2,900 RSD', serviceId: `${serviceName} - 45 min` },
        '120': { duration: '60 min', price: '3,500 RSD', serviceId: `${serviceName} - 60 min` }
      };
      return options[duration];
    }
    
    // Special pricing for Aroma duboko tkivo (couple)
    if (serviceKey === 'couple') {
      const options = {
        '60': { duration: '60 min', price: '4,900 RSD', serviceId: `${serviceName} - 60 min` },
        '90': { duration: '90 min', price: '6,000 RSD', serviceId: `${serviceName} - 90 min` }
      };
      return options[duration];
    }
    
    // Default pricing for all other massages
    const options = {
      '60': { duration: '60 min', price: '3,000 RSD', serviceId: `${serviceName} - 60 min` },
      '90': { duration: '90 min', price: '4,000 RSD', serviceId: `${serviceName} - 90 min` },
      '120': { duration: '120 min', price: '5,000 RSD', serviceId: `${serviceName} - 120 min` }
    };
    return options[duration];
  };

  // Helper to update duration for a specific service
  const updateDuration = (serviceKey, newDuration) => {
    console.log('🔴 updateDuration called:', { serviceKey, newDuration });
    setDurations(prev => {
      console.log('🔴 setDurations prev:', prev);
      return { ...prev, [serviceKey]: newDuration };
    });
    
    // Reset couples selections when duration changes for couples massage
    if (serviceKey === 'couple') {
      console.log('🔴 Updating couplesSelections.duration to:', newDuration);
      setCouplesSelections({
        duration: newDuration,
        person1Massage1: null,
        person1Massage2: null,
        person2Massage1: null,
        person2Massage2: null
      });
      console.log('🔴 couplesSelections should now have duration:', newDuration);
    }
  };

  const calculateCouplesPrice = () => {
    let totalPrice = 0;
    
    // Add person 1 massages
    if (couplesSelections.person1Massage1) {
      totalPrice += couplesSelections.person1Massage1.price || 0;
    }
    if (couplesSelections.person1Massage2) {
      totalPrice += couplesSelections.person1Massage2.price || 0;
    }
    
    // Add person 2 massages
    if (couplesSelections.person2Massage1) {
      totalPrice += couplesSelections.person2Massage1.price || 0;
    }
    if (couplesSelections.person2Massage2) {
      totalPrice += couplesSelections.person2Massage2.price || 0;
    }
    
    // Apply 15% discount
    return totalPrice * 0.85;
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
      
      // CTA section - no fade animation
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection) {
        ctaSection.style.opacity = 1;
        ctaSection.style.transform = 'translateY(0)';
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

  const traditionalDetails = getMassageDetails('traditional', 'Tradicionalna tajlandska masaža');
  const aromaDetails = getMassageDetails('aroma', 'Aroma terapija');
  const hotStoneDetails = getMassageDetails('hotStone', 'Masaža toplim uljem');
  const royalDetails = getMassageDetails('royal', 'Glava, vrat, ramena i leđa');
  const footDetails = getMassageDetails('foot', 'Masaža stopala');
  const coupleDetails = getMassageDetails('couple', 'Aroma duboko tkivo');
  const sportsDetails = getMassageDetails('sports', 'Sportska masaža');
  const shiatsuDetails = getMassageDetails('shiatsu', 'Shiatsu masaža');
  const reflexologyDetails = getMassageDetails('reflexology', 'Refleksologija');
  const backShoulderDetails = getMassageDetails('backShoulder', 'Masaža leđa i vrata');
  const antiStressDetails = getMassageDetails('antiStress', 'Antistres masaža');
  const prenatalDetails = getMassageDetails('prenatal', 'Prenatalna masaža');
  const deepTissueDetails = getMassageDetails('deepTissue', 'Masaža dubokih tkiva');
  const bambooDetails = getMassageDetails('bamboo', 'Bamboo masaža');
  const lymphaticDetails = getMassageDetails('lymphatic', 'Limfna drenaža');
  
  const massageServices = [
    {
      key: 'traditional',
      name: translate("traditionalMassage"),
      duration: traditionalDetails.duration,
      price: traditionalDetails.price,
      serviceId: traditionalDetails.serviceId,
      description: translate("traditionalMassageDesc"),
      benefits: [translate("traditionalBenefit1"), translate("traditionalBenefit2"), translate("traditionalBenefit3")],
      popular: true,
      hasDurationOptions: true
    },
    {
      key: 'aroma',
      name: translate("aromaTherapy"),
      duration: aromaDetails.duration,
      price: aromaDetails.price,
      serviceId: aromaDetails.serviceId,
      description: translate("oilMassageDesc"),
      benefits: [translate("oilBenefit1"), translate("oilBenefit2"), translate("oilBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'hotStone',
      name: translate("hotStone"),
      duration: hotStoneDetails.duration,
      price: hotStoneDetails.price,
      serviceId: hotStoneDetails.serviceId,
      description: translate("hotStoneDesc"),
      benefits: [translate("hotStoneBenefit1"), translate("hotStoneBenefit2"), translate("hotStoneBenefit3")],
      popular: false,
      hasDurationOptions: true,
      customDurations: ['60', '90'] // Only 60 and 90 min
    },
    {
      key: 'royal',
      name: translate("royalMassage"),
      duration: royalDetails.duration,
      price: royalDetails.price,
      serviceId: royalDetails.serviceId,
      description: translate("royalMassageDesc"),
      benefits: [translate("royalBenefit1"), translate("royalBenefit2"), translate("royalBenefit3"), translate("royalBenefit4")],
      popular: true,
      hasDurationOptions: true,
      customDurationLabels: {
        '60': '30 min',
        '90': '45 min',
        '120': '60 min'
      }
    },
    {
      key: 'foot',
      name: translate("footMassage"),
      duration: footDetails.duration,
      price: footDetails.price,
      serviceId: footDetails.serviceId,
      description: translate("footMassageDesc"),
      benefits: [translate("footBenefit1"), translate("footBenefit2"), translate("footBenefit3")],
      popular: false,
      hasDurationOptions: true,
      customDurationLabels: {
        '60': '30 min',
        '90': '45 min',
        '120': '60 min'
      }
    },
    {
      key: 'couple',
      name: translate("coupleMassage"),
      duration: coupleDetails.duration,
      price: coupleDetails.price,
      serviceId: coupleDetails.serviceId,
      description: translate("coupleMassageDesc"),
      benefits: [translate("coupleBenefit1"), translate("coupleBenefit2"), translate("coupleBenefit3"), translate("coupleBenefit4")],
      popular: false,
      hasDurationOptions: true,
      customDurations: ['60', '90']  // Only 60 and 90 min options
    },
    {
      key: 'sports',
      name: translate("sportsMassage"),
      duration: sportsDetails.duration,
      price: sportsDetails.price,
      serviceId: sportsDetails.serviceId,
      description: translate("sportsMassageDesc"),
      benefits: [translate("sportsBenefit1"), translate("sportsBenefit2"), translate("sportsBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'shiatsu',
      name: translate("shiatsuMassage"),
      duration: shiatsuDetails.duration,
      price: shiatsuDetails.price,
      serviceId: shiatsuDetails.serviceId,
      description: translate("shiatsuMassageDesc"),
      benefits: [translate("shiatsuBenefit1"), translate("shiatsuBenefit2"), translate("shiatsuBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'reflexology',
      name: translate("reflexologyMassage"),
      duration: reflexologyDetails.duration,
      price: reflexologyDetails.price,
      serviceId: reflexologyDetails.serviceId,
      description: translate("reflexologyMassageDesc"),
      benefits: [translate("reflexologyBenefit1"), translate("reflexologyBenefit2"), translate("reflexologyBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'backShoulder',
      name: translate("backShoulderMassage"),
      duration: backShoulderDetails.duration,
      price: backShoulderDetails.price,
      serviceId: backShoulderDetails.serviceId,
      description: translate("backShoulderMassageDesc"),
      benefits: [translate("backShoulderBenefit1"), translate("backShoulderBenefit2"), translate("backShoulderBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'antiStress',
      name: translate("antiStressMassage"),
      duration: antiStressDetails.duration,
      price: antiStressDetails.price,
      serviceId: antiStressDetails.serviceId,
      description: translate("antiStressMassageDesc"),
      benefits: [translate("antiStressBenefit1"), translate("antiStressBenefit2"), translate("antiStressBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'prenatal',
      name: translate("prenatalMassage"),
      duration: prenatalDetails.duration,
      price: prenatalDetails.price,
      serviceId: prenatalDetails.serviceId,
      description: translate("prenatalMassageDesc"),
      benefits: [translate("prenatalBenefit1"), translate("prenatalBenefit2"), translate("prenatalBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'deepTissue',
      name: translate("deepTissueMassage"),
      duration: deepTissueDetails.duration,
      price: deepTissueDetails.price,
      serviceId: deepTissueDetails.serviceId,
      description: translate("deepTissueMassageDesc"),
      benefits: [translate("deepTissueBenefit1"), translate("deepTissueBenefit2"), translate("deepTissueBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'bamboo',
      name: translate("bambooMassage"),
      duration: bambooDetails.duration,
      price: bambooDetails.price,
      serviceId: bambooDetails.serviceId,
      description: translate("bambooMassageDesc"),
      benefits: [translate("bambooBenefit1"), translate("bambooBenefit2"), translate("bambooBenefit3")],
      hasDurationOptions: true
    },
    {
      key: 'lymphatic',
      name: translate("lymphaticMassage"),
      duration: lymphaticDetails.duration,
      price: lymphaticDetails.price,
      serviceId: lymphaticDetails.serviceId,
      description: translate("lymphaticMassageDesc"),
      benefits: [translate("lymphaticBenefit1"), translate("lymphaticBenefit2"), translate("lymphaticBenefit3")],
      hasDurationOptions: true
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
          
          {/* Masaža za parove Card */}
          <CouplesMassageCard
            translate={translate}
            durations={durations}
            updateDuration={updateDuration}
            couplesSelections={couplesSelections}
            setCouplesSelections={setCouplesSelections}
            calculateCouplesPrice={calculateCouplesPrice}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />

          {massageServices.map((service, index) => {
            // Skip couples massage - it's rendered separately above
            if (service.key === 'couple') {
              return null;
            }
            
            // Regular massage cards
            return (
            <Card key={index} className="massage-card">
              {service.popular && (
                <Badge className="popular-badge">
                  <Star className="w-3 h-3 mr-1" />
                  {translate("mostPopular")}
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="massage-name">{service.name}</CardTitle>
                
                {/* Duration selection buttons - all services now have duration options */}
                {service.hasDurationOptions && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    {(!service.customDurations || service.customDurations.includes('60')) && (
                      <button
                        onClick={() => updateDuration(service.key, '60')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: durations[service.key] === '60' ? '2px solid #d4af37' : '1px solid #444',
                          backgroundColor: durations[service.key] === '60' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: '#d4af37',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: durations[service.key] === '60' ? 'bold' : 'normal',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {service.customDurationLabels ? service.customDurationLabels['60'] : '60 min'}
                      </button>
                    )}
                    {(!service.customDurations || service.customDurations.includes('90')) && (
                      <button
                        onClick={() => updateDuration(service.key, '90')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: durations[service.key] === '90' ? '2px solid #d4af37' : '1px solid #444',
                          backgroundColor: durations[service.key] === '90' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: '#d4af37',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: durations[service.key] === '90' ? 'bold' : 'normal',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {service.customDurationLabels ? service.customDurationLabels['90'] : '90 min'}
                      </button>
                    )}
                    {(!service.customDurations || service.customDurations.includes('120')) && (
                      <button
                        onClick={() => updateDuration(service.key, '120')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: durations[service.key] === '120' ? '2px solid #d4af37' : '1px solid #444',
                          backgroundColor: durations[service.key] === '120' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          color: '#d4af37',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: durations[service.key] === '120' ? 'bold' : 'normal',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {service.customDurationLabels ? service.customDurationLabels['120'] : '120 min'}
                      </button>
                    )}
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
                  <Link to={`/contact?service=${encodeURIComponent(service.serviceId || service.name)}`}>{translate("bookAppointment")}</Link>
                </Button>
              </CardContent>
            </Card>
            );
          })}
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