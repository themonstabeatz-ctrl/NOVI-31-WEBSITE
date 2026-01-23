import React, { useEffect, useMemo, useState, useRef } from "react";
import "./ParallaxCurvedSection.css";

/* SVG Path koordinate za krive linije
   GORNJA: konkavna nadole ("frown") - počinje srednje levo, spušta se u sredinu
   DONJA: konkavna nadole ("frown") - spuštena za 20% */
const TOP_PATH = "M0,50 Q720,180 1440,30";
const BOTTOM_PATH = "M0,750 Q720,880 1440,730";

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

// FlipServiceCard komponenta - HOVER flip behavior
function FlipServiceCard({ card, animationClass }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Kada kursor napusti karticu, vraća se na prednju stranu
  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  // Klik na DETALJI flipuje karticu
  const handleDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(true);
  };

  return (
    <div 
      className={`blFlipCard ${isFlipped ? "isFlipped" : ""} ${animationClass}`}
      onMouseLeave={handleMouseLeave}
    >
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
                onClick={handleDetailsClick}
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
            <div className="blBackNote">
              Sklonite kursor za povratak
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParallaxCurvedSection({ title, cards = [] }) {
  const parY = useParallax(22);
  const clipId = useMemo(() => `clip-${Math.random().toString(36).slice(2)}`, []);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer za aktiviranje animacija kada sekcija uđe u viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Određivanje animacije za svaku karticu
  // Gornji red: 0=levo, 1=dole, 2=desno
  // Donji red: 3=levo, 4=dole, 5=desno
  const getAnimationClass = (index) => {
    if (!isVisible) return "blCardHidden";
    
    if (index === 0 || index === 3) return "blSlideFromLeft";
    if (index === 2 || index === 5) return "blSlideFromRight";
    return "blSlideFromBottom";
  };

  return (
    <section ref={sectionRef} className="blParallaxSection" data-testid="parallax-curved-section">
      {/* SVG krive linije sa parallax efektom */}
      <div className="blCurveWrap" style={{ transform: `translate3d(0, ${parY}px, 0)` }}>
        <svg className="blCurveSvg" viewBox="0 0 1440 950" preserveAspectRatio="none">
          <defs>
            {/* ClipPath za ispunu između linija */}
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={`${TOP_PATH} L1440,950 L0,950 Z`} />
            </clipPath>
          </defs>

          {/* Tamno siva ispuna između linija */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="950"
            clipPath={`url(#${clipId})`}
            className="blCurveFill"
          />

          {/* Gornja zlatna linija */}
          <path d={TOP_PATH} className="blCurveLine blCurveTop" />
          
          {/* Donja zlatna linija - spuštena */}
          <path d={BOTTOM_PATH} className="blCurveLine blCurveBottom" />
        </svg>
      </div>

      {/* Sadržaj sekcije - naslov i kartice spušteni za 20% */}
      <div className="blParallaxInner">
        {title && <h2 className="blParallaxTitle">{title}</h2>}

        <div className="blCardGrid">
          {cards.map((card, index) => (
            <div key={card.id}>
              <FlipServiceCard 
                card={card} 
                animationClass={getAnimationClass(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
