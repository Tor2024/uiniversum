"use client";

import { useState, useCallback } from "react";

interface NavItem {
  id: string;
  label: { de: string; en: string; ru: string };
  url: string;
  order: number;
  visible: boolean;
  openNewTab: boolean;
}

interface NavData {
  header: NavItem[];
  footer: NavItem[];
}

interface MenuClientProps {
  initialData: NavData;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  fontSize: "13px",
  color: "#111",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

function newItem(order: number): NavItem {
  return {
    id: "nav_" + Date.now(),
    label: { de: "Neuer Link", en: "New Link", ru: "Новая ссылка" },
    url: "/",
    order,
    visible: true,
    openNewTab: false,
  };
}

function NavSection({
  title,
  subtitle,
  items,
  onChange,
}: {
  title: string;
  subtitle: string;
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const add = () => {
    const item = newItem(items.length);
    onChange([...items, item]);
    setEditingId(item.id);
  };

  const remove = (id: string) => {
    if (confirm("Удалить ссылку?")) {
      onChange(items.filter((i) => i.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const update = (id: string, field: string, value: unknown) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        if (field.startsWith("label.")) {
          const lang = field.split(".")[1] as "de" | "en" | "ru";
          return { ...item, label: { ...item.label, [lang]: value } };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const move = (id: string, dir: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const next = [...items];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  return (
    <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px", marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{title}</h2>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: "20px", fontSize: "12px", color: "#6b7280" }}>
            {items.length} ссылок
          </span>
          <button onClick={add} style={{ padding: "7px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            + Добавить
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#9ca3af", border: "2px dashed #e5e7eb", borderRadius: "8px" }}>
          <p style={{ margin: "0 0 12px", fontSize: "14px" }}>Ссылок пока нет</p>
          <button onClick={add} style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            + Добавить первую ссылку
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item, idx) => {
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} style={{ border: isEditing ? "2px solid #6366f1" : "1px solid #f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                {/* Row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: isEditing ? "#f5f3ff" : "#f9fafb" }}>
                  <span style={{ fontSize: "16px", color: "#9ca3af" }}>⠿</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.label.de || item.label.en || item.label.ru || "—"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{item.url}</div>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, background: item.visible ? "#dcfce7" : "#f3f4f6", color: item.visible ? "#166534" : "#9ca3af", flexShrink: 0 }}>
                    {item.visible ? "Видна" : "Скрыта"}
                  </span>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button onClick={() => move(item.id, "up")} disabled={idx === 0} style={{ padding: "4px 7px", border: "1px solid #e5e7eb", borderRadius: "5px", background: "#fff", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.3 : 1, fontSize: "12px" }}>↑</button>
                    <button onClick={() => move(item.id, "down")} disabled={idx === items.length - 1} style={{ padding: "4px 7px", border: "1px solid #e5e7eb", borderRadius: "5px", background: "#fff", cursor: idx === items.length - 1 ? "not-allowed" : "pointer", opacity: idx === items.length - 1 ? 0.3 : 1, fontSize: "12px" }}>↓</button>
                    <button onClick={() => update(item.id, "visible", !item.visible)} style={{ padding: "4px 7px", border: "1px solid #e5e7eb", borderRadius: "5px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>{item.visible ? "👁" : "🙈"}</button>
                    <button onClick={() => setEditingId(isEditing ? null : item.id)} style={{ padding: "4px 7px", border: isEditing ? "1px solid #c4b5fd" : "1px solid #e5e7eb", borderRadius: "5px", background: isEditing ? "#ede9fe" : "#fff", cursor: "pointer", fontSize: "12px", color: isEditing ? "#6366f1" : "#374151" }}>✏️</button>
                    <button onClick={() => remove(item.id)} style={{ padding: "4px 7px", border: "1px solid #fee2e2", borderRadius: "5px", background: "#fff", cursor: "pointer", fontSize: "12px", color: "#ef4444" }}>🗑</button>
                  </div>
                </div>

                {/* Edit form */}
                {isEditing && (
                  <div style={{ padding: "16px 14px", borderTop: "1px solid #f3f4f6", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={labelStyle}>URL</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => update(item.id, "url", e.target.value)}
                        style={inputStyle}
                        placeholder="/seite oder https://..."
                      />
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", paddingBottom: "2px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                        <input type="checkbox" checked={item.openNewTab} onChange={(e) => update(item.id, "openNewTab", e.target.checked)} style={{ width: "16px", height: "16px" }} />
                        Новая вкладка
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                        <input type="checkbox" checked={item.visible} onChange={(e) => update(item.id, "visible", e.target.checked)} style={{ width: "16px", height: "16px" }} />
                        Видна
                      </label>
                    </div>
                    {(["de", "en", "ru"] as const).map((lang) => (
                      <div key={lang}>
                        <label style={labelStyle}>Название ({lang.toUpperCase()})</label>
                        <input
                          type="text"
                          value={item.label[lang] || ""}
                          onChange={(e) => update(item.id, `label.${lang}`, e.target.value)}
                          style={inputStyle}
                          placeholder={lang === "de" ? "z.B. Startseite" : lang === "en" ? "e.g. Home" : "напр. Главная"}
                        />
                      </div>
                    ))}
                    <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={() => setEditingId(null)} style={{ padding: "7px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                        ✓ Готово
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MenuClient({ initialData }: MenuClientProps) {
  const [header, setHeader] = useState<NavItem[]>(initialData.header || []);
  const [footer, setFooter] = useState<NavItem[]>(initialData.footer || []);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const data = {
        header: header.map((item, i) => ({ ...item, order: i })),
        footer: footer.map((item, i) => ({ ...item, order: i })),
      };
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "data/navigation.json",
          content: JSON.stringify(data, null, 2),
          message: "navigation: update via admin",
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
  }, [header, footer]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>🔗 Навигация</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Ссылки в шапке и подвале вашего сайта</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saveStatus === "saved" && <span style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>✓ Сохранено</span>}
          {saveStatus === "error" && <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>✗ Ошибка</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "10px 24px", background: saving ? "#86efac" : "#22c55e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "⏳ Сохраняю..." : "💾 Сохранить"}
          </button>
        </div>
      </div>

      <NavSection
        title="Шапка сайта (Header)"
        subtitle="Главное меню — отображается на всех страницах вверху"
        items={header}
        onChange={setHeader}
      />

      <NavSection
        title="Подвал сайта (Footer)"
        subtitle="Ссылки внизу страницы — Контакты, Политика, Impressum"
        items={footer}
        onChange={setFooter}
      />

      <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px 16px", fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>
        <p style={{ fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>💡 Как работает</p>
        <p style={{ margin: 0 }}>
          Добавьте ссылки, настройте названия на 3 языках (DE/EN/RU), нажмите «Сохранить» — изменения запишутся в GitHub и сайт обновится через 1–2 минуты.
        </p>
      </div>
    </div>
  );
}
