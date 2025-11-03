import React, { useState } from 'react';
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
  calculateCouplesPrice
}) => {
  
  // ALL available massages (excluding SPA)
  const availableMassages = [
    { key: 'traditional', name: translate("traditionalMassage") || 'Tradicionalna tajlandska masaža', basePrice: 4400, durations: ['60', '90', '120'] },
    { key: 'aroma', name: translate("aromaTherapy") || 'Aroma terapija', basePrice: 4400, durations: ['60', '90', '120'] },
    { key: 'hotStone', name: translate("hotStoneMassage") || 'Masaža toplim uljem', basePrice: 4600, durations: ['60', '90'] },
    { key: 'royal', name: translate("royalMassage") || 'Glava, vrat, ramena i leđa', basePrice: 2400, durations: ['30', '45', '60'] },
    { key: 'foot', name: translate("footMassage") || 'Masaža stopala', basePrice: 2400, durations: ['30', '45', '60'] },
    { key: 'couple', name: translate("coupleMassage") || 'Aroma duboko tkivo', basePrice: 4900, durations: ['60', '90'] },
    { key: 'shiatsu', name: translate("shiatsuMassage") || 'Shiatsu masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'reflexology', name: translate("reflexology") || 'Refleksologija', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'backShoulder', name: translate("backShoulderMassage") || 'Masaža leđa i vrata', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'antiStress', name: translate("antiStressMassage") || 'Antistres masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'prenatal', name: translate("prenatalMassage") || 'Prenatalna masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'deepTissue', name: translate("deepTissueMassage") || 'Masaža dubokih tkiva', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'bamboo', name: translate("bambooMassage") || 'Bamboo masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'lymphatic', name: translate("lymphaticDrainage") || 'Limfna drenаža', basePrice: 3000, durations: ['60', '90', '120'] }
  ];

  const [dropdownOpen, setDropdownOpen] = useState({ person1: false, person2: false });

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

  const handleMassageClick = (person, massage, dur) => {
    const massageData = { key: massage.key, name: massage.name, duration: dur, price: massage.basePrice };
    
    if (person === 1) {
      const current1 = couplesSelections.person1Massage1;
      const current2 = couplesSelections.person1Massage2;
      
      // If 120 min mode and clicking 60 min massage
      if (couplesSelections.duration === '120' && dur === '60') {
        // Check if already selected
        if (current1?.key === massage.key && current1?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person1Massage1: null }));
        } else if (current2?.key === massage.key && current2?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person1Massage2: null }));
        } else {
          // Add to first empty slot
          if (!current1) {
            setCouplesSelections(prev => ({ ...prev, person1Massage1: massageData }));
          } else if (!current2) {
            setCouplesSelections(prev => ({ ...prev, person1Massage2: massageData }));
          }
        }
      } else {
        // For 120 min massage or 60/90 mode - single selection, clear ALL other selections
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
      
      if (couplesSelections.duration === '120' && dur === '60') {
        if (current1?.key === massage.key && current1?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person2Massage1: null }));
        } else if (current2?.key === massage.key && current2?.duration === '60') {
          setCouplesSelections(prev => ({ ...prev, person2Massage2: null }));
        } else {
          if (!current1) {
            setCouplesSelections(prev => ({ ...prev, person2Massage1: massageData }));
          } else if (!current2) {
            setCouplesSelections(prev => ({ ...prev, person2Massage2: massageData }));
          }
        }
      } else {
        // For 120 min massage or 60/90 mode - single selection, clear ALL other selections
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
      return '-- Izaberite masažu --';
    } else {
      const m1 = couplesSelections.person2Massage1;
      const m2 = couplesSelections.person2Massage2;
      if (m1 && m2) return `${m1.name.substring(0, 20)}... + ${m2.name.substring(0, 20)}...`;
      if (m1) return m1.name;
      return '-- Izaberite masažu --';
    }
  };

  const clearSelection = (person) => {
    if (person === 1) {
      setCouplesSelections(prev => ({ ...prev, person1Massage1: null, person1Massage2: null }));
    } else {
      setCouplesSelections(prev => ({ ...prev, person2Massage1: null, person2Massage2: null }));
    }
  };

  const isSelectionComplete = () => {
    return couplesSelections.person1Massage1 && couplesSelections.person2Massage1;
  };

  const is120Mode = couplesSelections.duration === '120';

  return (
    <Card className="massage-card" style={{ position: 'relative', minHeight: '540px', display: 'flex', flexDirection: 'column' }}>
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
            Osoba 1 - Izaberite masažu
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
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  marginTop: '0.25rem',
                  zIndex: 1000,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                }}>
                  {getFilteredMassages().map(massage => {
                    if (is120Mode) {
                      return null; // Will render separately below
                    } else {
                      // 60 or 90 mode - single select
                      const dur = couplesSelections.duration;
                      if (!massage.durations.includes(dur)) return null;
                      const selected = isSelected(1, massage.key);
                      return (
                        <div
                          key={`${massage.key}-${dur}`}
                          onClick={() => handleMassageClick(1, massage, dur)}
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
                          {massage.name} - {dur} min
                        </div>
                      );
                    }
                  })}
                  
                  {/* For 120 min mode: Show ALL 60 min first, then ALL 120 min */}
                  {is120Mode && (
                    <>
                      {/* FIRST: All 60 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('60')).map(massage => {
                        const selected = isSelected(1, massage.key);
                        return (
                          <div
                            key={`${massage.key}-60-p1`}
                            onClick={() => handleMassageClick(1, massage, '60')}
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
                            ★ {massage.name} - 60 min
                          </div>
                        );
                      })}
                      
                      {/* SECOND: All 120 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('120')).map(massage => {
                        const selected = isSelected(1, massage.key);
                        return (
                          <div
                            key={`${massage.key}-120-p1`}
                            onClick={() => handleMassageClick(1, massage, '120')}
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
                            {massage.name} - 120 min
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
              Otkaži
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
            Osoba 2 - Izaberite masažu
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
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  marginTop: '0.25rem',
                  zIndex: 1000,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                }}>
                  {getFilteredMassages().map(massage => {
                    if (is120Mode) {
                      return null; // Will render separately below
                    } else {
                      // 60 or 90 mode - single select
                      const dur = couplesSelections.duration;
                      if (!massage.durations.includes(dur)) return null;
                      const selected = isSelected(2, massage.key);
                      return (
                        <div
                          key={`${massage.key}-${dur}`}
                          onClick={() => handleMassageClick(2, massage, dur)}
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
                          {massage.name} - {dur} min
                        </div>
                      );
                    }
                  })}
                  
                  {/* For 120 min mode: Show ALL 60 min first, then ALL 120 min */}
                  {is120Mode && (
                    <>
                      {/* FIRST: All 60 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('60')).map(massage => {
                        const selected = isSelected(2, massage.key);
                        return (
                          <div
                            key={`${massage.key}-60-p2`}
                            onClick={() => handleMassageClick(2, massage, '60')}
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
                            ★ {massage.name} - 60 min
                          </div>
                        );
                      })}
                      
                      {/* SECOND: All 120 min massages */}
                      {getFilteredMassages().filter(m => m.durations.includes('120')).map(massage => {
                        const selected = isSelected(2, massage.key);
                        return (
                          <div
                            key={`${massage.key}-120-p2`}
                            onClick={() => handleMassageClick(2, massage, '120')}
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
                            {massage.name} - 120 min
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
              Otkaži
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Price */}
        {isSelectionComplete() && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
            paddingRight: '0.5rem'
          }}>
            <img 
              src="https://customer-assets.emergentagent.com/job_thaispa-booking/artifacts/hikv7loi_-15%25%20treca%20fotka.png" 
              alt="-15%"
              style={{ width: '140px', height: 'auto', objectFit: 'contain' }}
            />
            
            <div style={{
              color: '#d4af37',
              fontWeight: 'bold',
              fontSize: '2.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '1px',
              whiteSpace: 'nowrap'
            }}>
              {Math.round(calculateCouplesPrice()).toLocaleString()} RSD
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
          asChild={isSelectionComplete()}
        >
          {isSelectionComplete() ? (
            <Link to="/contact?service=couples">
              ZAKAŽITE
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