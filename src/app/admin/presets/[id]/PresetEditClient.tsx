"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface PresetEditClientProps {
  presetId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "7px",
  fontSize: "13px",
  color: "#111",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "20px",
  marginBottom: "20px",
};

// Localised field editor: renders 3 inputs for de/en/ru
function LocalField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const obj = typeof value === "object" && value !== null ? value : { de: value || "", en: "", ru: "" };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {(["de", "en", "ru"] as const).map((lang) => (
          <div key={lang} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "11px", color: "#6b7280", width: "24px", flexShrink: 0, paddingTop: "10px" }}>{lang}</span>
            {multiline ? (
              <textarea
                value={obj[lang] || ""}
                onChange={(e) => onChange({ ...obj, [lang]: e.target.value })}
                rows={3}
                placeholder={placeholder}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            ) : (
              <input
                type="text"
                value={obj[lang] || ""}
                onChange={(e) => onChange({ ...obj, [lang]: e.target.value })}
                placeholder={placeholder}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple string field
function StringField({
  label,
  value,
  onChange,
  placeholder = "",
  hint = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      {hint && <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>{hint}</p>}
    </div>
  );
}

export default function PresetEditClient({ presetId, initialData }: PresetEditClientProps) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "services" | "contact" | "meta" | "logo">("hero");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePath = useCallback((path: string[], value: any) => {
    setData((prev: any) => {
      const next = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur[path[i]] || typeof cur[path[i]] !== "object") cur[path[i]] = {};
        cur[path[i]] = { ...cur[path[i]] };
        cur = cur[path[i]];
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
          path: `data/presets/${presetId}.json`,
          content: JSON.stringify(data, null, 2),
          message: `preset: edit ${presetId} via admin`,
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
  }, [data, presetId]);

  const hero = data.content?.hero || {};
  const about = data.content?.about || {};
  const contact = data.content?.contact || {};
  const services: any[] = data.content?.services || [];
  const meta = data.meta || {};
  const logo = data.logo || {};

  const tabs = [
    { id: "hero", label: "🖼️ Hero" },
    { id: "about", label: "📖 О нас" },
    { id: "services", label: "⚙️ Услуги" },
    { id: "contact", label: "📞 Контакты" },
    { id: "meta", label: "🔍 SEO" },
    { id: "logo", label: "🏷️ Логотип" },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Link href="/admin/presets" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>← Шаблоны</Link>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>{presetId}</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111", margin: 0 }}>
            ✏️ {data.meta?.title?.split("|")[0]?.trim() || presetId}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saveStatus === "saved" && <span style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>✓ Сохранено</span>}
          {saveStatus === "error" && <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>✗ Ошибка</span>}
          <a
            href={`/de/preview/${presetId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "9px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", textDecoration: "none", background: "#fff" }}
          >
            👁 Превью
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "9px 20px", background: saving ? "#86efac" : "#22c55e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "⏳..." : "💾 Сохранить"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "0" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
              background: "transparent",
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#6366f1" : "#6b7280",
              cursor: "pointer",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      {activeTab === "hero" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Hero-секция</h2>
          <LocalField label="Заголовок" value={typeof hero === "object" && "de" in hero ? hero : hero?.de ? hero : {}} onChange={(v) => updatePath(["content", "hero"], v)} />
          <LocalField label="Подзаголовок" value={hero?.subheading || {}} onChange={(v) => updatePath(["content", "hero", "subheading"], v)} multiline />
          <LocalField label="Кнопка CTA" value={hero?.cta || {}} onChange={(v) => updatePath(["content", "hero", "cta"], v)} />
          <LocalField label="Вторая кнопка" value={hero?.secondaryCta || {}} onChange={(v) => updatePath(["content", "hero", "secondaryCta"], v)} />
          <StringField label="Изображение (путь)" value={hero?.image || hero?.de?.image || ""} onChange={(v) => updatePath(["content", "hero", "image"], v)} placeholder="/media/presets/..." />
          {data.content?.announcementBar !== undefined && (
            <LocalField label="Announcement bar" value={data.content.announcementBar} onChange={(v) => updatePath(["content", "announcementBar"], v)} />
          )}
        </div>
      )}

      {/* ── ABOUT ── */}
      {activeTab === "about" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Секция «О нас»</h2>
          {typeof about === "object" && ("de" in about || "en" in about) ? (
            <>
              {(["de", "en", "ru"] as const).map((lang) => {
                const langAbout = about[lang] || {};
                return (
                  <div key={lang} style={{ marginBottom: "24px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>{lang.toUpperCase()}</p>
                    <div style={{ marginBottom: "10px" }}>
                      <label style={labelStyle}>Заголовок</label>
                      <input type="text" value={langAbout.title || ""} onChange={(e) => updatePath(["content", "about", lang, "title"], e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <label style={labelStyle}>Подзаголовок</label>
                      <input type="text" value={langAbout.subtitle || ""} onChange={(e) => updatePath(["content", "about", lang, "subtitle"], e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Текст</label>
                      <textarea value={langAbout.text || ""} onChange={(e) => updatePath(["content", "about", lang, "text"], e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Секция «О нас» не найдена в этом шаблоне</p>
          )}
        </div>
      )}

      {/* ── SERVICES ── */}
      {activeTab === "services" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Услуги / Меню</h2>
          {services.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Услуги не найдены в этом шаблоне</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {services.map((service: any, i: number) => (
                <div key={i} style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>#{i + 1} {service.name_de || service.name_en || service.id || ""}</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>ID: {service.id || i}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    {(["de", "en", "ru"] as const).map((lang) => (
                      <div key={lang}>
                        <label style={labelStyle}>Название ({lang})</label>
                        <input type="text" value={service[`name_${lang}`] || ""} onChange={(e) => {
                          const updated = [...services];
                          updated[i] = { ...updated[i], [`name_${lang}`]: e.target.value };
                          updatePath(["content", "services"], updated);
                        }} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={labelStyle}>Цена</label>
                      <input type="text" value={service.price || ""} onChange={(e) => {
                        const updated = [...services];
                        updated[i] = { ...updated[i], price: e.target.value };
                        updatePath(["content", "services"], updated);
                      }} style={inputStyle} placeholder="ab 50 EUR" />
                    </div>
                    <div>
                      <label style={labelStyle}>Описание (DE)</label>
                      <input type="text" value={service.desc_de || ""} onChange={(e) => {
                        const updated = [...services];
                        updated[i] = { ...updated[i], desc_de: e.target.value };
                        updatePath(["content", "services"], updated);
                      }} style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTACT ── */}
      {activeTab === "contact" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Контактная информация</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <StringField label="Адрес" value={contact.address || ""} onChange={(v) => updatePath(["content", "contact", "address"], v)} placeholder="Hauptstraße 1, 10115 Berlin" />
            <StringField label="Телефон" value={contact.phone || ""} onChange={(v) => updatePath(["content", "contact", "phone"], v)} placeholder="+49 30 1234 5678" />
            <StringField label="Email" value={contact.email || ""} onChange={(v) => updatePath(["content", "contact", "email"], v)} placeholder="info@example.de" />
            <StringField label="Часы работы (DE)" value={contact.hours_de || ""} onChange={(v) => updatePath(["content", "contact", "hours_de"], v)} placeholder="Mo-Fr: 09:00-18:00 Uhr" />
            <StringField label="Часы работы (EN)" value={contact.hours_en || ""} onChange={(v) => updatePath(["content", "contact", "hours_en"], v)} placeholder="Mon-Fri: 9:00 AM-6:00 PM" />
            <StringField label="Часы работы (RU)" value={contact.hours_ru || ""} onChange={(v) => updatePath(["content", "contact", "hours_ru"], v)} placeholder="Пн-Пт: 09:00-18:00" />
          </div>
        </div>
      )}

      {/* ── META / SEO ── */}
      {activeTab === "meta" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>SEO и мета-данные</h2>
          <StringField label="Название сайта" value={meta.title || ""} onChange={(v) => updatePath(["meta", "title"], v)} placeholder="Mein Unternehmen | Beschreibung" hint="Отображается во вкладке браузера и в Google" />
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Описание (meta description)</label>
            <textarea value={meta.description || ""} onChange={(e) => updatePath(["meta", "description"], e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Kurze Beschreibung für Suchmaschinen..." />
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>Оптимально: 120–160 символов. Сейчас: {(meta.description || "").length}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <StringField label="OG Image" value={data.seo?.ogImage || ""} onChange={(v) => updatePath(["seo", "ogImage"], v)} placeholder="/media/og-image.jpg" />
            <StringField label="Keywords" value={data.seo?.keywords || ""} onChange={(v) => updatePath(["seo", "keywords"], v)} placeholder="keyword1, keyword2" />
          </div>
        </div>
      )}

      {/* ── LOGO ── */}
      {activeTab === "logo" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Логотип</h2>
          {/* Preview */}
          <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "8px", textAlign: "center", marginBottom: "20px", border: "1px solid #f3f4f6" }}>
            <div style={{ fontFamily: `'${logo.font || "Inter"}', serif`, fontSize: "28px", fontWeight: 700, color: "#111", lineHeight: 1.1 }}>
              {logo.text || "Логотип"}
            </div>
            {logo.tagline && <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9ca3af", marginTop: "4px" }}>{logo.tagline}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <StringField label="Текст логотипа" value={logo.text || ""} onChange={(v) => updatePath(["logo", "text"], v)} placeholder="Mein Unternehmen" />
            <StringField label="Подпись (tagline)" value={logo.tagline || ""} onChange={(v) => updatePath(["logo", "tagline"], v)} placeholder="BERLIN · SEIT 1995" />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Шрифт логотипа</label>
            <select value={logo.font || "Inter"} onChange={(e) => updatePath(["logo", "font"], e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {["Playfair Display", "Cormorant Garamond", "EB Garamond", "Oswald", "Montserrat", "Inter", "Raleway", "Libre Baskerville", "Lora", "DM Serif Display", "Dancing Script", "Pacifico"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Social links */}
      {data.social && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Социальные сети</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {Object.entries(data.social).map(([key, val]) => (
              <StringField key={key} label={key} value={String(val || "")} onChange={(v) => updatePath(["social", key], v)} placeholder={`https://${key}.com/...`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
