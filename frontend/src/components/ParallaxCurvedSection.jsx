import React, { useEffect, useMemo, useState } from "react";
import "./ParallaxCurvedSection.css";

/* SVG Path koordinate za krive linije - bazirano na referentnoj slici
   GORNJA: konkavna (otvorena nagore) - počinje nisko levo, penje se u sredini, završava visoko desno
   DONJA: konveksna (otvorena nadole) - počinje nisko levo, penje se do kraja desno */
const TOP_PATH = "M0,180 Q360,40 720,100 T1440,60";
const BOTTOM_PATH = "M0,320 Q360,380 720,340 T1440,400";

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

// FlipServiceCard komponenta
function FlipServiceCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`blFlipCard ${isFlipped ? "isFlipped" : ""}`}>
      <div className="blFlipInner">
        {/* FRONT */}
        <div className="blFlipFace blFront">
          <div className="blCardIcon">{card.icon}</div>
          <h3 className="blCardTitle">{card.title}</h3>
          <p className="blCardDesc">{card.shortDesc}</p>
          <button 
            className="blDetailsBtn"
            onClick={handleFlip}
            data-testid={`flip-card-btn-${card.id}`}
          >
            Detalji
          </button>
        </div>
        
        {/* BACK */}
        <div className="blFlipFace blBack">
          <h3 className="blBackTitle">{card.title}</h3>
          <p className="blBackDesc">{card.fullDesc}</p>
          <button 
            className="blBackBtn"
            onClick={handleFlip}
            data-testid={`flip-card-back-btn-${card.id}`}
          >
            Nazad
          </button>
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
        <svg className="blCurveSvg" viewBox="0 0 1440 460" preserveAspectRatio="none">
          <defs>
            {/* ClipPath za ispunu između linija */}
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={`${TOP_PATH} L1440,460 L0,460 Z`} />
            </clipPath>
          </defs>

          {/* Tamno siva ispuna između linija */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="460"
            clipPath={`url(#${clipId})`}
            className="blCurveFill"
          />

          {/* Gornja zlatna linija */}
          <path d={TOP_PATH} className="blCurveLine blCurveTop" />
          
          {/* Donja zlatna linija */}
          <path d={BOTTOM_PATH} className="blCurveLine blCurveBottom" />
        </svg>
      </div>

      {/* Sadržaj sekcije */}
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
