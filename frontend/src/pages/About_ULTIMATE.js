import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Star, Sparkles } from "lucide-react";

const About = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas candles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;

    class Candle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 150 + Math.random() * 100;
        this.width = 4;
        this.glowSize = 30 + Math.random() * 20;
        this.flickerOffset = Math.random() * Math.PI * 2;
        this.flickerSpeed = 0.05 + Math.random() * 0.05;
      }

      draw(scrollOffset) {
        const flickerIntensity = Math.sin(Date.now() * this.flickerSpeed + this.flickerOffset) * 5;
        const adjustedY = this.y - scrollOffset * 0.3;
        
        // Candle stick
        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.fillRect(this.x - this.width / 2, adjustedY, this.width, this.height);

        // Flame
        const flameY = adjustedY - 20 + flickerIntensity;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          this.x, flameY, 0,
          this.x, flameY, this.glowSize + flickerIntensity
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, flameY, this.glowSize + flickerIntensity, 0, Math.PI * 2);
        ctx.fill();

        // Flame shape
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.beginPath();
        ctx.moveTo(this.x, flameY - 15);
        ctx.bezierCurveTo(
          this.x - 8, flameY - 10,
          this.x - 8, flameY,
          this.x, flameY + 5
        );
        ctx.bezierCurveTo(
          this.x + 8, flameY,
          this.x + 8, flameY - 10,
          this.x, flameY - 15
        );
        ctx.fill();
      }
    }

    const candles = [];
    const candleCount = 15;
    for (let i = 0; i < candleCount; i++) {
      const x = (i / (candleCount - 1)) * canvas.width;
      const y = 100 + Math.random() * (canvas.height - 200);
      candles.push(new Candle(x, y));
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      candles.forEach(candle => candle.draw(scrollY));
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scrollY]);

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Tradicionalnost",
      description: "Naše tehnike su prenesene direktno iz Tajlanda kroz generacije među stručnim masereima."
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Kvalitet",
      description: "Koristimo isključivo prirodne sastojke i aromatična ulja najvišeg kvaliteta."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Iskustvo",
      description: "Naš tim čine sertifikovani terapeuti sa više od 10 godina iskustva."
    }
  ];

  return (
    <div className="about-ultimate-container" ref={containerRef}>
      {/* Canvas for candles */}
      <canvas ref={canvasRef} className="candles-canvas"></canvas>

      {/* Animated vines SVG */}
      <svg className="vines-svg" viewBox="0 0 1920 5000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#8B7355', stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
        
        {/* Left vine */}
        <path 
          className="vine-path vine-left"
          d={`M 50,0 Q 100,${100 + scrollY * 0.1} 80,${200 + scrollY * 0.15} T 60,${400 + scrollY * 0.2} T 90,${600 + scrollY * 0.25} T 70,${800 + scrollY * 0.3} T 100,${1000 + scrollY * 0.35} T 80,${1200 + scrollY * 0.4} T 60,${1400 + scrollY * 0.45} T 90,${1600 + scrollY * 0.5} T 70,${1800 + scrollY * 0.55} T 80,${2000 + scrollY * 0.6}`}
          fill="none"
          stroke="url(#vineGradient)"
          strokeWidth="3"
        />
        
        {/* Right vine */}
        <path 
          className="vine-path vine-right"
          d={`M 1870,0 Q 1820,${100 + scrollY * 0.1} 1840,${200 + scrollY * 0.15} T 1860,${400 + scrollY * 0.2} T 1830,${600 + scrollY * 0.25} T 1850,${800 + scrollY * 0.3} T 1820,${1000 + scrollY * 0.35} T 1840,${1200 + scrollY * 0.4} T 1860,${1400 + scrollY * 0.45} T 1830,${1600 + scrollY * 0.5} T 1850,${1800 + scrollY * 0.55} T 1840,${2000 + scrollY * 0.6}`}
          fill="none"
          stroke="url(#vineGradient)"
          strokeWidth="3"
        />

        {/* Leaves on vines */}
        {[...Array(20)].map((_, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          const baseX = side === 'left' ? 70 : 1840;
          const yPos = i * 120 + scrollY * 0.1;
          const rotation = Math.sin(scrollY * 0.01 + i) * 20;
          
          return (
            <g key={i} transform={`translate(${baseX}, ${yPos}) rotate(${rotation})`}>
              <ellipse
                className="vine-leaf"
                cx="0"
                cy="0"
                rx="15"
                ry="25"
                fill="url(#vineGradient)"
                opacity="0.7"
              />
            </g>
          );
        })}
      </svg>

      {/* Hero Section */}
      <section className="about-ultimate-hero">
        <div 
          className="hero-orbs-container"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
        </div>

        <div className="hero-content-ultimate">
          <h1 
            className="hero-title-ultimate"
            style={{
              transform: `perspective(2000px) rotateX(${scrollY * 0.05}deg) translateZ(${100 - scrollY * 0.2}px)`,
            }}
          >
            O Nama
          </h1>
          <div className="hero-subtitle-container">
            <p className="hero-subtitle-ultimate">
              Otkrijte našu priču i strast prema tradicionalnim tajlandskim tretmanima
            </p>
            <div className="subtitle-sparkles">
              <Sparkles className="hero-sparkle" />
              <Sparkles className="hero-sparkle" />
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Story Section with 3D depth */}
      <section className="story-ultimate-section">
        <div 
          className="story-ultimate-card"
          style={{
            transform: `perspective(2000px) rotateY(${(mousePosition.x / window.innerWidth - 0.5) * 15}deg) rotateX(${-(mousePosition.y / window.innerHeight - 0.5) * 15}deg) translateZ(${50 - scrollY * 0.05}px)`,
          }}
        >
          <div className="story-glow-effect"></div>
          <h2 className="story-ultimate-title">Naša Priča</h2>
          <div className="story-ultimate-content">
            <p>
              Bua Luang Thai Spa je nastao iz želje da se autentično tajlandsko iskustvo 
              donese u srce Srbije. Naša osnivačka je provela godine u Tajlandu, 
              učeći tradicionalne tehnike masaže i spa tretmana od međunarodnih meštara.
            </p>
            <p>
              "Bua Luang" na tajlandskom znači "kraljevski lotos" - simbol čistoce, 
              lepote i duševnog mira. Baš kao što se lotos izdige iz blata da postane 
              prekrasna biljka, i mi verujemo da svaki gost može da pronađe svoj 
              unutrašnji mir kroz naše tretmane.
            </p>
            <p>
              Danas, naš spa predstavlja oazu mira u gradu, gde spajamo 
              hiljadugodišnju tajlandsku tradiciju sa najsavremenijim tehnikama 
              i opremom, pružajući jedinstveno iskustvo svakom gostu.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section with 3D cards */}
      <section className="values-ultimate-section">
        <h2 
          className="values-ultimate-title"
          style={{
            transform: `translateY(${-scrollY * 0.1}px)`,
          }}
        >
          Naše Vrednosti
        </h2>
        <div className="values-ultimate-grid">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-ultimate-card"
              style={{
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <div className="value-card-ultimate-inner">
                <div className="value-card-shine"></div>
                <div className="value-icon-ultimate">{value.icon}</div>
                <h3 className="value-title-ultimate">{value.title}</h3>
                <p className="value-desc-ultimate">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-ultimate-section">
        <h2 className="team-ultimate-title">Naš Stručni Tim</h2>
        <div className="team-ultimate-grid">
          {[
            { name: "Siriporn Thanakit", role: "Glavni terapijska", exp: "15 godina" },
            { name: "Chanida Suwannaporn", role: "Spa terapeutkinja", exp: "12 godina" },
            { name: "Niran Pongpanich", role: "Masažer", exp: "8 godina" }
          ].map((member, i) => (
            <div key={i} className="team-ultimate-card">
              <div className="team-card-glow"></div>
              <div className="team-avatar-ultimate">
                <Star className="team-star-icon" />
              </div>
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
              <p className="team-member-exp">{member.exp} iskustva</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-ultimate-section">
        <div className="cta-ultimate-container">
          <h2 className="cta-ultimate-title">
            Spremni da doživite autentično tajlandsko iskustvo?
          </h2>
          <p className="cta-ultimate-subtitle">
            Kontaktirajte nas i rezervišite vaš tretman
          </p>
          <div className="cta-ultimate-buttons">
            <Button asChild className="cta-btn-ultimate cta-btn-primary">
              <Link to="/contact">Kontaktirajte nas</Link>
            </Button>
            <Button asChild className="cta-btn-ultimate cta-btn-secondary">
              <Link to="/massage">Pogledajte naše usluge</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
