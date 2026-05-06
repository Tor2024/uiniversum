import React from 'react';
import './renderer.module.css';

interface BlockRendererProps {
  block: any;
  locale: string;
}

function getLocalizedString(obj: any, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

export function BlockRenderer({ block, locale }: BlockRendererProps) {
  if (!block.visible) return null;

  const content = renderBlockContent(block, locale);

  return (
    <section 
      id={block.id} 
      className="block-renderer"
      data-block-type={block.type}
    >
      {content}
    </section>
  );
}

function renderBlockContent(block: any, locale: string): React.ReactNode {
  const settings = block.settings;

  switch (block.type) {
    case 'hero':
      return (
        <div className="hero-block">
          <h1 className="hero-heading">
            {getLocalizedString(settings?.heading, locale)}
          </h1>
          {settings?.subheading && (
            <p className="hero-subheading">
              {getLocalizedString(settings.subheading, locale)}
            </p>
          )}
          {settings?.buttonText && (
            <button className="hero-button">
              {getLocalizedString(settings.buttonText, locale)}
            </button>
          )}
        </div>
      );

    case 'text_rich':
      return (
        <div className="text-rich-block">
            <div dangerouslySetInnerHTML={{ __html: getLocalizedString(settings?.content, locale) }} />
        </div>
      );

    case 'image_single':
      return (
        <div className="image-single-block">
          <img 
            src={settings?.src || '/media/placeholder.jpg'} 
            alt={getLocalizedString(settings?.alt, locale)} 
          />
        </div>
      );

    case 'cards_grid':
      return (
        <div className="cards-grid-block">
          {(settings?.cards || []).map((card: any, index: number) => (
            <div key={index} className="card-item">
              <h3 className="card-title">{getLocalizedString(card?.title, locale)}</h3>
              <p className="card-desc">{getLocalizedString(card?.desc, locale)}</p>
            </div>
          ))}
        </div>
      );

    case 'testimonials':
      return (
        <div className="testimonials-block">
          {(settings?.items || []).map((item: any, index: number) => (
            <div key={index} className="testimonial-item">
              <p className="testimonial-text">"{getLocalizedString(item?.text, locale)}"</p>
              <p className="testimonial-name">— {item?.name}</p>
            </div>
          ))}
        </div>
      );

    case 'faq':
      return (
        <div className="faq-block">
          {(settings?.items || []).map((item: any, index: number) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">
                {getLocalizedString(item?.q, locale)}
              </summary>
              <p className="faq-answer">{getLocalizedString(item?.a, locale)}</p>
            </details>
          ))}
        </div>
      );

    case 'menu_food':
      return (
        <div className="menu-food-block">
          <h2 className="menu-title">
            {getLocalizedString(settings?.title, locale) || 'Menu'}
          </h2>
          {(settings?.categories || []).map((cat: any, idx: number) => (
            <div key={idx} className="menu-category">
              <h3 className="menu-category-title">{getLocalizedString(cat?.name, locale)}</h3>
              {cat?.items?.map((item: any, i: number) => (
                <div key={i} className="menu-item">
                  <span className="menu-item-name">{getLocalizedString(item?.name, locale)}</span>
                  <span className="menu-item-price">{item?.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case 'booking_form':
      return (
        <div className="booking-form-block">
          <h2 className="booking-title">{getLocalizedString(settings?.title, locale) || 'Book Now'}</h2>
          <p className="booking-text">Booking form integration here...</p>
        </div>
      );

    case 'divider':
      return <hr className="divider-block" />;

    // Заглушки для остальных типов
    case 'image_gallery':
    case 'video_embed':
    case 'pricing':
    case 'cta_banner':
    case 'contact_form':
    case 'map_embed':
    case 'countdown':
    case 'stats':
    case 'timeline':
    case 'logo_cloud':
    case 'team':
    case 'blog_feed':
    case 'custom_html':
      return (
        <div className={`${block.type}-block placeholder-block`}>
          Block: {block.type} (Pending Implementation)
        </div>
      );

    default:
      return <div>Unknown block type</div>;
  }
}