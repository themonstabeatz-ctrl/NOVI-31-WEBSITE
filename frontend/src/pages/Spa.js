import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Sparkles } from "lucide-react";

// SPA ZONES - extraPrice will be updated later
const SPA_ZONES = [
  { id: "SAUNA",   label: "Sauna",          extraMinutes: 30, extraPrice: 0 },
  { id: "STEAM",   label: "Parno kupatilo", extraMinutes: 30, extraPrice: 0 },
  { id: "JACUZZI", label: "Jacuzzi",        extraMinutes: 30, extraPrice: 0 }
];

// SPA PACKAGES - Minutes and prices from provided documentation
// TODO: Update these values with exact numbers from your document/photos
const SPA_PACKAGES = [
  {
    id: "SPA1",
    name: "Silky Body Ritual",
    description: "Kompletna nega tela sa piling-om, zavojem i aromaterapijom",
    included: [
      "Body scrub – 30 min",
      "Body wrap – 30 min",
      "Aroma masaža – 60 min"
    ],
    variants: [
      {
        id: "SPA1_BASE",
        label: "Bez masaže lica",
        totalMinutes: 120,
        basePrice: 7800  // TODO: Update from your document
      },
      {
        id: "SPA1_WITH_FACE",
        label: "Sa masažom lica",
        totalMinutes: 150,
        basePrice: 12200  // TODO: Update from your document
      }
    ]
  },
  {
    id: "SPA2",
    name: "Deep Renewal Ritual",
    description: "Intenzivan tretman za dubinsku regeneraciju kože",
    included: [
      "Body scrub – 60 min",
      "Body wrap – 60 min",
      "Aroma masaža – 60 min"
    ],
    variants: [
      {
        id: "SPA2_BASE",
        label: "Bez masaže lica",
        totalMinutes: 180,
        basePrice: 10400  // TODO: Update from your document
      },
      {
        id: "SPA2_WITH_FACE",
        label: "Sa masažom lica",
        totalMinutes: 180,
        basePrice: 13400  // TODO: Update from your document
      }
    ]
  },
  {
    id: "SPA3",
    name: "Royal Glow Ritual",
    description: "Kraljevski tretman za savršenu kožu i opuštanje",
    included: [
      "Body scrub – 60 min",
      "Body wrap – 60 min",
      "Aroma masaža – 90 min"
    ],
    variants: [
      {
        id: "SPA3_BASE",
        label: "Bez masaže lica",
        totalMinutes: 210,
        basePrice: 11600  // TODO: Update from your document
      },
      {
        id: "SPA3_WITH_FACE",
        label: "Sa masažom lica",
        totalMinutes: 210,
        basePrice: 14600  // TODO: Update from your document
      }
    ]
  }
];

