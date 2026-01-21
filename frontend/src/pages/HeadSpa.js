import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./HeadSpa.css";

// Head Spa content translations
const headSpaContent = {
  sr: {
    heroTitle: "Japanski Head Spa",
    heroSubtitle: "u Bua Luang Thai Spa",
    heroTagline: "Ritual koji budi temenje, neguje kosu i vraća mir u telo.",
    introTitle: "Više od nege kose",
    introText: "Bua Luang Head Spa je više od nege kose — to je luksuzni reset za vaše teme, vrat i um. Kombinujemo dubinsko čišćenje temena, parnu terapiju i preciznu masažu tačaka pritiska kako bismo smanjili napetost, osvežili kožu glave i podstakli zdrav rast kose. Namenjeno i ženama i muškarcima.",
    benefitsTitle: "Benefiti Head Spa tretmana",
    benefits: [
      { icon: "🧴", title: "Detoks temena", desc: "Uklanja sebum, naslage i nečistoće iz pora" },
      { icon: "💆", title: "Bolja cirkulacija", desc: "Masaža podstiče protok i može pomoći rastu kose" },
      { icon: "✨", title: "Lifting efekat", desc: "Opuštanje i drenaža smanjuju nadutost i zatežu lice" },
      { icon: "💎", title: "Zdravija kosa", desc: "Hranljive formule jačaju vlas i smanjuju pucanje" },
      { icon: "😴", title: "Bolji san", desc: "Duboka relaksacija — budite se odmorniji" },
      { icon: "🧘", title: "Mentalni reset", desc: "Aromaterapija + masaža vraćaju mir i fokus" },
      { icon: "👁️", title: "Olakšanje za oči/vrat", desc: "Idealno za rad za računarom" },
      { icon: "🌿", title: "Reset uma i tela", desc: "Umiruje nervni sistem i vraća balans" }
    ],
    concernsTitle: "Šta vas muči?",
    concerns: [
      "Opadanje kose, proređivanje, zalizci, širenje razdeljka",
      "Suvo i perutavo teme (nedostatak hranljivih materija, stres)",
      "Neprijatan miris temena, svrab i prekomerna masnoća",
      "Zategnuto ili crveno teme (često primećeno kod frizera)",
      "Oštećena kosa i ispucali krajevi",
      "Želja za boljim kvalitetom kose: volumen, punoća, sjaj"
    ],
    refreshTitle: "Osvežite se",
    refreshItems: [
      { title: "Osvežite teme", desc: "manje suvoće, svraba i masnoće" },
      { title: "Probudite se lakše", desc: "duboka relaksacija poboljšava kvalitet sna" },
      { title: "Oslobodite se umora", desc: "ublažava glavobolju, ukočen vrat i naprezanje očiju" },
      { title: "Rešite probleme kose", desc: "više volumena, elastičnosti i sjaja" },
      { title: "Lakše kroz sezonu alergija", desc: "osećaj čistog disanja i komfora" },
      { title: "Reset uma i tela", desc: "umiruje nervni sistem i vraća balans" },
      { title: "Lakše stilizovanje", desc: "kosa je poslušnija i jutarnja rutina brža" }
    ],
    treatmentsTitle: "Naši Head Spa tretmani",
    treatments: [
      {
        name: "Head Spa Signature",
        duration: "60–75 min",
        desc: "Dubinsko čišćenje + para + masaža + maska",
        note: "Idealno za prvi put i održavanje"
      },
      {
        name: "Detox & Growth Ritual",
        duration: "75–90 min",
        desc: "Fokus na detoks pora, cirkulaciju i rast kose",
        note: "Preporuka kod masnog temena i opadanja"
      },
      {
        name: "Luxury Relax & Repair",
        duration: "90+ min",
        desc: "Maksimalna relaksacija + intenzivna regeneracija",
        note: "Za suvu kosu, oštećenja i stres"
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
    benefitsTitle: "Head Spa Treatment Benefits",
    benefits: [
      { icon: "🧴", title: "Scalp Detox", desc: "Removes sebum, buildup, and impurities from pores" },
      { icon: "💆", title: "Better Circulation", desc: "Massage promotes blood flow and can help hair growth" },
      { icon: "✨", title: "Lifting Effect", desc: "Relaxation and drainage reduce puffiness and tighten the face" },
      { icon: "💎", title: "Healthier Hair", desc: "Nourishing formulas strengthen hair and reduce breakage" },
      { icon: "😴", title: "Better Sleep", desc: "Deep relaxation — wake up more rested" },
      { icon: "🧘", title: "Mental Reset", desc: "Aromatherapy + massage restore peace and focus" },
      { icon: "👁️", title: "Eye/Neck Relief", desc: "Ideal for computer work" },
      { icon: "🌿", title: "Mind & Body Reset", desc: "Calms the nervous system and restores balance" }
    ],
    concernsTitle: "What concerns you?",
    concerns: [
      "Hair loss, thinning, receding hairline, widening part",
      "Dry and flaky scalp (nutrient deficiency, stress)",
      "Unpleasant scalp odor, itching and excessive oiliness",
      "Tight or red scalp (often noticed by hairdressers)",
      "Damaged hair and split ends",
      "Desire for better hair quality: volume, fullness, shine"
    ],
    refreshTitle: "Refresh Yourself",
    refreshItems: [
      { title: "Refresh your scalp", desc: "less dryness, itching and oiliness" },
      { title: "Wake up easier", desc: "deep relaxation improves sleep quality" },
      { title: "Release fatigue", desc: "relieves headaches, stiff neck and eye strain" },
      { title: "Solve hair problems", desc: "more volume, elasticity and shine" },
      { title: "Easier through allergy season", desc: "feeling of clean breathing and comfort" },
      { title: "Mind & body reset", desc: "calms the nervous system and restores balance" },
      { title: "Easier styling", desc: "hair is more manageable and morning routine faster" }
    ],
    treatmentsTitle: "Our Head Spa Treatments",
    treatments: [
      {
        name: "Head Spa Signature",
        duration: "60–75 min",
        desc: "Deep cleansing + steam + massage + mask",
        note: "Ideal for first time and maintenance"
      },
      {
        name: "Detox & Growth Ritual",
        duration: "75–90 min",
        desc: "Focus on pore detox, circulation and hair growth",
        note: "Recommended for oily scalp and hair loss"
      },
      {
        name: "Luxury Relax & Repair",
        duration: "90+ min",
        desc: "Maximum relaxation + intensive regeneration",
        note: "For dry hair, damage and stress"
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
    benefitsTitle: "Преимущества Head Spa",
    benefits: [
      { icon: "🧴", title: "Детокс кожи головы", desc: "Удаляет себум, отложения и загрязнения из пор" },
      { icon: "💆", title: "Улучшение кровообращения", desc: "Массаж стимулирует кровоток и рост волос" },
      { icon: "✨", title: "Лифтинг эффект", desc: "Расслабление и дренаж уменьшают отечность" },
      { icon: "💎", title: "Здоровые волосы", desc: "Питательные формулы укрепляют волосы" },
      { icon: "😴", title: "Лучший сон", desc: "Глубокое расслабление — просыпайтесь отдохнувшими" },
      { icon: "🧘", title: "Ментальная перезагрузка", desc: "Ароматерапия + массаж возвращают покой" },
      { icon: "👁️", title: "Облегчение для глаз/шеи", desc: "Идеально при работе за компьютером" },
      { icon: "🌿", title: "Перезагрузка тела", desc: "Успокаивает нервную систему" }
    ],
    concernsTitle: "Что вас беспокоит?",
    concerns: [
      "Выпадение волос, истончение, залысины",
      "Сухая и шелушащаяся кожа головы",
      "Неприятный запах, зуд и чрезмерная жирность",
      "Напряженная или красная кожа головы",
      "Поврежденные волосы и секущиеся кончики",
      "Желание улучшить качество волос: объем, блеск"
    ],
    refreshTitle: "Освежитесь",
    refreshItems: [
      { title: "Освежите кожу головы", desc: "меньше сухости, зуда и жирности" },
      { title: "Просыпайтесь легче", desc: "глубокое расслабление улучшает сон" },
      { title: "Избавьтесь от усталости", desc: "снимает головную боль и напряжение" },
      { title: "Решите проблемы с волосами", desc: "больше объема и блеска" },
      { title: "Легче в сезон аллергии", desc: "ощущение чистого дыхания" },
      { title: "Перезагрузка ума и тела", desc: "успокаивает нервную систему" },
      { title: "Легче укладка", desc: "волосы послушнее" }
    ],
    treatmentsTitle: "Наши Head Spa процедуры",
    treatments: [
      {
        name: "Head Spa Signature",
        duration: "60–75 мин",
        desc: "Глубокое очищение + пар + массаж + маска",
        note: "Идеально для первого раза и поддержания"
      },
      {
        name: "Detox & Growth Ritual",
        duration: "75–90 мин",
        desc: "Фокус на детокс пор, кровообращение и рост волос",
        note: "Рекомендуется при жирной коже и выпадении"
      },
      {
        name: "Luxury Relax & Repair",
        duration: "90+ мин",
        desc: "Максимальное расслабление + интенсивная регенерация",
        note: "Для сухих волос, повреждений и стресса"
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
    benefitsTitle: "ประโยชน์ของ Head Spa",
    benefits: [
      { icon: "🧴", title: "ดีท็อกซ์หนังศีรษะ", desc: "กำจัดซีบัม สิ่งสะสม และสิ่งสกปรก" },
      { icon: "💆", title: "การไหลเวียนที่ดีขึ้น", desc: "การนวดกระตุ้นการไหลเวียนเลือด" },
      { icon: "✨", title: "เอฟเฟกต์ยกกระชับ", desc: "การผ่อนคลายลดอาการบวม" },
      { icon: "💎", title: "ผมที่แข็งแรง", desc: "สูตรบำรุงเสริมสร้างเส้นผม" },
      { icon: "😴", title: "นอนหลับดีขึ้น", desc: "การผ่อนคลายอย่างลึก" },
      { icon: "🧘", title: "รีเซ็ตจิตใจ", desc: "อโรมาเธอราพี + นวดคืนความสงบ" },
      { icon: "👁️", title: "บรรเทาตา/คอ", desc: "เหมาะสำหรับการทำงานหน้าคอม" },
      { icon: "🌿", title: "รีเซ็ตร่างกายและจิตใจ", desc: "สงบระบบประสาท" }
    ],
    concernsTitle: "คุณกังวลเรื่องอะไร?",
    concerns: [
      "ผมร่วง บาง แนวผมถอยร่น",
      "หนังศีรษะแห้งและลอก",
      "กลิ่นไม่พึงประสงค์ คัน และมัน",
      "หนังศีรษะตึงหรือแดง",
      "ผมเสียและปลายแตก",
      "ต้องการคุณภาพผมที่ดี: วอลลุ่ม เงางาม"
    ],
    refreshTitle: "รีเฟรชตัวเอง",
    refreshItems: [
      { title: "รีเฟรชหนังศีรษะ", desc: "ลดความแห้ง คัน และมัน" },
      { title: "ตื่นง่ายขึ้น", desc: "การผ่อนคลายช่วยการนอน" },
      { title: "ปลดปล่อยความเหนื่อยล้า", desc: "บรรเทาปวดหัวและความตึง" },
      { title: "แก้ปัญหาผม", desc: "วอลลุ่มและเงางามมากขึ้น" },
      { title: "ผ่านฤดูแพ้ง่ายขึ้น", desc: "หายใจสะอาดสบาย" },
      { title: "รีเซ็ตกายและใจ", desc: "สงบระบบประสาท" },
      { title: "จัดแต่งง่ายขึ้น", desc: "ผมเชื่อฟังมากขึ้น" }
    ],
    treatmentsTitle: "การรักษา Head Spa ของเรา",
    treatments: [
      {
        name: "Head Spa Signature",
        duration: "60–75 นาที",
        desc: "ทำความสะอาดลึก + ไอน้ำ + นวด + มาส์ก",
        note: "เหมาะสำหรับครั้งแรกและการบำรุงรักษา"
      },
      {
        name: "Detox & Growth Ritual",
        duration: "75–90 นาที",
        desc: "เน้นดีท็อกซ์รูขุมขน การไหลเวียน และการเติบโตของผม",
        note: "แนะนำสำหรับหนังศีรษะมันและผมร่วง"
      },
      {
        name: "Luxury Relax & Repair",
        duration: "90+ นาที",
        desc: "ผ่อนคลายสูงสุด + การฟื้นฟูอย่างเข้มข้น",
        note: "สำหรับผมแห้ง ความเสียหาย และความเครียด"
      }
    ],
    processTitle: "ขั้นตอนการรักษา",
    processSteps: [
      "นวดคอ ไหล่ และหน้าอก",
      "ทำความสะอาดลึกและขัดหนังศีรษะเบาๆ",
      "ไอน้ำอุ่นเปิดรูขุมขนและให้ความชุ่มชื้น",
      "มาส์ก + นวดหนังศีรษะที่จุดกด",
      "การดูแลผมขั้นสุดท้าย — นุ่ม เงา และสางง่าย"
    ],
    contraTitle: "สำคัญ",
    contraText: "ไม่แนะนำการรักษาหากคุณมี:",
    contraItems: [
      "ต่อผม",
      "ย้อมผมใหม่",
      "การติดเชื้อหนังศีรษะ",
      "หนังศีรษะไวมาก",
      "ตั้งครรภ์",
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
  const [waveOffset, setWaveOffset] = useState(0);
  const sectionsRef = useRef({});

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

    // Observe all sections
    const sections = document.querySelectorAll(".hs-animate");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Wave parallax effect on scroll
  useEffect(() => {
    let rafId = null;
    let lastScrollY = 0;

    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Only apply parallax in first 600px of scroll
        const offset = Math.min(Math.max(scrollY * 0.12, 0), 50);
        setWaveOffset(offset);
        lastScrollY = scrollY;
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
          
          <div className="hs-hero-content">
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

        {/* INTRO PARALLAX SECTION - Between Hero and Refresh */}
        <section id="hs-intro-parallax" className="hs-intro-parallax">
          {/* Top gold wave line */}
          <div className="hs-intro-wave-top" aria-hidden="true"></div>
          <div className="hs-intro-wave-top-stroke" aria-hidden="true"></div>
          
          {/* Black content area */}
          <div className="hs-intro-content">
            <h2 className="hs-intro-title">{content.introTitle}</h2>
            <p className="hs-intro-text">{content.introText}</p>
          </div>
          
          {/* Bottom gold wave line */}
          <div className="hs-intro-wave-bottom" aria-hidden="true"></div>
          <div className="hs-intro-wave-bottom-stroke" aria-hidden="true"></div>
        </section>

        {/* REFRESH SECTION - Parallax Effect */}
        <section id="hs-refresh" className="hs-section hs-refresh hs-parallax hs-animate">
          <div className="hs-parallax-bg"></div>
          <div className={`hs-container ${isVisible["hs-refresh"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.refreshTitle}</h2>
            <div className="hs-refresh-grid">
              {content.refreshItems.map((item, index) => (
                <div 
                  key={index} 
                  className="hs-refresh-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="hs-refresh-title">{item.title}</span>
                  <span className="hs-refresh-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONCERNS SECTION */}
        <section id="hs-concerns" className="hs-section hs-concerns hs-animate">
          <div className={`hs-container ${isVisible["hs-concerns"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.concernsTitle}</h2>
            <div className="hs-concerns-grid">
              {content.concerns.map((concern, index) => (
                <div 
                  key={index} 
                  className="hs-concern-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="hs-concern-icon">•</span>
                  <span className="hs-concern-text">{concern}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section id="hs-benefits" className="hs-section hs-benefits hs-animate">
          <div className={`hs-container ${isVisible["hs-benefits"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.benefitsTitle}</h2>
            <div className="hs-benefits-grid">
              {content.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="hs-benefit-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className="hs-benefit-icon">{benefit.icon}</span>
                  <h3 className="hs-benefit-title">{benefit.title}</h3>
                  <p className="hs-benefit-desc">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TREATMENTS SECTION */}
        <section id="hs-treatments" className="hs-section hs-treatments hs-animate">
          <div className={`hs-container ${isVisible["hs-treatments"] ? "hs-visible" : ""}`}>
            <h2 className="hs-section-title">{content.treatmentsTitle}</h2>
            <div className="hs-treatments-grid">
              {content.treatments.map((treatment, index) => (
                <div 
                  key={index} 
                  className="hs-treatment-card"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="hs-treatment-header">
                    <h3 className="hs-treatment-name">{treatment.name}</h3>
                    <span className="hs-treatment-duration">{treatment.duration}</span>
                  </div>
                  <p className="hs-treatment-desc">{treatment.desc}</p>
                  <p className="hs-treatment-note">{treatment.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
            <Link to="/contact" className="hs-cta-button">
              {content.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeadSpa;
