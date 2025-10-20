import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxBg = document.querySelector('.parallax-bg');
      const parallaxOverlay = document.querySelector('.parallax-overlay');
      
      if (parallaxBg && parallaxOverlay) {
        const speed = 0.5; // Brzina parallax efekta (manji broj = sporiji)
        parallaxBg.style.transform = `translateY(${scrolled * speed}px)`;
        
        // Dodajemo blagi fade out efekat tokom skrolovanja
        const fadeStart = 100;
        const fadeEnd = 800;
        const opacity = Math.max(0.05, Math.min(0.15, 0.15 - ((scrolled - fadeStart) / (fadeEnd - fadeStart)) * 0.1));
        parallaxBg.style.opacity = opacity;
      }
    };

    // Dodajemo smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [isHomePage]);

  return (
    <div className={`min-h-screen ${isHomePage ? 'parallax-container' : 'bg-spa-dark'}`}>
      {isHomePage && (
        <>
          <div className="parallax-bg"></div>
          <div className="parallax-overlay"></div>
        </>
      )}
      
      <div className="logo-section">
        <img 
          src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png" 
          alt="Bua Luang Thai Spa" 
          className="logo-image"
        />
      </div>
      
      <Header />
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;