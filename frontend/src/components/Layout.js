import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`min-h-screen ${isHomePage ? '' : 'bg-spa-dark'}`}>
      <div className="logo-section">
        <img 
          src="https://customer-assets.emergentagent.com/job_thai-massage-spa/artifacts/ujd19ro1_Bua%20luang%20logo.png" 
          alt="Bua Luang Thai Spa" 
          className="logo-image"
        />
      </div>
      
      <Header />
      
      <main>
        <Outlet />
      </main>
      
      {isHomePage && (
        <div className="fixed-footer-slogan" id="fixed-footer">
          <div className="fixed-footer-content">
            <h2 className="fixed-footer-text">Tajlandska masaža, duša tradicije i tela</h2>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Layout;