import { useLocale } from 'next-intl'
import BookingForm from '@/components/booking/BookingForm'
import Impressum from '@/components/legal/Impressum'
import Datenschutz from '@/components/legal/Datenschutz'
import AGB from '@/components/legal/AGB'

export default function RestaurantModernPage() {
  const locale = useLocale()
  
  const t = (de: string, en: string, ru: string) => {
    switch (locale) {
      case 'en': return en
      case 'ru': return ru
      default: return de
    }
  }

  return (
    <div className="bg-[#FFF8F0] text-[#2C1810]">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#FFF8F0] z-0"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-[80px] leading-[1.1] mb-6 font-bold">
            {t('Kulinarik neu erleben', 'Experience Culinary Art', 'Искусство гастрономии')}
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-[#8B7355]">
            {t(
              'Frische Zutaten, kreative Rezepte und eine Atmosphäre, die zum Verweilen einlädt.',
              'Fresh ingredients, creative recipes, and an atmosphere that invites you to stay.',
              'Свежие ингредиенты, креативные рецепты и атмосфера, в которой хочется задержаться.'
            )}
          </p>
          <a 
            href="#booking" 
            className="inline-block bg-[#D4A574] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#C08A5A] transition-colors duration-200"
          >
            {t('Tisch reservieren', 'Reserve a Table', 'Забронировать столик')}
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-[140px] px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[36px] mb-6">
            {t('Unsere Philosophie', 'Our Philosophy', 'Наша философия')}
          </h2>
          <p className="text-lg leading-[1.8] text-[#8B7355]">
            {t(
              'Wir glauben, dass gutes Essen Menschen verbindet. In L\'Atelier Gourmet kombinieren wir traditionelle Techniken mit modernen Einflüssen, um ein unvergessliches Geschmackserlebnis zu schaffen.',
              'We believe that good food brings people together. At L\'Atelier Gourmet, we combine traditional techniques with modern influences to create an unforgettable taste experience.',
              'Мы верим, что хорошая еда объединяет людей. В L\'Atelier Gourmet мы сочетаем традиционные техники с современными веяниями, создавая незабываемые гастрономические впечатления.'
            )}
          </p>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-[140px] px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-[36px] text-center mb-12">
            {t('Ausgewählte Speisen', 'Selected Dishes', 'Избранные блюда')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                name_de: 'Tartare vom Rind', name_en: 'Beef Tartare', name_ru: 'Тартар из говядины', 
                price: '24€', desc_de: 'Mit Kapern, Eigelb und Crostini', desc_en: 'With capers, egg yolk and crostini', desc_ru: 'С каперсами, желтком и кростини',
                image: 'https://images.unsplash.com/photo-1546833990-4125f5c2a42?w=800'
              },
              { 
                name_de: 'Burrata', name_en: 'Burrata', name_ru: 'Буррата', 
                price: '18€', desc_de: 'Mit Tomaten und Basilikum', desc_en: 'With tomatoes and basil', desc_ru: 'С томатами и базиликом',
                image: 'https://images.unsplash.com/photo-1482042689711-23fd7381357?w=800'
              },
              { 
                name_de: 'Lachsfilet', name_en: 'Salmon Fillet', name_ru: 'Филе лосося', 
                price: '32€', desc_de: 'Glasierter Spargel, Kartoffelpüree', desc_en: 'Glazed asparagus, mashed potatoes', desc_ru: 'Глазированная спаржа, пюре',
                image: 'https://images.unsplash.com/photo-1467003906228-9d9f08be6f49?w=800'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row bg-[#FFF8F0] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(44,24,16,0.08)] hover:shadow-[0_8px_30px_rgba(44,24,16,0.12)] transition-shadow duration-200">
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                  <img src={item.image} alt={t(item.name_de, item.name_en, item.name_ru)} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{t(item.name_de, item.name_en, item.name_ru)}</h3>
                    <span className="text-lg font-bold text-[#D4A574] ml-4">{item.price}</span>
                  </div>
                  <p className="text-[#8B7355]">{t(item.desc_de, item.desc_en, item.desc_ru)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-[140px] px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-[36px] text-center mb-4">
            {t('Reservierung', 'Reservation', 'Бронирование')}
          </h2>
          <p className="text-center text-[#8B7355] mb-12 max-w-2xl mx-auto">
            {t(
              'Sichern Sie sich Ihren Tisch. Wir freuen uns auf Ihren Besuch.',
              'Secure your table. We look forward to your visit.',
              'Забронируйте свой столик. Мы ждем вашего визита.'
            )}
          </p>
          <BookingForm locale={locale} />
        </div>
      </section>

      {/* Footer with Legal Links */}
      <footer className="py-16 px-4 border-t border-[#E6D5C3]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#8B7355]">
            © 2026 L'Atelier Gourmet. {t('Alle Rechte vorbehalten.', 'All rights reserved.', 'Все права защищены.')}
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/impressum" className="text-[#8B7355] hover:text-[#D4A574] transition-colors">{t('Impressum', 'Legal Notice', 'Юридическая информация')}</a>
            <a href="/datenschutz" className="text-[#8B7355] hover:text-[#D4A574] transition-colors">{t('Datenschutz', 'Privacy', 'Конфиденциальность')}</a>
            <a href="/agb" className="text-[#8B7355] hover:text-[#D4A574] transition-colors">{t('AGB', 'Terms', 'Условия')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}