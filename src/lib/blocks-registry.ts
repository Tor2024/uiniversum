export type BlockType =
  | 'hero'
  | 'text_rich'
  | 'image_single'
  | 'image_gallery'
  | 'video_embed'
  | 'cards_grid'
  | 'testimonials'
  | 'faq'
  | 'pricing'
  | 'cta_banner'
  | 'contact_form'
  | 'map_embed'
  | 'countdown'
  | 'stats'
  | 'timeline'
  | 'divider'
  | 'logo_cloud'
  | 'team'
  | 'blog_feed'
  | 'menu_food'
  | 'booking_form'
  | 'custom_html'

export interface BlockData {
  id: string;
  type: BlockType;
  visible: boolean;
  order: number;
  settings: Record<string, any>;
  styles: {
    paddingTop: number;
    paddingBottom: number;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
    maxWidth: string;
    [key: string]: any;
  };
}

export interface BlockRegistryItem {
  type: BlockType;
  name: string;
  group: 'content' | 'media' | 'forms' | 'special';
  icon: string;
  description: string;
  defaultSettings: Record<string, any>;
  defaultStyles: Record<string, any>;
}

const defaultStyles = {
  paddingTop: 60,
  paddingBottom: 60,
  backgroundColor: '',
  textAlign: 'center' as const,
  maxWidth: 'xl'
}

export const blocksRegistry: BlockRegistryItem[] = [
  // ── CONTENT ──────────────────────────────────────────────
  {
    type: 'hero',
    name: 'Hero',
    group: 'content',
    icon: '🖼️',
    description: 'Large banner with heading, subheading, CTA button and background image',
    defaultSettings: {
      heading: { de: 'Willkommen', en: 'Welcome', ru: 'Добро пожаловать' },
      subheading: { de: '', en: '', ru: '' },
      buttonText: { de: 'Mehr erfahren', en: 'Learn more', ru: 'Узнать больше' },
      buttonUrl: '#',
      backgroundImage: '',
      backgroundOverlay: 40,
      height: 'large'
    },
    defaultStyles: { ...defaultStyles, paddingTop: 80, paddingBottom: 80 }
  },
  {
    type: 'text_rich',
    name: 'Rich Text',
    group: 'content',
    icon: '📝',
    description: 'Formatted text block with HTML support',
    defaultSettings: {
      content: { de: '<p>Ihr Text hier...</p>', en: '<p>Your text here...</p>', ru: '<p>Ваш текст здесь...</p>' }
    },
    defaultStyles: { ...defaultStyles, textAlign: 'left' as const, maxWidth: 'md' }
  },
  {
    type: 'cards_grid',
    name: 'Cards Grid',
    group: 'content',
    icon: '🃏',
    description: 'Grid of cards with image, title and description',
    defaultSettings: {
      title: { de: 'Unsere Leistungen', en: 'Our Services', ru: 'Наши услуги' },
      columns: 3,
      cards: [
        {
          title: { de: 'Leistung 1', en: 'Service 1', ru: 'Услуга 1' },
          desc: { de: 'Beschreibung', en: 'Description', ru: 'Описание' },
          image: '',
          link: ''
        }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    group: 'content',
    icon: '💬',
    description: 'Customer reviews and testimonials',
    defaultSettings: {
      title: { de: 'Was unsere Kunden sagen', en: 'What our clients say', ru: 'Отзывы клиентов' },
      items: [
        {
          text: { de: 'Toller Service!', en: 'Great service!', ru: 'Отличный сервис!' },
          name: 'Max Mustermann',
          role: '',
          avatar: ''
        }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'faq',
    name: 'FAQ',
    group: 'content',
    icon: '❓',
    description: 'Frequently asked questions with accordion',
    defaultSettings: {
      title: { de: 'Häufige Fragen', en: 'Frequently Asked Questions', ru: 'Часто задаваемые вопросы' },
      items: [
        {
          q: { de: 'Frage 1?', en: 'Question 1?', ru: 'Вопрос 1?' },
          a: { de: 'Antwort 1.', en: 'Answer 1.', ru: 'Ответ 1.' }
        }
      ]
    },
    defaultStyles: { ...defaultStyles, textAlign: 'left' as const }
  },
  {
    type: 'pricing',
    name: 'Pricing',
    group: 'content',
    icon: '💰',
    description: 'Pricing plans with features list',
    defaultSettings: {
      title: { de: 'Preise', en: 'Pricing', ru: 'Цены' },
      plans: [
        {
          name: { de: 'Basic', en: 'Basic', ru: 'Базовый' },
          price: '29',
          currency: '€',
          period: { de: 'pro Monat', en: 'per month', ru: 'в месяц' },
          features: [
            { de: 'Feature 1', en: 'Feature 1', ru: 'Функция 1' }
          ],
          buttonText: { de: 'Jetzt starten', en: 'Get started', ru: 'Начать' },
          buttonUrl: '#',
          highlighted: false
        }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'cta_banner',
    name: 'CTA Banner',
    group: 'content',
    icon: '📣',
    description: 'Call-to-action banner with heading and button',
    defaultSettings: {
      heading: { de: 'Bereit loszulegen?', en: 'Ready to get started?', ru: 'Готовы начать?' },
      subheading: { de: '', en: '', ru: '' },
      buttonText: { de: 'Kontakt aufnehmen', en: 'Contact us', ru: 'Связаться' },
      buttonUrl: '#contact',
      backgroundColor: 'var(--color-accent)'
    },
    defaultStyles: { ...defaultStyles, paddingTop: 80, paddingBottom: 80 }
  },
  {
    type: 'stats',
    name: 'Stats',
    group: 'content',
    icon: '📊',
    description: 'Key numbers and statistics',
    defaultSettings: {
      items: [
        { value: '100+', label: { de: 'Kunden', en: 'Clients', ru: 'Клиентов' } },
        { value: '5★', label: { de: 'Bewertung', en: 'Rating', ru: 'Рейтинг' } },
        { value: '10+', label: { de: 'Jahre Erfahrung', en: 'Years experience', ru: 'Лет опыта' } }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'timeline',
    name: 'Timeline',
    group: 'content',
    icon: '📅',
    description: 'Chronological timeline of events or steps',
    defaultSettings: {
      title: { de: 'Unsere Geschichte', en: 'Our Story', ru: 'Наша история' },
      items: [
        {
          year: '2020',
          title: { de: 'Gründung', en: 'Founded', ru: 'Основание' },
          desc: { de: 'Wir haben angefangen.', en: 'We started.', ru: 'Мы начали.' }
        }
      ]
    },
    defaultStyles: { ...defaultStyles, textAlign: 'left' as const }
  },
  {
    type: 'team',
    name: 'Team',
    group: 'content',
    icon: '👥',
    description: 'Team members with photo, name and role',
    defaultSettings: {
      title: { de: 'Unser Team', en: 'Our Team', ru: 'Наша команда' },
      members: [
        {
          name: 'Max Mustermann',
          role: { de: 'Geschäftsführer', en: 'CEO', ru: 'Директор' },
          photo: '',
          bio: { de: '', en: '', ru: '' }
        }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'logo_cloud',
    name: 'Logo Cloud',
    group: 'content',
    icon: '🏢',
    description: 'Grid of partner or client logos',
    defaultSettings: {
      title: { de: 'Unsere Partner', en: 'Our Partners', ru: 'Наши партнёры' },
      logos: [
        { src: '', alt: 'Partner 1', url: '' }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'blog_feed',
    name: 'Blog Feed',
    group: 'content',
    icon: '📰',
    description: 'Latest blog posts or news articles',
    defaultSettings: {
      title: { de: 'Neuigkeiten', en: 'Latest News', ru: 'Новости' },
      posts: [
        {
          title: { de: 'Artikel 1', en: 'Article 1', ru: 'Статья 1' },
          excerpt: { de: '', en: '', ru: '' },
          image: '',
          date: '',
          url: '#'
        }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'divider',
    name: 'Divider',
    group: 'content',
    icon: '➖',
    description: 'Horizontal divider line between sections',
    defaultSettings: {
      style: 'line',
      color: 'var(--color-border)'
    },
    defaultStyles: { paddingTop: 0, paddingBottom: 0, backgroundColor: '', textAlign: 'center' as const, maxWidth: 'xl' }
  },

  // ── MEDIA ─────────────────────────────────────────────────
  {
    type: 'image_single',
    name: 'Single Image',
    group: 'media',
    icon: '🖼️',
    description: 'Full-width or contained single image',
    defaultSettings: {
      src: '',
      alt: { de: '', en: '', ru: '' },
      caption: { de: '', en: '', ru: '' },
      link: ''
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'image_gallery',
    name: 'Image Gallery',
    group: 'media',
    icon: '🗃️',
    description: 'Masonry or grid photo gallery with lightbox',
    defaultSettings: {
      title: { de: 'Galerie', en: 'Gallery', ru: 'Галерея' },
      columns: 3,
      images: [
        { src: '', alt: { de: '', en: '', ru: '' } }
      ]
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'video_embed',
    name: 'Video Embed',
    group: 'media',
    icon: '▶️',
    description: 'Embedded YouTube or Vimeo video',
    defaultSettings: {
      url: '',
      title: { de: '', en: '', ru: '' },
      autoplay: false,
      muted: false
    },
    defaultStyles: { ...defaultStyles }
  },

  // ── FORMS ─────────────────────────────────────────────────
  {
    type: 'contact_form',
    name: 'Contact Form',
    group: 'forms',
    icon: '✉️',
    description: 'Contact form with name, email and message fields',
    defaultSettings: {
      title: { de: 'Kontakt', en: 'Contact', ru: 'Контакт' },
      subtitle: { de: 'Schreiben Sie uns', en: 'Write to us', ru: 'Напишите нам' },
      buttonText: { de: 'Senden', en: 'Send', ru: 'Отправить' },
      successMessage: { de: 'Vielen Dank!', en: 'Thank you!', ru: 'Спасибо!' }
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'booking_form',
    name: 'Booking Form',
    group: 'forms',
    icon: '📆',
    description: 'Appointment booking form with date and time selection',
    defaultSettings: {
      title: { de: 'Termin buchen', en: 'Book Appointment', ru: 'Записаться' },
      subtitle: { de: '', en: '', ru: '' },
      buttonText: { de: 'Jetzt buchen', en: 'Book Now', ru: 'Забронировать' },
      showGuestsField: false,
      showMessageField: true
    },
    defaultStyles: { ...defaultStyles }
  },

  // ── SPECIAL ───────────────────────────────────────────────
  {
    type: 'menu_food',
    name: 'Food Menu',
    group: 'special',
    icon: '🍽️',
    description: 'Restaurant menu with categories and items',
    defaultSettings: {
      title: { de: 'Speisekarte', en: 'Menu', ru: 'Меню' },
      categories: [
        {
          name: { de: 'Vorspeisen', en: 'Starters', ru: 'Закуски' },
          items: [
            {
              name: { de: 'Gericht 1', en: 'Dish 1', ru: 'Блюдо 1' },
              description: { de: '', en: '', ru: '' },
              price: '9.90',
              image: ''
            }
          ]
        }
      ]
    },
    defaultStyles: { ...defaultStyles, textAlign: 'left' as const }
  },
  {
    type: 'map_embed',
    name: 'Map',
    group: 'special',
    icon: '📍',
    description: 'Embedded Google Maps with address',
    defaultSettings: {
      address: '',
      embedUrl: '',
      zoom: 15,
      showAddress: true
    },
    defaultStyles: { ...defaultStyles, paddingTop: 0, paddingBottom: 0 }
  },
  {
    type: 'countdown',
    name: 'Countdown',
    group: 'special',
    icon: '⏱️',
    description: 'Countdown timer to a specific date',
    defaultSettings: {
      title: { de: 'Bald verfügbar', en: 'Coming Soon', ru: 'Скоро' },
      targetDate: '',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true
    },
    defaultStyles: { ...defaultStyles }
  },
  {
    type: 'custom_html',
    name: 'Custom HTML',
    group: 'special',
    icon: '💻',
    description: 'Raw HTML/CSS/JS block for advanced customization',
    defaultSettings: {
      html: '<!-- Your custom HTML here -->'
    },
    defaultStyles: { ...defaultStyles }
  }
]
