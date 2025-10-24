import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { currentLanguage, setCurrentLanguage, translate } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: "sr", name: "Srpski" },
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "th", name: "ไทย" }
  ];

  const navigation = [
    { path: "/", label: translate("home") },
    { path: "/massage", label: translate("massage") },
    { path: "/spa", label: translate("spa") },
    { path: "/gallery", label: "Galerija" },
    { path: "/about", label: translate("about") },
    { path: "/contact", label: translate("contact") }
  ];

  // Scroll to top when clicking navigation links
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="header-container">
      <nav className="nav-wrapper">
        {/* Logo on Left */}
        <div className="nav-logo-container">
          <Link to="/">
            <img 
              src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/r2vm59ex_Bualuang%20logo%20senka.png" 
              alt="Bua Luang Thai Spa" 
              className="nav-logo"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`nav-link ${
                location.pathname === item.path ? "nav-link-active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="language-button">
                <Globe className="h-4 w-4" />
                <span className="ml-2">
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => setCurrentLanguage(language.code)}
                  className={currentLanguage === language.code ? "bg-accent" : ""}
                >
                  {language.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? "mobile-nav-open" : ""}`}>
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-link ${
              location.pathname === item.path ? "mobile-nav-link-active" : ""
            }`}
            onClick={handleNavClick}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;