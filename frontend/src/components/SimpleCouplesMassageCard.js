import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

const SimpleCouplesMassageCard = ({ translate }) => {
  const [selectedDuration, setSelectedDuration] = useState('60');

  // HARD-CODED selections
  const person1Massage = {
    name: 'Tradicionalna tajlandska masaža',
    duration: selectedDuration,
    price: selectedDuration === '60' ? 4400 : selectedDuration === '90' ? 6600 : 8800
  };

  const person2Massage = {
    name: 'Aroma terapija',
    duration: selectedDuration,
    price: selectedDuration === '60' ? 4400 : selectedDuration === '90' ? 6600 : 8800
  };

  // Calculate total price with 15% discount
  const totalOriginalPrice = person1Massage.price + person2Massage.price;
  const totalDiscountedPrice = Math.round(totalOriginalPrice * 0.85);
  const totalDuration = parseInt(selectedDuration) * 2; // Both people get same duration

  const bookingData = {
    duration: selectedDuration,
    totalDuration: totalDuration,
    person1: person1Massage,
    person2: person2Massage,
    totalPrice: totalDiscountedPrice,
    originalPrice: totalOriginalPrice,
    discount: '15%'
  };

  return (
    <Card className="massage-card" style={{ position: 'relative', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <CardTitle className="massage-name" style={{ color: '#d4af37' }}>
          Masaža za parove
        </CardTitle>
        
        {/* Duration buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          {['60', '90', '120'].map(dur => (
            <button
              key={dur}
              onClick={() => setSelectedDuration(dur)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: selectedDuration === dur ? '2px solid #d4af37' : '1px solid #444',
                backgroundColor: selectedDuration === dur ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                color: selectedDuration === dur ? '#d4af37' : '#ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: selectedDuration === dur ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {dur} min
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
        
        {/* Fixed selections display */}
        <div style={{ 
          backgroundColor: 'rgba(212, 175, 55, 0.05)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#d4af37', marginBottom: '0.25rem' }}>
              Osoba 1:
            </div>
            <div style={{ fontSize: '0.95rem', color: '#fff' }}>
              Tradicionalna tajlandska masaža - {selectedDuration} min
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#d4af37', marginBottom: '0.25rem' }}>
              Osoba 2:
            </div>
            <div style={{ fontSize: '0.95rem', color: '#fff' }}>
              Aroma terapija - {selectedDuration} min
            </div>
          </div>
        </div>

        {/* Price display with discount badge */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '10px', zIndex: 10 }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#d4af37',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#000'
            }}>
              -15%
            </div>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#888', textDecoration: 'line-through' }}>
            {totalOriginalPrice.toLocaleString('sr-RS')} RSD
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#d4af37', marginTop: '0.25rem' }}>
            {totalDiscountedPrice.toLocaleString('sr-RS')} RSD
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d4af37', marginTop: '0.25rem' }}>
            Ukupno trajanje: {totalDuration} min
          </div>
        </div>

        {/* Book button */}
        <Button 
          className="book-button w-full"
          style={{
            marginTop: 'auto',
            backgroundColor: '#d4af37',
            color: '#000',
            fontWeight: 'bold',
            padding: '0.75rem',
            fontSize: '1rem'
          }}
          asChild
        >
          <Link to={`/contact?service=${encodeURIComponent(`Masaža za parove - ${totalDuration} min`)}&couplesData=${encodeURIComponent(JSON.stringify(bookingData))}`}>
            ZAKAŽITE
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleCouplesMassageCard;
