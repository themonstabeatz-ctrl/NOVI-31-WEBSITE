import React, { useEffect, useMemo, useState, useRef } from "react";
import "./ParallaxCurvedSection.css";

/* SVG Path koordinate za krive linije
   GORNJA: konkavna nadole ("frown")
   DONJA: konkavna nadole - spuštena dodatno za 60% ukupno */
const TOP_PATH = "M0,50 Q720,180 1440,30";
const BOTTOM_PATH = "M0,1050 Q720,1180 1440,1030";

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
function FlipServiceCard({ card, isVisible, animationDirection }) {
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

  // Dinamička klasa za animaciju
  const animClass = isVisible ? `blSlide${animationDirection}` : "blCardHidden";

  return (
    <div 
      className={`blFlipCard ${isFlipped ? "isFlipped" : ""} ${animClass}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="blFlipInner">
        {/* FRONT */}
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
        
        {/* BACK */}
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
  const [cardVisibility, setCardVisibility] = useState({});
  const cardRefs = useRef([]);

  // Intersection Observer za svaku karticu - radi pri scroll gore i dole
  useEffect(() => {
    const observers = [];
    
    cardRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setCardVisibility(prev => ({
              ...prev,
              [index]: entry.isIntersecting
            }));
          });
        },
        { threshold: 0.15, rootMargin: "-50px 0px" }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [cards]);

  // Određivanje smera animacije za svaku karticu
  // Gornji red: 0=levo, 1=dole, 2=desno
  // Donji red: 3=levo, 4=dole, 5=desno
  const getAnimationDirection = (index) => {
    if (index === 0 || index === 3) return "FromLeft";
    if (index === 2 || index === 5) return "FromRight";
    return "FromBottom";
  };

  return (
    <section className="blParallaxSection" data-testid="parallax-curved-section">
      {/* SVG krive linije sa parallax efektom */}
      <div className="blCurveWrap" style={{ transform: `translate3d(0, ${parY}px, 0)` }}>
        <svg className="blCurveSvg" viewBox="0 0 1440 1100" preserveAspectRatio="none">
          <defs>
            {/* ClipPath - ispuna SAMO između gornje i donje linije */}
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={`${TOP_PATH} L1440,900 Q720,1050 0,920 Z`} />
            </clipPath>
          </defs>

          {/* Tamno siva ispuna SAMO između linija */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="1100"
            clipPath={`url(#${clipId})`}
            className="blCurveFill"
          />

          {/* Gornja zlatna linija */}
          <path d={TOP_PATH} className="blCurveLine blCurveTop" />
          
          {/* Donja zlatna linija - spuštena ispod kartica */}
          <path d={BOTTOM_PATH} className="blCurveLine blCurveBottom" />
        </svg>
      </div>

      {/* Sadržaj sekcije */}
      <div className="blParallaxInner">
        {title && <h2 className="blParallaxTitle">{title}</h2>}

        <div className="blCardGrid">
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              ref={el => cardRefs.current[index] = el}
              className="blCardWrapper"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <FlipServiceCard 
                card={card} 
                isVisible={cardVisibility[index]}
                animationDirection={getAnimationDirection(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
