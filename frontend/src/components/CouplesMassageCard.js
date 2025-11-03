import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, X } from "lucide-react";

const CouplesMassageCard = ({ 
  translate, 
  durations, 
  updateDuration, 
  couplesSelections, 
  setCouplesSelections,
  calculateCouplesPrice 
}) => {
  
  const availableMassages = [
    { key: 'traditional', name: 'Tradicionalna tajlandska masaža', basePrice: 4400, durations: ['60', '90', '120'] },
    { key: 'aroma', name: 'Aroma terapija', basePrice: 4400, durations: ['60', '90', '120'] },
    { key: 'hotStone', name: 'Masaža toplim uljem', basePrice: 4600, durations: ['60', '90'] },
    { key: 'royal', name: 'Glava, vrat, ramena i leđa', basePrice: 2400, durations: ['60', '90', '120'] },
    { key: 'foot', name: 'Masaža stopala', basePrice: 2400, durations: ['60', '90', '120'] },
    { key: 'couple', name: 'Aroma duboko tkivo', basePrice: 4900, durations: ['60', '90'] },
    { key: 'shiatsu', name: 'Shiatsu masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'reflexology', name: 'Refleksologija', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'backShoulder', name: 'Masaža leđa i vrata', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'antiStress', name: 'Antistres masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'prenatal', name: 'Prenatalna masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'deepTissue', name: 'Masaža dubokih tkiva', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'bamboo', name: 'Bamboo masaža', basePrice: 3000, durations: ['60', '90', '120'] },
    { key: 'lymphatic', name: 'Limfna drenaža', basePrice: 3000, durations: ['60', '90', '120'] }
  ];

  const getFilteredMassages = () => {
    const duration = couplesSelections.duration;
    
    if (duration === '120') {
      // For 120 min, show 60 and 120 min massages
      return availableMassages.filter(m => 
        m.durations.includes('60') || m.durations.includes('120')
      );
    } else {
      // For 60 or 90, show only that duration
      return availableMassages.filter(m => m.durations.includes(duration));
    }
  };

  const handleMassageSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    const [key, name, price, dur] = value.split('|');
    
    if (!couplesSelections.massage1) {
      setCouplesSelections(prev => ({
        ...prev,
        massage1: { key, name, duration: dur, price: parseFloat(price) }
      }));
    } else if (couplesSelections.duration === '120' && dur === '60' && !couplesSelections.massage2) {
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
    <Card className="massage-card">
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
          <div className="price">
            {isSelectionComplete ? `${Math.round(calculateCouplesPrice()).toLocaleString()} RSD` : '-'}
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
            fontSize: '0.9rem'
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
              fontSize: '0.875rem'
            }}
          >
            <option value="">-- Izaberite masažu --</option>
            {getFilteredMassages().map(massage => {
              const dur = couplesSelections.duration === '120' && massage.durations.includes('120') 
                ? '120' 
                : couplesSelections.duration;
              return (
                <option 
                  key={`${massage.key}-${dur}`} 
                  value={`${massage.key}|${massage.name}|${massage.basePrice}|${dur}`}
                >
                  {massage.name} - {dur} min
                </option>
              );
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
              fontSize: '0.9rem'
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
                fontSize: '0.875rem'
              }}
            >
              <option value="">-- Izaberite drugu masažu --</option>
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

        {/* Selected massages display */}
        {couplesSelections.massage1 && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            borderRadius: '8px',
            border: '1px solid #d4af37'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {translate("selectedMassages")}
              </span>
              <button
                onClick={cancelSelection}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#8b0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <X className="w-3 h-3" />
                {translate("cancel")}
              </button>
            </div>
            <div style={{ color: '#d4af37', fontSize: '0.85rem' }}>
              1. {couplesSelections.massage1.name} ({couplesSelections.massage1.duration} min)
            </div>
            {couplesSelections.massage2 && (
              <div style={{ color: '#d4af37', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                2. {couplesSelections.massage2.name} ({couplesSelections.massage2.duration} min)
              </div>
            )}
            {isSelectionComplete && (
              <div style={{ 
                color: '#d4af37', 
                fontWeight: 'bold', 
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #d4af37',
                fontSize: '0.9rem'
              }}>
                {translate("totalPrice")} {Math.round(calculateCouplesPrice()).toLocaleString()} RSD
              </div>
            )}
          </div>
        )}

        <button
          className="massage-button"
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: isSelectionComplete ? '#d4af37' : '#666',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
            cursor: isSelectionComplete ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            opacity: isSelectionComplete ? 1 : 0.5
          }}
          disabled={!isSelectionComplete}
          onClick={() => {
            if (isSelectionComplete) {
              // Navigate to booking with couples massage data
              window.location.href = '/contact?service=couples';
            }
          }}
        >
          {translate("reserve")}
        </button>
      </CardContent>
    </Card>
  );
};

export default CouplesMassageCard;
