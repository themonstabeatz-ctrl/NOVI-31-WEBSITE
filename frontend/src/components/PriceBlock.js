/**
 * ✅ SHARED PRICE BLOCK COMPONENT
 * 
 * Правило: Frontend САМО приказује оно што добије од backend-а
 * ❌ Frontend НИКАД не рачуна % нити price*(1-discount)
 * 
 * Очекивана поља из backend-а:
 * - original_price
 * - final_price  
 * - discount_percent
 * - has_discount
 */

import React from 'react';

// ✅ Format RSD - "9.200 RSD"
export function formatRSD(n) {
  const num = Number(n || 0);
  return `${num.toLocaleString("sr-RS")} RSD`;
}

// ✅ PriceBlock - приказује попуст ако постоји
// Користи САМО backend податке, НЕМА калкулација
export function PriceBlock({ 
  original_price, 
  final_price, 
  discount_percent, 
  has_discount,
  style = {},
  showBadge = true,
  size = 'normal' // 'small' | 'normal' | 'large'
}) {
  const original = Number(original_price);
  const final = Number(final_price);

  // ✅ Приказ попуста САМО ако backend каже да постоји
  const showDiscount = Boolean(has_discount) 
    && Number.isFinite(original) 
    && Number.isFinite(final) 
    && final < original;

  // Size styles
  const sizeStyles = {
    small: { original: '0.85rem', final: '1rem', badge: '0.7rem' },
    normal: { original: '0.9rem', final: '1.1rem', badge: '0.75rem' },
    large: { original: '1.1rem', final: '1.5rem', badge: '0.85rem' },
  };
  const sizes = sizeStyles[size] || sizeStyles.normal;

  return (
    <div className="price-block" style={style}>
      {showDiscount ? (
        <>
          {/* Original price (strikethrough) */}
          <div 
            className="original" 
            style={{ 
              textDecoration: "line-through", 
              opacity: 0.6,
              color: '#888',
              fontSize: sizes.original,
              marginBottom: '0.15rem'
            }}
          >
            {formatRSD(original)}
          </div>
          
          {/* Final price (bold) */}
          <div 
            className="final" 
            style={{ 
              fontWeight: 700,
              color: '#d4af37',
              fontSize: sizes.final
            }}
          >
            {formatRSD(final)}
          </div>
          
          {/* Discount badge */}
          {showBadge && discount_percent > 0 && (
            <div 
              className="badge" 
              style={{ 
                fontSize: sizes.badge, 
                opacity: 0.85,
                color: '#4ade80',
                marginTop: '0.15rem'
              }}
            >
              -{Number(discount_percent)}%
            </div>
          )}
        </>
      ) : (
        /* No discount - show original price */
        <div 
          className="final" 
          style={{ 
            fontWeight: 700,
            color: '#d4af37',
            fontSize: sizes.final
          }}
        >
          {formatRSD(original || final)}
        </div>
      )}
    </div>
  );
}

// ✅ Inline PriceBlock за мање просторе (SPA zone итд.)
export function InlinePriceBlock({ 
  original_price, 
  final_price, 
  discount_percent, 
  has_discount,
  prefix = ''
}) {
  const original = Number(original_price);
  const final = Number(final_price);

  const showDiscount = Boolean(has_discount) 
    && Number.isFinite(original) 
    && Number.isFinite(final) 
    && final < original;

  if (showDiscount) {
    return (
      <span style={{ color: '#d4af37' }}>
        {prefix}
        <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '0.5rem' }}>
          {formatRSD(original)}
        </span>
        <span style={{ fontWeight: 600 }}>
          {formatRSD(final)}
        </span>
        <span style={{ fontSize: '0.8em', color: '#4ade80', marginLeft: '0.25rem' }}>
          (-{discount_percent}%)
        </span>
      </span>
    );
  }

  return (
    <span style={{ color: '#d4af37', fontWeight: 600 }}>
      {prefix}{formatRSD(original || final)}
    </span>
  );
}

export default PriceBlock;
