"use client";

import { useState, useCallback } from "react";

interface SiteData {
  meta: {
    title?: string;
    description?: string;
    favicon?: string;
    language?: string;
    availableLanguages?: string[];
  };
  design?: Record<string, unknown>;
  seo?: {
    ogImage?: string;
    googleAnalyticsId?: string;
    keywords?: string;
    twitterCard?: string;
  };
  logo?: {
    text?: string;
    tagline?: string;
    font?: string;
  };
  booking?: {
    enabled?: boolean;
    slots?: string[];
    duration?: number;
  };
  [key: string]: unknown;
}

interface SettingsClientProps {
  initialData: SiteData;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#374151",
  background: "#fff",
  boxSizing: "border-box",
  outline: "none",
};

const hintStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
  margin: "4px 0 0",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "20px",
};

export default function SettingsClient({ initialData }: SettingsClientProps) {
  const [data, setData] = useState<SiteData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const update = useCallback((path: string[], value: unknown) => {
    setData((prev) => {
      const next = { ...prev };
      let cur: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur[path[i]] || typeof cur[path[i]] !== "object") {
          cur[path[i]] = {};
        }
        cur[path[i]] = { ...(cur[path[i]] as Record<string, unknown>) };
        cur = cur[path[i]] as Record<string, unknown>;
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "data/site.json",
          content: JSON.stringify(data, null, 2),
          message: "settings: update site config via admin",
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
  }, [data]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>⚙️ Настройки сайта</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Основные параметры, SEO, логотип и публикация</p>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>

        {/* ── GENERAL ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>🌐 Основное</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Название сайта</label>
              <input
                type="text"
                value={data.meta?.title || ""}
                onChange={(e) => update(["meta", "title"], e.target.value)}
                style={inputStyle}
                placeholder="Мой сайт | Описание"
              />
              <p style={hintStyle}>Отображается во вкладке браузера и в Google</p>
            </div>
            <div>
              <label style={labelStyle}>Описание (meta description)</label>
              <textarea
                value={data.meta?.description || ""}
                onChange={(e) => update(["meta", "description"], e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Краткое описание сайта для поисковиков..."
              />
              <p style={hintStyle}>Оптимально: 120–160 символов. Сейчас: {(data.meta?.description || "").length}</p>
            </div>
            <div>
              <label style={labelStyle}>Язык по умолчанию</label>
              <select
                value={data.meta?.language || "de"}
                onChange={(e) => update(["meta", "language"], e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="de">🇩🇪 Немецкий (de)</option>
                <option value="en">🇬🇧 Английский (en)</option>
                <option value="ru">🇷🇺 Русский (ru)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── LOGO ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>🏷️ Логотип</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Preview */}
            <div style={{
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #f3f4f6",
            }}>
              <div style={{
                fontFamily: `'${data.logo?.font || "Inter"}', serif`,
                fontSize: "24px",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.1,
              }}>
                {data.logo?.text || "Логотип"}
              </div>
              {data.logo?.tagline && (
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9ca3af", marginTop: "4px" }}>
                  {data.logo.tagline}
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Текст логотипа</label>
              <input
                type="text"
                value={data.logo?.text || ""}
                onChange={(e) => update(["logo", "text"], e.target.value)}
                style={inputStyle}
                placeholder="Название компании"
              />
            </div>
            <div>
              <label style={labelStyle}>Подпись (tagline)</label>
              <input
                type="text"
                value={data.logo?.tagline || ""}
                onChange={(e) => update(["logo", "tagline"], e.target.value)}
                style={inputStyle}
                placeholder="BERLIN · SEIT 1995"
              />
            </div>
            <div>
              <label style={labelStyle}>Шрифт логотипа</label>
              <select
                value={data.logo?.font || "Inter"}
                onChange={(e) => update(["logo", "font"], e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {["Playfair Display", "Cormorant Garamond", "EB Garamond", "Oswald", "Montserrat", "Inter", "Raleway", "Libre Baskerville", "Lora", "Dancing Script", "Pacifico"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── SEO ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>🔍 SEO и аналитика</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>OG Image (картинка для соцсетей)</label>
              <input
                type="text"
                value={data.seo?.ogImage || ""}
                onChange={(e) => update(["seo", "ogImage"], e.target.value)}
                style={inputStyle}
                placeholder="/media/og-image.jpg"
              />
              <p style={hintStyle}>Показывается при репосте в WhatsApp, Telegram, Facebook. Размер: 1200×630px</p>
            </div>
            <div>
              <label style={labelStyle}>Ключевые слова (keywords)</label>
              <input
                type="text"
                value={data.seo?.keywords || ""}
                onChange={(e) => update(["seo", "keywords"], e.target.value)}
                style={inputStyle}
                placeholder="ресторан, берлин, немецкая кухня"
              />
              <p style={hintStyle}>Через запятую. Влияние на SEO минимальное, но полезно для структуры</p>
            </div>
            <div>
              <label style={labelStyle}>Google Analytics ID</label>
              <input
                type="text"
                value={data.seo?.googleAnalyticsId || ""}
                onChange={(e) => update(["seo", "googleAnalyticsId"], e.target.value)}
                style={inputStyle}
                placeholder="G-XXXXXXXXXX"
              />
              <p style={hintStyle}>
                Получите ID на{" "}
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>
                  analytics.google.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ── BOOKING ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>📅 Онлайн-запись</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={data.booking?.enabled ?? false}
                onChange={(e) => update(["booking", "enabled"], e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                Включить форму записи
              </label>
            </div>
            {data.booking?.enabled && (
              <>
                <div>
                  <label style={labelStyle}>Длительность сеанса (минут)</label>
                  <input
                    type="number"
                    value={data.booking?.duration || 60}
                    onChange={(e) => update(["booking", "duration"], Number(e.target.value))}
                    style={{ ...inputStyle, width: "120px" }}
                    min={15}
                    max={480}
                    step={15}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Доступные слоты (через запятую)</label>
                  <input
                    type="text"
                    value={(data.booking?.slots || []).join(", ")}
                    onChange={(e) => update(["booking", "slots"], e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                    style={inputStyle}
                    placeholder="09:00, 10:00, 11:00, 14:00, 15:00"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── PUBLISH ── */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>🚀 Публикация</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px" }}>
            Нажмите «Сохранить» вверху страницы — изменения запишутся в GitHub и Vercel автоматически обновит сайт за 1–2 минуты.
          </p>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#166534", marginBottom: "12px" }}>
            ✓ Репозиторий: <strong>Tor2024/uiniversum</strong> · Ветка: <strong>master</strong>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#6b7280" }}>
            <p style={{ fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>💡 Как работает</p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              1. Нажмите «Сохранить» → данные записываются в <code style={{ background: "#e5e7eb", padding: "1px 4px", borderRadius: "3px" }}>data/site.json</code><br />
              2. GitHub получает коммит → Vercel запускает деплой<br />
              3. Через 1–2 минуты сайт обновлён
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}