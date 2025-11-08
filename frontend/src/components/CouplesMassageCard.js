import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const CouplesMassageCard = ({ 
  translate, 
  durations, 
  updateDuration,
  couplesSelections,
  setCouplesSelections,
  calculateCouplesPrice,
  dropdownOpen,
  setDropdownOpen,
  serviceDiscounts = {}
}) => {
  
  // Get discount for "Masaža za parove"
  // Get discount from first [PAROVI] service (all have same discount)
  const paroviKey = Object.keys(serviceDiscounts).find(key => key.startsWith('[PAROVI]'));
  const couplesDiscount = paroviKey ? serviceDiscounts[paroviKey] : 0;
  
  // Helper function to get discount badge for the price display
  const getCouplesDiscountBadge = () => {
    if (couplesDiscount === 5) return '/discount-5.png';
    if (couplesDiscount === 10) return '/discount-10.png';
    if (couplesDiscount === 15) return '/discount-15.png';
    return null;
  };
  
  // Load massages dynamically from booking system
  const [availableMassages, setAvailableMassages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Map massage names to translation keys
  const getMassageTranslationKey = (massageName) => {
    const nameMap = {
      'Tradicionalna tajlandska masaža': 'massageTraditionalThai',
      'Aroma terapija': 'massageAromaTherapy',
      'Masaža toplim uljem': 'massageHotOil',
      'Glava, vrat, ramena i leđa': 'massageHeadNeckShoulders',
      'Masaža stopala': 'massageFoot'
    };
    return nameMap[massageName] || massageName;
  };
  
  React.useEffect(() => {
    const loadMassages = async () => {
      try {
        console.log('📥 Loading massages from booking system...');
        const response = await fetch('https://spabooking.preview.emergentagent.com/api/services');
        const services = await response.json();
        
        // Filter by prefix "[PAROVI]"
        const couplesServices = services.filter(s => s.name.startsWith('[PAROVI]'));
        console.log(`✅ Loaded ${couplesServices.length} services for couple massage card`);
        
        // Group by base name (without duration and prefix)
        const servicesByName = {};
        couplesServices.forEach(service => {
          // Extract base name and duration from service name
          // e.g., "[PAROVI] Tradicionalna tajlandska masaža - 60 min" → base: "Tradicionalna tajlandska masaža", duration: "60"
          let serviceName = service.name;
          // Remove [PAROVI] prefix
          if (serviceName.startsWith('[PAROVI]')) {
            serviceName = serviceName.replace('[PAROVI]', '').trim();
          }
          
          const match = serviceName.match(/^(.+?)\s*-\s*(\d+)\s*min$/);
          if (match) {
            const baseName = match[1].trim();
            const duration = match[2];
            
            if (!servicesByName[baseName]) {
              servicesByName[baseName] = {
                key: service.id, // Use service ID as key
                name: baseName,
                serviceId: service.id,
                prices: {},
                durations: [],
                discounts: {} // Store discount per duration
              };
            }
            
            servicesByName[baseName].prices[duration] = service.price;
            servicesByName[baseName].durations.push(duration);
            // Get discount from booking system API (if available)
            servicesByName[baseName].discounts[duration] = service.discount_percentage || 0;
          }
        });
        
        // Convert to array
        const massagesArray = Object.values(servicesByName);
        console.log('✅ Processed massages:', massagesArray);
        
        setAvailableMassages(massagesArray);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to load massages:', error);
        setLoading(false);
      }
    };
    
    loadMassages();
  }, []);

  const getFilteredMassages = () => {
    const duration = couplesSelections.duration;
    
    if (duration === '120') {
      return availableMassages.filter(m => 
        m.durations.includes('60') || m.durations.includes('120')
      );
    } else if (duration === '60') {
      return availableMassages.filter(m => m.durations.includes('60'));
    } else if (duration === '90') {
      return availableMassages.filter(m => m.durations.includes('90'));
    }
    return [];
  };

  // Get discount badge image
  const getDiscountBadge = (discount) => {
    if (discount === 5) return '/discount-5.png';
    if (discount === 10) return '/discount-10.png';
    if (discount === 15) return '/discount-15.png';
    return null;
  };

  const handleMassageClick = (person, massage, dur) => {
    console.log('✅ handleMassageClick CALLED:', { person, massage: massage.name, dur });
    
    // Get correct price for the specific duration
    const price = massage.prices[dur] || massage.prices['60'];
    
    // Create full service name for booking system lookup
    const fullServiceName = `${massage.name} - ${dur} min`;
    
    const massageData = { 
      key: massage.key, 
      name: massage.name, 
      duration: dur, 
      price: price,
      fullServiceName: fullServiceName // For booking system lookup
    };
    console.log('✅ massageData created:', massageData);
    
    if (person === 1) {
      const current1 = couplesSelections.person1Massage1;
      const current2 = couplesSelections.person1Massage2;
      
      
      // If 120 min mode and clicking 60 min massage
      if (couplesSelections.duration === '120' && dur === '60') {
        // Check if already selected
        if (current1?.key === massage.key && current1?.duration === '60') {
          setCouplesSelections(prev => {
            return { ...prev, person1Massage1: null };
          });
        } else if (current2?.key === massage.key && current2?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person1Massage2: null }));
        } else {
          // Add to first empty slot
          if (!current1) {
            setCouplesSelections(prev => {
              const newState = { ...prev, person1Massage1: massageData };
              return newState;
            });
            // Don't close yet - waiting for second selection
          } else if (!current2) {
            setCouplesSelections(prev => ({ ...prev, person1Massage2: massageData }));
            // Both slots filled - close dropdown
            setDropdownOpen(prev => ({ ...prev, person1: false }));
          }
        }
      } else {
        // For 120 min massage or 60/90 mode - single selection, clear ALL other selections
        console.log('✅ Person 1: Setting single selection for 60/90 mode or 120-min massage');
        setCouplesSelections(prev => {
          const newState = { 
            ...prev, 
            person1Massage1: massageData,
            person1Massage2: null 
          };
          console.log('✅ Person 1: New state:', newState);
          return newState;
        });
        setDropdownOpen(prev => ({ ...prev, person1: false }));
      }
    } else {
      const current1 = couplesSelections.person2Massage1;
      const current2 = couplesSelections.person2Massage2;
      
      
      if (couplesSelections.duration === '120' && dur === '60') {
        if (current1?.key === massage.key && current1?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person2Massage1: null }));
        } else if (current2?.key === massage.key && current2?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person2Massage2: null }));
        } else {
          if (!current1) {
            setCouplesSelections(prev => {
              const newState = { ...prev, person2Massage1: massageData };
              return newState;
            });
            // Don't close yet - waiting for second selection
          } else if (!current2) {
            setCouplesSelections(prev => ({ ...prev, person2Massage2: massageData }));
            // Both slots filled - close dropdown
            setDropdownOpen(prev => ({ ...prev, person2: false }));
          }
        }
      } else {
        // For 120 min massage or 60/90 mode - single selection, clear ALL other selections
        setCouplesSelections(prev => {
          const newState = { 
            ...prev, 
            person2Massage1: massageData,
            person2Massage2: null
          };
          return newState;
        });
        setDropdownOpen(prev => ({ ...prev, person2: false }));
      }
    }
    
  };

  const isSelected = (person, massageKey, duration) => {
    if (person === 1) {
      const m1 = couplesSelections.person1Massage1;
      const m2 = couplesSelections.person1Massage2;
      // For 120-min mode, check both key AND duration to distinguish between 60-min and 120-min selections
      if (couplesSelections.duration === '120') {
        return (m1?.key === massageKey && m1?.duration === duration) || 
               (m2?.key === massageKey && m2?.duration === duration);
      }
      return m1?.key === massageKey || m2?.key === massageKey;
    } else {
      const m1 = couplesSelections.person2Massage1;
      const m2 = couplesSelections.person2Massage2;
      if (couplesSelections.duration === '120') {
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

  // Calculate original price (without discount)
  const calculateOriginalPrice = () => {
    let total = 0;
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    if (p1m1) total += p1m1.price;
    if (p1m2) total += p1m2.price;
    if (p2m1) total += p2m1.price;
    if (p2m2) total += p2m2.price;
    
    return total;
  };

  const isSelectionComplete = () => {
    const p1m1 = couplesSelections.person1Massage1;
    const p1m2 = couplesSelections.person1Massage2;
    const p2m1 = couplesSelections.person2Massage1;
    const p2m2 = couplesSelections.person2Massage2;
    
    // For 120-min mode: Each person can choose either 2x60min OR 1x120min
    if (couplesSelections.duration === '120') {
      // Check Person 1 completion
      let person1Complete = false;
      if (p1m1?.duration === '60') {
        // Person 1 is selecting 60-min massages, needs 2 selections
        person1Complete = !!(p1m1 && p1m2);
      } else if (p1m1?.duration === '120') {
        // Person 1 is selecting 120-min massage, needs just 1 selection
        person1Complete = !!p1m1;
      }
      
      // Check Person 2 completion
      let person2Complete = false;
      if (p2m1?.duration === '60') {
        // Person 2 is selecting 60-min massages, needs 2 selections
        person2Complete = !!(p2m1 && p2m2);
      } else if (p2m1?.duration === '120') {
        // Person 2 is selecting 120-min massage, needs just 1 selection
        person2Complete = !!p2m1;
      }
      
      return !!(person1Complete && person2Complete);
    }
    
    // For 60 or 90 min modes: just need 1 massage per person
    return !!(p1m1 && p2m1);
  };

  const is120Mode = couplesSelections.duration === '120';

  return (
    <Card className="massage-card couples-card-content" style={{ position: 'relative', minHeight: '540px', display: 'flex', flexDirection: 'column' }}>
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
            Učitavanje masaža...
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="massage-name">{translate("sportsMassage")}</CardTitle>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          {['60', '90', '120'].map(dur => (
            <button
              key={dur}
              onClick={() => updateDuration('sports', dur)}
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
      
      <CardContent style={{ paddingTop: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              {/* Custom dropdown */}
              <div
                onClick={() => setDropdownOpen(prev => ({ ...prev, person1: !prev.person1 }))}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#d4af37',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {getSelectedText(1)}
              </div>
              
              {/* Dropdown list */}
              {dropdownOpen.person1 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  marginTop: '0.25rem',
                  paddingBottom: '8px',
                  zIndex: 1000,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d4af37 #1a1a1a'
                }}
                className="custom-scrollbar"
                >
                  {getFilteredMassages().map(massage => {
                    if (is120Mode) {
                      return null; // Will render separately below
                    } else {
                      // 60 or 90 mode - single select
                      const dur = couplesSelections.duration;
                      if (!massage.durations.includes(dur)) return null;
                      const selected = isSelected(1, massage.key, dur);
                      return (
                        <div
                          key={`${massage.key}-${dur}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMassageClick(1, massage, dur);
                          }}
                          style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                            color: '#d4af37',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: '1px solid #333'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                        >
                          {selected && <Check className="w-4 h-4" />}
                          <div style={{ flex: 1 }}>
                            <span>{translate(getMassageTranslationKey(massage.name))} ({dur} min)</span>
                          </div>
                        </div>
                      );
                    }
                  })}
                  
                  {/* For 120 min mode: Show ALL 60 min first, then ALL 120 min */}
                  {is120Mode && (
                    <>
                      {/* FIRST: All 60 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('60')).map(massage => {
                        const selected = isSelected(1, massage.key, '60');
                        return (
                          <div
                            key={`${massage.key}-60-p1`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMassageClick(1, massage, '60');
                            }}
                            style={{
                              padding: '0.5rem',
                              cursor: 'pointer',
                              backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: '#d4af37',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              borderBottom: '1px solid #333',
                              fontWeight: selected ? 'bold' : 'normal'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                          >
                            {selected && <Check className="w-4 h-4" style={{ color: '#d4af37' }} />}
                            <div style={{ flex: 1 }}>
                              <span>★ {translate(getMassageTranslationKey(massage.name))} (60 min)</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* SECOND: All 120 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('120')).map(massage => {
                        const selected = isSelected(1, massage.key, '120');
                        return (
                          <div
                            key={`${massage.key}-120-p1`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMassageClick(1, massage, '120');
                            }}
                            style={{
                              padding: '0.5rem',
                              cursor: 'pointer',
                              backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: '#d4af37',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              borderBottom: '1px solid #333'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                          >
                            {selected && <Check className="w-4 h-4" style={{ color: '#d4af37' }} />}
                            <div style={{ flex: 1 }}>
                              <span>{massage.name} (120 min)</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
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
              <div
                onClick={() => setDropdownOpen(prev => ({ ...prev, person2: !prev.person2 }))}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#d4af37',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {getSelectedText(2)}
              </div>
              
              {dropdownOpen.person2 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  marginTop: '0.25rem',
                  paddingBottom: '8px',
                  zIndex: 1000,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d4af37 #1a1a1a'
                }}
                className="custom-scrollbar"
                >
                  {getFilteredMassages().map(massage => {
                    if (is120Mode) {
                      return null; // Will render separately below
                    } else {
                      // 60 or 90 mode - single select
                      const dur = couplesSelections.duration;
                      if (!massage.durations.includes(dur)) return null;
                      const selected = isSelected(2, massage.key, dur);
                      return (
                        <div
                          key={`${massage.key}-${dur}-person2`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMassageClick(2, massage, dur);
                          }}
                          style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                            color: '#d4af37',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: '1px solid #333'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                        >
                          {selected && <Check className="w-4 h-4" />}
                          <div style={{ flex: 1 }}>
                            <span>{translate(getMassageTranslationKey(massage.name))} ({dur} min)</span>
                          </div>
                        </div>
                      );
                    }
                  })}
                  
                  {/* For 120 min mode: Show ALL 60 min first, then ALL 120 min */}
                  {is120Mode && (
                    <>
                      {/* FIRST: All 60 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('60')).map(massage => {
                        const selected = isSelected(2, massage.key, '60');
                        return (
                          <div
                            key={`${massage.key}-60-p2`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMassageClick(2, massage, '60');
                            }}
                            style={{
                              padding: '0.5rem',
                              cursor: 'pointer',
                              backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: '#d4af37',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              borderBottom: '1px solid #333',
                              fontWeight: selected ? 'bold' : 'normal'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                          >
                            {selected && <Check className="w-4 h-4" style={{ color: '#d4af37' }} />}
                            <div style={{ flex: 1 }}>
                              <span>★ {translate(getMassageTranslationKey(massage.name))} (60 min)</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* SECOND: All 120 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('120')).map(massage => {
                        const selected = isSelected(2, massage.key, '120');
                        return (
                          <div
                            key={`${massage.key}-120-p2`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMassageClick(2, massage, '120');
                            }}
                            style={{
                              padding: '0.5rem',
                              cursor: 'pointer',
                              backgroundColor: selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: '#d4af37',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              borderBottom: '1px solid #333'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                          >
                            {selected && <Check className="w-4 h-4" style={{ color: '#d4af37' }} />}
                            <div style={{ flex: 1 }}>
                              <span>{massage.name} (120 min)</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
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
            {/* Original Price (strikethrough) - only show if there's a discount */}
            {couplesDiscount > 0 && (
              <div style={{
                color: '#e63946',
                fontSize: '1.2rem',
                textDecoration: 'line-through',
                textDecorationColor: 'white',
                marginBottom: '0.25rem'
              }}>
                {Math.round(calculateOriginalPrice()).toLocaleString('sr-RS')} RSD
              </div>
            )}
            
            {/* Discounted Price with Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {getCouplesDiscountBadge() && (
                <img 
                  src={getCouplesDiscountBadge()} 
                  alt={`-${couplesDiscount}%`}
                  style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                />
              )}
              <div style={{
                color: '#d4af37',
                fontWeight: 'bold',
                fontSize: '2.2rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '1px',
                whiteSpace: 'nowrap'
              }}>
                {Math.round(calculateCouplesPrice()).toLocaleString('sr-RS')} RSD
              </div>
            </div>
          </div>
        )}

        <Button 
          className="book-button w-full"
          style={{
            opacity: isSelectionComplete() ? 1 : 0.5,
            cursor: isSelectionComplete() ? 'pointer' : 'not-allowed'
          }}
          disabled={!isSelectionComplete()}
          asChild={!!isSelectionComplete()}
        >
          {isSelectionComplete() ? (
            <Link 
              to={`/contact?service=${encodeURIComponent(`${translate('couplesMassage')} - ${calculateTotalDuration()} min`)}&couplesData=${encodeURIComponent(JSON.stringify({
                duration: couplesSelections.duration,
                totalDuration: calculateTotalDuration(),
                person1: {
                  massage1: couplesSelections.person1Massage1,
                  massage2: couplesSelections.person1Massage2
                },
                person2: {
                  massage1: couplesSelections.person2Massage1,
                  massage2: couplesSelections.person2Massage2
                },
                totalPrice: calculateCouplesPrice(),
                originalPrice: calculateOriginalPrice(),
                discount: '15%'
              }))}`}
            >
              {translate('bookNowBtn')}
            </Link>
          ) : (
            <span>ZAKAŽITE</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CouplesMassageCard;