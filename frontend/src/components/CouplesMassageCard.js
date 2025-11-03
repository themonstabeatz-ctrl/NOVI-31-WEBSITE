import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, Star } from "lucide-react";
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
  
  // All available massages with CORRECT prices and durations (excluding SPA services)
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
      // For 120 min, show BOTH 60 min AND 120 min massages
      return availableMassages.filter(m => 
        m.durations.includes('60') || m.durations.includes('120')
      );
    } else if (duration === '60') {
      // For 60 min, show only 60 min massages
      return availableMassages.filter(m => m.durations.includes('60'));
    } else if (duration === '90') {
      // For 90 min, show only 90 min massages
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

  const cancelSelection = () => {
    setCouplesSelections(prev => ({
      ...prev,
      massage1: null,
      massage2: null
    }));
  };

  const isSelectionComplete = couplesSelections.massage1 && couplesSelections.massage2;

  return (
    <Card className="massage-card" style={{ position: 'relative', minHeight: '520px' }}>
      <CardHeader>
        <CardTitle className="massage-name">{translate("sportsMassage")}</CardTitle>
        
        {/* Duration selection buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          marginBottom: '0.75rem'
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
        
        <div className="massage-meta">
          <div className="duration">
            <Clock className="w-4 h-4" />
            <span>{durations.sports} min</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* First person dropdown - ALWAYS VISIBLE */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            color: '#d4af37', 
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            Osoba 1 - {translate("selectFirstMassage") || 'Izaberite masažu'}
          </label>
          <select
            value={couplesSelections.massage1 ? `${couplesSelections.massage1.key}|${couplesSelections.massage1.name}|${couplesSelections.massage1.price}|${couplesSelections.massage1.duration}` : ''}
            onChange={(e) => handleMassageSelect(e, 1)}
            style={{
              width: '100%',
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
              // For 120 min duration, show both 60 and 120 options
              if (couplesSelections.duration === '120') {
                // Show 120 min version if available
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
                // Otherwise show 60 min version
                if (massage.durations.includes('60')) {
                  return (
                    <option 
                      key={`${massage.key}-60-p1`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                    >
                      {massage.name} - 60 min
                    </option>
                  );
                }
              } else {
                // For 60 or 90 min, show only that specific duration
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
        </div>

        {/* Second person dropdown - ALWAYS VISIBLE */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            color: '#d4af37', 
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            Osoba 2 - {translate("selectSecondMassage") || 'Izaberite masažu'}
          </label>
          <select
            value={couplesSelections.massage2 ? `${couplesSelections.massage2.key}|${couplesSelections.massage2.name}|${couplesSelections.massage2.price}|${couplesSelections.massage2.duration}` : ''}
            onChange={(e) => handleMassageSelect(e, 2)}
            style={{
              width: '100%',
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
              // For 120 min duration, show both 60 and 120 options
              if (couplesSelections.duration === '120') {
                // Show 120 min version if available
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
                // Otherwise show 60 min version
                if (massage.durations.includes('60')) {
                  return (
                    <option 
                      key={`${massage.key}-60-p2`} 
                      value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                    >
                      {massage.name} - 60 min
                    </option>
                  );
                }
              } else {
                // For 60 or 90 min, show only that specific duration
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
        </div>

        {/* Book button */}
        <Button 
          className="book-button w-full"
          style={{
            marginTop: '1.5rem',
            marginBottom: '1rem',
            opacity: isSelectionComplete ? 1 : 0.5,
            cursor: isSelectionComplete ? 'pointer' : 'not-allowed'
          }}
          disabled={!isSelectionComplete}
          asChild={isSelectionComplete}
        >
          {isSelectionComplete ? (
            <Link to={`/contact?service=couples&massage1=${couplesSelections.massage1?.key}&massage2=${couplesSelections.massage2?.key || ''}`}>
              {translate("reserve") || "REZERVIŠITE"}
            </Link>
          ) : (
            <span>{translate("reserve") || "REZERVIŠITE"}</span>
          )}
        </Button>

        {/* Price display at bottom right corner with HUGE discount badge */}
        {isSelectionComplete && (
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* MASSIVE Discount badge on the left - 200% ENLARGED */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1.25rem 1.75rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              boxShadow: '0 8px 16px rgba(220, 38, 38, 0.6)',
              border: '3px solid #fff'
            }}>
              <Star className="w-10 h-10" style={{ fill: 'white', marginRight: '0.5rem' }} />
              -15%
            </div>
            
            {/* BIG Price on the right - 100% ENLARGED */}
            <div style={{
              color: '#d4af37',
              fontWeight: 'bold',
              fontSize: '3rem',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)',
              letterSpacing: '1px'
            }}>
              {Math.round(calculateCouplesPrice()).toLocaleString()} RSD
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouplesMassageCard;