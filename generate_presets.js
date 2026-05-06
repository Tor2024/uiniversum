const fs = require('fs');
const path = require('path');

const presetsDir = path.join(__dirname, 'data', 'presets');

// Базовые данные для генерации
const presetsData = [
  { id: 'yoga_studio', name: 'Zen Yoga Studio', category: 'Wellness', colors: { bg: '#F5F5F0', primary: '#5C8A6F', accent: '#E8A87C' }, fonts: { display: 'Lora', body: 'Nunito' }, slogan: { en: 'Find Your Inner Peace', de: 'Finde deinen inneren Frieden', ru: 'Найди внутренний покой' } },
  { id: 'beauty_salon', name: 'Glamour Beauty', category: 'Beauty', colors: { bg: '#FFF0F5', primary: '#D63384', accent: '#FFC0CB' }, fonts: { display: 'Dancing Script', body: 'Raleway' }, slogan: { en: 'Beauty Redefined', de: 'Schönheit neu definiert', ru: 'Красота переосмыслена' } },
  { id: 'web_agency', name: 'Pixel Perfect', category: 'Agency', colors: { bg: '#0F172A', primary: '#38BDF8', accent: '#818CF8' }, fonts: { display: 'Inter', body: 'DM Sans' }, slogan: { en: 'Digital Excellence', de: 'Digitale Exzellenz', ru: 'Цифровое совершенство' } },
  { id: 'fashion_store', name: 'Vogue Corner', category: 'Fashion', colors: { bg: '#FFFFFF', primary: '#000000', accent: '#D4AF37' }, fonts: { display: 'Playfair Display', body: 'Lato' }, slogan: { en: 'Style is Eternal', de: 'Stil ist ewig', ru: 'Стиль вечен' } },
  { id: 'boutique_hotel', name: 'Grand Plaza', category: 'Hospitality', colors: { bg: '#FAF9F6', primary: '#8B4513', accent: '#DAA520' }, fonts: { display: 'Cormorant Garamond', body: 'Montserrat' }, slogan: { en: 'Luxury Redefined', de: 'Luxus neu definiert', ru: 'Роскошь переосмыслена' } },
  { id: 'interior_designer', name: 'Space Architects', category: 'Design', colors: { bg: '#F8F8FF', primary: '#36454F', accent: '#C0C0C0' }, fonts: { display: 'Space Mono', body: 'Work Sans' }, slogan: { en: 'Shape Your Space', de: 'Gestalte deinen Raum', ru: 'Сформируй свое пространство' } },
  { id: 'wedding_photographer', name: 'Eternal Moments', category: 'Photography', colors: { bg: '#FFF8DC', primary: '#B8860B', accent: '#FFD700' }, fonts: { display: 'Great Vibes', body: 'Josefin Sans' }, slogan: { en: 'Love Stories Told', de: 'Liebesgeschichten erzählt', ru: 'Истории любви навсегда' } },
  { id: 'coffee_shop', name: 'Bean There', category: 'Cafe', colors: { bg: '#F5E6D3', primary: '#6F4E37', accent: '#C19A6B' }, fonts: { display: 'Pacifico', body: 'Open Sans' }, slogan: { en: 'Brewed to Perfection', de: 'Perfekt aufgebrüht', ru: 'Сварено до совершенства' } },
  { id: 'bakery', name: 'Sweet Tooth', category: 'Food', colors: { bg: '#FFFDD0', primary: '#D2691E', accent: '#FFDEAD' }, fonts: { display: 'Cookie', body: 'Quicksand' }, slogan: { en: 'Freshly Baked Joy', de: 'Frisch gebackene Freude', ru: 'Свежая радость' } },
  { id: 'coworking_space', name: 'Hub Workspace', category: 'Business', colors: { bg: '#F0F8FF', primary: '#1E90FF', accent: '#00CED1' }, fonts: { display: 'Archivo Black', body: 'Roboto' }, slogan: { en: 'Create Together', de: 'Gemeinsam schaffen', ru: 'Творим вместе' } },
  { id: 'business_consulting', name: 'Strategic Minds', category: 'Consulting', colors: { bg: '#FFFFFF', primary: '#003366', accent: '#4682B4' }, fonts: { display: 'Merriweather', body: 'Source Sans Pro' }, slogan: { en: 'Growth Partners', de: 'Wachstumspartner', ru: 'Партнеры по росту' } },
  { id: 'saas_startup', name: 'CloudScale', category: 'Tech', colors: { bg: '#0D1117', primary: '#00FFAA', accent: '#7B61FF' }, fonts: { display: 'Orbitron', body: 'IBM Plex Sans' }, slogan: { en: 'Scale Infinite', de: 'Unendlich skalieren', ru: 'Бесконечный масштаб' } },
  { id: 'construction_company', name: 'BuildRight', category: 'Construction', colors: { bg: '#FFFAF0', primary: '#FF8C00', accent: '#FFD700' }, fonts: { display: 'Bebas Neue', body: 'Oswald' }, slogan: { en: 'Building Futures', de: 'Zukunft bauen', ru: 'Строим будущее' } },
  { id: 'real_estate', name: 'Prime Property', category: 'Real Estate', colors: { bg: '#F5FFFA', primary: '#2E8B57', accent: '#FF6347' }, fonts: { display: 'Georgia', body: 'Arial' }, slogan: { en: 'Find Your Dream', de: 'Finde deinen Traum', ru: 'Найди свою мечту' } },
  { id: 'musician', name: 'Melody Lane', category: 'Music', colors: { bg: '#1A1A2E', primary: '#E94560', accent: '#0F3460' }, fonts: { display: 'Rock Salt', body: 'Cabin' }, slogan: { en: 'Feel the Rhythm', de: 'Spüre den Rhythmus', ru: 'Почувствуй ритм' } },
  { id: 'personal_blog', name: 'Life Unscripted', category: 'Blog', colors: { bg: '#FFFEF7', primary: '#333333', accent: '#FF6B6B' }, fonts: { display: 'Libre Baskerville', body: 'Merriweather' }, slogan: { en: 'Stories & Thoughts', de: 'Geschichten & Gedanken', ru: 'Истории и мысли' } },
  { id: 'non_profit', name: 'Helping Hand', category: 'Charity', colors: { bg: '#F0FFF0', primary: '#228B22', accent: '#FFD700' }, fonts: { display: 'Nunito', body: 'Open Sans' }, slogan: { en: 'Change the World', de: 'Verändere die Welt', ru: 'Измени мир' } },
  { id: 'kindergarten', name: 'Little Explorers', category: 'Education', colors: { bg: '#E0FFFF', primary: '#FF69B4', accent: '#FFD700' }, fonts: { display: 'Comfortaa', body: 'Nunito' }, slogan: { en: 'Learn Through Play', de: 'Lernen durch Spielen', ru: 'Учись играя' } },
  { id: 'law_firm', name: 'Justice & Co.', category: 'Legal', colors: { bg: '#001F3F', primary: '#FFD700', accent: '#FFFFFF' }, fonts: { display: 'Times New Roman', body: 'Helvetica' }, slogan: { en: 'Your Legal Shield', de: 'Dein Rechtsschirm', ru: 'Твой правовой щит' } },
  { id: 'logistics', name: 'Swift Logistics', category: 'Transport', colors: { bg: '#F5F5F5', primary: '#FF4500', accent: '#1E90FF' }, fonts: { display: 'Roboto', body: 'Arial' }, slogan: { en: 'Delivered on Time', de: 'Pünktlich geliefert', ru: 'Доставлено вовремя' } },
  { id: 'dental_clinic', name: 'Bright Smile', category: 'Health', colors: { bg: '#F0FFFF', primary: '#40E0D0', accent: '#87CEEB' }, fonts: { display: 'Quicksand', body: 'Raleway' }, slogan: { en: 'Smile with Confidence', de: 'Lächeln mit Vertrauen', ru: 'Улыбайся с уверенностью' } },
  { id: 'spa_center', name: 'Tranquil Spa', category: 'Wellness', colors: { bg: '#E6E6FA', primary: '#9370DB', accent: '#BA55D3' }, fonts: { display: 'Cinzel', body: 'Lato' }, slogan: { en: 'Relax & Rejuvenate', de: 'Entspannen & Verjüngen', ru: 'Расслабься и обновись' } },
  { id: 'jewelry_store', name: 'Gem Gallery', category: 'Luxury', colors: { bg: '#000000', primary: '#FFD700', accent: '#FFFFFF' }, fonts: { display: 'Cormorant', body: 'Raleway' }, slogan: { en: 'Timeless Elegance', de: 'Zeitlose Eleganz', ru: 'Вечная элегантность' } },
  { id: 'auto_service', name: 'Pro Mechanic', category: 'Automotive', colors: { bg: '#2F4F4F', primary: '#FF4500', accent: '#FFD700' }, fonts: { display: 'Staatliches', body: 'Oswald' }, slogan: { en: 'Drive with Confidence', de: 'Fahren mit Vertrauen', ru: 'Води с уверенностью' } },
  { id: 'travel_agency', name: 'Wanderlust', category: 'Travel', colors: { bg: '#87CEEB', primary: '#1E90FF', accent: '#FF6347' }, fonts: { display: 'Pacifico', body: 'Montserrat' }, slogan: { en: 'Explore the World', de: 'Entdecke die Welt', ru: 'Исследуй мир' } },
  { id: 'online_courses', name: 'Skill Up', category: 'Education', colors: { bg: '#FFFFFF', primary: '#6A5ACD', accent: '#FF8C00' }, fonts: { display: 'Poppins', body: 'Nunito' }, slogan: { en: 'Learn Without Limits', de: 'Lernen ohne Grenzen', ru: 'Учись без границ' } }
];

