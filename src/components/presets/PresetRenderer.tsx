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

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function PresetRenderer({ preset, locale }: PresetRendererProps) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-primary)",
        background: "var(--color-background)",
        minHeight: "100vh",
      }}
    >
      <PresetNav preset={preset} locale={locale} />
      <PresetHero preset={preset} locale={locale} />
      <PresetAbout preset={preset} locale={locale} />
      <PresetServices preset={preset} locale={locale} />
      <PresetTestimonials preset={preset} locale={locale} />
      <PresetFAQ preset={preset} locale={locale} />
      <PresetContact preset={preset} locale={locale} />
      <PresetFooter preset={preset} locale={locale} />
    </div>
  );
}
