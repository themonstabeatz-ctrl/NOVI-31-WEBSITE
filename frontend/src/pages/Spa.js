import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Clock, Sparkles, Leaf } from "lucide-react";
import { throttle } from "../utils/debounce";

// SPA PACKAGES - Complete 6 packages (3 existing + 3 new)
const SPA_PACKAGES = [
  // --- EXISTING 3 PACKAGES ---
  {
    id: "SPA1",
    name: "Silky Body Ritual",
    durationLabel: "120 min",
    baseDuration: 120,
    basePrice: 7800,
    description: "Kompletna nega tela sa pilingom, oblogom i aromaterapijom.",
    included: [
      "Body scrub – 30 min",
      "Body wrap – 30 min",
      "Aroma masaža celog tela – 60 min"
    ],
    variants: [
      {
        id: "SPA1_BASE",
        label: "Bez masaže lica",
        totalMinutes: 120,
        totalPrice: 7800
      },
      {
        id: "SPA1_WITH_FACE",
        label: "Sa masažom lica (tokom body wrap-a)",
        totalMinutes: 150,
        totalPrice: 12200
      }
    ],
    showVariantSelector: true,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  },
  {
    id: "SPA2",
    name: "Deep Renewal Ritual",
    durationLabel: "180 min",
    baseDuration: 180,
    basePrice: 10400,
    description: "Intenzivan tretman za dubinsku regeneraciju kože i opuštanje.",
    included: [
      "Body scrub – 60 min",
      "Body wrap – 60 min",
      "Aroma masaža celog tela – 60 min"
    ],
    variants: [
      {
        id: "SPA2_BASE",
        label: "Bez masaže lica",
        totalMinutes: 180,
        totalPrice: 10400
      },
      {
        id: "SPA2_WITH_FACE",
        label: "Sa masažom lica (tokom body wrap-a)",
        totalMinutes: 180,
        totalPrice: 13400
      }
    ],
    showVariantSelector: true,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  },
  {
    id: "SPA3",
    name: "Royal Glow Ritual",
    durationLabel: "210 min",
    baseDuration: 210,
    basePrice: 11600,
    description: "Kraljevski tretman za savršenu kožu i potpuno opuštanje.",
    included: [
      "Body scrub – 60 min",
      "Body wrap – 60 min",
      "Aroma masaža celog tela – 90 min"
    ],
    variants: [
      {
        id: "SPA3_BASE",
        label: "Bez masaže lica",
        totalMinutes: 210,
        totalPrice: 11600
      },
      {
        id: "SPA3_WITH_FACE",
        label: "Sa masažom lica (tokom body wrap-a)",
        totalMinutes: 210,
        totalPrice: 14600
      }
    ],
    showVariantSelector: true,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  },
  
  // --- NEW 3 PACKAGES ---
  {
    id: "SPA4",
    name: "Silky Face Ritual",
    durationLabel: "150 min",
    baseDuration: 150,
    basePrice: 12200,
    description: "Ritual za svilenkastu kožu i blistavo lice – piling, obloga, lice i aroma masaža.",
    included: [
      "Body scrub – 30 min",
      "Body wrap + masaža lica – 60 min",
      "Aroma masaža celog tela – 60 min"
    ],
    variants: [
      {
        id: "SPA4_MAIN",
        label: "Kompletan ritual (telo + lice)",
        totalMinutes: 150,
        totalPrice: 12200
      }
    ],
    showVariantSelector: false,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  },
  {
    id: "SPA5",
    name: "Deep Renewal Face Ritual",
    durationLabel: "180 min",
    baseDuration: 180,
    basePrice: 13400,
    description: "Dubinska regeneracija tela i lica – intenzivna nega za potpuni reset.",
    included: [
      "Body scrub – 60 min",
      "Body wrap + masaža lica – 60 min",
      "Aroma masaža celog tela – 60 min"
    ],
    variants: [
      {
        id: "SPA5_MAIN",
        label: "Kompletan ritual (telo + lice)",
        totalMinutes: 180,
        totalPrice: 13400
      }
    ],
    showVariantSelector: false,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  },
  {
    id: "SPA6",
    name: "Royal Glow Face Ritual",
    durationLabel: "210 min",
    baseDuration: 210,
    basePrice: 14600,
    description: "Najluksuzniji tretman – kraljevska nega tela i lica za poseban sjaj.",
    included: [
      "Body scrub – 60 min",
      "Body wrap + masaža lica – 60 min",
      "Aroma masaža celog tela – 90 min"
    ],
    variants: [
      {
        id: "SPA6_MAIN",
        label: "Kompletan ritual (telo + lice)",
        totalMinutes: 210,
        totalPrice: 14600
      }
    ],
    showVariantSelector: false,
    spaZones: [
      { id: "SAUNA", label: "Sauna (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "STEAM", label: "Parno kupatilo (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 },
      { id: "JACUZZI", label: "Jacuzzi (+30 min, +0 RSD)", extraMinutes: 30, extraPrice: 0 }
    ]
  }
];

// "SPA Paketi za posebne prilike" - Old packages (DO NOT MODIFY)
const getFixedPackageDetails = (serviceName, duration, price) => {
  return { duration, price, serviceId: `${serviceName} - ${duration}` };
};

const Spa = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for video optimization
  useEffect(() => {
    const checkMobile = () => {
      const width = window.visualViewport ? window.visualViewport.width : window.screen.width;
      setIsMobile(width < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // State for selected variant per package (default: first variant)
  const [selectedVariantByPackage, setSelectedVariantByPackage] = useState(() => {
    const initial = {};
    SPA_PACKAGES.forEach(pkg => {
      initial[pkg.id] = pkg.variants[0].id;
    });
    return initial;
  });

  // State for selected SPA zone per package (default: first zone from each package)
  const [selectedZoneByPackage, setSelectedZoneByPackage] = useState(() => {
    const initial = {};
    SPA_PACKAGES.forEach(pkg => {
      initial[pkg.id] = pkg.spaZones[0].id;
    });
    return initial;
  });

  // Parallax effect for content sections (IDENTICAL to Massage.js)
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

  // Intersection Observer for slide-in animation (IDENTICAL to Massage.js)
  useEffect(() => {
    const cards = document.querySelectorAll('.spa-ritual-card, .spa-special-card');
    
    // Get grid columns for dynamic slide direction
    const grid = document.querySelector('.spa-ritual-grid');
    const gridStyle = grid ? window.getComputedStyle(grid) : null;
    const gridTemplateColumns = gridStyle ? gridStyle.gridTemplateColumns : '';
    const columns = gridTemplateColumns.split(' ').length;
    
    cards.forEach((card, index) => {
      let slideDirection;
      let transformStart;
      
      if (window.innerWidth <= 768 || columns === 1) {
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
  }, []);

  // Handle variant selection
  const handleVariantSelect = (pkgId, variantId) => {
    setSelectedVariantByPackage(prev => ({
      ...prev,
      [pkgId]: variantId
    }));
  };

  // Handle SPA zone selection
  const handleZoneSelect = (pkgId, zoneId) => {
    setSelectedZoneByPackage(prev => ({
      ...prev,
      [pkgId]: zoneId
    }));
  };

  // Handle booking button click
  const handleSpaBookClick = (pkg) => {
    const selectedVariantId = selectedVariantByPackage[pkg.id] || pkg.variants[0].id;
    const selectedVariant = pkg.variants.find(v => v.id === selectedVariantId);

    const selectedZoneId = selectedZoneByPackage[pkg.id] || pkg.spaZones[0].id;
    const selectedZone = pkg.spaZones.find(z => z.id === selectedZoneId);

    const basePrice = selectedVariant.totalPrice;
    const zoneExtra = selectedZone.extraPrice;
    const totalPrice = basePrice + zoneExtra;

    const totalMinutes = selectedVariant.totalMinutes + (selectedZone.extraMinutes || 0);

    const params = new URLSearchParams({
      source: "spa",
      spaPackageId: pkg.id,
      spaPackageName: pkg.name,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.label,
      spaZoneId: selectedZone.id,
      spaZoneLabel: selectedZone.label,
      totalMinutes: String(totalMinutes),
      totalPrice: String(totalPrice)
    });

    console.log("📍 SPA booking redirect params:", Object.fromEntries(params));

    navigate(`/contact?${params.toString()}`);
  };

  // Calculate totals for display
  const calculateTotals = (pkg) => {
    const selectedVariantId = selectedVariantByPackage[pkg.id] || pkg.variants[0].id;
    const selectedVariant = pkg.variants.find(v => v.id === selectedVariantId);

    const selectedZoneId = selectedZoneByPackage[pkg.id] || pkg.spaZones[0].id;
    const selectedZone = pkg.spaZones.find(z => z.id === selectedZoneId);

    const basePrice = selectedVariant.totalPrice;
    const zoneExtra = selectedZone.extraPrice;
    const totalPrice = basePrice + zoneExtra;

    const totalMinutes = selectedVariant.totalMinutes + (selectedZone.extraMinutes || 0);

    return { totalPrice, totalMinutes, selectedVariant, selectedZone };
  };

  // Old SPA packages data
  const royalThaiRitualDetails = getFixedPackageDetails('Royal Thai Ritual', '180 min', '12,900 RSD');
  const detoxHarmonyDetails = getFixedPackageDetails('Detox Harmony', '120 min', '9,900 RSD');
  const aromaEscapeDetails = getFixedPackageDetails('Aroma Escape', '90 min', '7,900 RSD');
  const thaiBalanceDetails = getFixedPackageDetails('Thai Balance', '60 min', '6,500 RSD');
  const buaLuangRelaxDetails = getFixedPackageDetails('Bua Luang Relax Ritual', '90 min', '8,500 RSD');
  const gentleTouchCoupleDetails = getFixedPackageDetails('Gentle Touch Couple Package', '120 min', '11,900 RSD');
  const goldenReviveDetails = getFixedPackageDetails('Golden Revive', '90 min', '8,900 RSD');
  const spiritOfSiamDetails = getFixedPackageDetails('Spirit of Siam', '120 min', '10,900 RSD');
  const serenityBlossomDetails = getFixedPackageDetails('Serenity Blossom Ritual', '120 min', '9,400 RSD');
  
  const spaSpecialPackages = [
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
      popular: true
    },
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
      popular: false
    },
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
      popular: true
    },
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
      popular: false
    },
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
      popular: true
    },
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
      popular: true
    },
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
      popular: false
    },
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
      popular: true
    },
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
    <div className="spa-page">
      <Helmet>
        <title>SPA Paketi - Bua Luang Thai Spa</title>
        <meta name="description" content="Ekskluzivni SPA tretmani sa body scrub, body wrap i aromaterapijom" />
      </Helmet>

      {/* Fixed Video Hero Section (same structure as Massage.js) */}
      <section className="spa-hero-fixed">
        <div className="spa-hero-video-container" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: -1,
          overflow: 'hidden'
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            {isMobile ? (
              <source src="https://customer-assets.emergentagent.com/job_thaispa-mobile/artifacts/a5g7ogwu_SPA.mp4" type="video/mp4" />
            ) : (
              <source src="https://customer-assets.emergentagent.com/job_thaibookingspa/artifacts/4z9ic4bo_SPA.mp4" type="video/mp4" />
            )}
          </video>
        </div>
        
        <div className="spa-hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70vh',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }} />
        
        <div className="spa-hero-content" style={{
          position: 'relative',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            marginBottom: '1.5rem',
            color: '#d4af37',
            fontWeight: 'bold',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            Luksuzni SPA Rituali
          </h1>
          <div style={{
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            margin: '1rem auto 1.5rem'
          }} />
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            maxWidth: '800px',
            color: '#e8e6df',
            lineHeight: '1.7',
            textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
            fontWeight: '300'
          }}>
            Kombinacija pilinga, obloga, masaža i SPA zone za potpuno opuštanje tela i uma
          </p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div className="spa-parallax-content">

      {/* NEW SPA Ritual Packages Grid */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#d4af37',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            SPA Rituali
          </h2>
        </div>

        <div className="spa-ritual-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2.5rem'
        }}>
          {SPA_PACKAGES.map((pkg, index) => {
            const { totalPrice, totalMinutes, selectedVariant } = calculateTotals(pkg);
            const selectedVariantId = selectedVariantByPackage[pkg.id];
            const selectedZoneId = selectedZoneByPackage[pkg.id];

            return (
              <Card key={pkg.id} 
                className="spa-ritual-card"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <CardContent style={{ padding: '2rem' }}>
                  {/* Header: Duration and Price (DYNAMIC from selected variant) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={20} color="#d4af37" />
                      <span style={{ color: '#f5f2e8', fontSize: '1.1rem', fontWeight: '600' }}>
                        {totalMinutes} min
                      </span>
                    </div>
                    <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      color: '#d4af37'
                    }}>
                      {totalPrice.toLocaleString('sr-RS')} RSD
                    </div>
                  </div>

                  {/* Package Name */}
                  <h3 style={{
                    fontSize: '1.6rem',
                    color: '#d4af37',
                    marginBottom: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#c0baa8',
                    marginBottom: '1.25rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>
                    {pkg.description}
                  </p>

                  {/* Included Services (from package directly) */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '1rem',
                      marginBottom: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Uključeno:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {pkg.included.map((item, idx) => (
                        <li key={idx} style={{
                          color: '#f5f2e8',
                          fontSize: '0.9rem',
                          marginBottom: '0.4rem',
                          paddingLeft: '1.5rem',
                          position: 'relative'
                        }}>
                          <Sparkles size={14} color="#d4af37" style={{
                            position: 'absolute',
                            left: 0,
                            top: '3px'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Variant Selection (Radio Buttons) - ONLY if showVariantSelector is true */}
                  {pkg.showVariantSelector && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{
                        color: '#d4af37',
                        fontSize: '0.95rem',
                        marginBottom: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Izaberite varijantu:
                      </h4>
                      {pkg.variants.map((variant) => (
                        <label key={variant.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          marginBottom: '0.6rem',
                          cursor: 'pointer',
                          color: '#f5f2e8',
                          fontSize: '0.95rem',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          background: selectedVariantId === variant.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          transition: 'background 0.3s ease'
                        }}>
                          <input
                            type="radio"
                            name={`variant-${pkg.id}`}
                            value={variant.id}
                            checked={selectedVariantId === variant.id}
                            onChange={() => handleVariantSelect(pkg.id, variant.id)}
                            style={{
                              accentColor: '#d4af37',
                              cursor: 'pointer',
                              width: '18px',
                              height: '18px'
                            }}
                          />
                          <span>
                            {variant.label}
                            {variant.totalPrice > pkg.variants[0].totalPrice && (
                              <span style={{ color: '#d4af37', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                                (+{variant.totalMinutes - pkg.variants[0].totalMinutes} min / +{(variant.totalPrice - pkg.variants[0].totalPrice).toLocaleString('sr-RS')} RSD)
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {/* For packages WITHOUT variant selector, show fixed text */}
                  {!pkg.showVariantSelector && (
                    <div style={{ 
                      marginBottom: '1.5rem',
                      padding: '0.75rem',
                      background: 'rgba(212, 175, 55, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      <p style={{
                        color: '#f5f2e8',
                        fontSize: '0.95rem',
                        margin: 0,
                        fontStyle: 'italic'
                      }}>
                        ✨ {pkg.variants[0].label}
                      </p>
                    </div>
                  )}

                  {/* SPA Zone Dropdown */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor={`zone-${pkg.id}`} style={{
                      display: 'block',
                      color: '#d4af37',
                      fontSize: '0.95rem',
                      marginBottom: '0.6rem',
                      fontWeight: '600'
                    }}>
                      Izaberite SPA zonu:
                    </label>
                    <select
                      id={`zone-${pkg.id}`}
                      value={selectedZoneId}
                      onChange={(e) => handleZoneSelect(pkg.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '8px',
                        color: '#f5f2e8',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d4af37';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      }}
                    >
                      {pkg.spaZones.map((zone) => (
                        <option key={zone.id} value={zone.id} style={{ background: '#1a1a1a' }}>
                          {zone.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Summary */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <p style={{
                      color: '#f5f2e8',
                      fontSize: '0.95rem',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      <strong style={{ color: '#d4af37' }}>Ukupno trajanje:</strong> {totalMinutes} min<br />
                      <strong style={{ color: '#d4af37' }}>Ukupna cena:</strong> {totalPrice.toLocaleString('sr-RS')} RSD
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleSpaBookClick(pkg)}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#1a1a1a',
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Zakažite
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* "SPA Paketi za posebne prilike" Section - SAMO 2 KARTICE */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        background: 'transparent'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#d4af37',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            {translate("spaPackagesTitle")}
          </h2>
          <p style={{
            color: '#c0baa8',
            fontSize: '1.1rem',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {translate("spaPackagesSubtitle")}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Romantic Package */}
          <Card 
            className="spa-special-card romantic-card-special"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
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
            <CardHeader style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
              <CardTitle style={{
                fontSize: '1.8rem',
                color: '#d4af37',
                fontWeight: 'bold'
              }}>
                {translate("romanticPackage")}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ position: 'relative', zIndex: 1, padding: '0 2rem 2rem' }}>
              <p style={{
                color: '#f5f2e8',
                marginBottom: '1rem',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {translate("romanticPackageDesc")}
              </p>
              <div style={{
                color: '#d4af37',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={18} />
                {translate("romanticPackageDuration")}
              </div>
              
              <div className="romantic-price-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <button className="luxury-price-button" style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  cursor: 'default',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <span className="price-amount">18.000 RSD</span>
                </button>
                <div style={{
                  color: '#c0baa8',
                  fontSize: '0.9rem'
                }}>
                  Za dve osobe
                </div>
              </div>

              <Button asChild style={{
                width: '100%',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                color: '#1a1a1a',
                fontWeight: 'bold',
                padding: '1.1rem',
                fontSize: '1rem',
                borderRadius: '10px',
                border: 'none'
              }}>
                <Link to="/contact?service=Romantic%20Package">
                  Zakažite
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Bridal Package */}
          <Card 
            className="spa-special-card bridal-card-special"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div 
              className="bridal-card-background"
              style={{
                backgroundImage: 'url(https://customer-assets.emergentagent.com/job_thai-reserve/artifacts/48xkbz3e_Zena%20sa%20casom%20bualuang.jpg)',
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
            <CardHeader style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
              <CardTitle style={{
                fontSize: '1.8rem',
                color: '#d4af37',
                fontWeight: 'bold'
              }}>
                {translate("bridalPackage")}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ position: 'relative', zIndex: 2, padding: '0 2rem 2rem' }}>
              <p style={{
                color: '#f5f2e8',
                marginBottom: '1rem',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {translate("bridalPackageDesc")}
              </p>
              <div style={{
                color: '#d4af37',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={18} />
                {translate("bridalPackageDuration")}
              </div>
              
              <div className="romantic-price-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <button className="luxury-price-button" style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  cursor: 'default',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <span className="price-amount">8.500 RSD</span>
                </button>
                <div style={{
                  color: '#c0baa8',
                  fontSize: '0.9rem'
                }}>
                  Po osobi
                </div>
              </div>

              <Button asChild style={{
                width: '100%',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                color: '#1a1a1a',
                fontWeight: 'bold',
                padding: '1.1rem',
                fontSize: '1rem',
                borderRadius: '10px',
                border: 'none'
              }}>
                <Link to="/contact?service=Bridal%20Package">
                  Zakažite
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      </div> {/* End spa-parallax-content */}

      {/* CSS for luxury price button shine effect and page background */}
      <style>{`
        body {
          background: transparent !important;
        }
        
        .spa-page {
          background: transparent !important;
        }
        
        .spa-parallax-content {
          background: transparent !important;
        }
        
        .luxury-price-button {
          position: relative;
          overflow: hidden;
        }

        .luxury-price-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spa;
