import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock } from "lucide-react";

const CouplesMassageCard = ({ 
  translate, 
  durations, 
  updateDuration
}) => {
  
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
          <div className="price">TESTING</div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p style={{ color: '#d4af37' }}>Test Couples Massage Card - Rendering OK!</p>
      </CardContent>
    </Card>
  );
};

export default CouplesMassageCard;
