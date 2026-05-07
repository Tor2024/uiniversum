import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockRendererProps {
  block: any;
  locale: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loc(obj: any, locale: string): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['de'] || obj['en'] || obj['ru'] || '';
}

function sectionStyle(block: any): React.CSSProperties {
  const s = block.styles || {};
  const maxWidths: Record<string, string> = {
    sm: '640px', md: '768px', lg: '1024px', xl: '1280px', full: '100%'
  };
  return {
    paddingTop: s.paddingTop != null ? s.paddingTop + 'px' : '60px',
    paddingBottom: s.paddingBottom != null ? s.paddingBottom + 'px' : '60px',
    backgroundColor: s.backgroundColor || 'transparent',
    textAlign: (s.textAlign as any) || 'left',
  };
}

function innerStyle(block: any): React.CSSProperties {
  const s = block.styles || {};
  const maxWidths: Record<string, string> = {
    sm: '640px', md: '768px', lg: '1024px', xl: '1280px', full: '100%'
  };
  return {
    maxWidth: maxWidths[s.maxWidth] || 'var(--max-width-content, 1280px)',
    margin: '0 auto',
    padding: '0 clamp(16px, 5vw, 80px)',
  };
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

export function BlockRenderer({ block, locale }: BlockRendererProps) {
  if (!block.visible) return null;
  return (
    <section id={block.id} data-block-type={block.type} style={sectionStyle(block)}>
      <div style={innerStyle(block)}>
        {renderBlock(block, locale)}
      </div>
    </section>
  );
}

function renderBlock(block: any, locale: string): React.ReactNode {
  const s = block.settings || {};
  const align = block.styles?.textAlign || 'left';

  switch (block.type) {

    // ── HERO ──────────────────────────────────────────────────────────────────
    case 'hero': {
      const heading = loc(s.heading, locale);
      const subheading = loc(s.subheading, locale);
      const btnText = loc(s.buttonText, locale);
      const bgImg = s.backgroundImage;
      const overlay = s.backgroundOverlay ?? 40;
      const isLarge = s.height === 'large';
      return (
        <div style={{
          position: 'relative',
          minHeight: isLarge ? '80vh' : '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          textAlign: align as any,
          backgroundImage: bgImg ? 'url(' + bgImg + ')' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 'var(--radius-md, 0)',
          overflow: 'hidden',
        }}>
          {bgImg && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,' + (overlay / 100) + ')', zIndex: 0 }} />}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            {heading && <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: bgImg ? '#fff' : 'var(--color-primary)', lineHeight: 1.15, marginBottom: '20px' }}>{heading}</h1>}
            {subheading && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2vw, 20px)', color: bgImg ? 'rgba(255,255,255,0.85)' : 'var(--color-secondary)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '600px' }}>{subheading}</p>}
            {btnText && (
              <a href={s.buttonUrl || '#'} style={{ display: 'inline-block', background: 'var(--color-accent)', color: '#fff', padding: '14px 32px', borderRadius: 'var(--radius, 8px)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>{btnText}</a>
            )}
          </div>
        </div>
      );
    }

    // ── TEXT RICH ─────────────────────────────────────────────────────────────
    case 'text_rich': {
      const html = loc(s.content, locale);
      return (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body, 17px)', color: 'var(--color-primary)', lineHeight: 'var(--line-height-body, 1.7)', maxWidth: '720px', margin: align === 'center' ? '0 auto' : undefined }}
          dangerouslySetInnerHTML={{ __html: html || '<p>Text block</p>' }}
        />
      );
    }

    // ── IMAGE SINGLE ──────────────────────────────────────────────────────────
    case 'image_single': {
      const src = s.src || '';
      const alt = loc(s.alt, locale);
      const caption = loc(s.caption, locale);
      return (
        <figure style={{ margin: 0 }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md, 8px)', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--color-surface)', borderRadius: 'var(--radius-md, 8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', fontSize: '14px' }}>Bild hier</div>
          )}
          {caption && <figcaption style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>{caption}</figcaption>}
        </figure>
      );
    }

    // ── IMAGE GALLERY ─────────────────────────────────────────────────────────
    case 'image_gallery': {
      const images: any[] = s.images || [];
      const cols = s.columns || 3;
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '32px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gap: '12px' }}>
            {images.length > 0 ? images.map((img: any, i: number) => (
              <div key={i} style={{ aspectRatio: '4/3', background: 'var(--color-surface)', borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden' }}>
                {img.src && <img src={img.src} alt={loc(img.alt, locale)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            )) : [1,2,3].map(i => (
              <div key={i} style={{ aspectRatio: '4/3', background: 'var(--color-surface)', borderRadius: 'var(--radius-md, 8px)' }} />
            ))}
          </div>
        </div>
      );
    }

    // ── VIDEO EMBED ───────────────────────────────────────────────────────────
    case 'video_embed': {
      const url = s.url || '';
      const title = loc(s.title, locale);
      const embedUrl = url.includes('youtube.com/watch') ? url.replace('watch?v=', 'embed/') : url.includes('youtu.be/') ? 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1] : url;
      return (
        <div>
          {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '24px', textAlign: align as any }}>{title}</h2>}
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden', background: 'var(--color-surface)' }}>
            {embedUrl ? (
              <iframe src={embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={title || 'Video'} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', fontSize: '14px' }}>▶ Video URL eingeben</div>
            )}
          </div>
        </div>
      );
    }

    // ── CARDS GRID ────────────────────────────────────────────────────────────
    case 'cards_grid': {
      const cards: any[] = s.cards || [];
      const cols = s.columns || 3;
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {cards.map((card: any, i: number) => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md, 12px)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {card.image && <img src={card.image} alt={loc(card.title, locale)} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 'var(--radius-sm, 6px)' }} />}
                <h3 style={{ fontFamily: 'var(--font-heading, var(--font-display))', fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{loc(card.title, locale)}</h3>
                {card.desc && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>{loc(card.desc, locale)}</p>}
                {card.link && <a href={card.link} style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none', alignSelf: 'flex-start' }}>Mehr erfahren →</a>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── TESTIMONIALS ──────────────────────────────────────────────────────────
    case 'testimonials': {
      const items: any[] = s.items || [];
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {items.map((item: any, i: number) => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md, 12px)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {Array.from({ length: 5 }).map((_, si) => <span key={si} style={{ color: 'var(--color-accent)', fontSize: '14px' }}>★</span>)}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-primary)', lineHeight: 1.7, fontStyle: 'italic', flex: 1, margin: 0 }}>&ldquo;{loc(item.text, locale)}&rdquo;</p>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)' }}>— {item.name}{item.role ? ', ' + loc(item.role, locale) : ''}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── FAQ ───────────────────────────────────────────────────────────────────
    case 'faq': {
      const items: any[] = s.items || [];
      return (
        <div style={{ maxWidth: '800px', margin: align === 'center' ? '0 auto' : undefined }}>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item: any, i: number) => (
              <details key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden' }}>
                <summary style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background)' }}>
                  {loc(item.q, locale)}
                  <span style={{ color: 'var(--color-accent)', fontSize: '20px', fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 16px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)', lineHeight: 1.7, background: 'var(--color-background)' }}>
                  {loc(item.a, locale)}
                </div>
              </details>
            ))}
          </div>
        </div>
      );
    }

    // ── PRICING ───────────────────────────────────────────────────────────────
    case 'pricing': {
      const plans: any[] = s.plans || [];
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {plans.map((plan: any, i: number) => (
              <div key={i} style={{ background: plan.highlighted ? 'var(--color-accent)' : 'var(--color-surface)', border: '2px solid ' + (plan.highlighted ? 'var(--color-accent)' : 'var(--color-border)'), borderRadius: 'var(--radius-md, 12px)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: plan.highlighted ? '#fff' : 'var(--color-primary)', margin: 0 }}>{loc(plan.name, locale)}</h3>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: plan.highlighted ? '#fff' : 'var(--color-accent)', lineHeight: 1 }}>
                  {plan.currency || 'EUR'}{plan.price}
                  <span style={{ fontSize: '14px', fontWeight: 400, color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--color-secondary)', marginLeft: '4px' }}>{loc(plan.period, locale)}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {(plan.features || []).map((f: any, fi: number) => (
                    <li key={fi} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: plan.highlighted ? 'rgba(255,255,255,0.9)' : 'var(--color-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: plan.highlighted ? '#fff' : 'var(--color-accent)', flexShrink: 0 }}>✓</span>
                      {loc(f, locale)}
                    </li>
                  ))}
                </ul>
                <a href={plan.buttonUrl || '#'} style={{ display: 'block', background: plan.highlighted ? '#fff' : 'var(--color-accent)', color: plan.highlighted ? 'var(--color-accent)' : '#fff', padding: '12px 20px', borderRadius: 'var(--radius, 8px)', fontSize: '14px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontFamily: 'var(--font-body)' }}>{loc(plan.buttonText, locale)}</a>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── CTA BANNER ────────────────────────────────────────────────────────────
    case 'cta_banner': {
      const bg = s.backgroundColor || 'var(--color-accent)';
      const isDark = bg.includes('accent') || bg.startsWith('#') && parseInt(bg.slice(1,3),16) < 128;
      return (
        <div style={{ background: bg, borderRadius: 'var(--radius-md, 12px)', padding: '60px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{loc(s.heading, locale)}</h2>
          {s.subheading && <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px' }}>{loc(s.subheading, locale)}</p>}
          <a href={s.buttonUrl || '#'} style={{ display: 'inline-block', background: '#fff', color: 'var(--color-accent)', padding: '14px 36px', borderRadius: 'var(--radius, 8px)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>{loc(s.buttonText, locale)}</a>
        </div>
      );
    }

    // ── CONTACT FORM ──────────────────────────────────────────────────────────
    case 'contact_form': {
      return (
        <div style={{ maxWidth: '600px', margin: align === 'center' ? '0 auto' : undefined }}>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>{loc(s.title, locale)}</h2>}
          {s.subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-secondary)', marginBottom: '32px' }}>{loc(s.subtitle, locale)}</p>}
          <form action='/api/contact' method='POST' style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'name', label: locale === 'de' ? 'Name' : locale === 'ru' ? 'Имя' : 'Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
            ].map(field => (
              <div key={field.name}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{field.label}</label>
                <input type={field.type} name={field.name} required style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', background: 'var(--color-background)', boxSizing: 'border-box' as any }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{locale === 'de' ? 'Nachricht' : locale === 'ru' ? 'Сообщение' : 'Message'}</label>
              <textarea name='message' rows={4} required style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', background: 'var(--color-background)', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
            </div>
            <button type='submit' style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 'var(--radius, 8px)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', alignSelf: 'flex-start' }}>
              {loc(s.buttonText, locale) || (locale === 'de' ? 'Senden' : locale === 'ru' ? 'Отправить' : 'Send')}
            </button>
          </form>
        </div>
      );
    }

    // ── MAP EMBED ─────────────────────────────────────────────────────────────
    case 'map_embed': {
      const embedUrl = s.embedUrl || '';
      const address = s.address || '';
      return (
        <div>
          {address && s.showAddress && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)', marginBottom: '16px' }}>📍 {address}</p>}
          <div style={{ borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {embedUrl ? (
              <iframe src={embedUrl} width='100%' height='400' style={{ border: 'none', display: 'block' }} loading='lazy' title='Map' />
            ) : (
              <div style={{ height: '400px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', fontSize: '14px' }}>📍 Karte hier (Google Maps URL eingeben)</div>
            )}
          </div>
        </div>
      );
    }

    // ── STATS ─────────────────────────────────────────────────────────────────
    case 'stats': {
      const items: any[] = s.items || [];
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {items.map((item: any, i: number) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1, marginBottom: '8px' }}>{item.value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)' }}>{loc(item.label, locale)}</div>
            </div>
          ))}
        </div>
      );
    }

    // ── TEAM ──────────────────────────────────────────────────────────────────
    case 'team': {
      const members: any[] = s.members || [];
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px' }}>
            {members.map((m: any, i: number) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-surface)', margin: '0 auto 16px', overflow: 'hidden', border: '2px solid var(--color-border)' }}>
                  {m.photo ? <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>}
                </div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px' }}>{m.name}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-accent)', margin: '0 0 8px', fontWeight: 600 }}>{loc(m.role, locale)}</p>
                {m.bio && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0 }}>{loc(m.bio, locale)}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── LOGO CLOUD ────────────────────────────────────────────────────────────
    case 'logo_cloud': {
      const logos: any[] = s.logos || [];
      return (
        <div style={{ textAlign: 'center' }}>
          {s.title && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '32px' }}>{loc(s.title, locale)}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
            {logos.length > 0 ? logos.map((logo: any, i: number) => (
              <div key={i} style={{ opacity: 0.6, filter: 'grayscale(100%)' }}>
                {logo.src ? <img src={logo.src} alt={logo.alt || ''} style={{ height: '40px', width: 'auto' }} /> : <div style={{ padding: '8px 20px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontSize: '13px', color: 'var(--color-secondary)' }}>{logo.alt || 'Logo'}</div>}
              </div>
            )) : ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'].map((name, i) => (
              <div key={i} style={{ padding: '8px 20px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontSize: '13px', color: 'var(--color-secondary)', opacity: 0.6 }}>{name}</div>
            ))}
          </div>
        </div>
      );
    }

    // ── TIMELINE ──────────────────────────────────────────────────────────────
    case 'timeline': {
      const items: any[] = s.items || [];
      return (
        <div style={{ maxWidth: '700px', margin: align === 'center' ? '0 auto' : undefined }}>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px' }}>{loc(s.title, locale)}</h2>}
          <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid var(--color-border)' }}>
            {items.map((item: any, i: number) => (
              <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ position: 'absolute', left: '-41px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-accent)', border: '3px solid var(--color-background)' }} />
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.year}</div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 6px' }}>{loc(item.title, locale)}</h3>
                {item.desc && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0 }}>{loc(item.desc, locale)}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── DIVIDER ───────────────────────────────────────────────────────────────
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0' }} />;

    // ── BLOG FEED ─────────────────────────────────────────────────────────────
    case 'blog_feed': {
      const posts: any[] = s.posts || [];
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {posts.map((post: any, i: number) => (
              <a key={i} href={post.url || '#'} style={{ textDecoration: 'none', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md, 12px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {post.image && <img src={post.image} alt={loc(post.title, locale)} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {post.date && <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-secondary)' }}>{post.date}</span>}
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{loc(post.title, locale)}</h3>
                  {post.excerpt && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>{loc(post.excerpt, locale)}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // ── MENU FOOD ─────────────────────────────────────────────────────────────
    case 'menu_food': {
      const cats: any[] = s.categories || [];
      return (
        <div>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '40px', textAlign: align as any }}>{loc(s.title, locale)}</h2>}
          {cats.map((cat: any, ci: number) => (
            <div key={ci} style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>{loc(cat.name, locale)}</h3>
              {(cat.items || []).map((item: any, ii: number) => (
                <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px dashed var(--color-border)' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-primary)' }}>{loc(item.name, locale)}</span>
                    {item.description && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-secondary)', margin: '3px 0 0', lineHeight: 1.5 }}>{loc(item.description, locale)}</p>}
                  </div>
                  {item.price && <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 700, color: 'var(--color-accent)', marginLeft: '16px', flexShrink: 0 }}>{item.price}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // ── BOOKING FORM ──────────────────────────────────────────────────────────
    case 'booking_form': {
      return (
        <div style={{ maxWidth: '560px', margin: align === 'center' ? '0 auto' : undefined }}>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>{loc(s.title, locale)}</h2>}
          {s.subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-secondary)', marginBottom: '28px' }}>{loc(s.subtitle, locale)}</p>}
          <form action='/api/booking' method='POST' style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'name', label: locale === 'de' ? 'Name' : locale === 'ru' ? 'Имя' : 'Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: locale === 'de' ? 'Telefon' : locale === 'ru' ? 'Телефон' : 'Phone', type: 'tel' },
              { name: 'date', label: locale === 'de' ? 'Datum' : locale === 'ru' ? 'Дата' : 'Date', type: 'date' },
            ].map(field => (
              <div key={field.name}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{field.label}</label>
                <input type={field.type} name={field.name} required style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', background: 'var(--color-background)', boxSizing: 'border-box' as any }} />
              </div>
            ))}
            {s.showMessageField && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{locale === 'de' ? 'Nachricht' : locale === 'ru' ? 'Сообщение' : 'Message'}</label>
                <textarea name='message' rows={3} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius, 8px)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', background: 'var(--color-background)', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
              </div>
            )}
            <button type='submit' style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 'var(--radius, 8px)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', alignSelf: 'flex-start' }}>
              {loc(s.buttonText, locale) || (locale === 'de' ? 'Jetzt buchen' : locale === 'ru' ? 'Забронировать' : 'Book Now')}
            </button>
          </form>
        </div>
      );
    }

    // ── COUNTDOWN ─────────────────────────────────────────────────────────────
    case 'countdown': {
      return (
        <div style={{ textAlign: 'center' }}>
          {s.title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '32px' }}>{loc(s.title, locale)}</h2>}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Tage', 'Stunden', 'Minuten', 'Sekunden'].map((unit, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>00</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{unit}</div>
              </div>
            ))}
          </div>
          {s.targetDate && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-secondary)', marginTop: '16px' }}>Zieldatum: {s.targetDate}</p>}
        </div>
      );
    }

    // ── CUSTOM HTML ───────────────────────────────────────────────────────────
    case 'custom_html':
      return <div dangerouslySetInnerHTML={{ __html: s.html || '' }} />;

    default:
      return (
        <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius, 8px)', textAlign: 'center', color: 'var(--color-secondary)', fontSize: '13px' }}>
          Block: {block.type}
        </div>
      );
  }
}
