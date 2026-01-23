import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ParallaxCurvedSection from "../components/ParallaxCurvedSection";
import "./HeadSpa.css";

// Head Spa content translations
const headSpaContent = {
  sr: {
    heroTitle: "Japanski Head Spa",
    heroSubtitle: "u Bua Luang Thai Spa",
    heroTagline: "Ritual koji budi temenje, neguje kosu i vraća mir u telo.",
    introTitle: "Više od nege kose",
    introText: "Bua Luang Head Spa je više od nege kose — to je luksuzni reset za vaše teme, vrat i um. Kombinujemo dubinsko čišćenje temena, parnu terapiju i preciznu masažu tačaka pritiska kako bismo smanjili napetost, osvežili kožu glave i podstakli zdrav rast kose. Namenjeno i ženama i muškarcima.",
    servicesTitle: "Naši tretmani",
    services: [
      {
        id: "detox",
        icon: "🧴",
        title: "Detoks temena",
        shortDesc: "Dubinsko čišćenje i uklanjanje nečistoća",
        fullDesc: "Tretman dubinskog čišćenja temena koji uklanja sebum, naslage i nečistoće iz pora. Koristi se specijalna formula za detoksikaciju koja osvežava kožu glave i priprema je za dalju negu."
      },
      {
        id: "circulation",
        icon: "💆",
        title: "Bolja cirkulacija",
        shortDesc: "Masaža koja podstiče protok krvi",
        fullDesc: "Precizna masaža temena koja podstiče cirkulaciju krvi i može pomoći rastu kose. Tehnike pritiska na specifične tačke stimulišu folikule dlake i poboljšavaju dotok hranljivih materija."
      },
      {
        id: "lifting",
        icon: "✨",
        title: "Lifting efekat",
        shortDesc: "Opuštanje i drenaža lica",
        fullDesc: "Kombinacija masaže i drenaže koja smanjuje nadutost i zateže kožu lica. Rezultat je svežiji, mladalački izgled i osećaj lakoće nakon tretmana."
      },
      {
        id: "hair",
        icon: "💎",
        title: "Zdravija kosa",
        shortDesc: "Hranljive formule za jačanje vlasi",
        fullDesc: "Primena premium hranljivih formula koje prodiru duboko u strukturu kose. Jačaju vlas od korena, smanjuju pucanje i lomljenje, i vraćaju prirodni sjaj i elastičnost."
      },
      {
        id: "sleep",
        icon: "😴",
        title: "Bolji san",
        shortDesc: "Duboka relaksacija za kvalitetniji odmor",
        fullDesc: "Tretman duboke relaksacije koji umiruje nervni sistem. Mnogi klijenti primećuju poboljšanje kvaliteta sna već posle prvog tretmana — budite se odmorniji i energičniji."
      },
      {
        id: "mental",
        icon: "🧘",
        title: "Mentalni reset",
        shortDesc: "Aromaterapija i masaža za mir uma",
        fullDesc: "Kombinacija aromaterapije sa eteričnim uljima i precizne masaže koja vraća mir i fokus. Idealno za osobe pod stresom, sa mentalnim umorom ili potrebom za resetom."
      }
    ],
    processTitle: "Tok tretmana",
    processSteps: [
      "Masaža vrata, ramena i dekoltea",
      "Dubinsko čišćenje i blaga eksfolijacija temena",
      "Topla para (steam) za otvaranje pora i hidrataciju",
      "Maska + precizna masaža temena (pressure points)",
      "Završna nega kose — mekoća, sjaj i lako raščešljavanje"
    ],
    contraTitle: "Važno",
    contraText: "Tretman se ne preporučuje ako imate:",
    contraItems: [
      "Ekstenzije",
      "Sveže farbanje (može doći do blagog ispiranja boje)",
      "Aktivne infekcije ili iritacije temena",
      "Izrazito osetljivo teme",
      "Trudnoću",
      "Klaustrofobiju"
    ],
    ctaTitle: "Spremni za transformaciju?",
    ctaButton: "Zakažite Head Spa"
  },
  en: {
    heroTitle: "Japanese Head Spa",
    heroSubtitle: "at Bua Luang Thai Spa",
    heroTagline: "A ritual that awakens your scalp, nurtures your hair, and restores peace to your body.",
    introTitle: "More than hair care",
    introText: "Bua Luang Head Spa is more than hair care — it's a luxurious reset for your scalp, neck, and mind. We combine deep scalp cleansing, steam therapy, and precise pressure point massage to reduce tension, refresh your scalp, and promote healthy hair growth. For both women and men.",
    servicesTitle: "Our treatments",
    services: [
      {
        id: "detox",
        icon: "🧴",
        title: "Scalp Detox",
        shortDesc: "Deep cleansing and impurity removal",
        fullDesc: "Deep scalp cleansing treatment that removes sebum, buildup, and impurities from pores. Uses a special detox formula that refreshes the scalp and prepares it for further care."
      },
      {
        id: "circulation",
        icon: "💆",
        title: "Better Circulation",
        shortDesc: "Massage that stimulates blood flow",
        fullDesc: "Precise scalp massage that stimulates blood circulation and can help hair growth. Pressure point techniques stimulate hair follicles and improve nutrient delivery."
      },
      {
        id: "lifting",
        icon: "✨",
        title: "Lifting Effect",
        shortDesc: "Relaxation and facial drainage",
        fullDesc: "Combination of massage and drainage that reduces puffiness and tightens facial skin. The result is a fresher, more youthful appearance and a feeling of lightness after treatment."
      },
      {
        id: "hair",
        icon: "💎",
        title: "Healthier Hair",
        shortDesc: "Nourishing formulas to strengthen hair",
        fullDesc: "Application of premium nourishing formulas that penetrate deep into hair structure. Strengthens hair from the root, reduces breakage and splitting, and restores natural shine and elasticity."
      },
      {
        id: "sleep",
        icon: "😴",
        title: "Better Sleep",
        shortDesc: "Deep relaxation for better rest",
        fullDesc: "Deep relaxation treatment that calms the nervous system. Many clients notice improved sleep quality after just the first treatment — wake up more rested and energized."
      },
      {
        id: "mental",
        icon: "🧘",
        title: "Mental Reset",
        shortDesc: "Aromatherapy and massage for peace of mind",
        fullDesc: "Combination of aromatherapy with essential oils and precise massage that restores peace and focus. Ideal for people under stress, with mental fatigue, or in need of a reset."
      }
    ],
    processTitle: "Treatment Process",
    processSteps: [
      "Neck, shoulder and décolleté massage",
      "Deep cleansing and gentle scalp exfoliation",
      "Warm steam for opening pores and hydration",
      "Mask + precise scalp massage (pressure points)",
      "Final hair care — softness, shine and easy detangling"
    ],
    contraTitle: "Important",
    contraText: "Treatment is not recommended if you have:",
    contraItems: [
      "Hair extensions",
      "Recent hair coloring (may cause slight color fading)",
      "Active scalp infections or irritations",
      "Extremely sensitive scalp",
      "Pregnancy",
      "Claustrophobia"
    ],
    ctaTitle: "Ready for transformation?",
    ctaButton: "Book Head Spa"
  },
  ru: {
    heroTitle: "Японский Head Spa",
    heroSubtitle: "в Bua Luang Thai Spa",
    heroTagline: "Ритуал, который пробуждает кожу головы, питает волосы и возвращает покой телу.",
    introTitle: "Больше, чем уход за волосами",
    introText: "Bua Luang Head Spa — это больше, чем уход за волосами — это роскошная перезагрузка для кожи головы, шеи и разума. Мы сочетаем глубокое очищение кожи головы, паровую терапию и точечный массаж для снятия напряжения, освежения кожи головы и стимуляции роста волос. Для женщин и мужчин.",
    servicesTitle: "Наши процедуры",
    services: [
      {
        id: "detox",
        icon: "🧴",
        title: "Детокс кожи головы",
        shortDesc: "Глубокое очищение и удаление загрязнений",
        fullDesc: "Процедура глубокого очищения кожи головы, удаляющая себум, отложения и загрязнения из пор. Используется специальная формула детокса, освежающая кожу головы."
      },
      {
        id: "circulation",
        icon: "💆",
        title: "Улучшение кровообращения",
        shortDesc: "Массаж, стимулирующий кровоток",
        fullDesc: "Точечный массаж кожи головы, стимулирующий кровообращение и способствующий росту волос. Техники давления стимулируют волосяные фолликулы."
      },
      {
        id: "lifting",
        icon: "✨",
        title: "Лифтинг эффект",
        shortDesc: "Расслабление и дренаж лица",
        fullDesc: "Сочетание массажа и дренажа, уменьшающее отечность и подтягивающее кожу лица. Результат — свежий, молодой вид и ощущение легкости."
      },
      {
        id: "hair",
        icon: "💎",
        title: "Здоровые волосы",
        shortDesc: "Питательные формулы для укрепления",
        fullDesc: "Применение премиальных питательных формул, проникающих глубоко в структуру волос. Укрепляет волосы от корней и возвращает естественный блеск."
      },
      {
        id: "sleep",
        icon: "😴",
        title: "Лучший сон",
        shortDesc: "Глубокое расслабление для отдыха",
        fullDesc: "Процедура глубокого расслабления, успокаивающая нервную систему. Многие клиенты замечают улучшение качества сна уже после первой процедуры."
      },
      {
        id: "mental",
        icon: "🧘",
        title: "Ментальная перезагрузка",
        shortDesc: "Ароматерапия и массаж для покоя",
        fullDesc: "Сочетание ароматерапии с эфирными маслами и точечного массажа, возвращающее покой и концентрацию. Идеально для людей в стрессе."
      }
    ],
    processTitle: "Процесс процедуры",
    processSteps: [
      "Массаж шеи, плеч и декольте",
      "Глубокое очищение и мягкий пилинг кожи головы",
      "Теплый пар для открытия пор и увлажнения",
      "Маска + точечный массаж кожи головы",
      "Финальный уход — мягкость, блеск и легкое расчесывание"
    ],
    contraTitle: "Важно",
    contraText: "Процедура не рекомендуется при:",
    contraItems: [
      "Наращенных волосах",
      "Недавнем окрашивании",
      "Активных инфекциях кожи головы",
      "Очень чувствительной коже головы",
      "Беременности",
      "Клаустрофобии"
    ],
    ctaTitle: "Готовы к трансформации?",
    ctaButton: "Забронировать Head Spa"
  },
  th: {
    heroTitle: "Japanese Head Spa",
    heroSubtitle: "ที่ Bua Luang Thai Spa",
    heroTagline: "พิธีกรรมที่ปลุกหนังศีรษะ บำรุงเส้นผม และคืนความสงบให้ร่างกาย",
    introTitle: "มากกว่าการดูแลผม",
    introText: "Bua Luang Head Spa เป็นมากกว่าการดูแลผม — เป็นการรีเซ็ตสุดหรูสำหรับหนังศีรษะ คอ และจิตใจ เรารวมการทำความสะอาดหนังศีรษะอย่างล้ำลึก การบำบัดด้วยไอน้ำ และการนวดจุดกดที่แม่นยำ",
    servicesTitle: "การรักษาของเรา",
    services: [
      {
        id: "detox",
        icon: "🧴",
        title: "ดีท็อกซ์หนังศีรษะ",
        shortDesc: "ทำความสะอาดลึกและกำจัดสิ่งสกปรก",
        fullDesc: "การรักษาทำความสะอาดหนังศีรษะอย่างล้ำลึกที่กำจัดซีบัม สิ่งสะสม และสิ่งสกปรกออกจากรูขุมขน"
      },
      {
        id: "circulation",
        icon: "💆",
        title: "การไหลเวียนที่ดีขึ้น",
        shortDesc: "นวดกระตุ้นการไหลเวียนเลือด",
        fullDesc: "การนวดหนังศีรษะที่แม่นยำกระตุ้นการไหลเวียนเลือดและช่วยการเจริญเติบโตของเส้นผม"
      },
      {
        id: "lifting",
        icon: "✨",
        title: "เอฟเฟกต์ยกกระชับ",
        shortDesc: "ผ่อนคลายและระบายน้ำใบหน้า",
        fullDesc: "การรวมกันของการนวดและการระบายน้ำที่ลดอาการบวมและกระชับผิวหน้า"
      },
      {
        id: "hair",
        icon: "💎",
        title: "ผมที่แข็งแรง",
        shortDesc: "สูตรบำรุงเพื่อเสริมสร้างเส้นผม",
        fullDesc: "การใช้สูตรบำรุงพรีเมียมที่ซึมลึกเข้าสู่โครงสร้างเส้นผม เสริมสร้างผมจากราก"
      },
      {
        id: "sleep",
        icon: "😴",
        title: "นอนหลับดีขึ้น",
        shortDesc: "ผ่อนคลายลึกเพื่อการพักผ่อนที่ดี",
        fullDesc: "การรักษาผ่อนคลายลึกที่สงบระบบประสาท หลายคนสังเกตเห็นคุณภาพการนอนที่ดีขึ้น"
      },
      {
        id: "mental",
        icon: "🧘",
        title: "รีเซ็ตจิตใจ",
        shortDesc: "อโรมาเธอราพีและนวดเพื่อความสงบ",
        fullDesc: "การรวมกันของอโรมาเธอราพีกับน้ำมันหอมระเหยและการนวดที่แม่นยำคืนความสงบและสมาธิ"
      }
    ],
    processTitle: "ขั้นตอนการรักษา",
    processSteps: [
      "นวดคอ ไหล่ และหน้าอก",
      "ทำความสะอาดลึกและขัดผิวหนังศีรษะอ่อนโยน",
      "ไอน้ำอุ่นเพื่อเปิดรูขุมขนและให้ความชุ่มชื้น",
      "มาส์ก + นวดหนังศีรษะแม่นยำ",
      "การดูแลผมขั้นสุดท้าย — นุ่ม เงา และแยกง่าย"
    ],
    contraTitle: "สำคัญ",
    contraText: "ไม่แนะนำการรักษาหากคุณมี:",
    contraItems: [
      "ต่อผม",
      "ทำสีผมเร็วๆ นี้",
      "การติดเชื้อหนังศีรษะที่ใช้งานอยู่",
      "หนังศีรษะที่ไวมาก",
      "การตั้งครรภ์",
      "กลัวที่แคบ"
    ],
    ctaTitle: "พร้อมสำหรับการเปลี่ยนแปลง?",
    ctaButton: "จอง Head Spa"
  }
};

