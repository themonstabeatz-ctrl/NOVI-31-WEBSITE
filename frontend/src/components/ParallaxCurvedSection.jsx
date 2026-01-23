import React, { useEffect, useMemo, useState } from "react";
import "./ParallaxCurvedSection.css";

/* SVG Path koordinate za krive linije - TAČNO prema referentnoj slici
   GORNJA: konkavna nadole ("frown") - počinje srednje levo, spušta se u sredinu (najniža tačka), završava srednje desno
   DONJA: konkavna nadole ("frown") - stomak linije ide na dole */
const TOP_PATH = "M0,50 Q720,180 1440,30";
const BOTTOM_PATH = "M0,620 Q720,750 1440,600";

function useParallax(offset = 18) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return Math.round((y % 600) * (offset / 600));
}

// FlipServiceCard komponenta - dizajn prema referenci
function FlipServiceCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`blFlipCard ${isFlipped ? "isFlipped" : ""}`}>
      <div className="blFlipInner">
        {/* FRONT - Slika + naslov + cena/trajanje + opis + dugmad */}
        <div className="blFlipFace blFront">
          <div className="blCardImage">
            <img src={card.image} alt={card.title} />
          </div>
          <div className="blCardContent">
            <div className="blCardHeader">
              <h3 className="blCardTitle">{card.title}</h3>
              <div className="blCardMeta">
                <span className="blCardPrice">{card.price}</span>
                <span className="blCardDuration">{card.duration}</span>
              </div>
            </div>
            <p className="blCardDesc">{card.shortDesc}</p>
            <div className="blCardButtons">
              <button 
                type="button"
                className="blDetailsBtn"
                onClick={handleFlip}
                data-testid={`flip-card-details-${card.id}`}
              >
                DETALJI
              </button>
            </div>
          </div>
        </div>
        
        {/* BACK - Detaljan opis */}
        <div className="blFlipFace blBack">
          <div className="blBackContent">
            <h3 className="blBackTitle">{card.title}</h3>
            <p className="blBackDesc">{card.fullDesc}</p>
            <button 
              type="button"
              className="blBackBtn"
              onClick={handleFlip}
              data-testid={`flip-card-back-${card.id}`}
            >
              NAZAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParallaxCurvedSection({ title, cards = [] }) {
  const parY = useParallax(22);
  const clipId = useMemo(() => `clip-${Math.random().toString(36).slice(2)}`, []);

  return (
    <section className="blParallaxSection" data-testid="parallax-curved-section">
      {/* SVG krive linije sa parallax efektom */}
      <div className="blCurveWrap" style={{ transform: `translate3d(0, ${parY}px, 0)` }}>
        <svg className="blCurveSvg" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs>
            {/* ClipPath za ispunu između linija */}
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={`${TOP_PATH} L1440,800 L0,800 Z`} />
            </clipPath>
          </defs>

          {/* Tamno siva ispuna između linija - bez filtera */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="800"
            clipPath={`url(#${clipId})`}
            className="blCurveFill"
          />

          {/* Gornja zlatna linija - "frown" shape */}
          <path d={TOP_PATH} className="blCurveLine blCurveTop" />
          
          {/* Donja zlatna linija - "frown" shape (stomak nadole) */}
          <path d={BOTTOM_PATH} className="blCurveLine blCurveBottom" />
        </svg>
      </div>

      {/* Sadržaj sekcije - naslov fiksan na vrhu, kartice niže */}
      <div className="blParallaxInner">
        {title && <h2 className="blParallaxTitle">{title}</h2>}

        <div className="blCardGrid">
          {cards.map(card => (
            <FlipServiceCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