function generatePreset(preset) {
  return {
    "meta": {
      "title": `${preset.name} | ${preset.category}`,
      "description": `Premium ${preset.category.toLowerCase()} services with a focus on quality and design.`,
      "favicon": `/media/presets/${preset.id}/favicon.ico`,
      "language": "en",
      "availableLanguages": ["en", "de", "ru"]
    },
    "design": {
      "preset": preset.id,
      "tokens": {
        "colorBackground": preset.colors.bg,
        "colorSurface": "#FFFFFF",
        "colorPrimary": preset.colors.primary,
        "colorSecondary": "#6C757D",
        "colorBorder": "#DEE2E6",
        "colorAccent": preset.colors.accent,
        "colorAccentHover": preset.colors.accent,
        "fontDisplay": preset.fonts.display,
        "fontHeading": preset.fonts.display,
        "fontBody": preset.fonts.body,
        "fontCaption": preset.fonts.body,
        "fontMono": "Roboto Mono",
        "fontSizeDisplay": "72px",
        "fontSizeHeading": "36px",
        "fontSizeBody": "17px",
        "lineHeightBody": "1.7",
        "lineHeightHeading": "1.3",
        "spacingUnit": "8px",
        "spacingSection": "120px",
        "spacingElement": "24px",
        "spacingCard": "32px",
        "spacingButtonVertical": "16px",
        "spacingButtonHorizontal": "32px",
        "maxWidthContent": "1200px",
        "maxWidthText": "700px",
        "gridColumns": "12",
        "gridGutter": "30px",
        "horizontalPaddingMobile": "20px",
        "horizontalPaddingTablet": "50px",
        "horizontalPaddingDesktop": "80px",
        "borderRadius": "8",
        "borderRadiusSmall": "4px",
        "borderRadiusMedium": "8px",
        "borderRadiusLarge": "16px",
        "shadowStyle": "soft",
        "shadowResting": "0 4px 14px rgba(0,0,0,0.05)",
        "shadowHover": "0 8px 24px rgba(0,0,0,0.1)",
        "transitionDuration": "200ms",
        "transitionTiming": "ease-in-out",
        "imageRatioHero": "21:9",
        "imageRatioCard": "4:3",
        "imageRatioAvatar": "1:1"
      },
      "customCss": ""
    },
    "seo": {
      "ogImage": `/media/presets/${preset.id}/og-default.jpg`,
      "twitterCard": "summary_large_image",
      "googleAnalyticsId": "",
      "keywords": `${preset.category}, Premium, ${preset.name}`
    },
    "content": {
      "slogans": preset.slogan,
      "hero": {
        "en": { "heading": preset.slogan.en, "subheading": `Discover the best in ${preset.category.toLowerCase()}.`, "cta": "Get Started", "image": `/media/presets/${preset.id}/hero.jpg` },
        "de": { "heading": preset.slogan.de, "subheading": `Entdecken Sie das Beste in ${preset.category.toLowerCase()}.`, "cta": "Jetzt starten", "image": `/media/presets/${preset.id}/hero.jpg` },
        "ru": { "heading": preset.slogan.ru, "subheading": `Откройте для себя лучшее в ${preset.category.toLowerCase()}.`, "cta": "Начать", "image": `/media/presets/${preset.id}/hero.jpg` }
      },
      "about": {
        "en": { "title": "About Us", "text": `We are ${preset.name}, dedicated to providing top-tier ${preset.category.toLowerCase()} services.` },
        "de": { "title": "Über uns", "text": `Wir sind ${preset.name}, engagiert für erstklassige Dienstleistungen.` },
        "ru": { "title": "О нас", "text": `Мы ${preset.name}, преданные своему делу профессионалы.` }
      },
      "services": [
        { "name_en": "Service A", "name_de": "Dienst A", "name_ru": "Услуга А", "price": "$100", "desc_en": "High quality service.", "image": `/media/presets/${preset.id}/services/a.jpg` }
      ],
      "testimonials": [
        { "name": "John D.", "text_en": "Amazing experience!", "text_de": "Unglaubliche Erfahrung!", "text_ru": "Потрясающий опыт!", "rating": 5, "avatar": `/media/presets/${preset.id}/avatars/john.jpg` }
      ],
      "contact": {
        "address": "123 Main St, City",
        "phone": "+1 234 567 890",
        "email": `info@${preset.id}.com`,
        "hours_en": "Mon-Fri: 9:00 AM - 6:00 PM",
        "hours_de": "Mo-Fr: 09:00 - 18:00 Uhr",
        "hours_ru": "Пн-Пт: 09:00 - 18:00"
      },
      "faq": [
        { "q_en": "How to start?", "q_de": "Wie anfangen?", "q_ru": "Как начать?", "a_en": "Contact us today!", "a_de": "Kontaktieren Sie uns!", "a_ru": "Свяжитесь с нами!" }
      ]
    },
    "booking": { "enabled": true, "slots": ["09:00", "10:00", "14:00", "16:00"], "duration": 60 },
    "logo": { "text": preset.name.split(' ')[0], "tagline": preset.name.split(' ').slice(1).join(' '), "font": preset.fonts.display }
  };
}

// Генерация файлов
presetsData.forEach(preset => {
  const filePath = path.join(presetsDir, `${preset.id}.json`);
  const content = JSON.stringify(generatePreset(preset), null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${preset.id}.json`);
});

console.log('All presets generated successfully!');