import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`min-h-screen ${isHomePage ? '' : 'bg-spa-dark'}`}>
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