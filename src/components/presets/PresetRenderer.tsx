"use client";

// PresetRenderer — renders a full site preview from preset JSON data
// Sections: Nav, Hero, About, Services/Menu, Testimonials, FAQ, Contact, Footer

import React, { useState } from "react";
import type { Locale } from "@/lib/i18n/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

interface PresetRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preset: any;
  locale: Locale;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isColorDark(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

/** Get localised value from {de, en, ru} object — returns string or nested object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tl(obj: AnyObj | undefined, locale: Locale): any {
  if (!obj) return "";
  return obj[locale] || obj["de"] || obj["en"] || obj["ru"] || "";
}

/** Get localised field like name_de / name_en / name_ru */
function tf(obj: AnyObj | undefined, field: string, locale: Locale): string {
  if (!obj) return "";
  return (
    obj[`${field}_${locale}`] ||
    obj[`${field}_de`] ||
    obj[`${field}_en`] ||
    obj[`${field}_ru`] ||
    obj[field] ||
    ""
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function PresetNav({ preset, locale }: PresetRendererProps) {
  const [open, setOpen] = useState(false);
  const tokens = preset.design?.tokens || {};
  const navStyle = preset.layout?.navStyle || "transparent_dark";
  const isDishoom = navStyle === "dark_serif_gold_cta";

  // Dishoom: always dark navbar #1A1410
  // Others: transparent or surface
  const isDark = isColorDark(tokens.colorBackground || "#fff");
  const isTransparent = navStyle.includes("transparent");
  const navBg = isDishoom
    ? (tokens.colorDark || "#1A1410")
    : isTransparent
      ? isDark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.88)"
      : tokens.colorSurface || "#fff";

  const navTextColor = isDishoom ? (tokens.colorNavLink || "#D4C9B0") : (tokens.colorSecondary || tokens.colorPrimary);
  const logoColor = isDishoom ? (tokens.colorDarkText || "#F0ECE0") : (tokens.colorAccent || tokens.colorPrimary);

  const logo = preset.logo || {};
  const links: string[] = preset.navigation?.links || ["Über uns", "Leistungen", "Kontakt"];
  const accentDark = isColorDark(tokens.colorAccent || "#000");

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: navBg,
      backdropFilter: isDishoom ? "none" : "blur(12px)",
      WebkitBackdropFilter: isDishoom ? "none" : "blur(12px)",
      borderBottom: isDishoom ? "none" : `1px solid ${tokens.colorBorder || "#e5e5e5"}`,
      padding: `0 ${tokens.horizontalPaddingDesktop || "40px"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: isDishoom ? "54px" : "64px",
      fontFamily: "var(--font-body)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{
          fontFamily: isDishoom ? "var(--font-display)" : "var(--font-display)",
          fontSize: isDishoom ? "18px" : "20px",
          fontWeight: isDishoom ? 400 : 700,
          color: logoColor,
          letterSpacing: isDishoom ? "3px" : "-0.3px",
          textTransform: isDishoom ? "uppercase" : "none",
        }}>
          {logo.text || preset.meta?.title?.split("|")[0]?.trim() || "Logo"}
        </span>
        {logo.tagline && !isDishoom && (
          <span style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorSecondary }}>
            {logo.tagline}
          </span>
        )}
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: isDishoom ? "0" : "28px", alignItems: "center" }}>
        {links.slice(0, -1).map((link: string, i: number) => (
          <a key={i} href={`#section-${i}`} style={{
            fontSize: isDishoom ? "13px" : "14px",
            color: navTextColor,
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            transition: "color 0.2s",
            textTransform: isDishoom ? "uppercase" : "none",
            letterSpacing: isDishoom ? "1.5px" : "0",
            padding: isDishoom ? "0 16px" : "0",
          }}>
            {link}
          </a>
        ))}
        <a href="#contact" style={{
          background: tokens.colorAccent,
          color: accentDark ? "#fff" : "#000",
          padding: isDishoom ? "8px 16px" : "8px 20px",
          borderRadius: `${tokens.borderRadius || 0}px`,
          fontSize: isDishoom ? "12px" : "13px",
          fontWeight: isDishoom ? 400 : 600,
          textDecoration: "none",
          fontFamily: "var(--font-body)",
          textTransform: isDishoom ? "uppercase" : "none",
          letterSpacing: isDishoom ? "2px" : "0",
        }}>
          {links[links.length - 1] || "Kontakt"}
        </a>
      </div>

      {/* Mobile burger */}
      <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px", color: isDishoom ? (tokens.colorDarkText || "#F0ECE0") : tokens.colorPrimary }} aria-label="Menu" className="preset-burger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ position: "absolute", top: isDishoom ? "54px" : "64px", left: 0, right: 0, background: isDishoom ? (tokens.colorDark || "#1A1410") : (tokens.colorSurface || "#fff"), borderBottom: `1px solid ${tokens.colorBorder}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {links.map((link: string, i: number) => (
            <a key={i} href={`#section-${i}`} onClick={() => setOpen(false)} style={{ fontSize: isDishoom ? "18px" : "16px", color: isDishoom ? (tokens.colorDarkText || "#F0ECE0") : tokens.colorPrimary, textDecoration: "none", fontFamily: isDishoom ? "var(--font-display)" : "var(--font-body)" }}>
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}


// ─── HERO ─────────────────────────────────────────────────────────────────────

