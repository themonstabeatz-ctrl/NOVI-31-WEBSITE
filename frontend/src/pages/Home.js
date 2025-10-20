import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Star, Quote } from "lucide-react";

const Home = () => {
  const { translate } = useLanguage();

  const treatments = [
    {
      title: "Aromatherapy Massage",
      titleSr: "Aromaterapijska masaža",
      description: "Dive into deep relaxation with custom essential oil blends, crafted by our expert therapists to target your specific needs.",
      descriptionSr: "Uronite u duboku relaksaciju sa prilagođenim mešavinama eteričnih ulja, napravljenih od strane naših stručnih terapeuta.",
      duration: "60min £49 / 90min £69 / 120min £90",
      durationSr: "60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "/api/placeholder/310/282",
      popular: true
    },
    {
      title: "Swedish Massage", 
      titleSr: "Švedska masaža",
      description: "Gentle strokes and kneading techniques to melt away tension and soothe your mind for overall well-being.",
      descriptionSr: "Nežni pokreti i tehnike gnječenja za topljenje napetosti i smirenje uma za opšte blagostanje.",
      duration: "60min £49 / 90min £69 / 120min £90",
      durationSr: "60min 5,900 RSD / 90min 8,300 RSD / 120min 10,800 RSD",
      image: "/api/placeholder/310/282",
      popular: false
    },
    {
      title: "Hot Stone Massage",
      titleSr: "Masaža vrućim kamenjem", 
      description: "Warm, smooth stones glide across your body to melt away tension. The deep heat penetrates muscles, boosting circulation.",
      descriptionSr: "Topli, glatki kamen klizi po telu topeci napetost. Duboka toplota prodire u mišiće, poboljšavajući cirkulaciju.",
      duration: "30min £35 / 60min £49 / 90min £69",
      durationSr: "30min 4,200 RSD / 60min 5,900 RSD / 90min 8,300 RSD",
      image: "/api/placeholder/310/282",
      popular: false
    },
    {
      title: "Traditional Thai Massage",
      titleSr: "Tradicionalna tajlandska masaža",
      description: "Ancient techniques combining rhythmic pressure and gentle stretching to melt away tension and restore balance.",
      descriptionSr: "Drevne tehnike koje kombinuju ritmični pritisak i nežno istezanje za topljenje napetosti i vraćanje ravnoteže.",
      duration: "30min £35 / 60min £49 / 90min £69",
      durationSr: "30min 4,200 RSD / 60min 5,900 RSD / 90min 8,300 RSD", 
      image: "/api/placeholder/310/282",
      popular: true
    },
    {
      title: "Deep Tissue Massage",
      titleSr: "Duboka masaža tkiva",
      description: "Blend of classic Thai techniques with deep pressure, targeting your needs to ease chronic pain and stress.",
      descriptionSr: "Mešavina klasičnih tajlandskih tehnika sa dubokim pritiskom, ciljano za ublažavanje hronične boli i stresa.",
      duration: "60min £60 / 90min £85 / 120min £100", 
      durationSr: "60min 7,200 RSD / 90min 10,200 RSD / 120min 12,000 RSD",
      image: "/api/placeholder/310/282",
      popular: false
    },
    {
      title: "Thai Foot Massage",
      titleSr: "Tajlandska masaža stopala",
      description: "Ancient healing art combining reflexology with soothing massage to restore balance and well-being.",
      descriptionSr: "Drevna umetnost lečenja kombinuje refleksoterapiju sa umirujućom masažom za vraćanje ravnoteže i blagostanja.",
      duration: "30min £35 / 60min £49",
      durationSr: "30min 4,200 RSD / 60min 5,900 RSD",
      image: "/api/placeholder/310/282",
      popular: false
    }
  ];

  return (
    <div className="home-container-new">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-banner-content">
          <div className="hero-banner-text">
            <h1 className="hero-main-title">POSTAVITE VAŠE TELO</h1>
            <h2 className="hero-main-subtitle">U DOBRE RUKE</h2>
            <p className="hero-tagline">Oslobodite se, opustite se, odmorite se</p>
            <Button asChild size="lg" className="hero-cta-button">
              <Link to="/contact">Rezervišite online</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h3 className="welcome-subtitle">Dobrodošli u Bua Luang Thai Spa</h3>
            <h2 className="welcome-title">UMETNOST TAJLANDSKE MASAŽE</h2>
            <p className="welcome-description">
              Bua Luang Thai Spa je posvećen spajanju tradicionalnih tajlandskih tehnika masaže sa 
              savremenim wellness praksama. Naš tim je posvećen pružanju pomoći u postizanju opuštanja, 
              ublažavanju napetosti mišića i poboljšanju opšteg blagostanja. Zalažemo se za holistički 
              pristup lečenju koji integriše um, telo i duh.
            </p>
            <p className="welcome-location">
              Pronađite nas na adresi Knez Mihailova 15, Beograd 11000, Srbija.
            </p>
          </div>
          <div className="welcome-image">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/7sfhgz1m_Bua%20luang%20logo.png"
              alt="Bua Luang Thai Spa Logo"
              className="welcome-logo"
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-content">
          <Quote className="quote-icon" />
          <p className="quote-text">
            "Doživite lečilišne benefite<br />
            tajlandske masaže"
          </p>
          <p className="quote-author">- Bua Luang Thai Spa</p>
          <Button asChild size="lg" className="quote-cta-button">
            <Link to="/contact">Rezervišite online</Link>
          </Button>
        </div>
      </section>

      <Separator className="section-separator" />

      {/* Services Section */}
      <section className="treatments-section">
        <div className="treatments-header">
          <h2 className="treatments-title">Naši Tretmani</h2>
        </div>
        
        <div className="treatments-grid">
          {treatments.map((treatment, index) => (
            <Card key={index} className="treatment-card">
              {treatment.popular && (
                <Badge className="popular-badge">
                  <Star className="w-3 h-3 mr-1" />
                  Najpopularnije
                </Badge>
              )}
              <div className="treatment-image-container">
                <div className="treatment-image-placeholder">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/2lsuft76_6286005458adf.png"
                    alt={treatment.titleSr}
                    className="treatment-image"
                  />
                </div>
              </div>
              <CardContent className="treatment-content">
                <h3 className="treatment-name">{treatment.titleSr}</h3>
                <p className="treatment-description">{treatment.descriptionSr}</p>
                <p className="treatment-duration">{treatment.durationSr}</p>
                <Button className="book-treatment-button" asChild>
                  <Link to="/contact">Rezervišite sada</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="section-separator" />

      {/* Gift Voucher Section */}
      <section className="gift-section">
        <div className="gift-content">
          <h2 className="gift-title">
            Počastite voljenu osobu ili kolegu sa poklonom opuštanja. Ne morate da se stresiraće 
            vozanjem u potrazi za savršenim poklonom. Sa samo nekoliko klikova, možete kupiti 
            savršen poklon od nas.
          </h2>
          <div className="gift-voucher">
            <img 
              src="https://customer-assets.emergentagent.com/job_83ed575e-3634-46be-8586-79a3348def97/artifacts/1yzb8w71_%E2%80%94Pngtree%E2%80%94luxury%20mandala%20gold%20vintage%20frame_8780829.png"
              alt="Gift Voucher"
              className="gift-voucher-image"
            />
          </div>
          <Button size="lg" className="gift-cta-button" asChild>
            <Link to="/contact">KUPITE SADA</Link>
          </Button>
        </div>
      </section>

      <Separator className="section-separator" />

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <Quote className="testimonial-quote-icon" />
          <p className="testimonial-text">
            "Blaženo i lečilišno. Naš tim je topao, dobrodošao, profesionalan i briljantan u svom poslu. 
            Prilagođavaju se pritisku koji želite, ciljaju oblasti koje trebate, i brinu o vama svaki trenutak. 
            Snažne ruke, um, duša. 5★ i 10/10 snažno preporučujem!"
          </p>
          <p className="testimonial-author">- Marija P.</p>
          <div className="testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="star-filled" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;