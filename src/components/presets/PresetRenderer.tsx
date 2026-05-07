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
  const isDark = isColorDark(tokens.colorBackground || "#fff");
  const navStyle = preset.layout?.navStyle || "transparent_dark";
  const isTransparent = navStyle.includes("transparent");

  const navBg = isTransparent
    ? isDark
      ? "rgba(0,0,0,0.75)"
      : "rgba(255,255,255,0.88)"
    : tokens.colorSurface || "#fff";

  const logo = preset.logo || {};
  const links: string[] = preset.navigation?.links || ["Über uns", "Leistungen", "Kontakt"];
  const accentDark = isColorDark(tokens.colorAccent || "#000");

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: navBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${tokens.colorBorder || "#e5e5e5"}`,
        padding: "0 clamp(16px, 5vw, 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: tokens.colorAccent || tokens.colorPrimary,
            letterSpacing: "-0.3px",
          }}
        >
          {logo.text || preset.meta?.title?.split("|")[0]?.trim() || "Logo"}
        </span>
        {logo.tagline && (
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: tokens.colorSecondary,
            }}
          >
            {logo.tagline}
          </span>
        )}
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {links.slice(0, -1).map((link: string, i: number) => (
          <a
            key={i}
            href={`#section-${i}`}
            style={{
              fontSize: "14px",
              color: tokens.colorSecondary || tokens.colorPrimary,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              transition: "color 0.2s",
            }}
          >
            {link}
          </a>
        ))}
        <a
          href="#contact"
          style={{
            background: tokens.colorAccent,
            color: accentDark ? "#fff" : "#000",
            padding: "8px 20px",
            borderRadius: `${tokens.borderRadius || 8}px`,
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {links[links.length - 1] || "Kontakt"}
        </a>
      </div>

      {/* Mobile burger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          color: tokens.colorPrimary,
        }}
        aria-label="Menu"
        className="preset-burger"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: tokens.colorSurface || "#fff",
            borderBottom: `1px solid ${tokens.colorBorder}`,
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {links.map((link: string, i: number) => (
            <a
              key={i}
              href={`#section-${i}`}
              onClick={() => setOpen(false)}
              style={{
                fontSize: "16px",
                color: tokens.colorPrimary,
                textDecoration: "none",
              }}
            >
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

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function PresetRenderer({ preset, locale }: PresetRendererProps) {
  const layout = preset.layout || {};
  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)", background: "var(--color-background)", minHeight: "100vh" }}>
      {layout.announcementBar && preset.content?.announcementBar && <PresetAnnouncementBar preset={preset} locale={locale} />}
      <PresetNav preset={preset} locale={locale} />
      <PresetHero preset={preset} locale={locale} />
      {layout.quickLinksSection && preset.content?.quickLinks && <PresetQuickLinks preset={preset} locale={locale} />}
      {layout.credentialsBar && preset.content?.credentials && <PresetCredentials preset={preset} locale={locale} />}
      {layout.serviceCategoriesGrid && preset.content?.serviceCategories && <PresetServiceCategories preset={preset} locale={locale} />}
      {layout.bodyMapSection && preset.content?.bodyMap && <PresetBodyMap preset={preset} locale={locale} />}
      {layout.featuredTreatmentSpotlight && preset.content?.featuredTreatment && <PresetFeaturedTreatment preset={preset} locale={locale} />}
      {layout.featuredNewTreatment && preset.content?.featuredNewTreatment && <PresetFeaturedTreatment preset={preset} locale={locale} isSpa />}
      {layout.hairRestorationSection && preset.content?.hairRestoration && <PresetHairRestoration preset={preset} locale={locale} />}
      {layout.coreSpecialtiesGrid && preset.content?.coreSpecialties && <PresetCoreSpecialties preset={preset} locale={locale} />}
      {layout.whyChooseUs && preset.content?.whyChooseUs && <PresetWhyChooseUs preset={preset} locale={locale} />}
      <PresetAbout preset={preset} locale={locale} />
      {preset.content?.vision && <PresetVision preset={preset} locale={locale} />}
      {preset.content?.coreValues && <PresetCoreValues preset={preset} locale={locale} />}
      {layout.meetTherapist && preset.content?.therapist && <PresetMeetTherapist preset={preset} locale={locale} />}
      {layout.meetFounderSection && preset.content?.founder && <PresetMeetFounder preset={preset} locale={locale} />}
      {preset.content?.hairstyleGuide && <PresetHairstyleGuide preset={preset} locale={locale} />}
      <PresetServices preset={preset} locale={locale} />
      {layout.productsSection && preset.content?.products && <PresetProducts preset={preset} locale={locale} />}
      {preset.content?.hiitFacts && <PresetHiitFacts preset={preset} locale={locale} />}
      {preset.content?.trainingOptions && <PresetTrainingOptions preset={preset} locale={locale} />}
      {preset.content?.signatureSeries && <PresetSignatureSeries preset={preset} locale={locale} />}
      {preset.content?.pricing && <PresetPricing preset={preset} locale={locale} />}
      {layout.medicalSkincareSection && preset.content?.medicalSkincare && <PresetMedicalSkincare preset={preset} locale={locale} />}
      {layout.consultationCta && preset.content?.consultationCta && <PresetConsultationCta preset={preset} locale={locale} />}
      {layout.branchesSection && preset.content?.branches && <PresetBranches preset={preset} locale={locale} />}
      {preset.content?.locations && !layout.branchesSection && <PresetLocations preset={preset} locale={locale} />}
      {layout.lifestyleCollections && preset.content?.lifestyleCollections && <PresetLifestyleCollections preset={preset} locale={locale} />}
      {preset.content?.whyUs && <PresetWhyUs preset={preset} locale={locale} />}
      <PresetTestimonials preset={preset} locale={locale} />
      <PresetFAQ preset={preset} locale={locale} />
      {layout.newsletterSection && preset.content?.newsletter && <PresetNewsletter preset={preset} locale={locale} />}
      <PresetContact preset={preset} locale={locale} />
      <PresetFooter preset={preset} locale={locale} />
    </div>
  );
}
