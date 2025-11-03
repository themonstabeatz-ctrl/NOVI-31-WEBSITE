import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";
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
  
  // ALL available massages (excluding SPA) with CORRECT durations
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

  const getFilteredMassages = (specificDuration = null) => {
    const duration = specificDuration || couplesSelections.duration;
    
    if (duration === '120') {
      // For 120 min mode, show ALL massages (60 and 120)
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

  // Get only 60 min massages for second dropdown in 120 min mode
  const get60MinMassages = () => {
    return availableMassages.filter(m => m.durations.includes('60'));
  };

  const handleMassageSelect = (e, person, slot) => {
    const value = e.target.value;
    if (!value) return;

    const [key, name, price, dur] = value.split('|');
    const massageData = { key, name, duration: dur, price: parseFloat(price) };
    
    if (person === 1 && slot === 1) {
      setCouplesSelections(prev => ({ ...prev, person1Massage1: massageData }));
    } else if (person === 1 && slot === 2) {
      setCouplesSelections(prev => ({ ...prev, person1Massage2: massageData }));
    } else if (person === 2 && slot === 1) {
      setCouplesSelections(prev => ({ ...prev, person2Massage1: massageData }));
    } else if (person === 2 && slot === 2) {
      setCouplesSelections(prev => ({ ...prev, person2Massage2: massageData }));
    }
  };

  const cancelMassage = (person, slot) => {
    if (person === 1 && slot === 1) {
      setCouplesSelections(prev => ({ ...prev, person1Massage1: null }));
    } else if (person === 1 && slot === 2) {
      setCouplesSelections(prev => ({ ...prev, person1Massage2: null }));
    } else if (person === 2 && slot === 1) {
      setCouplesSelections(prev => ({ ...prev, person2Massage1: null }));
    } else if (person === 2 && slot === 2) {
      setCouplesSelections(prev => ({ ...prev, person2Massage2: null }));
    }
  };

  // Check if selection is complete
  const isSelectionComplete = () => {
    if (couplesSelections.duration === '120') {
      // For 120 min: both persons need at least first massage
      return couplesSelections.person1Massage1 && couplesSelections.person2Massage1;
    } else {
      // For 60 or 90 min: both persons need exactly one massage
      return couplesSelections.person1Massage1 && couplesSelections.person2Massage1;
    }
  };
  
  // Check if person selected 60 min in first slot (120 min mode)
  const person1NeedsSecond = couplesSelections.duration === '120' && 
    couplesSelections.person1Massage1 && 
    couplesSelections.person1Massage1.duration === '60';
    
  const person2NeedsSecond = couplesSelections.duration === '120' && 
    couplesSelections.person2Massage1 && 
    couplesSelections.person2Massage1.duration === '60';

  const is120Mode = couplesSelections.duration === '120';

  return (
    <Card className="massage-card" style={{ position: 'relative', minHeight: is120Mode ? '680px' : '540px', display: 'flex', flexDirection: 'column' }}>
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
        {/* PERSON 1 SECTION */}
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h4 style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Osoba 1</h4>
          
          {/* First dropdown for Person 1 */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#d4af37', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {is120Mode ? 'Prva masaža' : 'Izaberite masažu'}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={couplesSelections.person1Massage1 ? `${couplesSelections.person1Massage1.key}|${couplesSelections.person1Massage1.name}|${couplesSelections.person1Massage1.price}|${couplesSelections.person1Massage1.duration}` : ''}
                onChange={(e) => handleMassageSelect(e, 1, 1)}
                style={{
                  width: 'calc(100% - 90px)',
                  padding: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#d4af37',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Izaberite --</option>
                {getFilteredMassages().map(massage => {
                  if (is120Mode) {
                    if (massage.durations.includes('120')) {
                      return (
                        <option key={`${massage.key}-120-p1s1`} value={`${massage.key}|${massage.name}|${massage.basePrice}|120`}>
                          {massage.name} - 120 min
                        </option>
                      );
                    }
                    if (massage.durations.includes('60')) {
                      return (
                        <option 
                          key={`${massage.key}-60-p1s1`} 
                          value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                          style={{ backgroundColor: '#2d4a2b', color: '#90ee90' }}
                        >
                          ★ {massage.name} - 60 min
                        </option>
                      );
                    }
                  } else {
                    const dur = couplesSelections.duration;
                    if (!massage.durations.includes(dur)) return null;
                    return (
                      <option key={`${massage.key}-${dur}-p1s1`} value={`${massage.key}|${massage.name}|${massage.basePrice}|${dur}`}>
                        {massage.name} - {dur} min
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
              
              <button
                onClick={() => cancelMassage(1, 1)}
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
            
            {/* Green message for 60 min selection */}
            {person1NeedsSecond && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(144, 238, 144, 0.15)',
                border: '1px solid #90ee90',
                borderRadius: '8px',
                color: '#90ee90',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                ✓ Imate pravo da izaberete još jednu masažu od 60 minuta
              </div>
            )}
          </div>
          
          {/* Second dropdown for Person 1 (ONLY in 120 min mode and if first is 60 min) */}
          {person1NeedsSecond && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#d4af37', 
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Druga masaža (60 min)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={couplesSelections.person1Massage2 ? `${couplesSelections.person1Massage2.key}|${couplesSelections.person1Massage2.name}|${couplesSelections.person1Massage2.price}|${couplesSelections.person1Massage2.duration}` : ''}
                  onChange={(e) => handleMassageSelect(e, 1, 2)}
                  style={{
                    width: 'calc(100% - 90px)',
                    padding: '0.5rem',
                    backgroundColor: '#1a1a1a',
                    color: '#d4af37',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Izaberite --</option>
                  {get60MinMassages().map(massage => (
                    <option 
                      key={`${massage.key}-60-p1s2`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                      style={{ backgroundColor: '#2d4a2b', color: '#90ee90' }}
                    >
                      ★ {massage.name} - 60 min
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => cancelMassage(1, 2)}
                  disabled={!couplesSelections.person1Massage2}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    backgroundColor: couplesSelections.person1Massage2 ? '#d4af37' : '#444',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: couplesSelections.person1Massage2 ? 'pointer' : 'not-allowed',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    opacity: couplesSelections.person1Massage2 ? 1 : 0.5
                  }}
                >
                  <X className="w-3 h-3" />
                  Otkaži
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PERSON 2 SECTION */}
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h4 style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Osoba 2</h4>
          
          {/* First dropdown for Person 2 */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#d4af37', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {is120Mode ? 'Prva masaža' : 'Izaberite masažu'}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={couplesSelections.person2Massage1 ? `${couplesSelections.person2Massage1.key}|${couplesSelections.person2Massage1.name}|${couplesSelections.person2Massage1.price}|${couplesSelections.person2Massage1.duration}` : ''}
                onChange={(e) => handleMassageSelect(e, 2, 1)}
                style={{
                  width: 'calc(100% - 90px)',
                  padding: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#d4af37',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Izaberite --</option>
                {getFilteredMassages().map(massage => {
                  if (is120Mode) {
                    if (massage.durations.includes('120')) {
                      return (
                        <option key={`${massage.key}-120-p2s1`} value={`${massage.key}|${massage.name}|${massage.basePrice}|120`}>
                          {massage.name} - 120 min
                        </option>
                      );
                    }
                    if (massage.durations.includes('60')) {
                      return (
                        <option 
                          key={`${massage.key}-60-p2s1`} 
                          value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                          style={{ backgroundColor: '#2d4a2b', color: '#90ee90' }}
                        >
                          ★ {massage.name} - 60 min
                        </option>
                      );
                    }
                  } else {
                    const dur = couplesSelections.duration;
                    if (!massage.durations.includes(dur)) return null;
                    return (
                      <option key={`${massage.key}-${dur}-p2s1`} value={`${massage.key}|${massage.name}|${massage.basePrice}|${dur}`}>
                        {massage.name} - {dur} min
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
              
              <button
                onClick={() => cancelMassage(2, 1)}
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
            
            {/* Green message for 60 min selection */}
            {person2NeedsSecond && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(144, 238, 144, 0.15)',
                border: '1px solid #90ee90',
                borderRadius: '8px',
                color: '#90ee90',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                ✓ Imate pravo da izaberete još jednu masažu od 60 minuta
              </div>
            )}
          </div>
          
          {/* Second dropdown for Person 2 (ONLY in 120 min mode and if first is 60 min) */}
          {person2NeedsSecond && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#d4af37', 
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Druga masaža (60 min)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={couplesSelections.person2Massage2 ? `${couplesSelections.person2Massage2.key}|${couplesSelections.person2Massage2.name}|${couplesSelections.person2Massage2.price}|${couplesSelections.person2Massage2.duration}` : ''}
                  onChange={(e) => handleMassageSelect(e, 2, 2)}
                  style={{
                    width: 'calc(100% - 90px)',
                    padding: '0.5rem',
                    backgroundColor: '#1a1a1a',
                    color: '#d4af37',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Izaberite --</option>
                  {get60MinMassages().map(massage => (
                    <option 
                      key={`${massage.key}-60-p2s2`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                      style={{ backgroundColor: '#2d4a2b', color: '#90ee90' }}
                    >
                      ★ {massage.name} - 60 min
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => cancelMassage(2, 2)}
                  disabled={!couplesSelections.person2Massage2}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    backgroundColor: couplesSelections.person2Massage2 ? '#d4af37' : '#444',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: couplesSelections.person2Massage2 ? 'pointer' : 'not-allowed',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    opacity: couplesSelections.person2Massage2 ? 1 : 0.5
                  }}
                >
                  <X className="w-3 h-3" />
                  Otkaži
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Price display - SMALLER so RSD is on same line */}
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
              style={{
                width: '140px',
                height: 'auto',
                objectFit: 'contain'
              }}
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

        {/* Book button */}
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