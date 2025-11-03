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

  const handleMassageSelect = (e, person) => {
    const value = e.target.value;
    if (!value) return;

    const [key, name, price, dur] = value.split('|');
    
    if (person === 1) {
      setCouplesSelections(prev => ({
        ...prev,
        massage1: { key, name, duration: dur, price: parseFloat(price) }
      }));
    } else if (person === 2) {
      setCouplesSelections(prev => ({
        ...prev,
        massage2: { key, name, duration: dur, price: parseFloat(price) }
      }));
    }
  };

  const isSelectionComplete = couplesSelections.massage1 && couplesSelections.massage2;
  
  // Check if person selected 60 min massage in 120 min mode
  const person1Selected60In120 = couplesSelections.duration === '120' && 
    couplesSelections.massage1 && 
    couplesSelections.massage1.duration === '60';
    
  const person2Selected60In120 = couplesSelections.duration === '120' && 
    couplesSelections.massage2 && 
    couplesSelections.massage2.duration === '60';

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
        {/* First person dropdown */}
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
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={couplesSelections.massage1 ? `${couplesSelections.massage1.key}|${couplesSelections.massage1.name}|${couplesSelections.massage1.price}|${couplesSelections.massage1.duration}` : ''}
              onChange={(e) => handleMassageSelect(e, 1)}
              style={{
                width: 'calc(100% - 90px)',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                color: '#d4af37',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Izaberite masažu --</option>
              {getFilteredMassages().map(massage => {
                if (couplesSelections.duration === '120') {
                  if (massage.durations.includes('120')) {
                    return (
                      <option 
                        key={`${massage.key}-120-p1`} 
                        value={`${massage.key}|${massage.name}|${massage.basePrice}|120`}
                      >
                        {massage.name} - 120 min
                      </option>
                    );
                  }
                  if (massage.durations.includes('60')) {
                    return (
                      <option 
                        key={`${massage.key}-60-p1`} 
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
                    <option 
                      key={`${massage.key}-${dur}-p1`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|${dur}`}
                    >
                      {massage.name} - {dur} min
                    </option>
                  );
                }
                return null;
              })}
            </select>
            
            <button
              onClick={() => setCouplesSelections(prev => ({ ...prev, massage1: null }))}
              disabled={!couplesSelections.massage1}
              style={{
                width: '80px',
                padding: '0.5rem',
                backgroundColor: couplesSelections.massage1 ? '#d4af37' : '#444',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: couplesSelections.massage1 ? 'pointer' : 'not-allowed',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                transition: 'all 0.3s ease',
                opacity: couplesSelections.massage1 ? 1 : 0.5
              }}
            >
              <X className="w-3 h-3" />
              Otkaži
            </button>
          </div>
          
          {/* Green message box for 60 min selection in 120 min mode */}
          {person1Selected60In120 && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(144, 238, 144, 0.15)',
              border: '1px solid #90ee90',
              borderRadius: '8px',
              color: '#90ee90',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              ✓ Imate pravo da izaberete još jednu masažu od 60 minuta
            </div>
          )}
        </div>

        {/* Second person dropdown */}
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
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={couplesSelections.massage2 ? `${couplesSelections.massage2.key}|${couplesSelections.massage2.name}|${couplesSelections.massage2.price}|${couplesSelections.massage2.duration}` : ''}
              onChange={(e) => handleMassageSelect(e, 2)}
              style={{
                width: 'calc(100% - 90px)',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                color: '#d4af37',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Izaberite masažu --</option>
              {getFilteredMassages().map(massage => {
                if (couplesSelections.duration === '120') {
                  if (massage.durations.includes('120')) {
                    return (
                      <option 
                        key={`${massage.key}-120-p2`} 
                        value={`${massage.key}|${massage.name}|${massage.basePrice}|120`}
                      >
                        {massage.name} - 120 min
                      </option>
                    );
                  }
                  if (massage.durations.includes('60')) {
                    return (
                      <option 
                        key={`${massage.key}-60-p2`} 
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
                    <option 
                      key={`${massage.key}-${dur}-p2`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|${dur}`}
                    >
                      {massage.name} - {dur} min
                    </option>
                  );
                }
                return null;
              })}
            </select>
            
            <button
              onClick={() => setCouplesSelections(prev => ({ ...prev, massage2: null }))}
              disabled={!couplesSelections.massage2}
              style={{
                width: '80px',
                padding: '0.5rem',
                backgroundColor: couplesSelections.massage2 ? '#d4af37' : '#444',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: couplesSelections.massage2 ? 'pointer' : 'not-allowed',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                transition: 'all 0.3s ease',
                opacity: couplesSelections.massage2 ? 1 : 0.5
              }}
            >
              <X className="w-3 h-3" />
              Otkaži
            </button>
          </div>
          
          {/* Green message box for 60 min selection in 120 min mode */}
          {person2Selected60In120 && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(144, 238, 144, 0.15)',
              border: '1px solid #90ee90',
              borderRadius: '8px',
              color: '#90ee90',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              ✓ Imate pravo da izaberete još jednu masažu od 60 minuta
            </div>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Price display with NEW uploaded logo - BIGGER */}
        {isSelectionComplete && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
            paddingRight: '0.5rem'
          }}>
            {/* NEW uploaded discount logo - MUCH BIGGER */}
            <img 
              src="https://customer-assets.emergentagent.com/job_thaispa-booking/artifacts/hikv7loi_-15%25%20treca%20fotka.png" 
              alt="-15%"
              style={{
                width: '140px',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            
            {/* BIGGER price */}
            <div style={{
              color: '#d4af37',
              fontWeight: 'bold',
              fontSize: '2.8rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '1px'
            }}>
              {Math.round(calculateCouplesPrice()).toLocaleString()} RSD
            </div>
          </div>
        )}

        {/* Book button at bottom */}
        <Button 
          className="book-button w-full"
          style={{
            opacity: isSelectionComplete ? 1 : 0.5,
            cursor: isSelectionComplete ? 'pointer' : 'not-allowed'
          }}
          disabled={!isSelectionComplete}
          asChild={isSelectionComplete}
        >
          {isSelectionComplete ? (
            <Link to={`/contact?service=couples&massage1=${couplesSelections.massage1?.key}&massage2=${couplesSelections.massage2?.key || ''}`}>
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