function PresetHero({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const hero: AnyObj = preset.content?.hero ? (tl(preset.content.hero, locale) || {}) : {};
  const slogans: string[] = (tl(preset.content?.slogans, locale) as string[]) || [];
  const layoutStyle = preset.layout?.style || "clean_minimal";
  const isDark = isColorDark(tokens.colorBackground || "#fff");
  const accentDark = isColorDark(tokens.colorAccent || "#000");

  const heading = hero.heading || slogans[0] || preset.meta?.title?.split("|")[0]?.trim() || "";
  const subheading = hero.subheading || preset.meta?.description || "";
  const cta = hero.cta || "Mehr erfahren";
  const secondaryCta = hero.secondaryCta || "";

  const heroBg =
    layoutStyle === "dark_elegant" || layoutStyle === "dark_masculine"
      ? `linear-gradient(135deg, ${tokens.colorBackground} 0%, ${tokens.colorSurface} 100%)`
      : `linear-gradient(135deg, ${tokens.colorBackground} 0%, ${tokens.colorSurface}cc 100%)`;

  return (
    <section
      id="hero"
      style={{
        minHeight: "90vh",
        background: heroBg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "80px clamp(24px, 8vw, 120px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accent line */}
      <div
        style={{
          width: "60px",
          height: "3px",
          background: tokens.colorAccent,
          marginBottom: "32px",
          borderRadius: "2px",
        }}
      />

      {/* Heading */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 80px)",
          fontWeight: 700,
          color: tokens.colorPrimary,
          lineHeight: 1.15,
          maxWidth: "900px",
          margin: "0 0 24px",
          letterSpacing: isDark ? "0.5px" : "-0.5px",
        }}
      >
        {heading}
      </h1>

      {/* Subheading */}
      {subheading && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: tokens.colorSecondary,
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0 0 48px",
          }}
        >
          {subheading}
        </p>
      )}

      {/* CTAs */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="#contact"
          style={{
            background: tokens.colorAccent,
            color: accentDark ? "#fff" : "#000",
            padding: "16px 36px",
            borderRadius: `${tokens.borderRadius || 8}px`,
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            transition: "opacity 0.2s",
            display: "inline-block",
          }}
        >
          {cta}
        </a>
        {secondaryCta && (
          <a
            href="#about"
            style={{
              border: `2px solid ${tokens.colorAccent}`,
              color: tokens.colorAccent,
              padding: "14px 34px",
              borderRadius: `${tokens.borderRadius || 8}px`,
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              display: "inline-block",
            }}
          >
            {secondaryCta}
          </a>
        )}
      </div>

      {/* Announcement banner */}
      {preset.content?.announcement && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: tokens.colorAccent,
            color: accentDark ? "#fff" : "#000",
            padding: "8px 20px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            maxWidth: "90vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tl(preset.content.announcement, locale)}
        </div>
      )}
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function PresetAbout({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const aboutData: AnyObj | null = preset.content?.about
    ? (tl(preset.content.about, locale) || null)
    : null;
  if (!aboutData) return null;

  const title = aboutData.title || "";
  const subtitle = aboutData.subtitle || "";
  const text = aboutData.text || "";
  const stats: AnyObj[] = aboutData.stats || [];
  const layoutStyle = preset.layout?.aboutLayout || "image_left_text_right";
  const isDark = isColorDark(tokens.colorBackground || "#fff");

  return (
    <section
      id="about"
      style={{
        background: tokens.colorSurface || "#fff",
        padding: "100px clamp(24px, 8vw, 120px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: layoutStyle === "centered" ? "1fr" : "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Image placeholder */}
        {layoutStyle !== "centered" && (
          <div
            style={{
              aspectRatio: "4/3",
              background: isDark
                ? `linear-gradient(135deg, ${tokens.colorBackground} 0%, ${tokens.colorBorder} 100%)`
                : `linear-gradient(135deg, ${tokens.colorBorder}66 0%, ${tokens.colorAccent}22 100%)`,
              borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              order: layoutStyle === "image_right_text_left" ? 1 : 0,
            }}
          >
            <span style={{ fontSize: "48px", opacity: 0.4 }}>📷</span>
          </div>
        )}

        {/* Text */}
        <div style={{ textAlign: layoutStyle === "centered" ? "center" : "left" }}>
          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: tokens.colorAccent,
                marginBottom: "12px",
                fontWeight: 600,
              }}
            >
              {subtitle}
            </p>
          )}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: tokens.colorPrimary,
              lineHeight: 1.25,
              marginBottom: "24px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "17px",
              color: tokens.colorSecondary,
              lineHeight: 1.8,
              marginBottom: "40px",
              maxWidth: "560px",
            }}
          >
            {text}
          </p>

          {/* Stats */}
          {stats.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "40px",
                flexWrap: "wrap",
                justifyContent: layoutStyle === "centered" ? "center" : "flex-start",
              }}
            >
              {stats.map((stat: AnyObj, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "36px",
                      fontWeight: 700,
                      color: tokens.colorAccent,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: tokens.colorSecondary,
                      marginTop: "4px",
                    }}
                  >
                    {tf(stat, "label", locale) || stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES / MENU ─────────────────────────────────────────────────────────

function PresetServices({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const isDark = isColorDark(tokens.colorBackground || "#fff");

  // Support both services array and menu (restaurant) array
  const rawServices: AnyObj[] = preset.content?.services || [];
  const rawMenu: AnyObj[] = preset.content?.menu || [];
  const isMenu = rawMenu.length > 0;
  const items = isMenu ? rawMenu : rawServices;
  if (items.length === 0) return null;

  const accentDark = isColorDark(tokens.colorAccent || "#000");

  return (
    <section
      id="section-0"
      style={{
        background: tokens.colorBackground,
        padding: "100px clamp(24px, 8vw, 120px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: tokens.colorAccent,
              margin: "0 auto 20px",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: tokens.colorPrimary,
              marginBottom: "12px",
            }}
          >
            {isMenu
              ? locale === "de" ? "Speisekarte" : locale === "ru" ? "Меню" : "Menu"
              : locale === "de" ? "Unsere Leistungen" : locale === "ru" ? "Наши услуги" : "Our Services"}
          </h2>
        </div>

        {isMenu ? (
          // Restaurant menu — categories
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {items.map((category: AnyObj, ci: number) => (
              <div key={ci}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: tokens.colorAccent,
                    marginBottom: "24px",
                    paddingBottom: "12px",
                    borderBottom: `1px solid ${tokens.colorBorder}`,
                  }}
                >
                  {tf(category, "category", locale)}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {(category.items || []).map((item: AnyObj, ii: number) => (
                    <div
                      key={ii}
                      style={{
                        background: tokens.colorSurface,
                        border: `1px solid ${tokens.colorBorder}`,
                        borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: tokens.colorPrimary,
                            flex: 1,
                          }}
                        >
                          {tf(item, "name", locale)}
                        </span>
                        {item.price && (
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "15px",
                              fontWeight: 700,
                              color: tokens.colorAccent,
                              marginLeft: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>
                      {tf(item, "desc", locale) && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            color: tokens.colorSecondary,
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {tf(item, "desc", locale)}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                          {item.tags.map((tag: string, ti: number) => (
                            <span
                              key={ti}
                              style={{
                                background: `${tokens.colorAccent}22`,
                                color: tokens.colorAccent,
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontWeight: 600,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Services grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {items.map((service: AnyObj, i: number) => {
              const name = tf(service, "name", locale) || tf(service, "n", locale);
              const desc = tf(service, "desc", locale) || tf(service, "d", locale);
              const price = service.price || service.p || "";
              return (
                <div
                  key={i}
                  style={{
                    background: tokens.colorSurface,
                    border: `1px solid ${tokens.colorBorder}`,
                    borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "3px",
                      background: tokens.colorAccent,
                      borderRadius: "2px",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-heading, var(--font-display))",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: tokens.colorPrimary,
                      margin: 0,
                    }}
                  >
                    {name}
                  </h3>
                  {desc && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: tokens.colorSecondary,
                        lineHeight: 1.6,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {desc}
                    </p>
                  )}
                  {price && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: tokens.colorAccent,
                        marginTop: "8px",
                      }}
                    >
                      {price}
                    </div>
                  )}
                  <a
                    href="#contact"
                    style={{
                      background: tokens.colorAccent,
                      color: accentDark ? "#fff" : "#000",
                      padding: "10px 20px",
                      borderRadius: `${tokens.borderRadius || 8}px`,
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      textAlign: "center",
                      marginTop: "8px",
                      display: "block",
                    }}
                  >
                    {locale === "de" ? "Anfragen" : locale === "ru" ? "Записаться" : "Book Now"}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function PresetTestimonials({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const testimonials: AnyObj[] = preset.content?.testimonials || [];
  if (testimonials.length === 0) return null;

  const layoutStyle = preset.layout?.testimonialsLayout || "light_background";
  const isDarkBg = layoutStyle === "dark_background";
  const bg = isDarkBg ? tokens.colorSurface : tokens.colorBackground;
  const textColor = isDarkBg ? tokens.colorPrimary : tokens.colorPrimary;

  return (
    <section
      id="section-2"
      style={{
        background: bg,
        padding: "100px clamp(24px, 8vw, 120px)",
        borderTop: `1px solid ${tokens.colorBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: tokens.colorAccent,
              margin: "0 auto 20px",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: textColor,
            }}
          >
            {locale === "de" ? "Was unsere Kunden sagen" : locale === "ru" ? "Отзывы клиентов" : "What Our Clients Say"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "28px",
          }}
        >
          {testimonials.map((t: AnyObj, i: number) => {
            const text = tf(t, "text", locale);
            const stars = t.rating || 5;
            return (
              <div
                key={i}
                style={{
                  background: isDarkBg ? `${tokens.colorBackground}44` : tokens.colorSurface,
                  border: `1px solid ${tokens.colorBorder}`,
                  borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "3px" }}>
                  {Array.from({ length: stars }).map((_, si) => (
                    <span key={si} style={{ color: tokens.colorAccent, fontSize: "16px" }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: textColor,
                    lineHeight: 1.7,
                    margin: 0,
                    flex: 1,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{text}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: `${tokens.colorAccent}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: tokens.colorAccent,
                      fontFamily: "var(--font-body)",
                      flexShrink: 0,
                    }}
                  >
                    {t.name?.[0] || "?"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: textColor,
                      }}
                    >
                      {t.name}
                    </div>
                    {(t.location_de || t.location) && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: tokens.colorSecondary,
                        }}
                      >
                        {tf(t, "location", locale) || t.location}
                      </div>
                    )}
                  </div>
                  {t.source && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        color: tokens.colorSecondary,
                        background: `${tokens.colorBorder}88`,
                        padding: "2px 8px",
                        borderRadius: "8px",
                      }}
                    >
                      {t.source}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function PresetFAQ({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const faq: AnyObj[] = preset.content?.faq || [];
  if (faq.length === 0) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        background: tokens.colorSurface,
        padding: "100px clamp(24px, 8vw, 120px)",
        borderTop: `1px solid ${tokens.colorBorder}`,
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: tokens.colorAccent,
              margin: "0 auto 20px",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: tokens.colorPrimary,
            }}
          >
            {locale === "de" ? "Häufige Fragen" : locale === "ru" ? "Частые вопросы" : "FAQ"}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faq.map((item: AnyObj, i: number) => {
            const q = tf(item, "q", locale);
            const a = tf(item, "a", locale);
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  border: `1px solid ${isOpen ? tokens.colorAccent : tokens.colorBorder}`,
                  borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: isOpen ? `${tokens.colorAccent}11` : tokens.colorBackground,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: tokens.colorPrimary,
                      flex: 1,
                    }}
                  >
                    {q}
                  </span>
                  <span
                    style={{
                      color: tokens.colorAccent,
                      fontSize: "20px",
                      fontWeight: 300,
                      flexShrink: 0,
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      background: tokens.colorBackground,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: tokens.colorSecondary,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function PresetContact({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const contact = preset.content?.contact || {};
  const accentDark = isColorDark(tokens.colorAccent || "#000");

  return (
    <section
      id="contact"
      style={{
        background: tokens.colorBackground,
        padding: "100px clamp(24px, 8vw, 120px)",
        borderTop: `1px solid ${tokens.colorBorder}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Contact info */}
        <div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: tokens.colorAccent,
              marginBottom: "20px",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: tokens.colorPrimary,
              marginBottom: "32px",
            }}
          >
            {locale === "de" ? "Kontakt" : locale === "ru" ? "Контакты" : "Contact"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {contact.address && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>📍</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.colorSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    {locale === "de" ? "Adresse" : locale === "ru" ? "Адрес" : "Address"}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorPrimary }}>
                    {contact.address}
                  </div>
                </div>
              </div>
            )}
            {contact.phone && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>📞</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.colorSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    {locale === "de" ? "Telefon" : locale === "ru" ? "Телефон" : "Phone"}
                  </div>
                  <a href={`tel:${contact.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorAccent, textDecoration: "none" }}>
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}
            {contact.email && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>✉️</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.colorSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    Email
                  </div>
                  <a href={`mailto:${contact.email}`} style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorAccent, textDecoration: "none" }}>
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
            {(contact.hours_de || contact.hours) && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>🕐</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.colorSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    {locale === "de" ? "Öffnungszeiten" : locale === "ru" ? "Часы работы" : "Opening Hours"}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorPrimary, lineHeight: 1.6 }}>
                    {tf(contact, "hours", locale) || contact.hours}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div
          style={{
            background: tokens.colorSurface,
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: `${tokens.borderRadiusMedium || "12px"}`,
            padding: "40px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 700,
              color: tokens.colorPrimary,
              marginBottom: "28px",
            }}
          >
            {locale === "de" ? "Nachricht senden" : locale === "ru" ? "Написать нам" : "Send a Message"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: locale === "de" ? "Name" : locale === "ru" ? "Имя" : "Name", type: "text" },
              { label: "Email", type: "email" },
              { label: locale === "de" ? "Nachricht" : locale === "ru" ? "Сообщение" : "Message", type: "textarea" },
            ].map((field, i) => (
              <div key={i}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: tokens.colorSecondary,
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: tokens.colorBackground,
                      border: `1px solid ${tokens.colorBorder}`,
                      borderRadius: `${tokens.borderRadius || 8}px`,
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: tokens.colorPrimary,
                      resize: "vertical",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: tokens.colorBackground,
                      border: `1px solid ${tokens.colorBorder}`,
                      borderRadius: `${tokens.borderRadius || 8}px`,
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: tokens.colorPrimary,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              style={{
                background: tokens.colorAccent,
                color: accentDark ? "#fff" : "#000",
                padding: "14px 28px",
                borderRadius: `${tokens.borderRadius || 8}px`,
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                marginTop: "8px",
              }}
            >
              {locale === "de" ? "Absenden" : locale === "ru" ? "Отправить" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function PresetFooter({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const isDark = isColorDark(tokens.colorBackground || "#fff");
  const footerBg = isDark ? tokens.colorBackground : tokens.colorSurface;
  const logo = preset.logo || {};
  const contact = preset.content?.contact || {};
  const social = preset.social || {};
  const legal = preset.content?.legal || {};

  return (
    <footer
      style={{
        background: footerBg,
        borderTop: `1px solid ${tokens.colorBorder}`,
        padding: "60px clamp(24px, 8vw, 120px) 32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 700,
                color: tokens.colorAccent,
                marginBottom: "12px",
              }}
            >
              {logo.text || preset.meta?.title?.split("|")[0]?.trim()}
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: tokens.colorSecondary,
                lineHeight: 1.7,
                maxWidth: "320px",
                margin: "0 0 20px",
              }}
            >
              {preset.meta?.description || ""}
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "12px" }}>
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ color: tokens.colorSecondary, textDecoration: "none", fontSize: "20px" }}>
                  📸
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ color: tokens.colorSecondary, textDecoration: "none", fontSize: "20px" }}>
                  👥
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                color: tokens.colorSecondary,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "16px",
              }}
            >
              {locale === "de" ? "Kontakt" : locale === "ru" ? "Контакты" : "Contact"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {contact.address && (
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorSecondary }}>
                  {contact.address}
                </span>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorAccent, textDecoration: "none" }}>
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorAccent, textDecoration: "none" }}>
                  {contact.email}
                </a>
              )}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                color: tokens.colorSecondary,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "16px",
              }}
            >
              {locale === "de" ? "Rechtliches" : locale === "ru" ? "Правовое" : "Legal"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { href: "/de/impressum", label: "Impressum" },
                { href: "/de/datenschutz", label: "Datenschutz" },
                { href: "#", label: locale === "de" ? "AGB" : locale === "ru" ? "Условия" : "Terms" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: tokens.colorSecondary,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal notes */}
        {legal.allergenNote_de && locale === "de" && (
          <div
            style={{
              borderTop: `1px solid ${tokens.colorBorder}`,
              paddingTop: "24px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: tokens.colorSecondary,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {legal.allergenNote_de}
            </p>
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${tokens.colorBorder}`,
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: tokens.colorSecondary,
            }}
          >
            © {new Date().getFullYear()} {logo.text || preset.meta?.title?.split("|")[0]?.trim()}. Alle Rechte vorbehalten.
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: `${tokens.colorSecondary}88`,
            }}
          >
            Powered by 1universum
          </span>
        </div>
      </div>
    </footer>
  );
}



// ─── ANNOUNCEMENT BAR ────────────────────────────────────────────────────────

function PresetAnnouncementBar({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const raw = preset.content?.announcementBar;
  const text = typeof raw === "string" ? raw : tl(raw, locale);
  if (!text) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <div style={{
      background: tokens.colorAccent,
      color: accentDark ? "#fff" : "#000",
      textAlign: "center",
      padding: "10px 24px",
      fontSize: "13px",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      letterSpacing: "0.3px",
    }}>
      {text}
    </div>
  );
}

// ─── QUICK LINKS ─────────────────────────────────────────────────────────────

function PresetQuickLinks({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const links: AnyObj[] = preset.content?.quickLinks || [];
  if (!links.length) return null;
  return (
    <section style={{
      background: tokens.colorSurface,
      borderBottom: `1px solid ${tokens.colorBorder}`,
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: `repeat(${links.length}, 1fr)`,
      }}>
        {links.map((link: AnyObj, i: number) => (
          <a key={i} href={link.href || "#"} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "28px 16px",
            textDecoration: "none",
            borderRight: i < links.length - 1 ? `1px solid ${tokens.colorBorder}` : "none",
          }}>
            <span style={{ fontSize: "24px" }}>{link.icon}</span>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 700,
              color: tokens.colorPrimary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              textAlign: "center",
            }}>
              {link[`label_${locale}`] || link.label_de || link.label_en || ""}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── CREDENTIALS BAR ─────────────────────────────────────────────────────────

function PresetCredentials({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const creds: AnyObj[] = preset.content?.credentials || [];
  if (!creds.length) return null;
  return (
    <section style={{
      background: tokens.colorSurface,
      borderBottom: `1px solid ${tokens.colorBorder}`,
      padding: "20px clamp(16px, 5vw, 80px)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          color: tokens.colorSecondary,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          fontFamily: "var(--font-body)",
        }}>
          {locale === "de" ? "ZERTIFIZIERUNGEN:" : locale === "ru" ? "СЕРТИФИКАТЫ:" : "CREDENTIALS:"}
        </span>
        {creds.map((c: AnyObj, i: number) => (
          <span key={i} style={{
            fontSize: "12px",
            color: tokens.colorSecondary,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}>{c.name}</span>
        ))}
      </div>
    </section>
  );
}

// ─── SERVICE CATEGORIES ───────────────────────────────────────────────────────

function PresetServiceCategories({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const cats: AnyObj[] = preset.content?.serviceCategories || [];
  if (!cats.length) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "80px clamp(16px, 5vw, 80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
          {cats.map((cat: AnyObj, i: number) => (
            <div key={i} style={{ position: "relative", aspectRatio: "3/4", background: tokens.colorSurface, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${tokens.colorBackground}ee 0%, transparent 60%)` }} />
              <div style={{ position: "relative", padding: "32px 24px", zIndex: 1 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "16px", letterSpacing: "2px" }}>
                  {cat[`name_${locale}`] || cat.name_de || cat.name_en || ""}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                  {(cat.services || []).slice(0, 4).map((s: AnyObj, si: number) => (
                    <li key={si} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorSecondary, padding: "3px 0" }}>
                      {s[`name_${locale}`] || s.name_de || s.name_en || ""}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{ fontSize: "12px", fontWeight: 700, color: tokens.colorAccent, textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px", borderBottom: `1px solid ${tokens.colorAccent}`, paddingBottom: "2px" }}>
                  {locale === "de" ? "MEHR ANSEHEN" : locale === "ru" ? "ПОДРОБНЕЕ" : "VIEW MORE"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BODY MAP ─────────────────────────────────────────────────────────────────

function PresetBodyMap({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const bodyMap = preset.content?.bodyMap || {};
  const areas: string[] = bodyMap.areas || [];
  const title = bodyMap[`title_${locale}`] || bodyMap.title_de || bodyMap.title_en || "";
  if (!areas.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "40px" }}>{title}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          {areas.map((area: string, i: number) => (
            <span key={i} style={{ padding: "10px 20px", border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadius || 8}px`, fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorPrimary, cursor: "pointer" }}>{area}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED TREATMENT ───────────────────────────────────────────────────────

function PresetFeaturedTreatment({ preset, locale, isSpa }: PresetRendererProps & { isSpa?: boolean }) {
  const tokens = preset.design?.tokens || {};
  const ft = isSpa ? preset.content?.featuredNewTreatment : preset.content?.featuredTreatment;
  if (!ft) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  const badge = ft[`badge_${locale}`] || ft.badge_de || ft.badge_en || "";
  const title = ft[`title_${locale}`] || ft.title_de || ft.title_en || "";
  const desc = ft[`desc_${locale}`] || ft.desc_de || ft.desc_en || "";
  const cta = ft[`cta_${locale}`] || ft.cta_de || ft.cta_en || "";
  const benefits: AnyObj[] = ft.benefits || [];
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div>
          {badge && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>{badge}</p>}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.2, marginBottom: "24px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "32px" }}>{desc}</p>
          {benefits.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {benefits.map((b: AnyObj, i: number) => (
                <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "8px 0", fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, borderBottom: `1px solid ${tokens.colorBorder}` }}>
                  <span style={{ color: tokens.colorAccent, flexShrink: 0 }}>✓</span>
                  {b[locale] || b.de || b.en || ""}
                </li>
              ))}
            </ul>
          )}
          {cta && <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "14px 32px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}>{cta}</a>}
        </div>
        <div style={{ aspectRatio: "4/5", background: `linear-gradient(135deg, ${tokens.colorBorder}44 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.4 }}>✨</span>
        </div>
      </div>
    </section>
  );
}

// ─── HAIR RESTORATION ─────────────────────────────────────────────────────────

function PresetHairRestoration({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const hr = preset.content?.hairRestoration || {};
  const badge = hr[`badge_${locale}`] || hr.badge_de || "";
  const title = hr[`title_${locale}`] || hr.title_de || "";
  const desc = hr[`desc_${locale}`] || hr.desc_de || "";
  if (!title) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ aspectRatio: "4/5", background: `linear-gradient(135deg, ${tokens.colorBorder}44 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.4 }}>💆</span>
        </div>
        <div>
          {badge && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>{badge}</p>}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.2, marginBottom: "24px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "32px" }}>{desc}</p>
          <a href="#contact" style={{ display: "inline-block", border: `2px solid ${tokens.colorAccent}`, color: tokens.colorAccent, padding: "12px 28px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}>
            {locale === "de" ? "MEHR ERFAHREN" : locale === "ru" ? "УЗНАТЬ БОЛЬШЕ" : "LEARN MORE"}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── CORE SPECIALTIES ─────────────────────────────────────────────────────────

function PresetCoreSpecialties({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const specs: AnyObj[] = preset.content?.coreSpecialties || [];
  if (!specs.length) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Behandlungen für Ihr Wohlbefinden" : locale === "ru" ? "Процедуры для вашего благополучия" : "Treatments designed for how you want to feel"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
          {specs.map((spec: AnyObj, i: number) => (
            <div key={i} style={{ background: tokens.colorSurface, padding: "48px 36px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "32px", height: "2px", background: tokens.colorAccent }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.3 }}>
                {spec[`name_${locale}`] || spec.name_de || spec.name_en || ""}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, flex: 1 }}>
                {spec[`desc_${locale}`] || spec.desc_de || spec.desc_en || ""}
              </p>
              <a href="#contact" style={{ fontSize: "12px", fontWeight: 700, color: tokens.colorAccent, textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px", borderBottom: `1px solid ${tokens.colorAccent}`, paddingBottom: "2px", alignSelf: "flex-start" }}>
                {locale === "de" ? "ANSEHEN" : locale === "ru" ? "ПОДРОБНЕЕ" : "VIEW"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────

function PresetWhyChooseUs({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const items: AnyObj[] = preset.content?.whyChooseUs || [];
  if (!items.length) return null;
  const icons = ["🌿", "🏠", "⭐"];
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Warum Kunden uns wählen" : locale === "ru" ? "Почему клиенты выбирают нас" : "Why clients choose us"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
          {items.map((item: AnyObj, i: number) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "56px", height: "56px", background: `${tokens.colorAccent}22`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                {icons[i] || "✓"}
              </div>
              <h3 style={{ fontFamily: "var(--font-heading, var(--font-display))", fontSize: "18px", fontWeight: 700, color: tokens.colorPrimary }}>
                {item[`title_${locale}`] || item.title_de || item.title_en || ""}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7 }}>
                {item[`desc_${locale}`] || item.desc_de || item.desc_en || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MEET THERAPIST ───────────────────────────────────────────────────────────

function PresetMeetTherapist({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const t = preset.content?.therapist || {};
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  const quote = t[`quote_${locale}`] || t.quote_de || t.quote_en || "";
  const creds = t[`credentials_${locale}`] || t.credentials_de || t.credentials_en || "";
  if (!t.name) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg, ${tokens.colorBorder}66 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.4 }}>👩‍⚕️</span>
        </div>
        <div>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "8px" }}>
            {locale === "de" ? "Lernen Sie Ihre Therapeutin kennen" : locale === "ru" ? "Познакомьтесь с вашим терапевтом" : "Meet your therapist"}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, color: tokens.colorAccent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>{t.name}</p>
          {quote && <blockquote style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontStyle: "italic", color: tokens.colorPrimary, lineHeight: 1.7, borderLeft: `3px solid ${tokens.colorAccent}`, paddingLeft: "20px", marginBottom: "24px" }}>&ldquo;{quote}&rdquo;</blockquote>}
          {creds && <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, lineHeight: 1.7, marginBottom: "32px" }}>{creds}</p>}
          <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "12px 28px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}>
            {locale === "de" ? "Geschichte lesen" : locale === "ru" ? "Читать историю" : "Read full story"}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── VISION ───────────────────────────────────────────────────────────────────

function PresetVision({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const v = tl(preset.content?.vision, locale) as AnyObj || {};
  if (!v.title) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>{v.title}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.25, marginBottom: "24px" }}>{v.subtitle}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "32px" }}>{v.text}</p>
          <a href="#services" style={{ display: "inline-block", border: `2px solid ${tokens.colorAccent}`, color: tokens.colorAccent, padding: "12px 28px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}>
            {locale === "de" ? "Leistungen ansehen" : locale === "ru" ? "Наши услуги" : "View Our Services"}
          </a>
        </div>
        <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${tokens.colorBackground} 0%, ${tokens.colorBorder} 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.3 }}>🎯</span>
        </div>
      </div>
    </section>
  );
}

// ─── CORE VALUES ──────────────────────────────────────────────────────────────

function PresetCoreValues({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const values: string[] = tl(preset.content?.coreValues, locale) as string[] || [];
  if (!values.length) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "56px" }}>
          {locale === "de" ? "Unsere Kernwerte" : locale === "ru" ? "Наши ценности" : "Our Core Values"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px" }}>
          {values.map((val: string, i: number) => (
            <div key={i} style={{ background: tokens.colorSurface, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: tokens.colorAccent }}>{String(i + 1).padStart(2, "0")}</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorPrimary, lineHeight: 1.5, textAlign: "center" }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HAIRSTYLE GUIDE ──────────────────────────────────────────────────────────

function PresetHairstyleGuide({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const styles: AnyObj[] = preset.content?.hairstyleGuide || [];
  if (!styles.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Frisuren-Guide" : locale === "ru" ? "Гид по стрижкам" : "Hairstyle Guide"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "2px" }}>
          {styles.map((style: AnyObj, i: number) => (
            <div key={i} style={{ background: tokens.colorBackground, padding: "32px 20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `${tokens.colorAccent}22`, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>✂️</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: tokens.colorPrimary }}>
                {style[`name_${locale}`] || style.name_de || style.name_en || ""}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorSecondary, lineHeight: 1.5 }}>
                {style[`desc_${locale}`] || style.desc_de || style.desc_en || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

function PresetProducts({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const products = preset.content?.products || {};
  const items: AnyObj[] = products.items || [];
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  const title = products[`title_${locale}`] || products.title_de || products.title_en || "";
  const desc = products[`desc_${locale}`] || products.desc_de || products.desc_en || "";
  const tabs: string[] = products[`tabs_${locale}`] || products.tabs_de || products.tabs_en || [];
  if (!items.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start", marginBottom: "48px" }}>
          <div>
            <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, marginBottom: "20px" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "16px" }}>{title}</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7 }}>{desc}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-start" }}>
            {tabs.map((tab: string, i: number) => (
              <span key={i} style={{ padding: "8px 20px", border: `1px solid ${i === 0 ? tokens.colorAccent : tokens.colorBorder}`, borderRadius: `${tokens.borderRadius || 8}px`, fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? tokens.colorAccent : tokens.colorSecondary, cursor: "pointer" }}>{tab}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {items.map((item: AnyObj, i: number) => {
            const badge = item[`badge_${locale}`] || item.badge_de || "";
            return (
              <div key={i} style={{ background: tokens.colorBackground, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, overflow: "hidden" }}>
                <div style={{ aspectRatio: "1", background: `${tokens.colorAccent}11`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: "48px", opacity: 0.4 }}>🧴</span>
                  {badge && <span style={{ position: "absolute", top: "12px", left: "12px", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>{badge}</span>}
                </div>
                <div style={{ padding: "16px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: tokens.colorPrimary, marginBottom: "4px" }}>{item[`name_${locale}`] || item.name_de || item.name_en || ""}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 700, color: tokens.colorAccent }}>{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── HIIT FACTS ───────────────────────────────────────────────────────────────

function PresetHiitFacts({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const facts: AnyObj[] = preset.content?.hiitFacts || [];
  if (!facts.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2px" }}>
        {facts.map((fact: AnyObj, i: number) => (
          <div key={i} style={{ background: tokens.colorBackground, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 900, color: tokens.colorAccent, lineHeight: 1 }}>0{i + 1}</span>
            <h3 style={{ fontFamily: "var(--font-heading, var(--font-display))", fontSize: "16px", fontWeight: 700, color: tokens.colorPrimary, textTransform: "uppercase", letterSpacing: "1px" }}>
              {fact[`title_${locale}`] || fact.title_de || fact.title_en || ""}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, lineHeight: 1.6 }}>
              {fact[`desc_${locale}`] || fact.desc_de || fact.desc_en || ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TRAINING OPTIONS ─────────────────────────────────────────────────────────

function PresetTrainingOptions({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const options: AnyObj[] = preset.content?.trainingOptions || [];
  if (!options.length) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: tokens.colorPrimary, textTransform: "uppercase", letterSpacing: "2px" }}>
            {locale === "de" ? "Mehr Wege, FIT zu werden" : locale === "ru" ? "Больше способов быть в форме" : "More ways to get FIT"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
          {options.map((opt: AnyObj, i: number) => (
            <div key={i} style={{ background: tokens.colorSurface, padding: "48px 36px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: tokens.colorAccent, textTransform: "uppercase" }}>
                {opt[`title_${locale}`] || opt.title_de || opt.title_en || ""}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, flex: 1 }}>
                {opt[`desc_${locale}`] || opt.desc_de || opt.desc_en || ""}
              </p>
              <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "10px 24px", borderRadius: `${tokens.borderRadius || 4}px`, fontSize: "12px", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", alignSelf: "flex-start" }}>
                {opt[`cta_${locale}`] || opt.cta_de || opt.cta_en || ""}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SIGNATURE SERIES ─────────────────────────────────────────────────────────

function PresetSignatureSeries({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const series: AnyObj[] = preset.content?.signatureSeries || [];
  if (!series.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "200+ Kurse für jedes Level" : locale === "ru" ? "200+ занятий для каждого уровня" : "200+ Classes For Every Level"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {series.map((s: AnyObj, i: number) => (
            <div key={i} style={{ background: tokens.colorBackground, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, padding: "36px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ display: "inline-block", background: `${tokens.colorAccent}22`, color: tokens.colorAccent, fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px", alignSelf: "flex-start" }}>
                {s[`name_${locale}`] || s.name_de || s.name_en || ""}
              </span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, flex: 1 }}>
                {s[`desc_${locale}`] || s.desc_de || s.desc_en || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING CARDS ────────────────────────────────────────────────────────────

function PresetPricing({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const plans: AnyObj[] = preset.content?.pricing || [];
  if (!plans.length) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Die Preise" : locale === "ru" ? "Цены" : "The Pricing"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {plans.map((plan: AnyObj, i: number) => {
            const label = plan[`label_${locale}`] || plan.label_de || plan.label_en || "";
            const desc = plan[`desc_${locale}`] || plan.desc_de || plan.desc_en || "";
            const cta = plan[`cta_${locale}`] || plan.cta_de || plan.cta_en || "";
            const period = plan[`period_${locale}`] || plan.period_de || plan.period_en || "";
            const bg = plan.popular ? tokens.colorAccent : tokens.colorSurface;
            const textCol = plan.popular ? (accentDark ? "#fff" : "#000") : tokens.colorPrimary;
            const subCol = plan.popular ? (accentDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)") : tokens.colorSecondary;
            return (
              <div key={i} style={{ background: bg, border: `2px solid ${plan.popular ? tokens.colorAccent : tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                {plan.popular && <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: tokens.colorPrimary, color: tokens.colorBackground, fontSize: "10px", fontWeight: 700, padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                  {locale === "de" ? "AM BELIEBTESTEN" : locale === "ru" ? "ПОПУЛЯРНЫЙ" : "MOST POPULAR"}
                </span>}
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: subCol }}>{label}</p>
                <div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "56px", fontWeight: 700, color: textCol, lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: subCol, marginLeft: "8px" }}>{period}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: subCol, lineHeight: 1.6, flex: 1 }}>{desc}</p>
                <a href="#contact" style={{ display: "block", background: plan.popular ? (accentDark ? "#fff" : "#000") : tokens.colorAccent, color: plan.popular ? tokens.colorAccent : (accentDark ? "#fff" : "#000"), padding: "14px 24px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "13px", fontWeight: 700, textDecoration: "none", textAlign: "center", fontFamily: "var(--font-body)" }}>{cta}</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── MEET FOUNDER ─────────────────────────────────────────────────────────────

function PresetMeetFounder({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const fo = preset.content?.founder || {};
  const badge = fo[`badge_${locale}`] || fo.badge_de || fo.badge_en || "";
  const title = fo[`title_${locale}`] || fo.title_de || fo.title_en || "";
  const desc = fo[`desc_${locale}`] || fo.desc_de || fo.desc_en || "";
  const stats: AnyObj[] = fo.stats || [];
  if (!title) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div>
          {badge && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>{badge}</p>}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.2, marginBottom: "24px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "40px" }}>{desc}</p>
          {stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              {stats.map((stat: AnyObj, i: number) => (
                <div key={i} style={{ padding: "20px", background: tokens.colorBackground, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: tokens.colorAccent, lineHeight: 1, marginBottom: "8px" }}>{stat.value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.colorSecondary }}>{stat[`label_${locale}`] || stat.label_de || stat.label_en || ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg, ${tokens.colorBorder}44 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.4 }}>👩‍⚕️</span>
        </div>
      </div>
    </section>
  );
}

// ─── MEDICAL SKINCARE ─────────────────────────────────────────────────────────

function PresetMedicalSkincare({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const ms = preset.content?.medicalSkincare || {};
  const badge = ms[`badge_${locale}`] || ms.badge_de || ms.badge_en || "";
  const title = ms[`title_${locale}`] || ms.title_de || ms.title_en || "";
  const desc = ms[`desc_${locale}`] || ms.desc_de || ms.desc_en || "";
  const benefits: AnyObj[] = ms.benefits || [];
  if (!title) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${tokens.colorBorder}44 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "64px", opacity: 0.4 }}>🧪</span>
        </div>
        <div>
          {badge && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>{badge}</p>}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.2, marginBottom: "24px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "32px" }}>{desc}</p>
          {benefits.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {benefits.map((b: AnyObj, i: number) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: tokens.colorAccent, fontSize: "16px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorPrimary }}>{b[locale] || b.de || b.en || ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── CONSULTATION CTA ─────────────────────────────────────────────────────────

function PresetConsultationCta({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const cta = preset.content?.consultationCta || {};
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  const title = cta[`title_${locale}`] || cta.title_de || cta.title_en || "";
  const desc = cta[`desc_${locale}`] || cta.desc_de || cta.desc_en || "";
  const ctaText = cta[`cta_${locale}`] || cta.cta_de || cta.cta_en || "";
  if (!title) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}`, textAlign: "center" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "16px" }}>{title}</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary, lineHeight: 1.7, marginBottom: "32px" }}>{desc}</p>
        <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "16px 40px", borderRadius: `${tokens.borderRadius || 8}px`, fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "1px" }}>{ctaText}</a>
      </div>
    </section>
  );
}

// ─── BRANCHES ─────────────────────────────────────────────────────────────────

function PresetBranches({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const branches: AnyObj[] = preset.content?.branches || [];
  if (!branches.length) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "12px" }}>
            {locale === "de" ? "Filialen" : locale === "ru" ? "Филиалы" : "Branches"}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary }}>
            {locale === "de" ? "Wir sind gleich um die Ecke." : locale === "ru" ? "Мы рядом с вами." : "We're right around the corner."}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {branches.map((branch: AnyObj, i: number) => (
            <div key={i} style={{ background: tokens.colorSurface, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, overflow: "hidden" }}>
              <div style={{ aspectRatio: "16/9", background: `linear-gradient(135deg, ${tokens.colorBorder}66 0%, ${tokens.colorAccent}22 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "48px", opacity: 0.4 }}>📍</span>
              </div>
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "8px" }}>{branch.name}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, marginBottom: "4px" }}>{branch.address}</p>
                {branch.hours_de && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorSecondary, marginBottom: "16px" }}>{branch.hours_de}</p>}
                <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "10px 24px", borderRadius: `${tokens.borderRadius || 4}px`, fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}>
                  {locale === "de" ? "Termin buchen" : locale === "ru" ? "Записаться" : "Book Now"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LOCATIONS (coffee shop) ──────────────────────────────────────────────────

function PresetLocations({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const locations: AnyObj[] = preset.content?.locations || [];
  if (!locations.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: "40px", height: "1px", background: tokens.colorAccent, margin: "0 auto 32px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "48px" }}>
          {locations.map((loc: AnyObj, i: number) => (
            <div key={i}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "8px" }}>{loc.name}</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, lineHeight: 1.6, marginBottom: "8px" }}>{loc.address}</p>
              {loc.hours_de && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: tokens.colorSecondary }}>{loc.hours_de}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LIFESTYLE COLLECTIONS ────────────────────────────────────────────────────

function PresetLifestyleCollections({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const collections: AnyObj[] = preset.content?.lifestyleCollections || [];
  if (!collections.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Immobilien für Ihren Lebensstil" : locale === "ru" ? "Недвижимость под ваш образ жизни" : "Homes to Match Your Lifestyle"}
          </h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          {collections.map((col: AnyObj, i: number) => (
            <a key={i} href="#contact" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "20px 24px", border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadius || 4}px`, textDecoration: "none", minWidth: "120px" }}>
              <span style={{ fontSize: "24px" }}>🏠</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: tokens.colorPrimary, textAlign: "center" }}>
                {col[`label_${locale}`] || col.label_de || col.label_en || ""}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY US (law firm) ────────────────────────────────────────────────────────

function PresetWhyUs({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const items: AnyObj[] = preset.content?.whyUs || [];
  if (!items.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Warum Mandanten uns wählen" : locale === "ru" ? "Почему клиенты выбирают нас" : "Why Clients Choose Us"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {items.map((item: AnyObj, i: number) => (
            <div key={i} style={{ padding: "36px 28px", border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "12px"}`, display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "32px", height: "2px", background: tokens.colorAccent }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: tokens.colorPrimary }}>
                {item[`title_${locale}`] || item.title_de || item.title_en || ""}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7 }}>
                {item[`desc_${locale}`] || item.desc_de || item.desc_en || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────

function PresetNewsletter({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const nl = preset.content?.newsletter || {};
  const isDark = isColorDark(tokens.colorBackground || "#fff");
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  const title = nl[`title_${locale}`] || nl.title_de || nl.title_en || "";
  const desc = nl[`desc_${locale}`] || nl.desc_de || nl.desc_en || "";
  if (!title) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}`, textAlign: "center" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "12px", letterSpacing: isDark ? "2px" : "0", textTransform: isDark ? "uppercase" : "none" }}>{title}</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, marginBottom: "32px" }}>{desc}</p>
        <div style={{ display: "flex", gap: "8px", maxWidth: "400px", margin: "0 auto" }}>
          <input type="email" placeholder={locale === "de" ? "Ihre E-Mail-Adresse" : locale === "ru" ? "Ваш email" : "Your email address"} style={{ flex: 1, padding: "12px 16px", background: tokens.colorBackground, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadius || 4}px`, fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorPrimary, outline: "none" }} />
          <button style={{ background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", border: "none", padding: "12px 20px", borderRadius: `${tokens.borderRadius || 4}px`, fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
            {locale === "de" ? "Anmelden" : locale === "ru" ? "Подписаться" : "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── PIZZA: DOUGH STORY ──────────────────────────────────────────────────────

function PresetDoughStory({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const d = preset.content?.doughStory || {};
  if (!d[`title_${locale}`] && !d.title_de) return null;
  const title = d[`title_${locale}`] || d.title_de || d.title_en || "";
  const subtitle = d[`subtitle_${locale}`] || d.subtitle_de || d.subtitle_en || "";
  const doughTitle = d[`doughTitle_${locale}`] || d.doughTitle_de || d.doughTitle_en || "";
  const doughText = d[`doughText_${locale}`] || d.doughText_de || d.doughText_en || "";
  const ovenText = d[`ovenText_${locale}`] || d.ovenText_de || d.ovenText_en || "";
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, color: tokens.colorPrimary, letterSpacing: "2px", marginBottom: "16px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", fontStyle: "italic", color: tokens.colorSecondary, maxWidth: "600px", margin: "0 auto" }}>{subtitle}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "24px" }}>{doughTitle}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: tokens.colorSecondary, lineHeight: 1.8, marginBottom: "24px" }}>{doughText}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, fontStyle: "italic", borderLeft: `3px solid ${tokens.colorAccent}`, paddingLeft: "16px" }}>{ovenText}</p>
          </div>
          <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${tokens.colorBorder}44 0%, ${tokens.colorAccent}22 100%)`, borderRadius: `${tokens.borderRadiusMedium || "2px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "80px", opacity: 0.4 }}>🍕</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PIZZA: SEASONAL SECTION ──────────────────────────────────────────────────

function PresetSeasonal({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const s = preset.content?.seasonal || {};
  if (!s[`title_${locale}`] && !s.title_de) return null;
  const title = s[`title_${locale}`] || s.title_de || s.title_en || "";
  const subtitle = s[`subtitle_${locale}`] || s.subtitle_de || s.subtitle_en || "";
  const cta = s[`cta_${locale}`] || s.cta_de || s.cta_en || "";
  const food: AnyObj[] = s.food || [];
  const drinks: AnyObj[] = s.drinks || [];
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary, letterSpacing: "2px", marginBottom: "12px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary }}>{subtitle}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "40px" }}>
          {food.length > 0 && (
            <div>
              <h4 style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>
                {locale === "de" ? "Speisen" : locale === "ru" ? "Еда" : "Food"}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {food.map((item: AnyObj, i: number) => (
                  <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorPrimary, padding: "6px 0", borderBottom: `1px solid ${tokens.colorBorder}`, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: tokens.colorAccent }}>•</span>
                    {item[`name_${locale}`] || item.name_de || item.name_en || ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {drinks.length > 0 && (
            <div>
              <h4 style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: tokens.colorAccent, marginBottom: "16px" }}>
                {locale === "de" ? "Getränke" : locale === "ru" ? "Напитки" : "Drinks"}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {drinks.map((item: AnyObj, i: number) => (
                  <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorPrimary, padding: "6px 0", borderBottom: `1px solid ${tokens.colorBorder}`, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: tokens.colorAccent }}>•</span>
                    {item[`name_${locale}`] || item.name_de || item.name_en || ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {cta && (
          <div style={{ textAlign: "center" }}>
            <a href="#contact" style={{ display: "inline-block", background: tokens.colorAccent, color: accentDark ? "#fff" : "#000", padding: "14px 36px", borderRadius: `${tokens.borderRadius || 0}px`, fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)", letterSpacing: "1px", textTransform: "uppercase" }}>{cta}</a>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── PIZZA: LIMONCELLO ────────────────────────────────────────────────────────

function PresetLimoncello({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const l = preset.content?.limoncello || {};
  if (!l[`title_${locale}`] && !l.title_de) return null;
  const title = l[`title_${locale}`] || l.title_de || l.title_en || "";
  const text = l[`text_${locale}`] || l.text_de || l.text_en || "";
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%)`, borderRadius: `${tokens.borderRadiusMedium || "2px"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "80px" }}>🍋</span>
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: tokens.colorPrimary, letterSpacing: "1px", marginBottom: "24px" }}>{title}</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: tokens.colorSecondary, lineHeight: 1.8 }}>{text}</p>
        </div>
      </div>
    </section>
  );
}

// ─── WEDDING: PRESS QUOTE ─────────────────────────────────────────────────────

function PresetPressQuote({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const pq = preset.content?.pressQuote || {};
  if (!pq[`text_${locale}`] && !pq.text_de) return null;
  const text = pq[`text_${locale}`] || pq.text_de || pq.text_en || "";
  const source = pq.source || "";
  return (
    <section style={{ background: tokens.colorSurface, padding: "80px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}`, textAlign: "center" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", color: tokens.colorPrimary, lineHeight: 1.5, marginBottom: "20px" }}>
          &ldquo;{text}&rdquo;
        </p>
        {source && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: tokens.colorSecondary }}>{source}</p>
        )}
      </div>
    </section>
  );
}

// ─── WEDDING: FEATURED WEDDINGS ───────────────────────────────────────────────

function PresetFeaturedWeddings({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const weddings: AnyObj[] = preset.content?.featuredWeddings || [];
  if (!weddings.length) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: tokens.colorPrimary, lineHeight: 1.1 }}>
            {locale === "de" ? "Unsere echten Hochzeiten" : locale === "ru" ? "Наши настоящие свадьбы" : "Our real weddings"}
          </h2>
          <a href="#contact" style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700, color: tokens.colorAccent, textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px", borderBottom: `1px solid ${tokens.colorAccent}`, paddingBottom: "2px", flexShrink: 0 }}>
            {locale === "de" ? "Alle ansehen" : locale === "ru" ? "Смотреть все" : "See all weddings"}
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "8px" }}>
          {weddings.map((w: AnyObj, i: number) => {
            const title = w[`title_${locale}`] || w.title_de || w.title_en || "";
            return (
              <div key={i} style={{ position: "relative", aspectRatio: "2/3", background: `linear-gradient(135deg, ${tokens.colorBorder}66 0%, ${tokens.colorPrimary}22 100%)`, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${tokens.colorPrimary}cc 0%, transparent 50%)` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 400, color: "#fff", lineHeight: 1.3, marginBottom: "4px" }}>{title}</p>
                  {w.location && <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px", textTransform: "uppercase" }}>{w.location}</p>}
                  <a href="#contact" style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", fontWeight: 700, color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px", borderBottom: "1px solid rgba(255,255,255,0.5)", paddingBottom: "1px" }}>
                    {locale === "de" ? "Mehr ansehen" : locale === "ru" ? "Подробнее" : "Explore more"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SAAS: PROBLEM/SOLUTION ───────────────────────────────────────────────────

function PresetProblemSolution({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const items: AnyObj[] = preset.content?.problemSolution || [];
  if (!items.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary, marginBottom: "12px" }}>
            {locale === "de" ? "Von Chaos zu Klarheit" : locale === "ru" ? "От хаоса к ясности" : "From Chaos to Clarity"}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: tokens.colorSecondary }}>
            {locale === "de" ? "Beheben Sie das Wichtigste schnell" : locale === "ru" ? "Исправьте важное быстро" : "Fix What Matters Fast"}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {items.map((item: AnyObj, i: number) => {
            const problem = item[`problem_${locale}`] || item.problem_de || item.problem_en || "";
            const solution = item[`solution_${locale}`] || item.solution_de || item.solution_en || "";
            return (
              <div key={i} style={{ padding: "32px 28px", border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "8px"}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: tokens.colorAccent, fontSize: "20px" }}>✗</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, color: tokens.colorSecondary, margin: 0 }}>{problem}</h3>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: tokens.colorAccent, fontSize: "20px", flexShrink: 0 }}>✓</span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorPrimary, lineHeight: 1.6, margin: 0 }}>{solution}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SAAS: OUTCOMES ───────────────────────────────────────────────────────────

function PresetOutcomes({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const outcomes: AnyObj[] = preset.content?.outcomes || [];
  if (!outcomes.length) return null;
  const accentDark = isColorDark(tokens.colorAccent || "#000");
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Ergebnisse" : locale === "ru" ? "Результаты" : "Outcomes"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {outcomes.map((o: AnyObj, i: number) => {
            const title = o[`title_${locale}`] || o.title_de || o.title_en || "";
            const desc = o[`desc_${locale}`] || o.desc_de || o.desc_en || "";
            return (
              <div key={i} style={{ background: tokens.colorSurface, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "8px"}`, padding: "32px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontSize: "32px" }}>{o.icon || "✅"}</span>
                <h3 style={{ fontFamily: "var(--font-heading, var(--font-display))", fontSize: "20px", fontWeight: 700, color: tokens.colorPrimary, margin: 0 }}>{title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: tokens.colorSecondary, lineHeight: 1.7, margin: 0, flex: 1 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SAAS: TEAM PERSONAS ──────────────────────────────────────────────────────

function PresetTeamPersonas({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const personas: AnyObj[] = preset.content?.teamPersonas || [];
  if (!personas.length) return null;
  return (
    <section style={{ background: tokens.colorSurface, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Gebaut für Ihr Team" : locale === "ru" ? "Создано для вашей команды" : "Built for your Team"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {personas.map((p: AnyObj, i: number) => {
            const role = p[`role_${locale}`] || p.role_de || p.role_en || "";
            const desc = p[`desc_${locale}`] || p.desc_de || p.desc_en || "";
            return (
              <div key={i} style={{ padding: "28px 24px", border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "8px"}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{p.icon || "👤"}</span>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, color: tokens.colorPrimary, margin: 0 }}>{role}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SAAS: CAPABILITIES ───────────────────────────────────────────────────────

function PresetCapabilities({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const caps: AnyObj[] = preset.content?.capabilities || [];
  if (!caps.length) return null;
  return (
    <section style={{ background: tokens.colorBackground, padding: "100px clamp(16px, 5vw, 80px)", borderTop: `1px solid ${tokens.colorBorder}` }}>
      <div style={{ maxWidth: tokens.maxWidthContent || "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ width: "40px", height: "2px", background: tokens.colorAccent, margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: tokens.colorPrimary }}>
            {locale === "de" ? "Kernfunktionen" : locale === "ru" ? "Основные возможности" : "Core Capabilities"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {caps.map((c: AnyObj, i: number) => {
            const title = c[`title_${locale}`] || c.title_de || c.title_en || "";
            const desc = c[`desc_${locale}`] || c.desc_de || c.desc_en || "";
            return (
              <div key={i} style={{ padding: "28px 24px", background: tokens.colorSurface, border: `1px solid ${tokens.colorBorder}`, borderRadius: `${tokens.borderRadiusMedium || "8px"}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{c.icon || "⚡"}</span>
                <h3 style={{ fontFamily: "var(--font-heading, var(--font-display))", fontSize: "17px", fontWeight: 700, color: tokens.colorPrimary, margin: 0 }}>{title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tokens.colorSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── DISHOOM MENU TABS ────────────────────────────────────────────────────────

function PresetMenuTabs({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const tabs: AnyObj[] = preset.content?.menuTabs || [];
  if (!tabs.length) return null;
  return (
    <div style={{
      borderTop: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
      background: tokens.colorBackground,
      overflowX: "auto",
    }}>
      <div style={{
        display: "flex",
        maxWidth: tokens.maxWidthContent || "820px",
        margin: "0 auto",
        padding: `0 ${tokens.horizontalPaddingDesktop || "40px"}`,
        whiteSpace: "nowrap",
      }}>
        {tabs.map((tab: AnyObj, i: number) => {
          const label = tab[`label_${locale}`] || tab.label_de || tab.label_en || "";
          const isActive = tab.active;
          return (
            <a key={i} href={`#menu-${tab.id}`} style={{
              display: "inline-block",
              padding: "14px 18px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: isActive ? tokens.colorPrimary : tokens.colorSecondary,
              textDecoration: "none",
              borderBottom: isActive ? `2px solid ${tokens.colorAccent}` : "2px solid transparent",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}>
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── DISHOOM INTRO QUOTE ──────────────────────────────────────────────────────

function PresetIntroQuote({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const quote = preset.content?.introQuote;
  if (!quote) return null;
  const text = typeof quote === "string" ? quote : (quote[locale] || quote.de || quote.en || "");
  if (!text) return null;
  return (
    <div style={{
      maxWidth: tokens.maxWidthText || "560px",
      margin: "36px auto 28px",
      padding: `0 ${tokens.horizontalPaddingDesktop || "40px"}`,
      fontFamily: "var(--font-body)",
      fontSize: "16px",
      fontStyle: "italic",
      color: tokens.colorSecondary,
      lineHeight: 1.7,
      textAlign: "center",
    }}>
      {text}
    </div>
  );
}

// ─── DISHOOM SOURCING BLOCK ───────────────────────────────────────────────────

function PresetSourcingBlock({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const sourcing = preset.content?.sourcing;
  if (!sourcing) return null;
  const text = typeof sourcing === "string" ? sourcing : (sourcing[locale] || sourcing.de || sourcing.en || "");
  if (!text) return null;
  return (
    <div style={{
      background: tokens.colorSourcingBg || "#E8E0CC",
      borderLeft: `3px solid ${tokens.colorAccent}`,
      padding: "16px 20px",
      margin: `0 ${tokens.horizontalPaddingDesktop || "40px"} 32px`,
      fontFamily: "var(--font-body)",
      fontSize: "13.5px",
      color: tokens.colorSecondary,
      fontStyle: "italic",
      lineHeight: 1.7,
    }}>
      {text}
    </div>
  );
}

// ─── DISHOOM DIETARY LEGEND ───────────────────────────────────────────────────

function PresetDietaryLegend({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const legend = preset.content?.dietaryLegend;
  if (!legend) return null;
  const text = typeof legend === "string" ? legend : (legend[locale] || legend.de || legend.en || "");
  if (!text) return null;
  return (
    <div style={{
      borderTop: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
      padding: "12px 40px",
      textAlign: "center",
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: tokens.colorSecondary,
      letterSpacing: "0.5px",
      margin: "0 0 8px",
    }}>
      {text}
    </div>
  );
}

// ─── DISHOOM MENU LIST ────────────────────────────────────────────────────────

function PresetDishoomMenu({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const menu: AnyObj[] = preset.content?.menu || [];
  if (!menu.length) return null;
  const pad = tokens.horizontalPaddingDesktop || "40px";
  const maxW = tokens.maxWidthContent || "820px";
  return (
    <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${pad}` }}>
      {menu.map((section: AnyObj, si: number) => {
        const catName = section[`category_${locale}`] || section.category_de || section.category_en || "";
        const items: AnyObj[] = section.items || [];
        return (
          <div key={si} id={`menu-section-${si}`}>
            {/* Ornament divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              margin: "36px 0 0",
            }}>
              <div style={{ flex: 1, height: "1px", background: tokens.colorBorder }} />
              <span style={{ color: tokens.colorAccent, fontSize: "18px", margin: "0 12px" }}>✦</span>
              <div style={{ flex: 1, height: "1px", background: tokens.colorBorder }} />
            </div>
            {/* Section title */}
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 400,
              color: tokens.colorPrimary,
              textAlign: "center",
              padding: "24px 0 8px",
              letterSpacing: "0.5px",
              margin: 0,
            }}>
              {catName}
            </h3>
            {/* Items */}
            {items.map((item: AnyObj, ii: number) => {
              const name = item[`name_${locale}`] || item.name_de || item.name_en || "";
              const desc = item[`desc_${locale}`] || item.desc_de || item.desc_en || "";
              const tags: string[] = item.tags || [];
              const isLast = ii === items.length - 1;
              return (
                <div key={ii} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "24px",
                  padding: "18px 0",
                  borderBottom: isLast ? "none" : `1px dashed ${tokens.colorDashedBorder || "#D4C4A0"}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "17px",
                      fontWeight: 400,
                      color: tokens.colorPrimary,
                      marginBottom: "5px",
                    }}>
                      {name}
                    </div>
                    {desc && (
                      <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontStyle: "italic",
                        color: tokens.colorSecondary,
                        lineHeight: 1.6,
                        marginBottom: tags.length ? "3px" : 0,
                      }}>
                        {desc}
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: tokens.colorAccent,
                        marginTop: "3px",
                      }}>
                        {tags.map((t: string) => `(${t})`).join(" ")}
                      </div>
                    )}
                  </div>
                  {item.price && (
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "17px",
                      fontWeight: 400,
                      color: tokens.colorPrimary,
                      flexShrink: 0,
                      paddingTop: "1px",
                    }}>
                      {item.price}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── DISHOOM SERVICE CHARGE NOTE ─────────────────────────────────────────────

function PresetServiceChargeNote({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const note = preset.content?.serviceChargeNote;
  if (!note) return null;
  const text = typeof note === "string" ? note : (note[locale] || note.de || note.en || "");
  if (!text) return null;
  return (
    <div style={{
      maxWidth: tokens.maxWidthContent || "820px",
      margin: "0 auto",
      padding: `18px ${tokens.horizontalPaddingDesktop || "60px"}`,
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      fontStyle: "italic",
      color: tokens.colorSecondary,
      textAlign: "center",
      lineHeight: 1.7,
    }}>
      {text}
    </div>
  );
}

// ─── DISHOOM BRAND SIGNATURE ──────────────────────────────────────────────────

function PresetBrandSignature({ preset, locale }: PresetRendererProps) {
  const tokens = preset.design?.tokens || {};
  const sig = preset.content?.brandSignature;
  if (!sig) return null;
  const text = sig[`text_${locale}`] || sig.text_de || sig.text_en || "";
  if (!text) return null;
  return (
    <div style={{
      textAlign: "center",
      padding: "40px 0",
      borderTop: `1px solid ${tokens.colorBorder}`,
    }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "22px",
        fontStyle: "italic",
        color: tokens.colorRed || "#8B1A1A",
        letterSpacing: "0.5px",
      }}>
        ✦ {text} ✦
      </span>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function PresetRenderer({ preset, locale }: PresetRendererProps) {
  const layout = preset.layout || {};
  const isDishoom = layout.style === "dishoom_irani_cafe";

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)", background: "var(--color-background)", minHeight: "100vh" }}>
      {layout.announcementBar && preset.content?.announcementBar && <PresetAnnouncementBar preset={preset} locale={locale} />}
      <PresetNav preset={preset} locale={locale} />
      <PresetHero preset={preset} locale={locale} />

      {/* Pizza-specific sections */}
      {layout.doughStorySection && preset.content?.doughStory && <PresetDoughStory preset={preset} locale={locale} />}
      {layout.seasonalSection && preset.content?.seasonal && <PresetSeasonal preset={preset} locale={locale} />}

      {/* Dishoom-specific: menu tabs under hero */}
      {isDishoom && layout.menuTabsBar && preset.content?.menuTabs && <PresetMenuTabs preset={preset} locale={locale} />}
      {isDishoom && preset.content?.introQuote && <PresetIntroQuote preset={preset} locale={locale} />}
      {isDishoom && layout.sourcingBlock && preset.content?.sourcing && <PresetSourcingBlock preset={preset} locale={locale} />}
      {isDishoom && layout.dietaryLegend && preset.content?.dietaryLegend && <PresetDietaryLegend preset={preset} locale={locale} />}
      {isDishoom && preset.content?.menu && <PresetDishoomMenu preset={preset} locale={locale} />}
      {isDishoom && layout.serviceChargeNote && preset.content?.serviceChargeNote && <PresetServiceChargeNote preset={preset} locale={locale} />}
      {isDishoom && layout.brandSignature && preset.content?.brandSignature && <PresetBrandSignature preset={preset} locale={locale} />}

      {/* Pizza limoncello after menu */}
      {layout.limoncelloSection && preset.content?.limoncello && <PresetLimoncello preset={preset} locale={locale} />}

      {/* Wedding-specific sections */}
      {layout.pressQuoteSection && preset.content?.pressQuote && <PresetPressQuote preset={preset} locale={locale} />}

      {/* Standard sections for non-Dishoom presets */}
      {!isDishoom && layout.quickLinksSection && preset.content?.quickLinks && <PresetQuickLinks preset={preset} locale={locale} />}
      {!isDishoom && layout.credentialsBar && preset.content?.credentials && <PresetCredentials preset={preset} locale={locale} />}
      {!isDishoom && layout.serviceCategoriesGrid && preset.content?.serviceCategories && <PresetServiceCategories preset={preset} locale={locale} />}
      {!isDishoom && layout.bodyMapSection && preset.content?.bodyMap && <PresetBodyMap preset={preset} locale={locale} />}
      {!isDishoom && layout.featuredTreatmentSpotlight && preset.content?.featuredTreatment && <PresetFeaturedTreatment preset={preset} locale={locale} />}
      {!isDishoom && layout.featuredNewTreatment && preset.content?.featuredNewTreatment && <PresetFeaturedTreatment preset={preset} locale={locale} isSpa />}
      {!isDishoom && layout.hairRestorationSection && preset.content?.hairRestoration && <PresetHairRestoration preset={preset} locale={locale} />}
      {!isDishoom && layout.coreSpecialtiesGrid && preset.content?.coreSpecialties && <PresetCoreSpecialties preset={preset} locale={locale} />}
      {!isDishoom && layout.whyChooseUs && preset.content?.whyChooseUs && <PresetWhyChooseUs preset={preset} locale={locale} />}

      {!isDishoom && <PresetAbout preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.vision && <PresetVision preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.coreValues && <PresetCoreValues preset={preset} locale={locale} />}
      {!isDishoom && layout.meetTherapist && preset.content?.therapist && <PresetMeetTherapist preset={preset} locale={locale} />}
      {!isDishoom && layout.meetFounderSection && preset.content?.founder && <PresetMeetFounder preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.hairstyleGuide && <PresetHairstyleGuide preset={preset} locale={locale} />}
      {!isDishoom && <PresetServices preset={preset} locale={locale} />}
      {!isDishoom && layout.productsSection && preset.content?.products && <PresetProducts preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.hiitFacts && <PresetHiitFacts preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.trainingOptions && <PresetTrainingOptions preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.signatureSeries && <PresetSignatureSeries preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.pricing && <PresetPricing preset={preset} locale={locale} />}
      {!isDishoom && layout.medicalSkincareSection && preset.content?.medicalSkincare && <PresetMedicalSkincare preset={preset} locale={locale} />}
      {!isDishoom && layout.consultationCta && preset.content?.consultationCta && <PresetConsultationCta preset={preset} locale={locale} />}
      {!isDishoom && layout.branchesSection && preset.content?.branches && <PresetBranches preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.locations && !layout.branchesSection && <PresetLocations preset={preset} locale={locale} />}
      {!isDishoom && layout.lifestyleCollections && preset.content?.lifestyleCollections && <PresetLifestyleCollections preset={preset} locale={locale} />}
      {!isDishoom && preset.content?.whyUs && <PresetWhyUs preset={preset} locale={locale} />}

      {/* SaaS-specific sections */}
      {preset.content?.problemSolution && <PresetProblemSolution preset={preset} locale={locale} />}
      {preset.content?.outcomes && <PresetOutcomes preset={preset} locale={locale} />}
      {preset.content?.teamPersonas && <PresetTeamPersonas preset={preset} locale={locale} />}
      {preset.content?.capabilities && <PresetCapabilities preset={preset} locale={locale} />}

      {/* Wedding featured weddings */}
      {layout.realWeddingsSection && preset.content?.featuredWeddings && <PresetFeaturedWeddings preset={preset} locale={locale} />}

      {/* Shared sections */}
      {isDishoom && <PresetAbout preset={preset} locale={locale} />}
      <PresetTestimonials preset={preset} locale={locale} />
      <PresetFAQ preset={preset} locale={locale} />
      {layout.newsletterSection && preset.content?.newsletter && <PresetNewsletter preset={preset} locale={locale} />}
      <PresetContact preset={preset} locale={locale} />
      <PresetFooter preset={preset} locale={locale} />
    </div>
  );
}
