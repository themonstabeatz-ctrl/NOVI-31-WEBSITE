import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Sparkles, Leaf, Star, Shield, Target, Mail, Phone, MapPin, Clock, Instagram } from "lucide-react";

const About = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Logo transformation and parallax effects on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      const aboutHeroLogo = document.querySelector('.about-hero-logo');
      
      if (!aboutHeroSection || !aboutHeroLogo) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      if (scrollPercent > 0.05) {
        // Scroll down - transform logo with fade and blur
        const opacity = Math.max(1 - (scrollPercent - 0.05) * 3, 0);
        const scale = Math.max(1 - (scrollPercent - 0.05) * 1.5, 0.2);
        
        aboutHeroLogo.style.opacity = opacity;
        aboutHeroLogo.style.transform = `scale(${scale})`;
        aboutHeroLogo.style.filter = `blur(${(scrollPercent - 0.05) * 15}px)`;
      } else {
        // Scroll up - restore logo
        aboutHeroLogo.style.opacity = 1;
        aboutHeroLogo.style.transform = 'scale(1)';
        aboutHeroLogo.style.filter = 'blur(0px)';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for content sections
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.scrollY;
      const aboutHeroSection = document.querySelector('.about-hero-fixed');
      
      if (!aboutHeroSection) return;
      
      const heroHeight = aboutHeroSection.offsetHeight;
      
      // Apply parallax to sections after hero
      if (scrolled > heroHeight * 0.3) {
        const parallaxContent = document.querySelector('.about-parallax-content');
        if (parallaxContent) {
          const speed = 0.5;
          const yPos = -(scrolled - heroHeight * 0.3) * speed;
          parallaxContent.style.transform = `translateY(${yPos}px)`;
        }
      }

      // Hide hero content when scrolling down to prevent it from showing through footer
      const heroContent = document.querySelector('.about-hero-content');
      if (heroContent) {
        if (scrolled > heroHeight * 0.8) {
          heroContent.style.opacity = '0';
          heroContent.style.pointerEvents = 'none';
        } else {
          heroContent.style.opacity = '1';
          heroContent.style.pointerEvents = 'auto';
        }
      }
    };

    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleParallaxScroll);
  }, []);

  const aboutCards = [
    {
      title: "Naša Priča",
      icon: <Leaf className="w-6 h-6" />,
      description: "Bua Luang Thai Spa je nastao iz duboke strasti prema autentičnoj tajlandskoj wellness tradiciji. Naša osnivačica je provela godine učeći tradicionalne tehnike direktno od majstora u Bangkoku.",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Kraljevski Lotos",
      icon: <Sparkles className="w-6 h-6" />,
      description: "\"Bua Luang\" znači \"kraljevski lotos\" - simbol čistoće i transformacije. Baš kao što lotos cveta iz vode, verujemo da svako može pronaći unutrašnji mir kroz naše tretmane.",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Tradicionalnost",
      icon: <Heart className="w-6 h-6" />,
      description: "Naše tehnike su prenesene kroz generacije direktno iz Tajlanda, čuvajući autentičnost svakog pokreta i rituala hiljadugodišnje tajlandske mudrosti.",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Kvalitet",
      icon: <Shield className="w-6 h-6" />,
      description: "Koristimo isključivo prirodne proizvode i aromatična ulja najvišeg kvaliteta, direktno uvezena iz Tajlanda za vaše potpuno zadovoljstvo.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Posvećenost",
      icon: <Target className="w-6 h-6" />,
      description: "Svaki tretman je prilagođen vašim individualnim potrebama. Naš tim stručnjaka posvećen je vašem blagostanju i transformaciji tela, uma i duha.",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Iskustvo",
      icon: <Award className="w-6 h-6" />,
      description: "Sa preko 15 godina iskustva i više od 5000 zadovoljnih gostiju, kombinujemo tradiciju sa modernim pristupom wellness-u za jedinstveno iskustvo.",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="about-container">
      {/* Fixed Video Hero Section */}
      <section className="about-hero-fixed">
        <div className="about-hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="about-hero-video"
          >
            <source src="/Woman_Drinking_Tea_In_Spa_fhd_2012921.mp4" type="video/mp4" />
          </video>
          <div className="about-hero-overlay"></div>
        </div>
        
        <div className="about-hero-content">
          <div className="about-hero-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Logo"
              className="hero-logo-image"
            />
          </div>
          <h1 className="about-hero-title">O Nama</h1>
          <div className="about-hero-divider"></div>
          <p className="about-hero-subtitle">
            Priča o strasti, tradiciji i transformaciji kroz autentični tajlandski wellness
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;