const HeadSpa = () => {
  const { currentLanguage } = useLanguage();
  const content = headSpaContent[currentLanguage] || headSpaContent.sr;
  const [isVisible, setIsVisible] = useState({});
  const [heroOpacity, setHeroOpacity] = useState(1);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll(".hs-animate");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Hero fade out effect on scroll
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const opacity = Math.max(1 - (scrollY / 400), 0);
        setHeroOpacity(opacity);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Head Spa | Bua Luang Thai Spa</title>
        <meta name="description" content="Japanski Head Spa tretman - dubinsko čišćenje temena, parna terapija i masaža za zdraviju kosu i mentalni reset." />
      </Helmet>

      <div className="headspa-page">
        {/* HERO SECTION with Video Background */}
        <section className="hs-hero">
          <div className="hs-video-container">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="hs-video"
            >
              <source 
                src="https://customer-assets.emergentagent.com/job_spa-multilingual/artifacts/vjbp3lam_headspa.mp4" 
                type="video/mp4" 
              />
            </video>
            <div className="hs-video-overlay"></div>
          </div>
          
          <div className="hs-hero-content" style={{ opacity: heroOpacity }}>
            <img 
              src="https://customer-assets.emergentagent.com/job_serene-retreat-1/artifacts/r2vm59ex_Bualuang%20logo%20senka.png" 
              alt="Bua Luang Thai Spa" 
              className="hs-hero-logo"
            />
            <h1 className="hs-hero-title">
              <span className="hs-title-main">{content.heroTitle}</span>
            </h1>
            <p className="hs-title-sub">{content.heroSubtitle}</p>
            <p className="hs-hero-tagline">{content.heroTagline}</p>
          </div>
        </section>

        {/* INTRO PARALLAX SECTION - "Više od nege kose" */}
        <section id="hs-intro-parallax" className="hs-intro-parallax">
          <div className="hs-intro-wave-top" aria-hidden="true"></div>
          <div className="hs-intro-wave-top-stroke" aria-hidden="true"></div>
          
          <div className="hs-intro-content">
            <h2 className="hs-intro-title">{content.introTitle}</h2>
            <p className="hs-intro-text">{content.introText}</p>
          </div>
          
          <div className="hs-intro-wave-bottom" aria-hidden="true"></div>
          <div className="hs-intro-wave-bottom-stroke" aria-hidden="true"></div>
        </section>

        {/* NOVA PARALLAX SEKCIJA SA FLIP KARTICAMA */}
        <ParallaxCurvedSection 
          title={content.servicesTitle}
          cards={content.services}
        />

        {/* PROCESS SECTION */}
        <section id="hs-process" className="hs-section hs-process hs-parallax hs-animate">
          <div className="hs-parallax-bg hs-parallax-bg-2"></div>
          <div className={`hs-container ${isVisible["hs-process"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.processTitle}</h2>
            <div className="hs-process-steps">
              {content.processSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="hs-process-step"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <span className="hs-step-number">{index + 1}</span>
                  <span className="hs-step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTRAINDICATIONS SECTION */}
        <section id="hs-contra" className="hs-section hs-contra hs-animate">
          <div className={`hs-container ${isVisible["hs-contra"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.contraTitle}</h2>
            <p className="hs-contra-text">{content.contraText}</p>
            <ul className="hs-contra-list">
              {content.contraItems.map((item, index) => (
                <li 
                  key={index} 
                  className="hs-contra-item"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="hs-cta" className="hs-section hs-cta hs-animate">
          <div className={`hs-container ${isVisible["hs-cta"] ? "hs-visible" : ""}`}>
            <h2 className="hs-cta-title">{content.ctaTitle}</h2>
            <Link to="/contact" className="hs-cta-button" data-testid="head-spa-cta-button">
              {content.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeadSpa;
