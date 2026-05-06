const fs = require('fs');
const path = require('path');

const presetsDir = path.join(__dirname, 'data', 'presets');

const premiumData = {
  photographer_portfolio: {
    meta: { title: "Artistic Lens | Photography", description: "Capturing timeless moments with a creative touch. Portraits, Landscapes, and Events." },
    tags: ["photographer", "portfolio", "art"],
    slogan: { en: ["Capture the Moment", "Through the Lens", "Timeless Art"], de: ["Den Moment festhalten", "Durch das Objektiv", "Zeitlose Kunst"], ru: ["Поймай момент", "Взгляд через объектив", "Вечное искусство"] },
    about: { en: "We turn fleeting moments into lasting memories through the art of photography.", de: "Wir verwandeln flüchtige Momente in bleibende Erinnerungen.", ru: "Мы превращаем мимолётные мгновения в долгие воспоминания." },
    services: [
      { n_en: "Portrait Session", n_de: "Porträt-Session", n_ru: "Сессия портрета", p: "$300", d_en: "Professional indoor/outdoor portraits.", i: "portrait.jpg" },
      { n_en: "Wedding Day", n_de: "Hochzeitstag", n_ru: "Свадебный день", p: "$2000", d_en: "Full day coverage of your special day.", i: "wedding.jpg" }
    ],
    testimonials: [{ n: "Emma W.", t_en: "Absolutely stunning photos! She captured our day perfectly.", r: 5, a: "emma.jpg" }],
    logo: { t: "ARTISTIC", tg: "LENS", f: "Playfair Display" }
  },
  beauty_salon: {
    meta: { title: "Glow Up Beauty | Premium Salon", description: "Hair, makeup, and skincare services to make you look and feel beautiful." },
    tags: ["beauty", "salon", "makeup"],
    slogan: { en: ["Feel Beautiful", "Unleash Your Glow", "Expert Care"], de: ["Fühl dich schön", "Entfessle deinen Glow", "Expertinpflege"], ru: ["Почувствуй красоту", "Раскрой свое сияние", "Экспертный уход"] },
    about: { en: "Our mission is to enhance your natural beauty with top-quality products and expert stylists.", de: "Unsere Mission ist es, Ihre natürliche Schönheit zu betonen.", ru: "Наша миссия — подчеркнуть вашу природную красоту." },
    services: [
      { n_en: "Hair Styling", n_de: "Haarstyling", n_ru: "Укладка волос", p: "$80", d_en: "Cut, color, and style.", i: "hair.jpg" },
      { n_en: "Makeup Application", n_de: "Make-up", n_ru: "Макияж", p: "$60", d_en: "Bridal and evening makeup.", i: "makeup.jpg" }
    ],
    testimonials: [{ n: "Sophia R.", t_en: "Best salon in town, my hair has never looked better!", r: 5, a: "sophia.jpg" }],
    logo: { t: "GLOW", tg: "UP", f: "Dancing Script" }
  },
  web_agency: {
    meta: { title: "Pixel Perfect | Digital Agency", description: "We build stunning websites and apps that drive results for your business." },
    tags: ["web", "agency", "design"],
    slogan: { en: ["Code the Future", "Digital Excellence", "Innovate Now"], de: ["Coden für die Zukunft", "Digitale Exzellenz", "Jetzt innovieren"], ru: ["Кодируй будущее", "Цифровое совершенство", "Инновации сейчас"] },
    about: { en: "We are a team of passionate designers and developers creating digital masterpieces.", de: "Wir sind ein Team leidenschaftlicher Designer und Entwickler.", ru: "Мы команда увлеченных дизайнеров и разработчиков." },
    services: [
      { n_en: "Web Development", n_de: "Webentwicklung", n_ru: "Веб-разработка", p: "$5000+", d_en: "Custom websites and platforms.", i: "web.jpg" },
      { n_en: "UI/UX Design", n_de: "UI/UX Design", n_ru: "UI/UX Дизайн", p: "$3000+", d_en: "User-centered design strategies.", i: "uiux.jpg" }
    ],
    testimonials: [{ n: "TechCorp", t_en: "Our new website increased leads by 200%. Incredible work.", r: 5, a: "techcorp.jpg" }],
    logo: { t: "PIXEL", tg: "PERFECT", f: "Inter" }
  },
  fashion_store: {
    meta: { title: "Vogue Corner | Fashion Store", description: "Discover the latest trends in fashion for men and women. Premium quality apparel." },
    tags: ["fashion", "store", "clothing"],
    slogan: { en: ["Dress to Impress", "Trendy & Chic", "Style Redefined"], de: ["Kleide dich, um zu beeindrucken", "Trendig & Schick", "Stil neu definiert"], ru: ["Оденься, чтобы впечатлять", "Модно и стильно", "Стиль переосмыслен"] },
    about: { en: "Curating the best fashion pieces from around the world for the modern wardrobe.", de: "Die besten Mode-Stücke für den modernen Kleiderschrank.", ru: "Лучшие модные вещи со всего мира для современного гардероба." },
    services: [
      { n_en: "Summer Collection", n_de: "Sommerkollektion", n_ru: "Летняя коллекция", p: "$50+", d_en: "Light and breathable fabrics.", i: "summer.jpg" },
      { n_en: "Accessories", n_de: "Accessoires", n_ru: "Аксессуары", p: "$30+", d_en: "Complete your look.", i: "accessories.jpg" }
    ],
    testimonials: [{ n: "Olivia F.", t_en: "Always find something unique here. Love the quality!", r: 5, a: "olivia.jpg" }],
    logo: { t: "VOGUE", tg: "CORNER", f: "Playfair Display" }
  },
  boutique_hotel: {
    meta: { title: "Grand Plaza | Boutique Hotel", description: "Experience luxury and comfort in the heart of the city. Your perfect stay awaits." },
    tags: ["hotel", "luxury", "travel"],
    slogan: { en: ["Live Luxury", "Your Oasis", "Unforgettable Stay"], de: ["Leben Sie luxuriös", "Ihre Oase", "Unvergesslicher Aufenthalt"], ru: ["Живи роскошно", "Твой оазис", "Незабываемый отдых"] },
    about: { en: "Nestled in the city center, Grand Plaza offers an oasis of calm and sophistication.", de: "Im Herzen der Stadt bietet Grand Plaza eine Oase der Ruhe.", ru: "В центре города Grand Plaza предлагает оазис спокойствия." },
    services: [
      { n_en: "Deluxe Suite", n_de: "Deluxe Suite", n_ru: "Люкс Сьют", p: "$250/night", d_en: "Spacious rooms with city views.", i: "suite.jpg" },
      { n_en: "Spa Access", n_de: "Spa-Zugang", n_ru: "Доступ в СПА", p: "$50", d_en: "Rejuvenate with our spa treatments.", i: "spa.jpg" }
    ],
    testimonials: [{ n: "Mr. Smith", t_en: "The service was impeccable. Will definitely return.", r: 5, a: "smith.jpg" }],
    logo: { t: "GRAND", tg: "PLAZA", f: "Cormorant Garamond" }
  },
  interior_designer: {
    meta: { title: "Space Architects | Interior Design", description: "Transforming houses into dream homes with innovative design solutions." },
    tags: ["design", "interior", "architecture"],
    slogan: { en: ["Design Your Life", "Spaces That Inspire", "Modern Living"], de: ["Gestalte dein Leben", "Räume, die inspirieren", "Modernes Wohnen"], ru: ["Спроектируй свою жизнь", "Пространства, вдохновляющие", "Современная жизнь"] },
    about: { en: "We believe in creating spaces that reflect your personality and lifestyle.", de: "Wir glauben an Räume, die Ihre Persönlichkeit widerspiegeln.", ru: "Мы верим в создание пространств, отражающих вашу личность." },
    services: [
      { n_en: "Residential Design", n_de: "Wohndesign", n_ru: "Дизайн жилья", p: "$5000+", d_en: "Full home interior makeover.", i: "residential.jpg" },
      { n_en: "Commercial Spaces", n_de: "Gewerbliche Räume", n_ru: "Коммерческие помещения", p: "$10000+", d_en: "Office and retail design.", i: "commercial.jpg" }
    ],
    testimonials: [{ n: "Anna B.", t_en: "They transformed my small apartment into a palace!", r: 5, a: "anna.jpg" }],
    logo: { t: "SPACE", tg: "ARCHITECTS", f: "Space Mono" }
  },
  wedding_photographer: {
    meta: { title: "Eternal Moments | Wedding Photo", description: "Capturing the romance and joy of your wedding day with artistic flair." },
    tags: ["wedding", "photo", "love"],
    slogan: { en: ["Love Stories", "Forever Yours", "Pure Emotion"], de: ["Liebesgeschichten", "Für immer dir", "Reine Emotion"], ru: ["Истории любви", "Навеки твое", "Чистая эмоция"] },
    about: { en: "We specialize in candid wedding photography that tells your unique love story.", de: "Wir spezialisieren uns auf natürliche Hochzeitsfotografie.", ru: "Мы специализируемся на естественной свадебной фотографии." },
    services: [
      { n_en: "Full Day Package", n_de: "Ganztagespaket", n_ru: "Пакет на весь день", p: "$2500", d_en: "From preparation to party.", i: "full_day.jpg" },
      { n_en: "Engagement Shoot", n_de: "Verlobungs-Shooting", n_ru: "Love Story съемка", p: "$400", d_en: "Beautiful pre-wedding memories.", i: "engagement.jpg" }
    ],
    testimonials: [{ n: "James & Lily", t_en: "Our photos are breathtaking. Thank you for everything!", r: 5, a: "couple.jpg" }],
    logo: { t: "ETERNAL", tg: "MOMENTS", f: "Great Vibes" }
  },
  coffee_shop: {
    meta: { title: "Bean There | Specialty Coffee", description: "Artisan coffee, fresh pastries, and a cozy atmosphere to work or relax." },
    tags: ["coffee", "cafe", "barista"],
    slogan: { en: ["Brewed to Perfection", "Taste the Bean", "Wake Up Call"], de: ["Perfekt aufgebrüht", "Schmecke die Bohne", "Weckruf"], ru: ["Сварено до совершенства", "Почувствуй вкус", "Сигнал к пробуждению"] },
    about: { en: "We source the finest beans and roast them to perfection to bring you the best cup.", de: "Wir beziehen die feinsten Bohnen und rösten sie perfekt.", ru: "Мы закупаем лучшие зерна и обжариваем их до совершенства." },
    services: [
      { n_en: "Pour Over", n_de: "Pour Over", n_ru: "Пуровер", p: "$5", d_en: "Handcrafted single cup.", i: "pourover.jpg" },
      { n_en: "Fresh Pastries", n_de: "Frische Gebäck", n_ru: "Свежая выпечка", p: "$3", d_en: "Baked fresh every morning.", i: "pastry.jpg" }
    ],
    testimonials: [{ n: "David C.", t_en: "Best latte art in town and the vibe is just perfect.", r: 5, a: "david.jpg" }],
    logo: { t: "BEAN", tg: "THERE", f: "Pacifico" }
  },
  bakery: {
    meta: { title: "Sweet Tooth | Artisan Bakery", description: "Freshly baked bread, croissants, and cakes made with love and premium ingredients." },
    tags: ["bakery", "bread", "cakes"],
    slogan: { en: ["Freshly Baked Joy", "Taste the Difference", "Daily Fresh"], de: ["Frisch gebackene Freude", "Schmecke den Unterschied", "Täglich frisch"], ru: ["Свежая радость", "Почувствуй разницу", "Каждый день свежее"] },
    about: { en: "Our passion is baking traditional recipes with a modern twist using organic flour.", de: "Unsere Leidenschaft ist das Backen traditioneller Rezepte.", ru: "Наша страсть — выпечка традиционных рецептов с современным подходом." },
    services: [
      { n_en: "Sourdough Bread", n_de: "Sauerteigbrot", n_ru: "Хлеб на закваске", p: "$8", d_en: "Classic and rye varieties.", i: "bread.jpg" },
      { n_en: "Custom Cakes", n_de: "Maßgefertigte Kuchen", n_ru: "Торты на заказ", p: "$50+", d_en: "For birthdays and events.", i: "cake.jpg" }
    ],
    testimonials: [{ n: "Grandma L.", t_en: "Reminds me of my childhood bakery. Absolutely delicious!", r: 5, a: "grandma.jpg" }],
    logo: { t: "SWEET", tg: "TOOTH", f: "Cookie" }
  },
  coworking_space: {
    meta: { title: "Hub Workspace | Co-working", description: "Flexible desk spaces, high-speed internet, and a community of creators." },
    tags: ["coworking", "office", "workspace"],
    slogan: { en: ["Create Together", "Work Smarter", "Join the Hub"], de: ["Gemeinsam schaffen", "Intelligenter arbeiten", "Tritt dem Hub bei"], ru: ["Творим вместе", "Работай умнее", "Присоединяйся к Хабу"] },
    about: { en: "A place where freelancers and startups grow together in a productive environment.", de: "Ein Ort, an dem Freelancer und Startups gemeinsam wachsen.", ru: "Место, где фрилансеры и стартапы растут вместе." },
    services: [
      { n_en: "Hot Desk", n_de: "Flex-Arbeitsplatz", n_ru: "Горячее место", p: "$25/day", d_en: "Flexible seating in open space.", i: "hotdesk.jpg" },
      { n_en: "Meeting Room", n_de: "Besprechungsraum", n_ru: "Переговорная", p: "$50/hr", d_en: "Equipped for presentations.", i: "meeting.jpg" }
    ],
    testimonials: [{ n: "Startup X", t_en: "The networking opportunities here are incredible.", r: 5, a: "startup.jpg" }],
    logo: { t: "HUB", tg: "WORKSPACE", f: "Archivo Black" }
  },
  business_consulting: {
    meta: { title: "Strategic Minds | Consulting", description: "Strategic business consulting to drive growth, efficiency, and innovation." },
    tags: ["consulting", "business", "strategy"],
    slogan: { en: ["Growth Partners", "Think Strategic", "Business Evolved"], de: ["Wachstumspartner", "Denke strategisch", "Business entwickelt"], ru: ["Партнеры по росту", "Мысли стратегически", "Бизнес эволюционирует"] },
    about: { en: "We partner with businesses to unlock their full potential through strategic planning.", de: "Wir helfen Unternehmen, ihr volles Potenzial auszuschöpfen.", ru: "Мы помогаем бизнесу раскрыть свой полный потенциал." },
    services: [
      { n_en: "Market Analysis", n_de: "Marktanalyse", n_ru: "Анализ рынка", p: "$2000", d_en: "Deep dive into market trends.", i: "market.jpg" },
      { n_en: "Financial Planning", n_de: "Finanzplanung", n_ru: "Финансовое планирование", p: "$3000", d_en: "Secure your company's future.", i: "finance.jpg" }
    ],
    testimonials: [{ n: "CEO Corp", t_en: "Their insights saved our Q3. Highly recommended.", r: 5, a: "ceo.jpg" }],
    logo: { t: "STRATEGIC", tg: "MINDS", f: "Merriweather" }
  },
  saas_startup: {
    meta: { title: "CloudScale | SaaS Platform", description: "Scalable cloud solutions for modern businesses. Automate and grow." },
    tags: ["saas", "cloud", "tech"],
    slogan: { en: ["Scale Infinite", "Future Ready", "Cloud Native"], de: ["Unendlich skalieren", "Zukunftsbereit", "Cloud Native"], ru: ["Бесконечный масштаб", "Готов к будущему", "Облачные технологии"] },
    about: { en: "Building the infrastructure that powers the next generation of digital products.", de: "Wir bauen die Infrastruktur für die nächste Generation.", ru: "Мы строим инфраструктуру для следующего поколения продуктов." },
    services: [
      { n_en: "CRM Setup", n_de: "CRM-Einrichtung", n_ru: "Настройка CRM", p: "$500/mo", d_en: "Manage your leads effectively.", i: "crm.jpg" },
      { n_en: "Data Analytics", n_de: "Datenanalyse", n_ru: "Аналитика данных", p: "$800/mo", d_en: "Make data-driven decisions.", i: "analytics.jpg" }
    ],
    testimonials: [{ n: "Dev Inc", t_en: "CloudScale helped us handle 10x traffic overnight.", r: 5, a: "dev.jpg" }],
    logo: { t: "CLOUD", tg: "SCALE", f: "Orbitron" }
  },
  construction_company: {
    meta: { title: "BuildRight | Construction", description: "Quality construction services from residential to commercial projects." },
    tags: ["construction", "building", "renovation"],
    slogan: { en: ["Building Futures", "Solid Foundations", "Built to Last"], de: ["Zukunft bauen", "Solide Fundamente", "Gebaut für die Ewigkeit"], ru: ["Строим будущее", "Крепкий фундамент", "Построено на века"] },
    about: { en: "With 20 years of experience, we deliver quality construction on time and on budget.", de: "Mit 20 Jahren Erfahrung liefern wir Qualität.", ru: "С 20-летним опытом мы гарантируем качество." },
    services: [
      { n_en: "Home Renovation", n_de: "Hausrenovierung", n_ru: "Ремонт дома", p: "$10k+", d_en: "Transform your living space.", i: "reno.jpg" },
      { n_en: "New Build", n_de: "Neubau", n_ru: "Новое строительство", p: "$100k+", d_en: "From foundation to roof.", i: "build.jpg" }
    ],
    testimonials: [{ n: "Homeowner", t_en: "Professional team, clean work, amazing results.", r: 5, a: "home.jpg" }],
    logo: { t: "BUILDRIGHT", tg: "", f: "Bebas Neue" }
  },
  real_estate: {
    meta: { title: "Prime Property | Real Estate", description: "Find your dream home or investment property with our expert agents." },
    tags: ["real estate", "property", "housing"],
    slogan: { en: ["Find Your Dream", "Home Sweet Home", "Invest Wise"], de: ["Finde deinen Traum", "Zuhause ist es am schönsten", "Klug investieren"], ru: ["Найди свою мечту", "Все дороги ведут домой", "Инвестируй с умом"] },
    about: { en: "Connecting people with properties that match their lifestyle and budget.", de: "Wir verbinden Menschen mit Immobilien.", ru: "Мы соединяем людей с недвижимостью." },
    services: [
      { n_en: "Property Listing", n_de: "Immobilienangebote", n_ru: "Продажа недвижимости", p: "2% Commission", d_en: "Sell your property fast.", i: "listing.jpg" },
      { n_en: "Buying Assistance", n_de: "Kaufhilfe", n_ru: "Помощь в покупке", p: "1.5% Fee", d_en: "Find the best deals.", i: "buying.jpg" }
    ],
    testimonials: [{ n: "Family G.", t_en: "They found us a house in 2 weeks. Amazing service!", r: 5, a: "family.jpg" }],
    logo: { t: "PRIME", tg: "PROPERTY", f: "Georgia" }
  },
  musician: {
    meta: { title: "Melody Lane | Music Production", description: "Professional music production, mixing, and mastering for artists." },
    tags: ["music", "producer", "studio"],
    slogan: { en: ["Feel the Rhythm", "Sound of Art", "Create Magic"], de: ["Spüre den Rhythmus", "Klang der Kunst", "Magie erschaffen"], ru: ["Почувствуй ритм", "Звук искусства", "Создай магию"] },
    about: { en: "We help artists bring their musical vision to life with industry-standard gear.", de: "Wir helfen Künstlern, ihre Vision zu verwirklichen.", ru: "Мы помогаем артистам воплотить музыкальные идеи в жизнь." },
    services: [
      { n_en: "Studio Recording", n_de: "Studioaufnahme", n_ru: "Студийная запись", p: "$100/hr", d_en: "Top-tier microphones and gear.", i: "recording.jpg" },
      { n_en: "Mixing & Mastering", n_de: "Mixing & Mastering", n_ru: "Сведение и мастеринг", p: "$500/track", d_en: "Radio-ready sound.", i: "mixing.jpg" }
    ],
    testimonials: [{ n: "DJ Pulse", t_en: "The acoustics in this studio are out of this world.", r: 5, a: "dj.jpg" }],
    logo: { t: "MELODY", tg: "LANE", f: "Rock Salt" }
  },
  personal_blog: {
    meta: { title: "Life Unscripted | Personal Blog", description: "Thoughts on life, travel, and everything in between. Join the journey." },
    tags: ["blog", "lifestyle", "travel"],
    slogan: { en: ["Stories & Thoughts", "Live Authentic", "Unscripted Life"], de: ["Geschichten & Gedanken", "Leb authentisch", "Unscripted Leben"], ru: ["Истории и мысли", "Живи аутентично", "Несценарная жизнь"] },
    about: { en: "A personal journey through the ups and downs of life, shared with honesty.", de: "Eine persönliche Reise durch das Leben, ehrlich geteilt.", ru: "Личное путешествие по жизни, честно поделенное с вами." },
    services: [
      { n_en: "Weekly Posts", n_de: "Wöchentliche Posts", n_ru: "Еженедельные посты", p: "Free", d_en: "Deep dives into topics.", i: "posts.jpg" },
      { n_en: "Newsletter", n_de: "Newsletter", n_ru: "Рассылка", p: "$5/mo", d_en: "Exclusive content.", i: "newsletter.jpg" }
    ],
    testimonials: [{ n: "Reader R.", t_en: "Your blog is my weekly dose of inspiration. Thank you!", r: 5, a: "reader.jpg" }],
    logo: { t: "LIFE", tg: "UNSCRIPTED", f: "Libre Baskerville" }
  },
  non_profit: {
    meta: { title: "Helping Hand | Charity Org", description: "Dedicated to making a difference in the lives of those in need." },
    tags: ["charity", "non-profit", "donation"],
    slogan: { en: ["Change the World", "Give Hope", "Together We Can"], de: ["Verändere die Welt", "Gib Hoffnung", "Gemeinsam können wir"], ru: ["Измени мир", "Дай надежду", "Вместе мы сможем"] },
    about: { en: "Our mission is to provide resources and support to underprivileged communities.", de: "Unsere Mission ist es, benachteiligten Gemeinschaften zu helfen.", ru: "Наша миссия — помогать нуждающимся сообществам." },
    services: [
      { n_en: "Food Drives", n_de: "Lebensmittelsammlungen", n_ru: "Сбор продуктов", p: "Donation", d_en: "Fighting hunger locally.", i: "food.jpg" },
      { n_en: "Education Fund", n_de: "Bildungsfonds", n_ru: "Фонд образования", p: "Sponsorship", d_en: "Sponsoring children's education.", i: "edu.jpg" }
    ],
    testimonials: [{ n: "Volunteer M.", t_en: "The most rewarding experience of my life.", r: 5, a: "volunteer.jpg" }],
    logo: { t: "HELPING", tg: "HAND", f: "Nunito" }
  },
  kindergarten: {
    meta: { title: "Little Explorers | Kindergarten", description: "A safe and fun environment for children to learn, play, and grow." },
    tags: ["kindergarten", "kids", "education"],
    slogan: { en: ["Learn Through Play", "Happy Kids", "Bright Future"], de: ["Lernen durch Spielen", "Glückliche Kinder", "Bright Future"], ru: ["Учись играя", "Счастливые дети", "Светлое будущее"] },
    about: { en: "We foster creativity and curiosity in a nurturing environment for early development.", de: "Wir fördern Kreativität und Neugier im frühen Alter.", ru: "Мы поощряем креативность и любознательность у детей." },
    services: [
      { n_en: "Early Learning", n_de: "Frühe Bildung", n_ru: "Раннее развитие", p: "$800/mo", d_en: "ABCs and 123s.", i: "learning.jpg" },
      { n_en: "Arts & Crafts", n_de: "Kunst & Handwerk", n_ru: "Творчество", p: "Included", d_en: "Unleashing creativity.", i: "art.jpg" }
    ],
    testimonials: [{ n: "Mom T.", t_en: "My daughter loves it here! She learns so much every day.", r: 5, a: "mom.jpg" }],
    logo: { t: "LITTLE", tg: "EXPLORERS", f: "Comfortaa" }
  },
  law_firm: {
    meta: { title: "Justice & Co. | Law Firm", description: "Experienced legal representation for corporate and private clients." },
    tags: ["law", "legal", "justice"],
    slogan: { en: ["Your Legal Shield", "Defending Rights", "Justice Served"], de: ["Dein Rechtsschirm", "Rechte verteidigen", "Gerechtigkeit"], ru: ["Твой правовой щит", "Защита прав", "Правосудие"] },
    about: { en: "Providing robust legal strategies to protect your interests and assets.", de: "Wir bieten robuste Rechtsstrategien zum Schutz Ihrer Interessen.", ru: "Мы предоставляем надежные юридические стратегии." },
    services: [
      { n_en: "Corporate Law", n_de: "Unternehmensrecht", n_ru: "Корпоративное право", p: "$400/hr", d_en: "Contracts and mergers.", i: "corporate.jpg" },
      { n_en: "Family Law", n_de: "Familienrecht", n_ru: "Семейное право", p: "$250/hr", d_en: "Divorce and custody.", i: "family.jpg" }
    ],
    testimonials: [{ n: "Client X", t_en: "They won a seemingly impossible case. Top tier lawyers.", r: 5, a: "client.jpg" }],
    logo: { t: "JUSTICE", tg: "& CO.", f: "Times New Roman" }
  },
  logistics: {
    meta: { title: "Swift Logistics | Transport", description: "Fast and reliable logistics solutions for global shipping needs." },
    tags: ["logistics", "shipping", "transport"],
    slogan: { en: ["Delivered on Time", "Global Reach", "Swift & Safe"], de: ["Pünktlich geliefert", "Globaler Reach", "Schnell & Sicher"], ru: ["Доставлено вовремя", "Глобальный охват", "Быстро и безопасно"] },
    about: { en: "Streamlining supply chains with technology and a vast network of carriers.", de: "Wir optimieren Lieferketten mit Technologie.", ru: "Мы оптимизируем цепочки поставок с помощью технологий." },
    services: [
      { n_en: "Freight Shipping", n_de: "Frachtschifffahrt", n_ru: "Грузоперевозки", p: "Quote", d_en: "Sea, air, and land.", i: "freight.jpg" },
      { n_en: "Warehousing", n_de: "Lagerhaltung", n_ru: "Складские услуги", p: "$2/pallet", d_en: "Secure storage solutions.", i: "warehouse.jpg" }
    ],
    testimonials: [{ n: "Logistics Mgr", t_en: "Reduced our shipping costs by 30%. Highly efficient.", r: 5, a: "mgr.jpg" }],
    logo: { t: "SWIFT", tg: "LOGISTICS", f: "Roboto" }
  },
  dental_clinic: {
    meta: { title: "Bright Smile | Dental Clinic", description: "Modern dentistry with a gentle touch. Your smile is our priority." },
    tags: ["dental", "health", "smile"],
    slogan: { en: ["Smile with Confidence", "Healthy Teeth", "Gentle Care"], de: ["Lächeln mit Vertrauen", "Gesunde Zähne", "Sanfte Pflege"], ru: ["Улыбайся с уверенностью", "Здоровые зубы", "Заботливое лечение"] },
    about: { en: "Using the latest technology to provide painless and effective dental treatments.", de: "Modernste Technologie für schmerzfreie Behandlungen.", ru: "Современные технологии для безболезненного лечения." },
    services: [
      { n_en: "Teeth Whitening", n_de: "Zahnaufhellung", n_ru: "Отбеливание", p: "$300", d_en: "Brighten your smile in an hour.", i: "whiten.jpg" },
      { n_en: "Check-up", n_de: "Check-up", n_ru: "Осмотр", p: "$80", d_en: "Regular dental health monitoring.", i: "checkup.jpg" }
    ],
    testimonials: [{ n: "Patient K.", t_en: "The dentist was so gentle, I actually fell asleep!", r: 5, a: "patient.jpg" }],
    logo: { t: "BRIGHT", tg: "SMILE", f: "Quicksand" }
  },
  spa_center: {
    meta: { title: "Tranquil Spa | Wellness Center", description: "Rejuvenate your mind and body with our luxury spa treatments." },
    tags: ["spa", "wellness", "relaxation"],
    slogan: { en: ["Relax & Rejuvenate", "Pure Bliss", "Inner Harmony"], de: ["Entspannen & Verjüngen", "Reine Seligkeit", "Innere Harmonie"], ru: ["Расслабься и обновись", "Чистое блаженство", "Внутренняя гармония"] },
    about: { en: "An oasis of calm where we use organic products to soothe your senses.", de: "Eine Oase der Ruhe mit organischen Produkten.", ru: "Оазис спокойствия с органическими продуктами." },
    services: [
      { n_en: "Deep Tissue Massage", n_de: "Tiefengewebsmassage", n_ru: "Глубокий массаж", p: "$120", d_en: "Release tension and stress.", i: "massage.jpg" },
      { n_en: "Facial Treatment", n_de: "Gesichtsbehandlung", n_ru: "Уход за лицом", p: "$90", d_en: "Glowing skin guaranteed.", i: "facial.jpg" }
    ],
    testimonials: [{ n: "Relaxed R.", t_en: "Best massage of my life. I feel like a new person.", r: 5, a: "relaxed.jpg" }],
    logo: { t: "TRANQUIL", tg: "SPA", f: "Cinzel" }
  },
  jewelry_store: {
    meta: { title: "Gem Gallery | Jewelry Store", description: "Exquisite jewelry pieces crafted with precision and passion." },
    tags: ["jewelry", "luxury", "gems"],
    slogan: { en: ["Timeless Elegance", "Shine Bright", "Exquisite Gems"], de: ["Zeitlose Eleganz", "Strahlend schön", "Exquisite Edelsteine"], ru: ["Вечная элегантность", "Сияй ярко", "Изысканные камни"] },
    about: { en: "Every piece tells a story. We craft jewelry that becomes a family heirloom.", de: "Jedes Stück erzählt eine Geschichte. Wir fertigen Schmuck für Generationen.", ru: "Каждое изделие рассказывает историю. Мы создаем украшения на поколения." },
    services: [
      { n_en: "Custom Rings", n_de: "Maßgefertigte Ringe", n_ru: "Кольца на заказ", p: "$1000+", d_en: "Engagement and wedding rings.", i: "rings.jpg" },
      { n_en: "Watch Collection", n_de: "Uhrensammlung", n_ru: "Коллекция часов", p: "$500+", d_en: "Luxury timepieces.", i: "watches.jpg" }
    ],
    testimonials: [{ n: "Fiance M.", t_en: "She said yes! The ring is absolutely stunning.", r: 5, a: "fiance.jpg" }],
    logo: { t: "GEM", tg: "GALLERY", f: "Cormorant" }
  },
  auto_service: {
    meta: { title: "Pro Mechanic | Auto Service", description: "Expert car repair and maintenance. Honest service you can trust." },
    tags: ["auto", "mechanic", "repair"],
    slogan: { en: ["Drive with Confidence", "Engine Experts", "Honest Repair"], de: ["Fahren mit Vertrauen", "Motoren-Experten", "Ehrliche Reparatur"], ru: ["Води с уверенностью", "Эксперты по двигателям", "Честный ремонт"] },
    about: { en: "We treat your car like it's our own. Transparent pricing and expert diagnostics.", de: "Wir behandeln Ihr Auto, wie unseres. Transparente Preise.", ru: "Мы относимся к вашей машине как к своей. Прозрачные цены." },
    services: [
      { n_en: "Oil Change", n_de: "Ölwechsel", n_ru: "Замена масла", p: "$50", d_en: "Synthetic and conventional.", i: "oil.jpg" },
      { n_en: "Brake Service", n_de: "Bremsenservice", n_ru: "Обслуживание тормозов", p: "$300", d_en: "Safety first.", i: "brakes.jpg" }
    ],
    testimonials: [{ n: "Driver P.", t_en: "Finally an honest mechanic. Fast and reliable work.", r: 5, a: "driver.jpg" }],
    logo: { t: "PRO", tg: "MECHANIC", f: "Staatliches" }
  },
  travel_agency: {
    meta: { title: "Wanderlust | Travel Agency", description: "Your journey begins here. Custom travel packages and exotic destinations." },
    tags: ["travel", "vacation", "tours"],
    slogan: { en: ["Explore the World", "Adventure Awaits", "Travel More"], de: ["Entdecke die Welt", "Abenteuer wartet", "Reise mehr"], ru: ["Исследуй мир", "Приключение ждет", "Путешествуй больше"] },
    about: { en: "Creating unforgettable travel experiences tailored to your desires and budget.", de: "Wir kreieren unvergessliche Reiseerlebnisse.", ru: "Мы создаем незабываемые путешествия под ваш бюджет." },
    services: [
      { n_en: "Honeymoon Packages", n_de: "Flitterwochenpakete", n_ru: "Свадебные путешествия", p: "$3000+", d_en: "Romantic getaways.", i: "honeymoon.jpg" },
      { n_en: "Adventure Tours", n_de: "Abenteuertouren", n_ru: "Туры с приключениями", p: "$1500+", d_en: "Hiking and extreme sports.", i: "adventure.jpg" }
    ],
    testimonials: [{ n: "Traveler J.", t_en: "They booked the perfect honeymoon. Exceeded expectations!", r: 5, a: "traveler.jpg" }],
    logo: { t: "WANDERLUST", tg: "", f: "Pacifico" }
  },
  online_courses: {
    meta: { title: "Skill Up | Online Courses", description: "Learn new skills from industry experts. Flexible learning anytime, anywhere." },
    tags: ["education", "courses", "learning"],
    slogan: { en: ["Learn Without Limits", "Skill Up", "Future Ready"], de: ["Lernen ohne Grenzen", "Skill Up", "Zukunftsbereit"], ru: ["Учись без границ", "Прокачай навыки", "Готов к будущему"] },
    about: { en: "Empowering individuals with knowledge and skills to advance their careers.", de: "Wir stärken Individuen mit Wissen für ihre Karriere.", ru: "Мы наделяем людей знаниями для продвижения по карьерной лестнице." },
    services: [
      { n_en: "Web Development Bootcamp", n_de: "Web Development Bootcamp", n_ru: "Буткемп по веб-разработке", p: "$500", d_en: "Full-stack curriculum.", i: "web_course.jpg" },
      { n_en: "Digital Marketing", n_de: "Digitales Marketing", n_ru: "Цифровой маркетинг", p: "$300", d_en: "Master online ads and SEO.", i: "marketing.jpg" }
    ],
    testimonials: [{ n: "Student A.", t_en: "Changed my career path completely. Best investment ever.", r: 5, a: "student.jpg" }],
    logo: { t: "SKILL", tg: "UP", f: "Poppins" }
  }
};

