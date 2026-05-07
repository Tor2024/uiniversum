"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteData {
  meta: Record<string, unknown>;
  design: {
    preset: string;
    tokens: Record<string, string>;
    customCss?: string;
  };
  seo?: Record<string, unknown>;
  logo?: Record<string, string>;
  [key: string]: unknown;
}

interface DesignClientProps {
  initialData: SiteData;
}

// ─── Google Fonts grouped ─────────────────────────────────────────────────────

const FONT_GROUPS = [
  {
    label: "Serif — элегантные",
    fonts: ["Playfair Display", "Cormorant Garamond", "EB Garamond", "Libre Baskerville", "Lora", "Merriweather", "Crimson Text", "Spectral", "Bitter", "Zilla Slab", "Cardo", "Vollkorn"],
  },
  {
    label: "Sans-Serif — чистые",
    fonts: ["Inter", "DM Sans", "Raleway", "Nunito", "Lato", "Open Sans", "Source Sans Pro", "Roboto", "Noto Sans", "Mulish", "Outfit", "Plus Jakarta Sans", "Figtree", "Manrope"],
  },
  {
    label: "Display — выразительные",
    fonts: ["Oswald", "Montserrat", "Space Grotesk", "Syne", "Bebas Neue", "Archivo Black", "Poppins", "Barlow", "Exo 2", "Josefin Sans", "Kanit", "Righteous", "Teko"],
  },
  {
    label: "Handwriting — рукописные",
    fonts: ["Dancing Script", "Pacifico", "Great Vibes", "Caveat", "Sacramento", "Satisfy", "Kaushan Script", "Lobster"],
  },
  {
    label: "Mono — технические",
    fonts: ["JetBrains Mono", "Fira Code", "Source Code Pro", "Space Mono", "Roboto Mono"],
  },
];

const ALL_FONTS = FONT_GROUPS.flatMap((g) => g.fonts);

// ─── Color fields ─────────────────────────────────────────────────────────────

const COLOR_FIELDS = [
  { key: "colorBackground", label: "Фон страницы", desc: "Основной цвет фона" },
  { key: "colorSurface", label: "Поверхность", desc: "Карточки, панели" },
  { key: "colorPrimary", label: "Основной текст", desc: "Заголовки и текст" },
  { key: "colorSecondary", label: "Второстепенный", desc: "Подписи, описания" },
  { key: "colorBorder", label: "Граница", desc: "Разделители и рамки" },
  { key: "colorAccent", label: "Акцент (CTA)", desc: "Кнопки, ссылки" },
  { key: "colorAccentHover", label: "Акцент hover", desc: "Кнопки при наведении" },
];

// ─── Spacing / style fields ───────────────────────────────────────────────────

