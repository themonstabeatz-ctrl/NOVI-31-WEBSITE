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
    { key: 'royal', name: translate("royalMassage") || 'Glava, vrat, ramena i leđa', basePrice: 2400, durations: ['30', '45', '60'] }, // Special durations
    { key: 'foot', name: translate("footMassage") || 'Masaža stopala', basePrice: 2400, durations: ['30', '45', '60'] }, // Special durations
    { key: 'couple', name: translate("coupleMassage") || 'Aroma duboko tkivo', basePrice: 4900, durations: ['60', '90'] },
    { key: 'shiatsu', name: translate("shiatsuMassage") || 'Shiatsu masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'reflexology', name: translate("reflexology") || 'Refleksologija', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'backShoulder', name: translate("backShoulderMassage") || 'Masaža leđa i vrata', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'antiStress', name: translate("antiStressMassage") || 'Antistres masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'prenatal', name: translate("prenatalMassage") || 'Prenatalna masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'deepTissue', name: translate("deepTissueMassage") || 'Masaža dubokih tkiva', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'bamboo', name: translate("bambooMassage") || 'Bamboo masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'lymphatic', name: translate("lymphaticDrainage") || 'Limfna drenaža', basePrice: 3000, durations: ['60', '90', '120'] }
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

  const handleMassageSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    const [key, name, price, dur] = value.split('|');
    
    if (!couplesSelections.massage1) {
      // First massage selection
      setCouplesSelections(prev => ({
        ...prev,
        massage1: { key, name, duration: dur, price: parseFloat(price) }
      }));
    } else if (couplesSelections.duration === '120' && dur === '60' && !couplesSelections.massage2) {
      // Second massage selection (only for 120 min with 60 min first choice)
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

  const showSecondDropdown = couplesSelections.duration === '120' && 
    couplesSelections.massage1 && 
    couplesSelections.massage1.duration === '60' && 
    !couplesSelections.massage2;

  const isSelectionComplete = couplesSelections.massage1 && 
    (couplesSelections.duration !== '120' || 
     couplesSelections.massage1.duration === '120' || 
     couplesSelections.massage2);

  return (
    <Card className="massage-card" style={{ position: 'relative', minHeight: '500px' }}>
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
        {/* First massage dropdown */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            color: '#d4af37', 
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {translate("selectFirstMassage")}
          </label>
          <select
            value={couplesSelections.massage1 ? `${couplesSelections.massage1.key}|${couplesSelections.massage1.name}|${couplesSelections.massage1.price}|${couplesSelections.massage1.duration}` : ''}
            onChange={handleMassageSelect}
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
            <option value="">-- {translate("selectFirstMassage") || 'Izaberite masažu'} --</option>
            {getFilteredMassages().map(massage => {
              // For 120 min duration, show both 60 and 120 options
              if (couplesSelections.duration === '120') {
                // Show 120 min version if available
                if (massage.durations.includes('120')) {
                  return (
                    <option 
                      key={`${massage.key}-120`} 
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
                      key={`${massage.key}-60`} 
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
                    key={`${massage.key}-${dur}`} 
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

        {/* Second massage dropdown (only for 120 min with 60 min first selection) */}
        {showSecondDropdown && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#d4af37', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {translate("selectSecondMassage")}
            </label>
            <select
              value={couplesSelections.massage2 ? `${couplesSelections.massage2.key}|${couplesSelections.massage2.name}|${couplesSelections.massage2.price}|${couplesSelections.massage2.duration}` : ''}
              onChange={handleMassageSelect}
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
              <option value="">-- {translate("selectSecondMassage") || 'Izaberite drugu masažu'} --</option>
              {availableMassages.filter(m => m.durations.includes('60')).map(massage => (
                <option 
                  key={`${massage.key}-60-2`} 
                  value={`${massage.key}|${massage.name}|${massage.basePrice}|60`}
                >
                  {massage.name} - 60 min
                </option>
              ))}
            </select>
          </div>
        )}

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

        {/* Price display at bottom right corner with discount badge */}
        {isSelectionComplete && (
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {/* Discount badge on the left */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <Star className="w-5 h-5" style={{ fill: 'white', marginRight: '0.25rem' }} />
              -15%
            </div>
            
            {/* Price on the right */}
            <div style={{
              color: '#d4af37',
              fontWeight: 'bold',
              fontSize: '1.8rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
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