Object.keys(premiumData).forEach(id => {
  const filePath = path.join(presetsDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return;

  const preset = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const data = premiumData[id];

  preset.meta.title = data.meta.title;
  preset.meta.description = data.meta.description;
  preset.seo.keywords = data.tags.join(', ');
  preset.content.slogans = data.slogan;

  ['en', 'de', 'ru'].forEach(lang => {
    if (preset.content.hero[lang]) {
      preset.content.hero[lang].heading = data.slogan[lang][0];
      preset.content.hero[lang].subheading = data.meta.description;
    }
    if (preset.content.about[lang]) {
      preset.content.about[lang].text = data.about[lang];
    }
  });

  preset.content.services = data.services.map(s => ({
    [`name_${'en'}`]: s.n_en,
    [`name_${'de'}`]: s.n_de,
    [`name_${'ru'}`]: s.n_ru,
    price: s.p,
    desc_en: s.d_en,
    image: `/media/presets/${id}/services/${s.i}`
  }));

  preset.content.testimonials = data.testimonials.map(t => ({
    name: t.n,
    text_en: t.t_en,
    text_de: t.t_en,
    text_ru: t.t_en,
    rating: t.r,
    avatar: `/media/presets/${id}/avatars/${t.a}`
  }));

  if (data.logo) {
    preset.logo.text = data.logo.t;
    preset.logo.tagline = data.logo.tg;
    preset.logo.font = data.logo.f;
  }

  fs.writeFileSync(filePath, JSON.stringify(preset, null, 2), 'utf8');
  console.log(`Upgraded: ${id}.json`);
});

console.log('All presets upgraded to Premium quality!');