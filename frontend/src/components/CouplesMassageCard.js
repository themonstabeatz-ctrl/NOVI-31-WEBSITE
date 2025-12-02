import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

// 🔒 DO NOT MODIFY — STABLE VERIFIED LOGIC (Bua Luang - SNAPSHOT: BuaLuang-FRONTEND-STABLE-01)
// Couples massage card component with dropdown selection and price calculation
const CouplesMassageCard = ({ 
  translate, 
  durations, 
  updateDuration,
  couplesSelections,
  setCouplesSelections,
  dropdownOpen,
  setDropdownOpen
}) => {
  
  const navigate = useNavigate();
  
  // Get discount for "Masaža za parove"
  // Load massages dynamically from booking system
  const [availableMassages, setAvailableMassages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [couplesDiscount, setCouplesDiscount] = React.useState(0);
  
  // Helper function to get discount badge for the price display
  const getCouplesDiscountBadge = () => {
    if (couplesDiscount === 5) return '/discount-5.png';
    if (couplesDiscount === 10) return '/discount-10.png';
    if (couplesDiscount === 15) return '/discount-15.png';
    return null;
  };
  
  // Map massage names to translation keys
  const getMassageTranslationKey = (massageName) => {
    // ✅ CRITICAL: Keep [PAROVI] prefix for backend identification
    // Only remove prefix for translation lookup
    const cleanName = massageName.replace(/^\[PAROVI\]\s*/, '');
    
    const nameMap = {
      'Tradicionalna tajlandska masaža': 'massageTraditionalThai',
      'Aroma terapija': 'massageAromaTherapy',
      'Masaža toplim uljem': 'massageHotOil',
      'Glava, vrat, ramena i leđa': 'massageHeadNeckShoulders',
      'Masaža stopala': 'massageFoot',
      'Aroma duboko tkivo': 'massageAromaDeepTissue',
      'Aromaterapija & topli kamen': 'massageAromaHotStone',
      'Aroma sa toplim biljnim kompresama': 'massageAromaThaiHerbal',
      'Thai masaža sa toplim biljnim kompresama': 'massageThaiHerbal'
    };
    return nameMap[cleanName] || cleanName;
  };
  
  React.useEffect(() => {
    const loadMassages = async () => {
      try {
        console.log('📥 Loading ALL services and filtering for [PAROVI] massages...');
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        
        // CRITICAL: Load all services and filter by category "Kartica Masaza za parove"
        const response = await fetch(`${backendUrl}/api/services`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allServices = await response.json();
        
        // Filter by category "Kartica Masaza za parove" to get INDIVIDUAL [PAROVI] masaže
        const couplesServices = allServices.filter(s => s.category === 'Kartica Masaza za parove');
        
        console.log(`✅ Total services: ${allServices.length}, Filtered [PAROVI] services: ${couplesServices.length}`);
        
        // Verify all filtered services have [PAROVI] prefix
        const withPrefix = couplesServices.filter(s => s.name.startsWith('[PAROVI]'));
        console.log(`✅ Services with [PAROVI] prefix: ${withPrefix.length}/${couplesServices.length}`);
        
        // Get discount from booking system and apply it on frontend
        const discount = couplesServices[0] ? (couplesServices[0].discount_percentage || 0) : 0;
        setCouplesDiscount(discount);
        console.log(`✅ Couples discount: ${discount}% (from booking system)`);
        
        // Group by base name (without duration)
        const servicesByName = {};
        couplesServices.forEach(service => {
          // Extract base name and duration from service name
          // ✅ CRITICAL: Keep [PAROVI] prefix - it's required by backend for identification
          // e.g., "[PAROVI] Tradicionalna tajlandska masaža - 60 min" → base: "[PAROVI] Tradicionalna tajlandska masaža", duration: "60"
          let serviceName = service.name;
          
          // ✅ DO NOT remove [PAROVI] prefix - backend needs it for categorization
          
          const match = serviceName.match(/^(.+?)\s*-\s*(\d+)\s*min$/);
          if (match) {
            const baseName = match[1].trim();  // Includes [PAROVI] prefix
            const duration = match[2];
            
            if (!servicesByName[baseName]) {
              servicesByName[baseName] = {
                key: service.id, // Use service ID as key
                name: baseName,  // ✅ Keep [PAROVI] prefix in name
                serviceId: service.id,
                prices: {},  // Will store discounted prices from backend
                originalPrices: {},  // Will store original prices
                serviceIds: {},  // Store duration-specific service IDs
                durations: [],
                serviceCode: service.service_code  // Unique code for this massage type
              };
            }
            
            // 🔒 DO NOT MODIFY — STABLE VERIFIED PRICE LOGIC (Bua Luang - SNAPSHOT: BuaLuang-FRONTEND-STABLE-01)
            // CRITICAL FIX: Use metadata.final_price (source of truth, NOT root-level final_price!)
            // Same bug as single massages - external API has double discount in root-level final_price
            const metadata = service.metadata || {};
            const correctFinalPrice = metadata.final_price || service.price;
            const correctOriginalPrice = metadata.original_price || service.price;
            
            servicesByName[baseName].prices[duration] = correctFinalPrice;
            servicesByName[baseName].originalPrices[duration] = correctOriginalPrice;
            servicesByName[baseName].serviceIds[duration] = service.id;  // Store service_id per duration
            servicesByName[baseName].durations.push(duration);
          }
        });
        
        // Convert to array
        const massagesArray = Object.values(servicesByName);
        
        console.log('✅ Processed couples massages:', massagesArray);
        
        // Debug: Log specific prices
        const aroma60 = massagesArray.find(m => m.key === 'aromaTerapija' && m.prices['60']);
        const aromaDuboko60 = massagesArray.find(m => m.key === 'aromaDubokoTkivo' && m.prices['60']);
        if (aroma60) console.log(`🔍 Aroma terapija 60min: ${aroma60.prices['60']} RSD`);
        if (aromaDuboko60) console.log(`🔍 Aroma duboko tkivo 60min: ${aromaDuboko60.prices['60']} RSD`);
        
        setAvailableMassages(massagesArray);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to load couples massages:', error);
        setLoading(false);
      }
    };
    
    loadMassages();
  }, []);

  const getFilteredMassages = () => {
    const duration = durations.sports;
    
    // Filter based on selected duration
    if (duration === '120') {
      // For 120 min mode: show both 60 and 120 min options
      return availableMassages.filter(m => 
        m.durations.includes('60') || m.durations.includes('120')
      );
    } else if (duration === '60') {
      // For 60 min mode: show only 60 min options
      return availableMassages.filter(m => m.durations.includes('60'));
    } else if (duration === '90') {
      // For 90 min mode: show only 90 min options
      return availableMassages.filter(m => m.durations.includes('90'));
    }
    
    return availableMassages;
  };

  // Get discount badge image
  const getDiscountBadge = (discount) => {
    if (discount === 5) return '/discount-5.png';
    if (discount === 10) return '/discount-10.png';
    if (discount === 15) return '/discount-15.png';
    return null;
  };

  const handleMassageClick = (person, massage, dur) => {
    console.log('🔵🔵🔵 handleMassageClick CALLED!', { person, massage: massage.name, dur });
    console.log('📍 MASSAGE DATA:', massage);
    console.log('📍 PERSON:', person);
    console.log('📍 DURATION:', dur);
    
    // Get correct price for the specific duration (backend already applied discount)
    const price = massage.prices[dur] || massage.prices['60'];  // discounted price from backend
    const originalPrice = massage.originalPrices?.[dur] || massage.prices[dur];  // original price from backend
    const serviceId = massage.serviceIds?.[dur] || massage.serviceId;  // Get duration-specific service_id
    
    // Create full service name for booking system lookup
    const fullServiceName = `${massage.name} - ${dur} min`;
    
    const massageData = { 
      key: massage.key, 
      name: massage.name, 
      duration: dur, 
      price: price,  // Backend-calculated discounted price (final_price from metadata)
      originalPrice: originalPrice,  // Backend original price (original_price from metadata)
      service_id: serviceId,  // ✅ ADDED: Duration-specific service ID for backend
      fullServiceName: fullServiceName,
      serviceCode: massage.serviceCode  // Unique service code
    };
    
    if (person === 1) {
      const current1 = couplesSelections.person1Massage1;
      const current2 = couplesSelections.person1Massage2;
      
      // For 120 min mode: can select 2x60 or 1x120
      if (durations.sports === '120' && dur === '60') {
        if (!current1 || current1.duration === '120') {
          // First 60 min or replacing 120
          setCouplesSelections(prev => ({
            ...prev,
            person1Massage1: massageData,
            person1Massage2: null
          }));
        } else if (!current2) {
          // Second 60 min
          setCouplesSelections(prev => ({ ...prev, person1Massage2: massageData }));
          setDropdownOpen(prev => ({ ...prev, person1: false }));
        } else {
          // Replace second
          setCouplesSelections(prev => ({ ...prev, person1Massage2: massageData }));
        }
      } else if (durations.sports === '120' && dur === '120') {
        // Single 120 min
        setCouplesSelections(prev => ({
          ...prev,
          person1Massage1: massageData,
          person1Massage2: null
        }));
        setDropdownOpen(prev => ({ ...prev, person1: false }));
      } else {
        // 60 or 90 mode: single selection
        setCouplesSelections(prev => ({
          ...prev,
          person1Massage1: massageData,
          person1Massage2: null
        }));
        setDropdownOpen(prev => ({ ...prev, person1: false }));
      }
    } else {
      const current1 = couplesSelections.person2Massage1;
      const current2 = couplesSelections.person2Massage2;
      
      // For 120 min mode: can select 2x60 or 1x120
      if (durations.sports === '120' && dur === '60') {
        if (!current1 || current1.duration === '120') {
          // First 60 min or replacing 120
          setCouplesSelections(prev => ({
            ...prev,
            person2Massage1: massageData,
            person2Massage2: null
          }));
        } else if (!current2) {
          // Second 60 min
          setCouplesSelections(prev => ({ ...prev, person2Massage2: massageData }));
          setDropdownOpen(prev => ({ ...prev, person2: false }));
        } else {
          // Replace second
          setCouplesSelections(prev => ({ ...prev, person2Massage2: massageData }));
        }
      } else if (durations.sports === '120' && dur === '120') {
        // Single 120 min
        setCouplesSelections(prev => ({
          ...prev,
          person2Massage1: massageData,
          person2Massage2: null
        }));
        setDropdownOpen(prev => ({ ...prev, person2: false }));
      } else {
        // 60 or 90 mode: single selection
        setCouplesSelections(prev => ({
          ...prev,
          person2Massage1: massageData,
          person2Massage2: null
        }));
        setDropdownOpen(prev => ({ ...prev, person2: false }));
      }
    }
  };

  const isSelected = (person, massageKey, duration) => {
    if (person === 1) {
      const m1 = couplesSelections.person1Massage1;
      const m2 = couplesSelections.person1Massage2;
      // For 120-min mode, check both key AND duration to distinguish between 60-min and 120-min selections
      if (durations.sports === '120') {
        return (m1?.key === massageKey && m1?.duration === duration) || 
               (m2?.key === massageKey && m2?.duration === duration);
      }
      return m1?.key === massageKey || m2?.key === massageKey;
    } else {
      const m1 = couplesSelections.person2Massage1;
      const m2 = couplesSelections.person2Massage2;
      if (durations.sports === '120') {
        return (m1?.key === massageKey && m1?.duration === duration) || 
               (m2?.key === massageKey && m2?.duration === duration);
      }
      return m1?.key === massageKey || m2?.key === massageKey;
    }
  };

  const getSelectedText = (person) => {
    if (person === 1) {
      const m1 = couplesSelections.person1Massage1;
      const m2 = couplesSelections.person1Massage2;
      if (m1 && m2) return `${m1.name.substring(0, 20)}... + ${m2.name.substring(0, 20)}...`;
      if (m1) return m1.name;
      return translate('selectMassagePlaceholder');
    } else {
      const m1 = couplesSelections.person2Massage1;
      const m2 = couplesSelections.person2Massage2;
      if (m1 && m2) return `${m1.name.substring(0, 20)}... + ${m2.name.substring(0, 20)}...`;
      if (m1) return m1.name;
      return translate('selectMassagePlaceholder');
    }
  };

  const clearSelection = (person) => {
    if (person === 1) {
      setCouplesSelections(prev => ({ ...prev, person1Massage1: null, person1Massage2: null }));
    } else {
      setCouplesSelections(prev => ({ ...prev, person2Massage1: null, person2Massage2: null }));
    }
  };

  // Calculate total duration for both persons
  const calculateTotalDuration = () => {
    let total = 0;
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    if (p1m1) total += parseInt(p1m1.duration);
    if (p1m2) total += parseInt(p1m2.duration);
    if (p2m1) total += parseInt(p2m1.duration);
    if (p2m2) total += parseInt(p2m2.duration);
    
    return total;
  };

  const calculateOriginalPrice = () => {
    // ORIGINALNA CENA = ZBIR originalPrice iz backenda (backend je izvor istine)
    let total = 0;
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    // Backend vraća originalPrice - samo saberi vrednosti
    if (p1m1) total += p1m1.originalPrice || p1m1.price;
    if (p1m2) total += p1m2.originalPrice || p1m2.price;
    if (p2m1) total += p2m1.originalPrice || p2m1.price;
    if (p2m2) total += p2m2.originalPrice || p2m2.price;
    
    console.log(`💰 Original price (pre popusta, iz backenda): ${total} RSD`);
    
    return total;
  };

  // Calculate final price (backend already calculated discount)
  const calculateCouplesPrice = () => {
    // FINALNA CENA = ZBIR discounted_price iz backenda (backend već primenio popust)
    let total = 0;
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    // Backend već izračunao cene sa popustom - samo saberi
    if (p1m1) total += p1m1.price;  // price već sadrži diskontovanu cenu iz backenda
    if (p1m2) total += p1m2.price;
    if (p2m1) total += p2m1.price;
    if (p2m2) total += p2m2.price;
    
    console.log(`💰 Couples price (finalna sa popustom, iz backenda): ${total.toFixed(0)} RSD`);
    
    return total;
  };

  const isSelectionComplete = () => {
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    console.log('🔍 isSelectionComplete check:', {
      duration: durations.sports,
      p1m1: p1m1 ? `${p1m1.name} (${p1m1.duration}min) - type: ${typeof p1m1.duration}` : 'NULL',
      p1m2: p1m2 ? `${p1m2.name} (${p1m2.duration}min) - type: ${typeof p1m2.duration}` : 'NULL',
      p2m1: p2m1 ? `${p2m1.name} (${p2m1.duration}min) - type: ${typeof p2m1.duration}` : 'NULL',
      p2m2: p2m2 ? `${p2m2.name} (${p2m2.duration}min) - type: ${typeof p2m2.duration}` : 'NULL',
      'p1m1 exists': !!p1m1,
      'p2m1 exists': !!p2m1
    });
    
    // For 120 min mode: each person needs 2x60 OR 1x120
    if (durations.sports === '120') {
      let person1Complete = false;
      if (p1m1?.duration === '60') {
        person1Complete = !!(p1m1 && p1m2); // Need 2x60
      } else if (p1m1?.duration === '120') {
        person1Complete = !!p1m1; // Need 1x120
      }
      
      let person2Complete = false;
      if (p2m1?.duration === '60') {
        person2Complete = !!(p2m1 && p2m2); // Need 2x60
      } else if (p2m1?.duration === '120') {
        person2Complete = !!p2m1; // Need 1x120
      }
      
      const result = !!(person1Complete && person2Complete);
      console.log(`✅ isSelectionComplete (120 mode): ${result}`);
      return result;
    }
    
    // For 60 or 90 min modes: just need 1 massage per person
    const result = !!(p1m1 && p2m1);
    console.log(`✅ isSelectionComplete (60/90 mode): ${result}`);
    return result;
  };

  const is120Mode = durations.sports === '120';

  // ✅ UPDATED PER USER REQUEST: Add complete price data for backend (like single massages)
  // Handle booking button click - navigate to Contact form with couples data
  const handleBookClick = () => {
    console.log('📍 Couples book clicked');
    console.log('📍 isSelectionComplete =', isSelectionComplete());
    console.log('📍 couplesSelections =', couplesSelections);
    
    // Calculate totals
    const totalOriginalPrice = calculateOriginalPrice();
    const totalFinalPrice = calculateCouplesPrice();
    const totalDiscountAmount = totalOriginalPrice - totalFinalPrice;
    
    console.log('📍 totalOriginalPrice =', totalOriginalPrice);
    console.log('📍 totalFinalPrice =', totalFinalPrice);
    console.log('📍 couplesDiscount =', couplesDiscount);
    
    // ✅ CRITICAL: Build service name with [PAROVI] prefix for backend identification
    const buildServiceName = (massage) => {
      if (!massage) return null;
      // Ensure [PAROVI] prefix is present (massage.name should already have it from backend)
      const nameWithPrefix = massage.name.startsWith('[PAROVI]') 
        ? massage.name 
        : `[PAROVI] ${massage.name}`;
      return nameWithPrefix;
    };
    
    // ✅ Build couples data with simplified structure for backend
    const couplesData = {
      person1: {
        service_id: couplesSelections.person1Massage1?.service_id || null,
        name: buildServiceName(couplesSelections.person1Massage1),
        duration: couplesSelections.person1Massage1?.duration || 60,
        original_price: couplesSelections.person1Massage1?.originalPrice || 0,
        final_price: couplesSelections.person1Massage1?.price || 0
      },
      person2: {
        service_id: couplesSelections.person2Massage1?.service_id || null,
        name: buildServiceName(couplesSelections.person2Massage1),
        duration: couplesSelections.person2Massage1?.duration || 60,
        original_price: couplesSelections.person2Massage1?.originalPrice || 0,
        final_price: couplesSelections.person2Massage1?.price || 0
      },
      pair_original_price: totalOriginalPrice,
      pair_final_price: totalFinalPrice,
      pair_discount_percentage: couplesDiscount,  // 10
      pair_discount_amount: totalDiscountAmount
    };
    
    // ✅ CRITICAL: Build URL with [PAROVI] prefix in service parameter
    const firstMassage = couplesSelections.person1Massage1;
    const serviceNameForUrl = buildServiceName(firstMassage);
    
    const params = new URLSearchParams({
      service: serviceNameForUrl,  // ✅ Now includes [PAROVI] prefix
      couplesData: JSON.stringify(couplesData)
    });
    
    console.log('📍 Couples data (WITH full price info):', couplesData);
    console.log('📍 Service name for URL:', serviceNameForUrl);
    console.log('📍 Navigating to /contact for COUPLES with params:', params.toString());
    
    navigate(`/contact?${params.toString()}`);
  };

  return (
    <Card 
      className="massage-card couples-card-content" 
      style={{ 
        position: 'relative', 
        minHeight: '540px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'visible',
        zIndex: 100
      }}
    >
      {/* Inner wrapper to constrain golden line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: '20px'
      }} />
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{ color: '#d4af37', fontSize: '1.2rem' }}>
            {translate('loadingMassages')}
          </div>
        </div>
      )}
      <CardHeader style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle className="massage-name">{translate("sportsMassage")}</CardTitle>
          
          {/* Discount Badge - Always visible when discount > 0 */}
          {getCouplesDiscountBadge() && (
            <img 
              src={getCouplesDiscountBadge()} 
              alt={`-${couplesDiscount}%`}
              style={{ 
                width: '54px',  // Increased by 20% (38px * 1.2 ≈ 46px, but using 54px for better visibility)
                height: '54px', 
                objectFit: 'contain',
                marginRight: '1rem' // Move to left by adding right margin
              }}
            />
          )}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          {['60', '90', '120'].map(dur => (
            <button
              key={dur}
              onClick={() => {
                console.log(`🔵 COUPLES CARD: Duration button clicked: ${dur} min`);
                updateDuration('sports', dur);
              }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: durations.sports === dur ? '2px solid #d4af37' : '1px solid #444',
                backgroundColor: durations.sports === dur ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                color: '#d4af37',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: durations.sports === dur ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {dur} min
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent style={{ position: 'relative', zIndex: 1, paddingTop: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
        {/* PERSON 1 */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ 
            display: 'block', 
            color: '#d4af37', 
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700'
          }}>
            {translate('person1')} - {translate('selectMassage')}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: 'calc(100% - 90px)', position: 'relative' }}>
              {/* Person 1 - Dropdown */}
              <div
                onClick={() => {
                  if (!loading && availableMassages.length > 0) {
                    setDropdownOpen(prev => ({ ...prev, person1: !prev.person1 }));
                  }
                }}
                style={{
                  height: '40px',
                  padding: '0.5rem',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                  color: couplesSelections.person1Massage1 ? '#d4af37' : '#d4af37',
                  fontSize: '0.875rem',
                  cursor: (loading || availableMassages.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (loading || availableMassages.length === 0) ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <span>
                  {loading ? translate('loading') : (
                    couplesSelections.person1Massage1 ? (
                      couplesSelections.person1Massage2 ? (
                        // Two 60-min massages selected
                        `${translate(getMassageTranslationKey(couplesSelections.person1Massage1.name))} + ${translate(getMassageTranslationKey(couplesSelections.person1Massage2.name))}`
                      ) : (
                        // Single massage selected
                        `${translate(getMassageTranslationKey(couplesSelections.person1Massage1.name))} (${couplesSelections.person1Massage1.duration} min)`
                      )
                    ) : (availableMassages.length > 0 ? translate('clickHere') : translate('noAvailableMassages'))
                  )}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
              
              {/* Dropdown list */}
              {dropdownOpen.person1 && (
                <div 
                  className="custom-scrollbar"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    marginTop: '0.25rem',
                    zIndex: 101,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  {getFilteredMassages().map(massage => {
                    const options = [];
                    const selectedDuration = durations.sports;
                    
                    massage.durations.forEach(dur => {
                      // Skip if duration doesn't match the filter
                      if (selectedDuration === '60' && dur !== '60') return;
                      if (selectedDuration === '90' && dur !== '90') return;
                      if (selectedDuration === '120' && dur !== '60' && dur !== '120') return;
                      
                      const selected = isSelected(1, massage.key, dur);
                      
                      options.push(
                        <div
                          key={`${massage.key}-${dur}`}
                          onClick={() => handleMassageClick(1, massage, dur)}
                          style={{
                            padding: '0.75rem',
                            cursor: 'pointer',
                            backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                            color: '#d4af37',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            borderBottom: '1px solid #333'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {selected && <Check className="w-4 h-4" />}
                            {/* ✅ KEEP [PAROVI] PREFIX - required by backend for categorization */}
                            <span>{massage.name} ({dur} min)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                            {couplesDiscount > 0 && massage.originalPrices[dur] && massage.originalPrices[dur] !== massage.prices[dur] ? (
                              <>
                                <span style={{ color: '#999', textDecoration: 'line-through' }}>
                                  {massage.originalPrices[dur].toLocaleString('sr-RS')} RSD
                                </span>
                                <span style={{ color: '#4ade80', fontWeight: '600' }}>
                                  {massage.prices[dur].toLocaleString('sr-RS')} RSD
                                </span>
                                <span style={{ 
                                  backgroundColor: '#dc2626', 
                                  color: 'white', 
                                  padding: '0.15rem 0.4rem', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem',
                                  fontWeight: '700'
                                }}>
                                  -{couplesDiscount}%
                                </span>
                              </>
                            ) : (
                              <span style={{ color: '#999' }}>
                                {massage.prices[dur].toLocaleString('sr-RS')} RSD
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                    
                    return options;
                  })}
                </div>
              )}
            </div>
            
            <button
              onClick={() => clearSelection(1)}
              disabled={!couplesSelections.person1Massage1}
              style={{
                width: '80px',
                padding: '0.5rem',
                backgroundColor: couplesSelections.person1Massage1 ? '#d4af37' : '#444',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: couplesSelections.person1Massage1 ? 'pointer' : 'not-allowed',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                opacity: couplesSelections.person1Massage1 ? 1 : 0.5
              }}
            >
              <X className="w-3 h-3" />
              {translate('cancel')}
            </button>
          </div>
        </div>

        {/* PERSON 2 */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ 
            display: 'block', 
            color: '#d4af37', 
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700'
          }}>
            {translate('person2')} - {translate('selectMassage')}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: 'calc(100% - 90px)', position: 'relative' }}>
              {/* Person 2 - Dropdown */}
              <div
                onClick={() => {
                  if (!loading && availableMassages.length > 0) {
                    setDropdownOpen(prev => ({ ...prev, person2: !prev.person2 }));
                  }
                }}
                style={{
                  height: '40px',
                  padding: '0.5rem',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                  color: couplesSelections.person2Massage1 ? '#d4af37' : '#d4af37',
                  fontSize: '0.875rem',
                  cursor: (loading || availableMassages.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (loading || availableMassages.length === 0) ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <span>
                  {loading ? translate('loading') : (
                    couplesSelections.person2Massage1 ? (
                      couplesSelections.person2Massage2 ? (
                        // Two 60-min massages selected
                        `${translate(getMassageTranslationKey(couplesSelections.person2Massage1.name))} + ${translate(getMassageTranslationKey(couplesSelections.person2Massage2.name))}`
                      ) : (
                        // Single massage selected
                        `${translate(getMassageTranslationKey(couplesSelections.person2Massage1.name))} (${couplesSelections.person2Massage1.duration} min)`
                      )
                    ) : (availableMassages.length > 0 ? translate('clickHere') : translate('noAvailableMassages'))
                  )}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
              
              {/* Dropdown list */}
              {dropdownOpen.person2 && (
                <div 
                  className="custom-scrollbar"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    marginTop: '0.25rem',
                    zIndex: 101,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  {getFilteredMassages().map(massage => {
                    const options = [];
                    const selectedDuration = durations.sports;
                    
                    massage.durations.forEach(dur => {
                      // Skip if duration doesn't match the filter
                      if (selectedDuration === '60' && dur !== '60') return;
                      if (selectedDuration === '90' && dur !== '90') return;
                      if (selectedDuration === '120' && dur !== '60' && dur !== '120') return;
                      
                      const selected = isSelected(2, massage.key, dur);
                      
                      options.push(
                        <div
                          key={`${massage.key}-${dur}-p2`}
                          onClick={() => handleMassageClick(2, massage, dur)}
                          style={{
                            padding: '0.75rem',
                            cursor: 'pointer',
                            backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                            color: '#d4af37',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            borderBottom: '1px solid #333'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {selected && <Check className="w-4 h-4" />}
                            {/* ✅ KEEP [PAROVI] PREFIX - required by backend for categorization */}
                            <span>{massage.name} ({dur} min)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                            {couplesDiscount > 0 && massage.originalPrices[dur] && massage.originalPrices[dur] !== massage.prices[dur] ? (
                              <>
                                <span style={{ color: '#999', textDecoration: 'line-through' }}>
                                  {massage.originalPrices[dur].toLocaleString('sr-RS')} RSD
                                </span>
                                <span style={{ color: '#4ade80', fontWeight: '600' }}>
                                  {massage.prices[dur].toLocaleString('sr-RS')} RSD
                                </span>
                                <span style={{ 
                                  backgroundColor: '#dc2626', 
                                  color: 'white', 
                                  padding: '0.15rem 0.4rem', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem',
                                  fontWeight: '700'
                                }}>
                                  -{couplesDiscount}%
                                </span>
                              </>
                            ) : (
                              <span style={{ color: '#999' }}>
                                {massage.prices[dur].toLocaleString('sr-RS')} RSD
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                    
                    return options;
                  })}
                </div>
              )}
            </div>
            
            <button
              onClick={() => clearSelection(2)}
              disabled={!couplesSelections.person2Massage1}
              style={{
                width: '80px',
                padding: '0.5rem',
                backgroundColor: couplesSelections.person2Massage1 ? '#d4af37' : '#444',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: couplesSelections.person2Massage1 ? 'pointer' : 'not-allowed',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                opacity: couplesSelections.person2Massage1 ? 1 : 0.5
              }}
            >
              <X className="w-3 h-3" />
              {translate('cancel')}
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Price */}
        {isSelectionComplete() && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginBottom: '1rem',
            paddingRight: '0.5rem'
          }}>
            {/* ✅ UPDATED: Identičan stil kao kod single masaža (Bua Luang - per user request)
                Backend je IZVOR ISTINE za cene!
                Backend vraća original_price i final_price (discounted_price).
                Frontend SAMO PRIKAZUJE ove vrednosti, bez dodatnih izračunavanja. */}
            
            {/* Original Price (SIVA + precrtana) - samo ako ima popust */}
            {couplesDiscount > 0 && (
              <div style={{
                color: '#888',              // SIVA (kao kod single)
                fontSize: '0.9rem',
                textDecoration: 'line-through',
                marginBottom: '0.25rem'
              }}>
                {Math.round(calculateOriginalPrice()).toLocaleString('sr-RS')} RSD
              </div>
            )}
            
            {/* Final Price (CRVENA + BOLD) - identično kao kod single masaža */}
            <div style={{
              color: couplesDiscount > 0 ? '#e63946' : '#d4af37',  // CRVENA ako ima popust, zlatna inače
              fontWeight: 'bold',
              fontSize: '1.4rem',
              whiteSpace: 'nowrap'
            }}>
              {Math.round(calculateCouplesPrice()).toLocaleString('sr-RS')} RSD
            </div>
          </div>
        )}

        {isSelectionComplete() ? (
          <Button 
            className="book-button w-full" 
            onClick={() => {
              console.log('🔵🔵🔵 COUPLES BUTTON CLICKED!!!');
              handleBookClick();
            }}
          >
            {translate('bookNowBtn')}
          </Button>
        ) : (
          <Button disabled className="book-button w-full" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            {translate('bookNowBtn')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CouplesMassageCard;