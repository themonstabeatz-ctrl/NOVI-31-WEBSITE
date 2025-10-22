import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Sparkles, Leaf, Star, Shield, Target } from "lucide-react";

const About = () => {
  const { translate } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-professional-container">
      {/* Hero Section */}
      <section className="about-pro-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content-wrapper">
          <div className="about-hero-text">
            <h1 className="about-hero-title">O Nama</h1>
            <div className="about-hero-divider"></div>
            <p className="about-hero-subtitle">
              Otkrijte našu priču posvećenosti autentičnoj tajlandskoj masaži i wellness tradiciji
            </p>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-pro-story">
        <div className="container-pro">
          <div className="story-grid">
            <div className="story-image-side">
              <div className="story-image-frame">
                <div className="image-placeholder">
                  <Leaf className="placeholder-icon" />
                </div>
              </div>
            </div>
            <div className="story-content-side">
              <span className="section-label">Naša Priča</span>
              <h2 className="section-title">Putovanje Ka Autentičnosti</h2>
              <div className="story-text">
                <p>
                  Bua Luang Thai Spa je nastao iz duboke strasti prema autentičnoj tajlandskoj wellness tradiciji. 
                  Naša osnivačica je provela godine učeći tradicionalne tehnike masaže direktno od tajlandskih majstora u Bangkoku.
                </p>
                <p>
                  "Bua Luang" znači "kraljevski lotos" - simbol čistoće, transformacije i unutrašnjeg mira. 
                  Baš kao što lotos cveta iz vode, mi verujemo da svako može pronaći svoj unutrašnji mir kroz naše tretmane.
                </p>
                <p>
                  Danas, kombinujemo hiljadugodišnju tajlandsku mudrost sa modernim pristupom wellness-u, 
                  stvarajući jedinstveno iskustvo koje transformiše telo, um i duh.
                </p>
              </div>
              <div className="story-stats">
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Godina Iskustva</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">Zadovoljnih Gostiju</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Autentično</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-pro-values">
        <div className="container-pro">
          <div className="section-header-center">
            <span className="section-label">Naše Vrednosti</span>
            <h2 className="section-title">Šta Nas Definiše</h2>
            <p className="section-description">
              Tri stuba na kojima gradimo svako iskustvo u Bua Luang Thai Spa
            </p>
          </div>
          
          <div className="values-grid-pro">
            <div className="value-card-pro">
              <div className="value-icon-wrapper">
                <Heart className="value-icon" />
              </div>
              <h3 className="value-title">Tradicionalnost</h3>
              <p className="value-description">
                Naše tehnike su prenesene kroz generacije direktno iz Tajlanda, 
                čuvajući autentičnost svake pokreta i rituala.
              </p>
            </div>

            <div className="value-card-pro">
              <div className="value-icon-wrapper">
                <Shield className="value-icon" />
              </div>
              <h3 className="value-title">Kvalitet</h3>
              <p className="value-description">
                Koristimo isključivo prirodne proizvode i aromatična ulja 
                najvišeg kvaliteta iz Tajlanda.
              </p>
            </div>

            <div className="value-card-pro">
              <div className="value-icon-wrapper">
                <Target className="value-icon" />
              </div>
              <h3 className="value-title">Posvećenost</h3>
              <p className="value-description">
                Svaki tretman je prilagođen vašim individualnim potrebama 
                za optimalne rezultate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-pro-team">
        <div className="container-pro">
          <div className="section-header-center">
            <span className="section-label">Naš Tim</span>
            <h2 className="section-title">Stručnjaci U Svojoj Oblasti</h2>
            <p className="section-description">
              Sertifikovani terapeuti sa dugogodišnjim iskustvom u tajlandskoj masaži
            </p>
          </div>

          <div className="team-grid-pro">
            <div className="team-member-card">
              <div className="member-image-wrapper">
                <div className="member-image-placeholder">
                  <Star className="member-placeholder-icon" />
                </div>
              </div>
              <div className="member-info">
                <h3 className="member-name">Siriporn Thanakit</h3>
                <p className="member-role">Glavni Terapeut</p>
                <p className="member-experience">15 godina iskustva</p>
                <p className="member-certification">Royal Thai Massage School, Bangkok</p>
              </div>
            </div>

            <div className="team-member-card">
              <div className="member-image-wrapper">
                <div className="member-image-placeholder">
                  <Star className="member-placeholder-icon" />
                </div>
              </div>
              <div className="member-info">
                <h3 className="member-name">Chanida Suwannaporn</h3>
                <p className="member-role">Spa Terapeutkinja</p>
                <p className="member-experience">12 godina iskustva</p>
                <p className="member-certification">Chiva-Som International Health Resort</p>
              </div>
            </div>

            <div className="team-member-card">
              <div className="member-image-wrapper">
                <div className="member-image-placeholder">
                  <Star className="member-placeholder-icon" />
                </div>
              </div>
              <div className="member-info">
                <h3 className="member-name">Niran Pongpanich</h3>
                <p className="member-role">Masažer</p>
                <p className="member-experience">8 godina iskustva</p>
                <p className="member-certification">Thai Traditional Medical College</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-pro-philosophy">
        <div className="container-pro">
          <div className="philosophy-content">
            <div className="philosophy-icon-large">
              <Sparkles />
            </div>
            <h2 className="philosophy-title">Naša Filozofija</h2>
            <p className="philosophy-text">
              "Verujemo da je pravi luksuz u jednostavnosti. Svaki pokret, svaki miris, 
              svaki trenutak u našem spa-u dizajniran je da vas vrati u sklad sa sobom. 
              Tajlandska masaža nije samo fizički tretman - to je meditacija, 
              putovanje i transformacija."
            </p>
            <div className="philosophy-signature">
              <div className="signature-line"></div>
              <span className="signature-text">Bua Luang Thai Spa</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-pro-cta">
        <div className="container-pro">
          <div className="cta-content-pro">
            <h2 className="cta-title-pro">Spremni Za Transformaciju?</h2>
            <p className="cta-subtitle-pro">
              Rezervišite svoj tretman i započnite putovanje ka unutrašnjem miru
            </p>
            <div className="cta-buttons-pro">
              <Button asChild className="cta-button-primary-pro">
                <Link to="/contact">Kontaktirajte Nas</Link>
              </Button>
              <Button asChild className="cta-button-secondary-pro">
                <Link to="/massage">Pogledajte Usluge</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
