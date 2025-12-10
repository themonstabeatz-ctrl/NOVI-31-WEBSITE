import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Clock, Sparkles, Leaf } from "lucide-react";
import { throttle } from "../utils/debounce";

// HELPER: Safe number formatting - prevents undefined.toLocaleString() crashes
const formatNumber = (value) => {
  const n = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  return n.toLocaleString('sr-RS');
};

// SPA PACKAGES - 3 ritual packages + 1 zone-only package
const SPA_PACKAGES = [
  {
    id: "SPA1",
    name: "Silky Body Ritual",
    description: "Kompletna nega tela sa pilingom, oblogom i aromaterapijom.",
    included: [
      "Body scrub – 30 min",
      "Body wrap – 60 min",
      "Aroma masaža celog tela – 60 min"
    ],
    variants: [
      {
        id: "SPA1_BASE",
        label: "Bez masaže lica",
        totalMinutes: 150,
        totalPrice: 9200
      },
      {
        id: "SPA1_WITH_FACE",
        label: "Sa masažom lica (tokom body wrap-a)",
        totalMinutes: 150,
        totalPrice: 12200
      }
    ],
    spaZones: [
      {
        id: "SAUNA",
        label: "Sauna",
        options: [
          { id: "SAUNA_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "SAUNA_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "STEAM",
        label: "Parno kupatilo",
        options: [
          { id: "STEAM_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "STEAM_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "JACUZZI",
        label: "Jacuzzi",
        options: [
          { id: "JACUZZI_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 },
          { id: "JACUZZI_60", label: "60 min", extraMinutes: 60, extraPrice: 2800 }
        ]
      }
    ]
  },
  {
    id: "SPA2",
    name: "Gentle Touch Ritual",
    description: "Kompletna nega tela sa pilingom, oblogom i aromaterapijom.",
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
    spaZones: [
      {
        id: "SAUNA",
        label: "Sauna",
        options: [
          { id: "SAUNA_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "SAUNA_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "STEAM",
        label: "Parno kupatilo",
        options: [
          { id: "STEAM_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "STEAM_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "JACUZZI",
        label: "Jacuzzi",
        options: [
          { id: "JACUZZI_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 },
          { id: "JACUZZI_60", label: "60 min", extraMinutes: 60, extraPrice: 2800 }
        ]
      }
    ]
  },
  {
    id: "SPA3",
    name: "Deep Renewal Ritual",
    description: "Intenzivan tretman za dubinsku regeneraciju kože i opuštanje.",
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
    spaZones: [
      {
        id: "SAUNA",
        label: "Sauna",
        options: [
          { id: "SAUNA_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "SAUNA_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "STEAM",
        label: "Parno kupatilo",
        options: [
          { id: "STEAM_15", label: "15 min", extraMinutes: 15, extraPrice: 800 },
          { id: "STEAM_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 }
        ]
      },
      {
        id: "JACUZZI",
        label: "Jacuzzi",
        options: [
          { id: "JACUZZI_30", label: "30 min", extraMinutes: 30, extraPrice: 1400 },
          { id: "JACUZZI_60", label: "60 min", extraMinutes: 60, extraPrice: 2800 }
        ]
      }
    ]
  }
];

// NEW SPA PACKAGES - Fixed price packages with included SPA zone
// Constants for herbal packages
const HERBAL_BASE_MINUTES = 120;   // 30 min scrub + 90 min tretman
const HERBAL_SPA_BONUS = 15;       // +15 min gratis ako je SPA uključen
const HERBAL_PRICE = 7600;

const NEW_SPA_PACKAGES = [
  {
    id: "SPA_HC_1",
    name: "Silky Herbal Compress Ritual",
    description: "Nega tela sa pilingom i dubokim opuštanjem uz aromu i tople biljne komprese.",
    included: [
      "Body scrub – 30 min",
      "Aroma masaža sa toplim biljnim kompresama – 90 min"
    ]
  },
  {
    id: "SPA_HC_2",
    name: "Thai Herbal Compress Ritual",
    description: "Tradicionalni tajlandski tretman sa toplim biljnim kompresama za rasterećenje mišića i uma.",
    included: [
      "Body scrub – 30 min",
      "Thai masaža sa toplim biljnim kompresama – 90 min"
    ]
  },
  {
    id: "SPA_HC_3",
    name: "Aroma Stone Harmony Ritual",
    description: "Spoj aromaterapije i toplog kamena za dubinsko opuštanje tela i otklanjanje napetosti.",
    included: [
      "Body scrub – 30 min",
      "Aromaterapija & topli kamen – 90 min"
    ]
  }
];

// SPA ZONE-ONLY package (no ritual, just zones)
const SPA_ZONE_ONLY = {
  id: "SPAZONE",
  name: "SPA Zone",
  description: "Isključivo korišćenje SPA zona bez rituala.",
  isZoneOnly: true,
  zones: [
    {
      id: "SAUNA",
      label: "Sauna",
      options: [
        { id: "SAUNA_15", label: "15 min", totalMinutes: 15, totalPrice: 1400 },
        { id: "SAUNA_30", label: "30 min", totalMinutes: 30, totalPrice: 2400 }
      ]
    },
    {
      id: "STEAM",
      label: "Parno kupatilo",
      options: [
        { id: "STEAM_15", label: "15 min", totalMinutes: 15, totalPrice: 1400 },
        { id: "STEAM_30", label: "30 min", totalMinutes: 30, totalPrice: 2400 }
      ]
    },
    {
      id: "JACUZZI",
      label: "Jacuzzi",
      options: [
        { id: "JACUZZI_30", label: "30 min", totalMinutes: 30, totalPrice: 2200 },
        { id: "JACUZZI_60", label: "60 min", totalMinutes: 60, totalPrice: 3400 }
      ]
    }
  ]
};

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

  // State for selected SPA zones - each zone tracked independently
  const [selectedZonesByPackage, setSelectedZonesByPackage] = useState(() => {
    const initial = {};
    SPA_PACKAGES.forEach(pkg => {
      // Default: all zones set to "Bez" (null)
      initial[pkg.id] = {
        SAUNA: null,    // null means "Bez"
        STEAM: null,    // null means "Bez"
        JACUZZI: null   // null means "Bez"
      };
    });
    // For zone-only package
    initial[SPA_ZONE_ONLY.id] = {
      SAUNA: null,
      STEAM: null,
      JACUZZI: null
    };
    return initial;
  });

  // State for NEW herbal packages - tracks selected SPA zone
  const [herbalZones, setHerbalZones] = useState({
    SPA_HC_1: "NONE",   // Silky Herbal - Default: Bez SPA zone
    SPA_HC_2: "NONE",   // Thai Herbal
    SPA_HC_3: "NONE"    // Aroma Stone
  });

  // Scroll fade-out effect for hero (IDENTICAL to Massage.js)
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
        
        if (spaHeroTitle) {
          spaHeroTitle.style.opacity = opacity;
          spaHeroTitle.style.transform = `translateY(-${(scrollPercent - 0.05) * 80}px)`;
        }
        
        if (spaHeroSubtitle) {
          spaHeroSubtitle.style.opacity = opacity;
          spaHeroSubtitle.style.transform = `translateY(-${(scrollPercent - 0.05) * 60}px)`;
        }
      } else {
        // Reset to default when at top
        spaHeroLogo.style.opacity = '1';
        spaHeroLogo.style.transform = 'scale(1)';
        spaHeroLogo.style.filter = 'none';
        
        if (spaHeroTitle) {
          spaHeroTitle.style.opacity = '1';
          spaHeroTitle.style.transform = 'translateY(0)';
        }
        
        if (spaHeroSubtitle) {
          spaHeroSubtitle.style.opacity = '1';
          spaHeroSubtitle.style.transform = 'translateY(0)';
        }
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

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
  const handleZoneOptionSelect = (pkgId, zoneId, optionId) => {
    setSelectedZonesByPackage(prev => ({
      ...prev,
      [pkgId]: {
        ...prev[pkgId],
        [zoneId]: optionId  // Set specific zone option (or null for "Bez")
      }
    }));
  };

  // Handle booking button click
  const handleSpaBookClick = (pkg) => {
    const { totalPrice, totalMinutes, selectedVariant, selectedZones } = calculateTotals(pkg);

    // Build zone labels string
    const zoneLabels = [];
    const zones = pkg.isZoneOnly ? pkg.zones : pkg.spaZones;
    
    zones.forEach(zone => {
      const selectedOptionId = selectedZones[zone.id];
      if (selectedOptionId) {  // If not "Bez"
        const option = zone.options.find(o => o.id === selectedOptionId);
        if (option) {
          zoneLabels.push(`${zone.label} ${option.label}`);
        }
      }
    });
    
    const spaZoneLabel = zoneLabels.length > 0 ? zoneLabels.join(", ") : "Bez SPA zona";

    const params = new URLSearchParams({
      source: "spa",
      spaPackageId: pkg.id,
      spaPackageName: pkg.name,
      totalMinutes: String(totalMinutes),
      totalPrice: String(totalPrice),
      spaZoneLabel: spaZoneLabel
    });

    if (pkg.isZoneOnly) {
      params.append("variantId", "ZONE_ONLY");
      params.append("variantLabel", "Samo SPA zona");
    } else {
      params.append("variantId", selectedVariant.id);
      params.append("variantLabel", selectedVariant.label);
    }

    console.log("📍 SPA booking redirect params:", Object.fromEntries(params));

    navigate(`/contact?${params.toString()}`);
  };

  // Handle booking for HERBAL packages
  const handleNewPackageBookClick = (card) => {
    const selectedZone = herbalZones[card.id] || "NONE";
    const hasSpa = selectedZone !== "NONE";
    
    // Dynamic duration: 120 min base, +15 min if SPA selected
    const totalMinutes = HERBAL_BASE_MINUTES + (hasSpa ? HERBAL_SPA_BONUS : 0);
    const totalPrice = HERBAL_PRICE;
    
    // Determine SPA zone label
    let spaZoneLabel = "Bez SPA zone";
    if (selectedZone === "SAUNA_15") spaZoneLabel = "Sauna – 15 min";
    if (selectedZone === "STEAM_15") spaZoneLabel = "Parno kupatilo – 15 min";

    const params = new URLSearchParams({
      source: "spa",
      spaPackageId: card.id,
      spaPackageName: card.name,
      variantId: `${card.id}_BASE`,
      variantLabel: "Osnovni paket (telo + SPA zona)",
      spaZoneLabel: spaZoneLabel,
      totalMinutes: String(totalMinutes),
      totalPrice: String(totalPrice)
    });

    console.log("📍 HERBAL package booking params:", Object.fromEntries(params));

    navigate(`/contact?${params.toString()}`);
  };

  // Handle zone selection for HERBAL packages
  const handleHerbalZoneChange = (cardId, value) => {
    setHerbalZones(prev => ({
      ...prev,
      [cardId]: value  // "NONE" | "SAUNA_15" | "STEAM_15"
    }));
  };

  // Calculate totals for display
  const calculateTotals = (pkg) => {
    const selectedZones = selectedZonesByPackage[pkg.id] || {};
    
    if (pkg.isZoneOnly) {
      // Zone-only package - sum ALL selected zones
      let totalMinutes = 0;
      let totalPrice = 0;
      
      pkg.zones.forEach(zone => {
        const selectedOptionId = selectedZones[zone.id];
        if (selectedOptionId) {  // If not null (not "Bez")
          const option = zone.options.find(o => o.id === selectedOptionId);
          if (option) {
            totalMinutes += option.totalMinutes;
            totalPrice += option.totalPrice;
          }
        }
      });
      
      return {
        totalPrice: totalPrice || 0,
        totalMinutes: totalMinutes || 0,
        selectedVariant: null,
        selectedZones
      };
    } else {
      // Regular ritual package
      const selectedVariantId = selectedVariantByPackage[pkg.id] || (pkg.variants && pkg.variants[0] && pkg.variants[0].id);
      const selectedVariant = pkg.variants && pkg.variants.find(v => v.id === selectedVariantId);
      
      if (!selectedVariant) {
        return {
          totalPrice: 0,
          totalMinutes: 0,
          selectedVariant: null,
          selectedZones
        };
      }
      
      let baseMinutes = selectedVariant.totalMinutes;
      let basePrice = selectedVariant.totalPrice;
      
      // Add ALL selected zones
      let zoneMinutes = 0;
      let zonePrice = 0;
      
      if (pkg.spaZones) {
        pkg.spaZones.forEach(zone => {
          const selectedOptionId = selectedZones[zone.id];
          if (selectedOptionId) {  // If not null (not "Bez")
            const option = zone.options.find(o => o.id === selectedOptionId);
            if (option) {
              zoneMinutes += option.extraMinutes;
              zonePrice += option.extraPrice;
            }
          }
        });
      }
      
      return {
        totalPrice: basePrice + zonePrice,
        totalMinutes: baseMinutes + zoneMinutes,
        selectedVariant,
        selectedZones
      };
    }
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

      {/* Hero Section - IDENTICAL to Massage.js */}
      <section className="spa-hero-fixed">
        <div className="spa-hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="auto"
            className="spa-hero-video"
          >
            {isMobile ? (
              <source src="https://customer-assets.emergentagent.com/job_thaispa-mobile/artifacts/a5g7ogwu_SPA.mp4" type="video/mp4" />
            ) : (
              <source src="https://customer-assets.emergentagent.com/job_thaibookingspa/artifacts/4z9ic4bo_SPA.mp4" type="video/mp4" />
            )}
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
          <h1 className="spa-hero-title">Luksuzni SPA Rituali</h1>
          <div className="spa-hero-divider"></div>
          <p className="spa-hero-subtitle">
            Kombinacija pilinga, obloga, masaža i SPA zone za potpuno opuštanje tela i uma
          </p>
        </div>
      </section>

      {/* Parallax Content Section */}
      <div className="spa-parallax-content">

      {/* SPA Ritual Packages Grid */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent'
      }}>
        <div className="spa-ritual-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2.5rem'
        }}>
          {SPA_PACKAGES.map((pkg, index) => {
            const { totalPrice, totalMinutes, selectedVariant, selectedZones } = calculateTotals(pkg);
            const selectedVariantId = selectedVariantByPackage[pkg.id];

            return (
              <Card key={pkg.id} 
                className="spa-ritual-card"
                style={{
                  background: 'rgba(10, 10, 10, 0.65)',
                  backdropFilter: 'blur(8px)',
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
                <CardContent style={{ padding: '0.6rem' }}>
                  {/* Header: Duration and Price */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem',
                    paddingBottom: '0.3rem',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} color="#d4af37" />
                      <span style={{ color: '#f5f2e8', fontSize: '0.8rem', fontWeight: '600' }}>
                        {formatNumber(totalMinutes)} min
                      </span>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#d4af37'
                    }}>
                      {formatNumber(totalPrice)} RSD
                    </div>
                  </div>

                  {/* Package Name */}
                  <h3 style={{
                    fontSize: '1rem',
                    color: '#d4af37',
                    marginBottom: '0.2rem',
                    fontWeight: 'bold'
                  }}>
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#c0baa8',
                    marginBottom: '0.4rem',
                    fontSize: '0.72rem',
                    lineHeight: '1.3'
                  }}>
                    {pkg.description}
                  </p>

                  {/* Included Services */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.72rem',
                      marginBottom: '0.2rem',
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
                          fontSize: '0.68rem',
                          marginBottom: '0.1rem',
                          paddingLeft: '1rem',
                          position: 'relative',
                          lineHeight: '1.3'
                        }}>
                          <Sparkles size={9} color="#d4af37" style={{
                            position: 'absolute',
                            left: 0,
                            top: '2px'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Variant Selection (Radio Buttons) */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.72rem',
                      marginBottom: '0.25rem',
                      fontWeight: '600'
                    }}>
                      Izaberite varijantu:
                    </h4>
                    {pkg.variants.map((variant) => (
                      <label key={variant.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        color: '#f5f2e8',
                        fontSize: '0.72rem',
                        padding: '0.25rem',
                        borderRadius: '4px',
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
                            width: '12px',
                            height: '12px'
                          }}
                        />
                        <span>
                          {variant.label}
                          {variant.totalPrice > pkg.variants[0].totalPrice && (
                            <span style={{ color: '#d4af37', fontSize: '0.68rem', marginLeft: '0.25rem' }}>
                              (+{formatNumber(variant.totalPrice - pkg.variants[0].totalPrice)} RSD)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* SPA ZONA - Premium Boxed Section */}
                  <div style={{
                    marginBottom: '0.4rem',
                    padding: '0.4rem 0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.1)'
                  }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.72rem',
                      marginBottom: '0.3rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      SPA ZONA
                    </h4>
                    
                    {pkg.spaZones.map((zone) => (
                      <div key={zone.id} style={{ marginBottom: '0.3rem' }}>
                        <p style={{
                          color: '#d4af37',
                          fontSize: '0.68rem',
                          marginBottom: '0.15rem',
                          fontWeight: '600'
                        }}>
                          {zone.label}:
                        </p>
                        {/* "Bez" option */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          marginBottom: '0.1rem',
                          cursor: 'pointer',
                          color: '#f5f2e8',
                          fontSize: '0.68rem',
                          padding: '0.12rem',
                          borderRadius: '3px',
                          background: selectedZones[zone.id] === null ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          transition: 'background 0.3s ease'
                        }}>
                          <input
                            type="radio"
                            name={`zone-${pkg.id}-${zone.id}`}
                            value="bez"
                            checked={selectedZones[zone.id] === null}
                            onChange={() => handleZoneOptionSelect(pkg.id, zone.id, null)}
                            style={{
                              accentColor: '#d4af37',
                              cursor: 'pointer',
                              width: '10px',
                              height: '10px'
                            }}
                          />
                          <span>Bez</span>
                        </label>
                        {/* Zone options */}
                        {zone.options.map((option) => {
                          const isSelected = selectedZones[zone.id] === option.id;
                          return (
                            <label key={option.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              marginBottom: '0.1rem',
                              cursor: 'pointer',
                              color: '#f5f2e8',
                              fontSize: '0.68rem',
                              padding: '0.12rem',
                              borderRadius: '3px',
                              background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                              transition: 'background 0.3s ease'
                            }}>
                              <input
                                type="radio"
                                name={`zone-${pkg.id}-${zone.id}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleZoneOptionSelect(pkg.id, zone.id, option.id)}
                                style={{
                                  accentColor: '#d4af37',
                                  cursor: 'pointer',
                                  width: '10px',
                                  height: '10px'
                                }}
                              />
                              <span>
                                {option.label} <span style={{ color: '#d4af37', fontWeight: '600' }}>+{formatNumber(option.extraPrice)} RSD</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Total Summary */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '0.35rem',
                    borderRadius: '5px',
                    marginBottom: '0.4rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <p style={{
                      color: '#f5f2e8',
                      fontSize: '0.68rem',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      <strong style={{ color: '#d4af37' }}>Ukupno trajanje:</strong> {formatNumber(totalMinutes)} min<br />
                      <strong style={{ color: '#d4af37' }}>Ukupna cena:</strong> {formatNumber(totalPrice)} RSD
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleSpaBookClick(pkg)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#1a1a1a',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
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

      {/* NEW FIXED-PRICE SPA PACKAGES - 3 Herbal & Stone Rituals */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent'
      }}>
        <div className="spa-ritual-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2.5rem'
        }}>
          {NEW_SPA_PACKAGES.map((pkg) => {
            const selectedZone = herbalZones[pkg.id] || "NONE";
            const hasSpa = selectedZone !== "NONE";
            
            // Dynamic duration: 120 min base, +15 min if SPA selected
            const totalMinutes = HERBAL_BASE_MINUTES + (hasSpa ? HERBAL_SPA_BONUS : 0);
            const totalPrice = HERBAL_PRICE;

            return (
              <Card key={pkg.id} 
                className="spa-ritual-card"
                style={{
                  background: 'rgba(10, 10, 10, 0.65)',
                  backdropFilter: 'blur(8px)',
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
                <CardContent style={{ padding: '0.6rem' }}>
                  {/* Header: Duration and Price */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem',
                    paddingBottom: '0.3rem',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} color="#d4af37" />
                      <span style={{ color: '#f5f2e8', fontSize: '0.8rem', fontWeight: '600' }}>
                        {formatNumber(totalMinutes)} min
                      </span>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#d4af37'
                    }}>
                      {formatNumber(totalPrice)} RSD
                    </div>
                  </div>

                  {/* Package Name */}
                  <h3 style={{
                    fontSize: '1rem',
                    color: '#d4af37',
                    marginBottom: '0.2rem',
                    fontWeight: 'bold'
                  }}>
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#c0baa8',
                    marginBottom: '0.4rem',
                    fontSize: '0.72rem',
                    lineHeight: '1.3'
                  }}>
                    {pkg.description}
                  </p>

                  {/* Included Services */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.72rem',
                      marginBottom: '0.2rem',
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
                          fontSize: '0.68rem',
                          marginBottom: '0.1rem',
                          paddingLeft: '1rem',
                          position: 'relative',
                          lineHeight: '1.3'
                        }}>
                          <Sparkles size={9} color="#d4af37" style={{
                            position: 'absolute',
                            left: 0,
                            top: '2px'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* MINI SPA ZONA Section */}
                  <div style={{
                    marginBottom: '0.4rem',
                    padding: '0.4rem 0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.1)'
                  }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.72rem',
                      marginBottom: '0.3rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      SPA ZONA (15 min uključeno u cenu)
                    </h4>
                    
                    <div style={{ marginBottom: '0.2rem' }}>
                      <p style={{
                        color: '#d4af37',
                        fontSize: '0.68rem',
                        marginBottom: '0.15rem',
                        fontWeight: '600'
                      }}>
                        Izaberite SPA opciju:
                      </p>
                      
                      {/* "Bez SPA zone" option - DEFAULT */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.1rem',
                        cursor: 'pointer',
                        color: '#f5f2e8',
                        fontSize: '0.68rem',
                        padding: '0.12rem',
                        borderRadius: '3px',
                        background: selectedZone === "NONE" ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        transition: 'background 0.3s ease'
                      }}>
                        <input
                          type="radio"
                          name={`herbal-spa-${pkg.id}`}
                          value="NONE"
                          checked={selectedZone === "NONE"}
                          onChange={() => handleHerbalZoneChange(pkg.id, "NONE")}
                          style={{
                            accentColor: '#d4af37',
                            cursor: 'pointer',
                            width: '10px',
                            height: '10px'
                          }}
                        />
                        <span>Bez SPA zone</span>
                      </label>
                      
                      {/* Sauna option */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.1rem',
                        cursor: 'pointer',
                        color: '#f5f2e8',
                        fontSize: '0.68rem',
                        padding: '0.12rem',
                        borderRadius: '3px',
                        background: selectedZone === "SAUNA_15" ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        transition: 'background 0.3s ease'
                      }}>
                        <input
                          type="radio"
                          name={`herbal-spa-${pkg.id}`}
                          value="SAUNA_15"
                          checked={selectedZone === "SAUNA_15"}
                          onChange={() => handleHerbalZoneChange(pkg.id, "SAUNA_15")}
                          style={{
                            accentColor: '#d4af37',
                            cursor: 'pointer',
                            width: '10px',
                            height: '10px'
                          }}
                        />
                        <span>Sauna – 15 min</span>
                      </label>
                      
                      {/* Parno kupatilo option */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.1rem',
                        cursor: 'pointer',
                        color: '#f5f2e8',
                        fontSize: '0.68rem',
                        padding: '0.12rem',
                        borderRadius: '3px',
                        background: selectedZone === "STEAM_15" ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        transition: 'background 0.3s ease'
                      }}>
                        <input
                          type="radio"
                          name={`herbal-spa-${pkg.id}`}
                          value="STEAM_15"
                          checked={selectedZone === "STEAM_15"}
                          onChange={() => handleHerbalZoneChange(pkg.id, "STEAM_15")}
                          style={{
                            accentColor: '#d4af37',
                            cursor: 'pointer',
                            width: '10px',
                            height: '10px'
                          }}
                        />
                        <span>Parno kupatilo – 15 min</span>
                      </label>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '0.35rem',
                    borderRadius: '5px',
                    marginBottom: '0.4rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <p style={{
                      color: '#f5f2e8',
                      fontSize: '0.68rem',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      <strong style={{ color: '#d4af37' }}>Ukupno trajanje:</strong> {formatNumber(totalMinutes)} min<br />
                      <strong style={{ color: '#d4af37' }}>Ukupna cena:</strong> {formatNumber(totalPrice)} RSD
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleNewPackageBookClick(pkg)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#1a1a1a',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
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

 

      {/* SPA ZONE ONLY - Moved to end */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent'
      }}>
        <div className="spa-ritual-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem'
        }}>
          {/* SPA ZONE ONLY Card - Horizontal Layout */}
          {(() => {
            const { totalPrice, totalMinutes, selectedZones } = calculateTotals(SPA_ZONE_ONLY);

            return (
              <Card 
                key={SPA_ZONE_ONLY.id}
                className="spa-ritual-card"
                style={{
                  background: 'rgba(10, 10, 10, 0.65)',
                  backdropFilter: 'blur(8px)',
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
                <CardContent style={{ padding: '1.5rem' }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.4rem',
                        color: '#d4af37',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}>
                        {SPA_ZONE_ONLY.name}
                      </h3>
                    </div>

                    {/* Duration and Price */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={18} color="#d4af37" />
                        <span style={{ color: '#f5f2e8', fontSize: '1rem', fontWeight: '600' }}>
                          {totalMinutes} min
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#d4af37'
                      }}>
                        {formatNumber(totalPrice)} RSD
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#c0baa8',
                    marginBottom: '0.9rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {SPA_ZONE_ONLY.description}
                  </p>

                  {/* Zone Options in Horizontal Layout */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    {SPA_ZONE_ONLY.zones.map((zone) => (
                      <div key={zone.id}>
                        <h4 style={{
                          color: '#d4af37',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>
                          {zone.label}:
                        </h4>
                        {/* "Bez" option */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginBottom: '0.3rem',
                          cursor: 'pointer',
                          color: '#f5f2e8',
                          fontSize: '0.85rem',
                          padding: '0.3rem',
                          borderRadius: '4px',
                          background: selectedZones[zone.id] === null ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                          transition: 'background 0.3s ease'
                        }}>
                          <input
                            type="radio"
                            name={`zone-only-${zone.id}`}
                            value="bez"
                            checked={selectedZones[zone.id] === null}
                            onChange={() => handleZoneOptionSelect(SPA_ZONE_ONLY.id, zone.id, null)}
                            style={{
                              accentColor: '#d4af37',
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px'
                            }}
                          />
                          <span>Bez</span>
                        </label>
                        {/* Zone options */}
                        {zone.options.map((option) => {
                          const isSelected = selectedZones[zone.id] === option.id;
                          return (
                            <label key={option.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              marginBottom: '0.3rem',
                              cursor: 'pointer',
                              color: '#f5f2e8',
                              fontSize: '0.85rem',
                              padding: '0.3rem',
                              borderRadius: '4px',
                              background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                              transition: 'background 0.3s ease'
                            }}>
                              <input
                                type="radio"
                                name={`zone-only-${zone.id}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleZoneOptionSelect(SPA_ZONE_ONLY.id, zone.id, option.id)}
                                style={{
                                  accentColor: '#d4af37',
                                  cursor: 'pointer',
                                  width: '14px',
                                  height: '14px'
                                }}
                              />
                              <span>
                                {option.label} <span style={{ color: '#d4af37', fontWeight: '600' }}>+{formatNumber(option.extraPrice)} RSD</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Total Summary */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <p style={{
                      color: '#f5f2e8',
                      fontSize: '0.9rem',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      <strong style={{ color: '#d4af37' }}>Ukupno trajanje:</strong> {formatNumber(totalMinutes)} min<br />
                      <strong style={{ color: '#d4af37' }}>Ukupna cena:</strong> {formatNumber(totalPrice)} RSD
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleSpaBookClick(SPA_ZONE_ONLY)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#1a1a1a',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                    }}
                  >
                    Zakažite
                  </button>
                </CardContent>
              </Card>
            );
          })()}
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

        {/* DVE VERTIKALNE KARTICE ZA PAROVE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          margin: '0 auto 3rem'
        }}>
          {/* Kartica 1: Romantični paket za parove */}
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
            {/* Background image */}
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
            
            <CardContent style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
              {/* Naslov */}
              <h3 style={{
                fontSize: '1.8rem',
                color: '#d4af37',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                Romantični paket za parove
              </h3>
              
              {/* Kratak opis */}
              <p style={{
                color: '#c0baa8',
                marginBottom: '1rem',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Partnerska aroma masaža sa SPA zonom, šampanjcem i voćem za dvoje.
              </p>
              
              {/* Trajanje */}
              <div style={{
                color: '#d4af37',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={18} />
                <span style={{ fontWeight: '600' }}>210 min</span>
              </div>
              
              {/* Uključeno - lista */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  color: '#d4af37',
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  fontWeight: '600'
                }}>
                  Uključeno:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#f5f2e8',
                  fontSize: '0.85rem',
                  lineHeight: '1.8'
                }}>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Aroma masaža celog tela – 60 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Masaža lica – 60 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Sauna – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Parno kupatilo – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Jacuzzi – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Šampanjac i sveže voće
                  </li>
                </ul>
              </div>
              
              {/* Cena + "Za dve osobe" */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.3)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {formatNumber(25000)} RSD
                </div>
                <div style={{
                  color: '#d4af37',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}>
                  Za dve osobe
                </div>
              </div>

              {/* Dugme "Zakažite" */}
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
                <Link to="/contact?service=Romantični paket za parove&duration=210&price=25000">
                  Zakažite
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Kartica 2: Devojačko veče */}
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
            {/* Background image */}
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
            
            <CardContent style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
              {/* Naslov */}
              <h3 style={{
                fontSize: '1.8rem',
                color: '#d4af37',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                Devojačko veče
              </h3>
              
              {/* Kratak opis */}
              <p style={{
                color: '#c0baa8',
                marginBottom: '1rem',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Ekskluzivan SPA ritual sa pilingom, aromaterapijom, saunom, parnim kupatilom i jacuzzijem.
              </p>
              
              {/* Trajanje */}
              <div style={{
                color: '#d4af37',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={18} />
                <span style={{ fontWeight: '600' }}>210 min</span>
              </div>
              
              {/* Uključeno - lista */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  color: '#d4af37',
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  fontWeight: '600'
                }}>
                  Uključeno:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#f5f2e8',
                  fontSize: '0.85rem',
                  lineHeight: '1.8'
                }}>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Body scrub – 60 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Aroma masaža celog tela – 60 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Sauna – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Parno kupatilo – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Jacuzzi – 30 min
                  </li>
                  <li style={{ marginBottom: '0.3rem', paddingLeft: '1.2rem', position: 'relative' }}>
                    <Sparkles size={10} color="#d4af37" style={{ position: 'absolute', left: 0, top: '5px' }} />
                    Šampanjac i sveže voće
                  </li>
                </ul>
              </div>
              
              {/* Cena + "Za dve osobe" */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.3)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {formatNumber(25000)} RSD
                </div>
                <div style={{
                  color: '#d4af37',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}>
                  Za dve osobe
                </div>
              </div>

              {/* Dugme "Zakažite" */}
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
                <Link to="/contact?service=Devojačko veče&duration=210&price=25000">
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