const STYLE_FIELDS = [
  { key: "borderRadius", label: "Скругление углов (px)", type: "range", min: 0, max: 32, step: 1 },
  { key: "spacingSection", label: "Отступ между секциями", type: "text" },
  { key: "maxWidthContent", label: "Макс. ширина контента", type: "text" },
  { key: "transitionDuration", label: "Скорость анимации", type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "6px",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "20px",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DesignClient({ initialData }: DesignClientProps) {
  const [tokens, setTokens] = useState<Record<string, string>>(
    { ...initialData.design.tokens }
  );
  const [customCss, setCustomCss] = useState(initialData.design.customCss || "");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewFont, setPreviewFont] = useState<string | null>(null);

  const updateToken = useCallback((key: string, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const updated = {
        ...initialData,
        design: {
          ...initialData.design,
          tokens,
          customCss,
        },
      };
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "data/site.json",
          content: JSON.stringify(updated, null, 2),
          message: "design: update tokens via admin",
        }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [tokens, customCss, initialData]);

  // Live preview CSS vars
  const previewStyle = Object.entries(tokens)
    .filter(([k]) => k.startsWith("color"))
    .map(([k, v]) => `--preview-${k}: ${v};`)
    .join(" ");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>🎨 Дизайн сайта</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            Редактируйте цвета, шрифты и стили. Нажмите «Сохранить» для применения.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saveStatus === "saved" && <span style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>✓ Сохранено</span>}
          {saveStatus === "error" && <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>✗ Ошибка</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              background: saving ? "#86efac" : "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "⏳ Сохраняю..." : "💾 Сохранить"}
          </button>
        </div>
      </div>

      {/* Live preview bar */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        padding: "16px 20px",
        marginBottom: "20px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Предпросмотр:
        </span>
        {COLOR_FIELDS.map((f) => (
          <div key={f.key} title={f.label} style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: tokens[f.key] || "#ccc",
            border: "2px solid rgba(0,0,0,0.1)",
            flexShrink: 0,
          }} />
        ))}
        <div style={{
          marginLeft: "8px",
          padding: "8px 16px",
          background: tokens.colorAccent || "#333",
          color: "#fff",
          borderRadius: `${tokens.borderRadius || 8}px`,
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: `'${tokens.fontBody}', sans-serif`,
        }}>
          Кнопка CTA
        </div>
        <div style={{
          padding: "8px 16px",
          background: tokens.colorBackground || "#fff",
          color: tokens.colorPrimary || "#111",
          border: `1px solid ${tokens.colorBorder || "#e5e5e5"}`,
          borderRadius: `${tokens.borderRadius || 8}px`,
          fontSize: "13px",
          fontFamily: `'${tokens.fontBody}', sans-serif`,
        }}>
          Текст
        </div>
        <div style={{
          fontFamily: `'${tokens.fontDisplay}', serif`,
          fontSize: "18px",
          fontWeight: 700,
          color: tokens.colorPrimary || "#111",
        }}>
          {tokens.fontDisplay} — Заголовок
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>

        {/* ── COLORS ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>🎨 Цвета</h2>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 16px", lineHeight: 1.5 }}>
            💡 Нажмите на цветной квадрат чтобы открыть палитру. Или введите HEX-код вручную (например #FF5500). Используйте «Быстрые палитры» для мгновенного применения готовой цветовой схемы.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {COLOR_FIELDS.map((f) => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Color picker */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <input
                    type="color"
                    value={tokens[f.key] || "#000000"}
                    onChange={(e) => updateToken(f.key, e.target.value)}
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      padding: "2px",
                      background: "transparent",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#111", margin: "0 0 1px" }}>{f.label}</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{f.desc}</p>
                </div>
                {/* Hex input */}
                <input
                  type="text"
                  value={tokens[f.key] || ""}
                  onChange={(e) => updateToken(f.key, e.target.value)}
                  style={{
                    width: "90px",
                    padding: "6px 8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#374151",
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Quick palettes */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
            <p style={{ ...labelStyle, marginBottom: "10px" }}>Быстрые палитры</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { name: "Тёплый минимализм", bg: "#F8F7F4", accent: "#C9A96E", primary: "#1A1A1A" },
                { name: "Тёмный элегантный", bg: "#0D0D0D", accent: "#B8860B", primary: "#F5F0E8" },
                { name: "Кремовый Dishoom", bg: "#F0ECE0", accent: "#C8973A", primary: "#2C2018" },
                { name: "Чистый синий", bg: "#FFFFFF", accent: "#003087", primary: "#0A1628" },
                { name: "Розовый салон", bg: "#FDFCFB", accent: "#D4A0A0", primary: "#2D1B1B" },
                { name: "Тёмный фитнес", bg: "#0A0A0A", accent: "#FF4500", primary: "#FFFFFF" },
              ].map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => {
                    updateToken("colorBackground", palette.bg);
                    updateToken("colorAccent", palette.accent);
                    updateToken("colorPrimary", palette.primary);
                  }}
                  title={palette.name}
                  style={{
                    display: "flex",
                    gap: "3px",
                    padding: "4px 8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: "#fff",
                    cursor: "pointer",
                    alignItems: "center",
                    fontSize: "11px",
                    color: "#374151",
                  }}
                >
                  {[palette.bg, palette.accent, palette.primary].map((c, i) => (
                    <span key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.1)", display: "inline-block" }} />
                  ))}
                  <span style={{ marginLeft: "4px" }}>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── FONTS ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>🔤 Шрифты</h2>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 16px", lineHeight: 1.5 }}>
            💡 Display — крупные заголовки (Hero). Heading — заголовки секций. Body — основной текст. Выберите из 50+ Google Fonts или введите своё название.
          </p>
          {[
            { key: "fontDisplay", label: "Display — крупные заголовки", size: "28px", weight: 700 },
            { key: "fontHeading", label: "Heading — заголовки секций", size: "20px", weight: 600 },
            { key: "fontBody", label: "Body — основной текст", size: "15px", weight: 400 },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>{f.label}</label>
              {/* Preview */}
              <div style={{
                padding: "10px 12px",
                background: "#f9fafb",
                borderRadius: "8px",
                marginBottom: "8px",
                fontFamily: `'${tokens[f.key]}', serif`,
                fontSize: f.size,
                fontWeight: f.weight,
                color: "#111",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {tokens[f.key]} — Пример текста
              </div>
              {/* Font selector */}
              <select
                value={tokens[f.key] || ""}
                onChange={(e) => updateToken(f.key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#374151",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {FONT_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          ))}

          {/* Font size */}
          <div style={{ paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
            <label style={labelStyle}>Размер основного текста</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="range"
                min={14}
                max={20}
                step={1}
                value={parseInt(tokens.fontSizeBody || "17")}
                onChange={(e) => updateToken("fontSizeBody", `${e.target.value}px`)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", width: "40px", textAlign: "right" }}>
                {tokens.fontSizeBody || "17px"}
              </span>
            </div>
          </div>

          {/* Custom font URL */}
          <div style={{ paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
            <label style={labelStyle}>Свой шрифт (Google Fonts URL)</label>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>
              💡 Зайдите на <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>fonts.google.com</a>, выберите шрифт, скопируйте название и вставьте ниже
            </p>
            <input
              type="text"
              placeholder="Например: Nunito Sans"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", color: "#374151", boxSizing: "border-box" }}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) {
                  updateToken("fontDisplay", val);
                  updateToken("fontHeading", val);
                  updateToken("fontBody", val);
                }
              }}
            />
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>Введите название шрифта — он применится ко всему сайту</p>
          </div>
        </div>

        {/* ── STYLE PARAMS ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>
            ⚙️ Параметры стиля
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Border radius */}
            <div>
              <label style={labelStyle}>Скругление углов</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={32}
                  step={1}
                  value={parseInt(tokens.borderRadius || "8")}
                  onChange={(e) => {
                    const v = e.target.value;
                    updateToken("borderRadius", v);
                    updateToken("borderRadiusSmall", `${Math.max(0, parseInt(v) - 2)}px`);
                    updateToken("borderRadiusMedium", `${parseInt(v)}px`);
                    updateToken("borderRadiusLarge", `${parseInt(v) * 2}px`);
                  }}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", width: "40px", textAlign: "right" }}>
                  {tokens.borderRadius || "8"}px
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {[0, 4, 8, 12, 20].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      updateToken("borderRadius", String(r));
                      updateToken("borderRadiusMedium", `${r}px`);
                      updateToken("borderRadiusLarge", `${r * 2}px`);
                    }}
                    style={{
                      width: "36px",
                      height: "36px",
                      border: `2px solid ${parseInt(tokens.borderRadius || "8") === r ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: `${r}px`,
                      background: parseInt(tokens.borderRadius || "8") === r ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "#374151",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div>
              <label style={labelStyle}>Тени</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { label: "Нет", value: "none", shadow: "none" },
                  { label: "Мягкие", value: "soft", shadow: "0 4px 24px rgba(0,0,0,0.06)" },
                  { label: "Средние", value: "medium", shadow: "0 8px 32px rgba(0,0,0,0.12)" },
                  { label: "Сильные", value: "hard", shadow: "0 12px 40px rgba(0,0,0,0.2)" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      updateToken("shadowStyle", s.value);
                      updateToken("shadowResting", s.shadow);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      border: `2px solid ${tokens.shadowStyle === s.value ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: tokens.shadowStyle === s.value ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: tokens.shadowStyle === s.value ? "#6366f1" : "#374151",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max width */}
            <div>
              <label style={labelStyle}>Максимальная ширина контента</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["1100px", "1200px", "1280px", "1400px"].map((w) => (
                  <button
                    key={w}
                    onClick={() => updateToken("maxWidthContent", w)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      border: `2px solid ${tokens.maxWidthContent === w ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: tokens.maxWidthContent === w ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: tokens.maxWidthContent === w ? "#6366f1" : "#374151",
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label style={labelStyle}>Отступ между секциями</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min={60}
                  max={200}
                  step={10}
                  value={parseInt(tokens.spacingSection || "120")}
                  onChange={(e) => updateToken("spacingSection", `${e.target.value}px`)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", width: "50px", textAlign: "right" }}>
                  {tokens.spacingSection || "120px"}
                </span>
              </div>
            </div>

            {/* Animation speed */}
            <div>
              <label style={labelStyle}>Скорость анимации</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["100ms", "200ms", "300ms", "500ms"].map((d) => (
                  <button
                    key={d}
                    onClick={() => updateToken("transitionDuration", d)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      border: `2px solid ${tokens.transitionDuration === d ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: tokens.transitionDuration === d ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: tokens.transitionDuration === d ? "#6366f1" : "#374151",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOM CSS ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>
            💻 Свой CSS
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px" }}>
            Дополнительные стили поверх токенов. Используйте CSS-переменные: <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: "3px", fontSize: "11px" }}>var(--color-accent)</code>
          </p>
          <textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            rows={8}
            placeholder={`.hero { background: var(--color-accent); }\n.btn { border-radius: 0; }`}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#374151",
              resize: "vertical",
              boxSizing: "border-box",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* ── CURRENT PRESET ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>
            ✨ Активный шаблон
          </h2>
          <div style={{
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "10px",
            border: "2px solid #6366f1",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}>
            <span style={{ fontSize: "32px" }}>🎨</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 2px" }}>
                {initialData.design.preset.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Текущий активный стиль</p>
            </div>
          </div>
          <a
            href="/admin/presets"
            style={{
              display: "block",
              padding: "10px",
              background: "#6366f1",
              color: "#fff",
              borderRadius: "8px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Сменить шаблон →
          </a>

          {/* Reset to preset */}
          <button
            onClick={() => {
              if (confirm("Сбросить все изменения к значениям шаблона?")) {
                setTokens({ ...initialData.design.tokens });
                setCustomCss(initialData.design.customCss || "");
              }
            }}
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "10px",
              background: "#fff",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ↺ Сбросить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
