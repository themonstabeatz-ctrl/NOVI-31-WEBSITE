import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
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
  
  // State for each spa service duration - all default to 60 min
  const [durations, setDurations] = useState({
    facial: '60',
    bodyWrap: '60',
    golden: '60',
    steam: '60',
    royalSpa: '60',
    hydrating: '60',
    detox: '60',
    bodyScrub: '60',
    anticellulite: '60',
    collagen: '60',
    vitaminC: '60',
    combined: '60',
    chocolate: '60',
    thalasso: '60'
  });

  const [serviceDiscounts, setServiceDiscounts] = useState({}); // Per-service discount percentages

  // Map frontend keys to booking system service names
  const serviceKeyToBookingName = {
    'facial': 'Tretman lica',
    'bodyWrap': 'Body wrap',
    'golden': 'Zlatni tretman lica',
    'steam': 'Parno kupatilo',
    'royalSpa': 'Kraljevski spa paket',
    'hydrating': 'Hidratantni tretman',
    'detox': 'Detox tretman',
    'bodyScrub': 'Piling tela',
    'anticellulite': 'Anticelulit tretman',
    'collagen': 'Kolageni tretman lica',
    'vitaminC': 'Vitamin C tretman lica',
    'combined': 'Kombinovani spa dan',
    'chocolate': 'Čokoladni wrap'
  };

  // Fetch all service discounts from booking system via backend proxy
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        // Fetch services from booking system API via backend proxy
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/api/services`);
        const services = await response.json();
        
        // Build discount mapping: service name -> discount percentage
        const discountMap = {};
        
        // Map of full service names to frontend keys for SPA Special kartica
        const spaServiceMapping = {
          'Royal Thai Ritual': 'royalThaiRitual',
          'Detox Harmony': 'detoxHarmony',
          'Aroma Escape': 'aromaEscape',
          'Thai Balance': 'thaiBalance',
          'Bua Luang Relax Ritual': 'buaLuangRelax',
          'Gentle Touch Couple Package': 'gentleTouchCouple',
          'Golden Revive': 'goldenRevive',
          'Spirit of Siam': 'spiritOfSiam',
          'Serenity Blossom Ritual': 'serenityBlossom'
        };
        
        services.forEach(service => {
          const discount = service.discount_percentage || 0;
          const serviceName = service.name; // e.g., "Royal Thai Ritual - 180 min"
          
          // Extract base service name without duration
          const baseName = serviceName.split(' - ')[0]; // e.g., "Royal Thai Ritual"
          
          // Check if it's a SPA Special service
          if (spaServiceMapping[baseName] && discount > 0) {
            const frontendKey = spaServiceMapping[baseName];
            discountMap[frontendKey] = discount;
            console.log(`✨ SPA Discount: ${baseName} (${frontendKey}) -> ${discount}%`);
          } 
          // Otherwise use base name for regular services
          else if (!discountMap[baseName] && discount > 0) {
            discountMap[baseName] = discount;
          }
        });
        
        console.log('📊 Spa Discounts loaded from booking system:', discountMap);
        setServiceDiscounts(discountMap);
      } catch (error) {
        console.error('Error fetching spa discounts from booking system:', error);
      }
    };
    fetchDiscounts();
  }, []);

  // Generic function to get spa details based on duration
  const getSpaDetails = (serviceKey, serviceName) => {
    const duration = durations[serviceKey];
    const options = {
      '60': { duration: '60 min', price: '3,000 RSD', serviceId: `${serviceName} - 60 min` },
      '90': { duration: '90 min', price: '4,000 RSD', serviceId: `${serviceName} - 90 min` },
      '120': { duration: '120 min', price: '5,000 RSD', serviceId: `${serviceName} - 120 min` }
    };
    return options[duration];
  };

  // Fixed package details (no duration options)
  const getFixedPackageDetails = (serviceName, duration, price) => {
    return { duration, price, serviceId: `${serviceName} - ${duration}` };
  };

  // Get discount badge image based on service discount
  const getDiscountBadge = (serviceKey) => {
    // First try direct key lookup (for new SPA services)
    let discount = serviceDiscounts[serviceKey];
    
    // If not found, try booking name mapping (for old services)
    if (!discount) {
      const bookingName = serviceKeyToBookingName[serviceKey];
      discount = serviceDiscounts[bookingName] || 0;
    }
    
    if (discount === 5) {
      return "https://customer-assets.emergentagent.com/job_spa-form-repair/artifacts/xdhih1ft_-5%25.png";
    } else if (discount === 10) {
      return "https://customer-assets.emergentagent.com/job_spa-form-repair/artifacts/zo9fsp4t_-10%25.png";
    } else if (discount === 15) {
      return "https://customer-assets.emergentagent.com/job_spa-form-repair/artifacts/0c5tq3wd_-15%25.png";
    }
    return null; // No discount
  };

  // Get discount percentage for a service
  const getServiceDiscount = (serviceKey) => {
    // First try direct key lookup (for new SPA services)
    let discount = serviceDiscounts[serviceKey];
    
    // If not found, try booking name mapping (for old services)
    if (!discount) {
      const bookingName = serviceKeyToBookingName[serviceKey];
      discount = serviceDiscounts[bookingName] || 0;
    }
    
    return discount || 0;
  };

  // Calculate price with discount
  const calculateDiscountedPrice = (originalPrice, serviceKey) => {
    const discount = getServiceDiscount(serviceKey);
    if (discount === 0) return originalPrice;
    return Math.round(originalPrice * (1 - discount / 100));
  };

  // Helper to update duration for a specific service
  const updateDuration = (serviceKey, newDuration) => {
    setDurations(prev => ({ ...prev, [serviceKey]: newDuration }));
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  // Portrait mode adjustment for packages grid
  useEffect(() => {
    const adjustPackagesForPortrait = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const packagesGrid = document.querySelector('.packages-grid');
      
      if (packagesGrid && isPortrait && window.innerWidth < 600) {
        // On portrait mode, make cards smaller to fit both in viewport
        packagesGrid.style.gridTemplateColumns = '1fr 1fr';
        packagesGrid.style.gap = '0.5rem';
        packagesGrid.style.padding = '0 0.5rem';
        
        document.querySelectorAll('.package-card').forEach(card => {
          card.style.fontSize = '0.85rem';
        });
      }
    };
    
    adjustPackagesForPortrait();
    window.addEventListener('resize', adjustPackagesForPortrait);
    window.addEventListener('orientationchange', adjustPackagesForPortrait);
    
    return () => {
      window.removeEventListener('resize', adjustPackagesForPortrait);
      window.removeEventListener('orientationchange', adjustPackagesForPortrait);
    };
  }, []);

  // Card slide-in animation on scroll
  useEffect(() => {
    const cards = document.querySelectorAll('.spa-card');
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
      // Set initial hidden state
      card.style.opacity = '0';
      card.style.transform = transformStart;
    });

    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
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

  // New luxury package details (fixed duration and price)
  const royalThaiRitualDetails = getFixedPackageDetails('Royal Thai Ritual', '180 min', '12,900 RSD');
  const detoxHarmonyDetails = getFixedPackageDetails('Detox Harmony', '120 min', '9,900 RSD');
  const aromaEscapeDetails = getFixedPackageDetails('Aroma Escape', '90 min', '7,900 RSD');
  const thaiBalanceDetails = getFixedPackageDetails('Thai Balance', '60 min', '6,500 RSD');
  const buaLuangRelaxDetails = getFixedPackageDetails('Bua Luang Relax Ritual', '90 min', '8,500 RSD');
  const gentleTouchCoupleDetails = getFixedPackageDetails('Gentle Touch Couple Package', '120 min', '11,900 RSD');
  const goldenReviveDetails = getFixedPackageDetails('Golden Revive', '90 min', '8,900 RSD');
  const spiritOfSiamDetails = getFixedPackageDetails('Spirit of Siam', '120 min', '10,900 RSD');
  const serenityBlossomDetails = getFixedPackageDetails('Serenity Blossom Ritual', '120 min', '9,400 RSD');
  
  const spaServices = [
    // Royal Thai Ritual
    {
      key: 'royalThaiRitual',
      name: translate("royalThaiRitual"),
      duration: royalThaiRitualDetails.duration,
      price: royalThaiRitualDetails.price,
      serviceId: royalThaiRitualDetails.serviceId,
      description: translate("royalThaiRitualDesc"),
      included: translate("royalThaiRitualIncluded"),
      note: translate("royalThaiRitualNote"),
      category: "premium",
      categoryDisplay: translate("categoryPremium"),
      popular: true,
      hasDurationOptions: false
    },
    // Detox Harmony
    {
      key: 'detoxHarmony',
      name: translate("detoxHarmony"),
      duration: detoxHarmonyDetails.duration,
      price: detoxHarmonyDetails.price,
      serviceId: detoxHarmonyDetails.serviceId,
      description: translate("detoxHarmonyDesc"),
      included: translate("detoxHarmonyIncluded"),
      note: translate("detoxHarmonyNote"),
      category: "body",
      categoryDisplay: translate("categoryBody"),
      popular: false,
      hasDurationOptions: false
    },
    // Aroma Escape
    {
      key: 'aromaEscape',
      name: translate("aromaEscape"),
      duration: aromaEscapeDetails.duration,
      price: aromaEscapeDetails.price,
      serviceId: aromaEscapeDetails.serviceId,
      description: translate("aromaEscapeDesc"),
      included: translate("aromaEscapeIncluded"),
      note: translate("aromaEscapeNote"),
      category: "relaxation",
      categoryDisplay: translate("categoryRelaxation"),
      popular: true,
      hasDurationOptions: false
    },
    // Thai Balance
    {
      key: 'thaiBalance',
      name: translate("thaiBalance"),
      duration: thaiBalanceDetails.duration,
      price: thaiBalanceDetails.price,
      serviceId: thaiBalanceDetails.serviceId,
      description: translate("thaiBalanceDesc"),
      included: translate("thaiBalanceIncluded"),
      note: translate("thaiBalanceNote"),
      category: "body",
      categoryDisplay: translate("categoryBody"),
      popular: false,
      hasDurationOptions: false
    },
    // Bua Luang Relax Ritual
    {
      key: 'buaLuangRelax',
      name: translate("buaLuangRelax"),
      duration: buaLuangRelaxDetails.duration,
      price: buaLuangRelaxDetails.price,
      serviceId: buaLuangRelaxDetails.serviceId,
      description: translate("buaLuangRelaxDesc"),
      included: translate("buaLuangRelaxIncluded"),
      note: translate("buaLuangRelaxNote"),
      category: "relaxation",
      categoryDisplay: translate("categoryRelaxation"),
      popular: true,
      hasDurationOptions: false
    },
    // Gentle Touch Couple Package
    {
      key: 'gentleTouchCouple',
      name: translate("gentleTouchCouple"),
      duration: gentleTouchCoupleDetails.duration,
      price: gentleTouchCoupleDetails.price,
      serviceId: gentleTouchCoupleDetails.serviceId,
      description: translate("gentleTouchCoupleDesc"),
      included: translate("gentleTouchCoupleIncluded"),
      note: translate("gentleTouchCoupleNote"),
      category: "premium",
      categoryDisplay: translate("categoryPremium"),
      popular: true,
      hasDurationOptions: false
    },
    // Golden Revive
    {
      key: 'goldenRevive',
      name: translate("goldenRevive"),
      duration: goldenReviveDetails.duration,
      price: goldenReviveDetails.price,
      serviceId: goldenReviveDetails.serviceId,
      description: translate("goldenReviveDesc"),
      included: translate("goldenReviveIncluded"),
      note: translate("goldenReviveNote"),
      category: "face",
      categoryDisplay: translate("categoryFace"),
      popular: false,
      hasDurationOptions: false
    },
    // Spirit of Siam
    {
      key: 'spiritOfSiam',
      name: translate("spiritOfSiam"),
      duration: spiritOfSiamDetails.duration,
      price: spiritOfSiamDetails.price,
      serviceId: spiritOfSiamDetails.serviceId,
      description: translate("spiritOfSiamDesc"),
      included: translate("spiritOfSiamIncluded"),
      note: translate("spiritOfSiamNote"),
      category: "premium",
      categoryDisplay: translate("categoryPremium"),
      popular: true,
      hasDurationOptions: false
    },
    // Serenity Blossom Ritual
    {
      key: 'serenityBlossom',
      name: translate("serenityBlossom"),
      duration: serenityBlossomDetails.duration,
      price: serenityBlossomDetails.price,
      serviceId: serenityBlossomDetails.serviceId,
      description: translate("serenityBlossomDesc"),
      included: translate("serenityBlossomIncluded"),
      note: translate("serenityBlossomNote"),
      category: "face",
      categoryDisplay: translate("categoryFace"),
      popular: true,
      hasDurationOptions: false
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
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Luksuzni SPA Tretmani Beograd | Royal Thai Ritual & Wellness - Bua Luang</title>
        <meta name="description" content="Ekskluzivni SPA paketi u Beogradu. Royal Thai Ritual, Detox Harmony, Aroma Escape, spa tretmani za parove. Cene od 6,500 RSD. Rezervišite luksuzno opuštanje!" />
        <meta name="keywords" content="spa beograd, luksuzni spa, royal thai ritual, detox tretman, spa za parove, wellness beograd, spa paketi, relaksacija beograd" />
        <link rel="canonical" href="https://www.bualuangthaispa.rs/spa" />
        <meta property="og:title" content="Luksuzni SPA Tretmani Beograd | Royal Thai Ritual - Bua Luang" />
        <meta property="og:url" content="https://www.bualuangthaispa.rs/spa" />
        <meta property="og:type" content="website" />
      </Helmet>
      
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
            <source src="https://customer-assets.emergentagent.com/job_thaibookingspa/artifacts/4z9ic4bo_SPA.mp4" type="video/mp4" />
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
                
                {/* Duration selection buttons - all services now have duration options */}
                {service.hasDurationOptions && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
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
                      60 min
                    </button>
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
                      90 min
                    </button>
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
                      120 min
                    </button>
                  </div>
                )}
                
                <div className="spa-meta">
                  <div className="duration">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getDiscountBadge(service.key) && (
                      <img 
                        src={getDiscountBadge(service.key)} 
                        alt={`-${getServiceDiscount(service.key)}%`}
                        style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {getServiceDiscount(service.key) > 0 ? (
                        <>
                          <div style={{ 
                            textDecoration: 'line-through', 
                            color: '#999', 
                            fontSize: '0.85rem' 
                          }}>
                            {service.price}
                          </div>
                          <div className="price" style={{ color: '#e63946', fontWeight: 'bold' }}>
                            {calculateDiscountedPrice(
                              parseInt(service.price.replace(/[^\d]/g, '')),
                              service.key
                            ).toLocaleString()} RSD
                          </div>
                        </>
                      ) : (
                        <div className="price">{service.price}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="spa-description">{service.description}</p>
                
                {/* Display included items for new packages */}
                {service.included && (
                  <div className="benefits">
                    <h4 className="benefits-title">Uključeno:</h4>
                    <p className="benefit-item" style={{ 
                      fontSize: '0.9rem', 
                      color: '#d4af37',
                      marginBottom: '0.75rem',
                      lineHeight: '1.6'
                    }}>
                      {service.included}
                    </p>
                  </div>
                )}
                
                {/* Display benefits for old packages */}
                {service.benefits && (
                  <div className="benefits">
                    <h4 className="benefits-title">{translate("benefits")}</h4>
                    <ul className="benefits-list">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="benefit-item">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Display note for new packages */}
                {service.note && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#aaa',
                    fontStyle: 'italic',
                    marginTop: '0.75rem',
                    marginBottom: '0.75rem',
                    padding: '0.5rem',
                    borderLeft: '3px solid #d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.05)'
                  }}>
                    {service.note}
                  </p>
                )}
                
                <Button asChild className="book-button w-full">
                  <Link to={`/contact?service=${encodeURIComponent(service.serviceId || service.name)}`}>{translate("bookAppointment")}</Link>
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
          {/* Romantic Package with Background Image and Heart Button */}
          <Card className="package-card romantic-card-special">
            <div 
              className="romantic-card-background"
              style={{
                backgroundImage: 'url(https://customer-assets.emergentagent.com/job_thaibookingspa/artifacts/xhozz0qf_Romanticni%20paket%20za%20parove.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.3,
                zIndex: 0
              }}
            />
            <CardHeader style={{ position: 'relative', zIndex: 1 }}>
              <CardTitle className="package-name">{translate("romanticPackage")}</CardTitle>
            </CardHeader>
            <CardContent style={{ position: 'relative', zIndex: 1 }}>
              <p className="package-description">{translate("romanticPackageDesc")}</p>
              <div className="package-duration">{translate("romanticPackageDuration")}</div>
              
              {/* Luxury Price Button */}
              <div className="romantic-price-container">
                <button className="luxury-price-button luxury-price-button-small">
                  <span className="price-glow"></span>
                  <span className="price-amount">18.000 RSD</span>
                  <span className="price-shine"></span>
                </button>
                <div className="price-subtitle">Za dve osobe</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="package-card bridal-card-special">
            {/* Background photo */}
            <div 
              className="bridal-card-background"
              style={{
                backgroundImage: 'url(https://customer-assets.emergentagent.com/job_thaispa-mobile/artifacts/i1p5m5qv_Devojacko%20vece%20fotka.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.3,
                zIndex: 0
              }}
            />
            {/* PNG overlay at bottom - larger roses to edges */}
            <div 
              className="bridal-card-overlay"
              style={{
                backgroundImage: 'url(https://customer-assets.emergentagent.com/job_thaispa-mobile/artifacts/h0f5okmx_Untitled-1.png)',
                backgroundSize: '100% auto',
                backgroundPosition: 'bottom center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '100%',
                zIndex: 1
              }}
            />
            <CardHeader style={{ position: 'relative', zIndex: 2 }}>
              <CardTitle className="package-name">{translate("bridalPackage")}</CardTitle>
            </CardHeader>
            <CardContent style={{ position: 'relative', zIndex: 2 }}>
              <p className="package-description">{translate("bridalPackageDesc")}</p>
              <div className="package-duration">{translate("bridalPackageDuration")}</div>
              
              {/* Luxury Price Button - same style as romantic package */}
              <div className="romantic-price-container">
                <button className="luxury-price-button luxury-price-button-small">
                  <span className="price-glow"></span>
                  <span className="price-amount">8.500 RSD</span>
                  <span className="price-shine"></span>
                </button>
                <div className="price-subtitle">Po osobi</div>
              </div>
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