const Spa = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // State for selected variant per package (default: first variant)
  const [selectedVariantByPackage, setSelectedVariantByPackage] = useState(() => {
    const initial = {};
    SPA_PACKAGES.forEach(pkg => {
      initial[pkg.id] = pkg.variants[0].id; // Default to first variant
    });
    return initial;
  });

  // State for selected SPA zone per package (default: first zone)
  const [selectedZoneByPackage, setSelectedZoneByPackage] = useState(() => {
    const initial = {};
    SPA_PACKAGES.forEach(pkg => {
      initial[pkg.id] = SPA_ZONES[0].id; // Default to first zone
    });
    return initial;
  });

  // Handle variant selection (radio button)
  const handleVariantSelect = (pkgId, variantId) => {
    setSelectedVariantByPackage(prev => ({
      ...prev,
      [pkgId]: variantId
    }));
  };

  // Handle SPA zone selection (dropdown)
  const handleZoneSelect = (pkgId, zoneId) => {
    setSelectedZoneByPackage(prev => ({
      ...prev,
      [pkgId]: zoneId
    }));
  };

  // Handle booking button click
  const handleSpaBookClick = (pkg) => {
    const selectedVariantId = selectedVariantByPackage[pkg.id] || pkg.variants[0].id;
    const selectedVariant = pkg.variants.find(v => v.id === selectedVariantId);

    const selectedZoneId = selectedZoneByPackage[pkg.id] || SPA_ZONES[0].id;
    const selectedZone = SPA_ZONES.find(z => z.id === selectedZoneId);

    const basePrice = selectedVariant.basePrice;
    const zoneExtra = selectedZone.extraPrice;
    const totalPrice = basePrice + zoneExtra;

    const totalMinutes = selectedVariant.totalMinutes + (selectedZone.extraMinutes || 0);

    const params = new URLSearchParams({
      source: "spa",
      spaPackageId: pkg.id,
      spaPackageName: pkg.name,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.label,
      spaZoneId: selectedZone.id,
      spaZoneLabel: selectedZone.label,
      totalMinutes: String(totalMinutes),
      totalPrice: String(totalPrice)
    });

    console.log("📍 SPA booking redirect params:", Object.fromEntries(params));

    navigate(`/contact?${params.toString()}`);
  };

  // Calculate totals for display
  const calculateTotals = (pkg) => {
    const selectedVariantId = selectedVariantByPackage[pkg.id] || pkg.variants[0].id;
    const selectedVariant = pkg.variants.find(v => v.id === selectedVariantId);

    const selectedZoneId = selectedZoneByPackage[pkg.id] || SPA_ZONES[0].id;
    const selectedZone = SPA_ZONES.find(z => z.id === selectedZoneId);

    const basePrice = selectedVariant.basePrice;
    const zoneExtra = selectedZone.extraPrice;
    const totalPrice = basePrice + zoneExtra;

    const totalMinutes = selectedVariant.totalMinutes + (selectedZone.extraMinutes || 0);

    return { totalPrice, totalMinutes, selectedVariant, selectedZone };
  };

  return (
    <div className="spa-page" style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <Helmet>
        <title>SPA Paketi - Bua Luang Thai Spa</title>
        <meta name="description" content="Ekskluzivni SPA tretmani sa body scrub, body wrap i aromaterapijom" />
      </Helmet>

      {/* Hero Section */}
      <section className="spa-hero" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#f5f2e8'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '1rem',
            color: '#d4af37',
            fontWeight: 'bold'
          }}>
            SPA Paketi
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#f5f2e8',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Kompletna nega tela sa piling-om, zavojem i aromaterapijom
          </p>
        </div>
      </section>

      {/* SPA Packages Grid */}
      <section style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {SPA_PACKAGES.map((pkg) => {
            const { totalPrice, totalMinutes, selectedVariant, selectedZone } = calculateTotals(pkg);
            const selectedVariantId = selectedVariantByPackage[pkg.id];
            const selectedZoneId = selectedZoneByPackage[pkg.id];

            return (
              <Card key={pkg.id} style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <CardContent style={{ padding: '2rem' }}>
                  {/* Package Name */}
                  <h3 style={{
                    fontSize: '1.5rem',
                    color: '#d4af37',
                    marginBottom: '1rem',
                    fontWeight: 'bold'
                  }}>
                    {pkg.name}
                  </h3>

                  {/* Duration and Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#d4af37" />
                      <span style={{ color: '#f5f2e8', fontSize: '1rem' }}>
                        {totalMinutes} min
                      </span>
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#d4af37'
                    }}>
                      {totalPrice.toLocaleString('sr-RS')} RSD
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#c0baa8',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                  }}>
                    {pkg.description}
                  </p>

                  {/* Included Services */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '1rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Uključeno:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {pkg.included.map((item, idx) => (
                        <li key={idx} style={{
                          color: '#f5f2e8',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                          paddingLeft: '1.5rem',
                          position: 'relative'
                        }}>
                          <Sparkles size={14} color="#d4af37" style={{
                            position: 'absolute',
                            left: 0,
                            top: '2px'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Variant Selection (Radio Buttons) */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      color: '#d4af37',
                      fontSize: '0.9rem',
                      marginBottom: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Izaberite varijantu:
                    </h4>
                    {pkg.variants.map((variant) => (
                      <label key={variant.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        color: '#f5f2e8',
                        fontSize: '0.9rem'
                      }}>
                        <input
                          type="radio"
                          name={`variant-${pkg.id}`}
                          value={variant.id}
                          checked={selectedVariantId === variant.id}
                          onChange={() => handleVariantSelect(pkg.id, variant.id)}
                          style={{
                            accentColor: '#d4af37',
                            cursor: 'pointer'
                          }}
                        />
                        <span>
                          {variant.label}
                          {variant.id.includes('WITH_FACE') && (
                            <span style={{ color: '#d4af37', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                              (+30 min / +{(variant.basePrice - pkg.variants[0].basePrice).toLocaleString('sr-RS')} RSD)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* SPA Zone Dropdown */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor={`zone-${pkg.id}`} style={{
                      display: 'block',
                      color: '#d4af37',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Izaberite SPA zonu:
                    </label>
                    <select
                      id={`zone-${pkg.id}`}
                      value={selectedZoneId}
                      onChange={(e) => handleZoneSelect(pkg.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '8px',
                        color: '#f5f2e8',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d4af37';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      }}
                    >
                      {SPA_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id} style={{ background: '#1a1a1a' }}>
                          {zone.label} (+{zone.extraMinutes} min, +{zone.extraPrice} RSD)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Summary */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{
                      color: '#f5f2e8',
                      fontSize: '0.9rem',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      <strong style={{ color: '#d4af37' }}>Ukupno trajanje:</strong> {totalMinutes} min<br />
                      <strong style={{ color: '#d4af37' }}>Ukupna cena:</strong> {totalPrice.toLocaleString('sr-RS')} RSD
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleSpaBookClick(pkg)}
                    disabled={!selectedZoneId}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: selectedZoneId ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : '#666',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#1a1a1a',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: selectedZoneId ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      opacity: selectedZoneId ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (selectedZoneId) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Zakažite
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Spa;
