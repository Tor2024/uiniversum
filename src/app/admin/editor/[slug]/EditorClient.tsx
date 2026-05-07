"use client";

import { useState, useCallback } from "react";
import { blocksRegistry, BlockData, BlockRegistryItem } from "@/lib/blocks-registry";
import dynamic from "next/dynamic";

// Lazy-load MediaClient to avoid SSR issues
const MediaClient = dynamic(() => import("../../media/MediaClient"), { ssr: false });


// ─── Types ────────────────────────────────────────────────────────────────────

interface PageData {
  title: Record<string, string> | string;
  slug?: string;
  status?: string;
  blocks: BlockData[];
}

interface EditorClientProps {
  slug: string;
  initialData: PageData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOCK_ICONS: Record<string, string> = {
  hero: "🖼️", text_rich: "📝", image_single: "🖼️", image_gallery: "🗃️",
  video_embed: "▶️", cards_grid: "🃏", testimonials: "💬", faq: "❓",
  pricing: "💰", cta_banner: "📣", contact_form: "✉️", map_embed: "📍",
  countdown: "⏱️", stats: "📊", timeline: "📅", divider: "➖",
  logo_cloud: "🏢", team: "👥", blog_feed: "📰", menu_food: "🍽️",
  booking_form: "📆", custom_html: "💻",
};

const BLOCK_NAMES: Record<string, string> = {
  hero: "Hero-баннер", text_rich: "Текст", image_single: "Изображение",
  image_gallery: "Галерея", video_embed: "Видео", cards_grid: "Карточки",
  testimonials: "Отзывы", faq: "FAQ", pricing: "Цены", cta_banner: "CTA-баннер",
  contact_form: "Контактная форма", map_embed: "Карта", countdown: "Таймер",
  stats: "Статистика", timeline: "Хронология", divider: "Разделитель",
  logo_cloud: "Логотипы", team: "Команда", blog_feed: "Блог",
  menu_food: "Меню ресторана", booking_form: "Форма записи", custom_html: "HTML-блок",
};

const GROUPS = [
  { key: "content", label: "Контент", icon: "📝" },
  { key: "media", label: "Медиа", icon: "🖼️" },
  { key: "forms", label: "Формы", icon: "✉️" },
  { key: "special", label: "Особые", icon: "⭐" },
];

// ─── Block Field Editor ───────────────────────────────────────────────────────

function getStringValue(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    return String(obj.de || obj.en || obj.ru || "");
  }
  return String(val ?? "");
}

function BlockFieldEditor({
  block,
  onChange,
}: {
  block: BlockData;
  onChange: (updated: BlockData) => void;
}) {
  const [mediaPicker, setMediaPicker] = useState<string | null>(null); // key of field being picked

  const updateSetting = (key: string, value: unknown) => {
    onChange({
      ...block,
      settings: { ...block.settings, [key]: value },
    });
  };

  const updateLocalizedSetting = (key: string, lang: string, value: string) => {
    const current = block.settings[key];
    const obj = typeof current === "object" && current !== null ? { ...(current as Record<string, string>) } : {};
    obj[lang] = value;
    updateSetting(key, obj);
  };

  // Detect if a field key is likely an image/media field
  const isMediaField = (key: string) =>
    /image|photo|avatar|background|src|logo|cover|thumb|poster|video/i.test(key);

  const renderField = (key: string, value: unknown) => {
    // Skip complex nested arrays for now — show as JSON
    if (Array.isArray(value)) {
      return (
        <div key={key} style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{key}</label>
          <textarea
            defaultValue={JSON.stringify(value, null, 2)}
            rows={6}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "11px" }}
            onBlur={(e) => {
              try {
                updateSetting(key, JSON.parse(e.target.value));
              } catch {
                // invalid JSON — ignore
              }
            }}
          />
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>JSON-редактор</p>
        </div>
      );
    }

    // Localised object {de, en, ru}
    if (typeof value === "object" && value !== null && ("de" in value || "en" in value || "ru" in value)) {
      const obj = value as Record<string, string>;
      return (
        <div key={key} style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{key}</label>
          {(["de", "en", "ru"] as const).map((lang) => (
            <div key={lang} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#6b7280", width: "24px", flexShrink: 0 }}>{lang}</span>
              <input
                type="text"
                defaultValue={obj[lang] || ""}
                style={inputStyle}
                onBlur={(e) => updateLocalizedSetting(key, lang, e.target.value)}
              />
            </div>
          ))}
        </div>
      );
    }

    // Boolean
    if (typeof value === "boolean") {
      return (
        <div key={key} style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            defaultChecked={value}
            onChange={(e) => updateSetting(key, e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label style={{ fontSize: "13px", color: "#374151", cursor: "pointer" }}>{key}</label>
        </div>
      );
    }

    // Number
    if (typeof value === "number") {
      return (
        <div key={key} style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>{key}</label>
          <input
            type="number"
            defaultValue={value}
            style={{ ...inputStyle, width: "100px" }}
            onBlur={(e) => updateSetting(key, Number(e.target.value))}
          />
        </div>
      );
    }

    // String — check if media field
    const strVal = String(value ?? "");
    const isMedia = isMediaField(key);
    const isLong = strVal.length > 80 || key === "html" || key === "content";

    return (
      <div key={key} style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>{key}</label>

        {/* Media field: show thumbnail + picker button */}
        {isMedia ? (
          <div>
            {strVal && (
              <div style={{ marginBottom: "6px", borderRadius: "6px", overflow: "hidden", border: "1px solid #e5e7eb", maxHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={strVal} alt="" style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                defaultValue={strVal}
                placeholder="/media/..."
                style={{ ...inputStyle, flex: 1 }}
                onBlur={(e) => updateSetting(key, e.target.value)}
              />
              <button
                onClick={() => setMediaPicker(key)}
                style={{
                  padding: "8px 12px",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                🖼️
              </button>
            </div>
          </div>
        ) : isLong ? (
          <textarea
            defaultValue={strVal}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
            onBlur={(e) => updateSetting(key, e.target.value)}
          />
        ) : (
          <input
            type="text"
            defaultValue={strVal}
            style={inputStyle}
            onBlur={(e) => updateSetting(key, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      {Object.entries(block.settings).map(([key, value]) => renderField(key, value))}

      {/* Media picker modal */}
      {mediaPicker && (
        <MediaClient
          initialFiles={[]}
          pickerMode
          onPick={(path) => {
            updateSetting(mediaPicker, path);
            setMediaPicker(null);
          }}
          onClose={() => setMediaPicker(null)}
        />
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  padding: "8px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  fontSize: "13px",
  color: "#111",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

// ─── Block Editor Tabs (Content + Styles) ────────────────────────────────────

function BlockEditorTabs({
  block,
  onChange,
  onClose,
}: {
  block: BlockData;
  onChange: (updated: BlockData) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"content" | "styles">("content");

  const updateStyle = (key: string, value: unknown) => {
    onChange({ ...block, styles: { ...block.styles, [key]: value } });
  };

  const tabBtn = (id: "content" | "styles", label: string) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: "8px 16px",
        border: "none",
        borderBottom: `2px solid ${tab === id ? "#6366f1" : "transparent"}`,
        background: "transparent",
        fontSize: "12px",
        fontWeight: tab === id ? 700 : 500,
        color: tab === id ? "#6366f1" : "#6b7280",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 14px" }}>
        {tabBtn("content", "✏️ Контент")}
        {tabBtn("styles", "🎨 Стили")}
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{ padding: "8px 12px", border: "none", background: "transparent", fontSize: "12px", color: "#9ca3af", cursor: "pointer" }}
        >
          ✓ Готово
        </button>
      </div>

      <div style={{ padding: "16px 14px" }}>
        {tab === "content" ? (
          <BlockFieldEditor block={block} onChange={onChange} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Padding */}
            <div>
              <label style={labelStyle}>Отступ сверху (px)</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={160}
                  step={8}
                  value={block.styles.paddingTop ?? 60}
                  onChange={(e) => updateStyle("paddingTop", Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", width: "40px", textAlign: "right" }}>
                  {block.styles.paddingTop ?? 60}px
                </span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Отступ снизу (px)</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={160}
                  step={8}
                  value={block.styles.paddingBottom ?? 60}
                  onChange={(e) => updateStyle("paddingBottom", Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", width: "40px", textAlign: "right" }}>
                  {block.styles.paddingBottom ?? 60}px
                </span>
              </div>
            </div>

            {/* Background color */}
            <div>
              <label style={labelStyle}>Цвет фона</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={block.styles.backgroundColor && block.styles.backgroundColor !== "" && !block.styles.backgroundColor.startsWith("var") ? block.styles.backgroundColor : "#ffffff"}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  style={{ width: "44px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer", padding: "2px" }}
                />
                <input
                  type="text"
                  value={block.styles.backgroundColor || ""}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  placeholder="var(--color-surface) или #ffffff"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={() => updateStyle("backgroundColor", "")}
                  title="Сбросить"
                  style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#fff", cursor: "pointer", fontSize: "12px", color: "#6b7280" }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                {[
                  { label: "Фон", val: "var(--color-background)" },
                  { label: "Поверхность", val: "var(--color-surface)" },
                  { label: "Акцент", val: "var(--color-accent)" },
                  { label: "Прозрачный", val: "" },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => updateStyle("backgroundColor", p.val)}
                    style={{
                      padding: "4px 10px",
                      border: `1px solid ${block.styles.backgroundColor === p.val ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "6px",
                      background: block.styles.backgroundColor === p.val ? "#ede9fe" : "#fff",
                      fontSize: "11px",
                      color: block.styles.backgroundColor === p.val ? "#6366f1" : "#374151",
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text align */}
            <div>
              <label style={labelStyle}>Выравнивание текста</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateStyle("textAlign", align)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: `2px solid ${block.styles.textAlign === align ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: block.styles.textAlign === align ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {align === "left" ? "⬅" : align === "center" ? "↔" : "➡"}
                  </button>
                ))}
              </div>
            </div>

            {/* Max width */}
            <div>
              <label style={labelStyle}>Максимальная ширина</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["sm", "md", "lg", "xl", "full"].map((w) => (
                  <button
                    key={w}
                    onClick={() => updateStyle("maxWidth", w)}
                    style={{
                      padding: "6px 12px",
                      border: `2px solid ${block.styles.maxWidth === w ? "#6366f1" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: block.styles.maxWidth === w ? "#ede9fe" : "#fff",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: block.styles.maxWidth === w ? "#6366f1" : "#374151",
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                sm=640px · md=768px · lg=1024px · xl=1280px · full=100%
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function EditorClient({ slug, initialData }: EditorClientProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(
    (initialData.blocks || []).sort((a, b) => a.order - b.order)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const pageTitle =
    typeof initialData.title === "object"
      ? (initialData.title.ru || initialData.title.de || initialData.title.en || slug)
      : (initialData.title || slug);

  // ── Save to GitHub via /api/publish ──────────────────────────────────────

  const handlePublish = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const pageData = {
        ...initialData,
        blocks: blocks.map((b, i) => ({ ...b, order: i })),
      };
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `data/pages/${slug}.json`,
          content: JSON.stringify(pageData, null, 2),
          message: `editor: update ${slug} page`,
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
  }, [blocks, initialData, slug]);

  // ── Block operations ──────────────────────────────────────────────────────

  const addBlock = useCallback((registryItem: BlockRegistryItem) => {
    const newBlock: BlockData = {
      id: `${registryItem.type}-${Date.now()}`,
      type: registryItem.type,
      visible: true,
      order: blocks.length,
      settings: { ...registryItem.defaultSettings },
      styles: { ...registryItem.defaultStyles } as BlockData["styles"],
    };
    setBlocks((prev) => [...prev, newBlock]);
    setEditingId(newBlock.id);
  }, [blocks.length]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) setEditingId(null);
  }, [editingId]);

  const toggleVisible = useCallback((id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  }, []);

  const updateBlock = useCallback((updated: BlockData) => {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const newBlocks = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newBlocks.length) return prev;
      [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
      return newBlocks;
    });
  }, []);

  // ── Drag and drop ─────────────────────────────────────────────────────────

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === dragId);
      const to = prev.findIndex((b) => b.id === targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragId(null);
    setDragOverId(null);
  };

  const editingBlock = blocks.find((b) => b.id === editingId) ?? null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── LEFT: Block library ── */}
      <aside style={{ width: "220px", background: "#fff", borderRight: "1px solid #e5e7eb", overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
            + Добавить блок
          </p>
        </div>
        {GROUPS.map((group) => {
          const items = blocksRegistry.filter((b) => b.group === group.key);
          return (
            <div key={group.key}>
              <div style={{ padding: "8px 12px 4px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", margin: 0 }}>
                  {group.icon} {group.label}
                </p>
              </div>
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item)}
                  title={item.description}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 12px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    margin: "0 4px",
                    width: "calc(100% - 8px)",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: "15px", flexShrink: 0 }}>{BLOCK_ICONS[item.type] || "📦"}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                    {BLOCK_NAMES[item.type] || item.name}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </aside>

      {/* ── CENTER: Canvas ── */}
      <main style={{ flex: 1, overflowY: "auto", background: "#f3f4f6", padding: "20px", minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <div>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Редактор страницы
            </p>
            <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: 0 }}>{pageTitle}</h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {saveStatus === "saved" && (
              <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>✓ Сохранено</span>
            )}
            {saveStatus === "error" && (
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600 }}>✗ Ошибка</span>
            )}
            <a
              href={`/de`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: "7px", fontSize: "12px", color: "#374151", textDecoration: "none", background: "#fff" }}
            >
              👁 Предпросмотр
            </a>
            <button
              onClick={handlePublish}
              disabled={saving}
              style={{
                padding: "7px 16px",
                background: saving ? "#86efac" : "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "⏳ Сохраняю..." : "🚀 Опубликовать"}
            </button>
          </div>
        </div>

        {/* Blocks list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {blocks.map((block, idx) => {
            const isEditing = editingId === block.id;
            const isDragging = dragId === block.id;
            const isOver = dragOverId === block.id;
            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                onDragOver={(e) => handleDragOver(e, block.id)}
                onDrop={() => handleDrop(block.id)}
                onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  border: isEditing ? "2px solid #6366f1" : isOver ? "2px dashed #6366f1" : "1px solid #f3f4f6",
                  boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.06)",
                  opacity: isDragging ? 0.5 : block.visible ? 1 : 0.5,
                  cursor: "grab",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              >
                {/* Block header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0, cursor: "grab" }}>⠿</span>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{BLOCK_ICONS[block.type] || "📦"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>
                        {BLOCK_NAMES[block.type] || block.type}
                      </span>
                      {!block.visible && (
                        <span style={{ fontSize: "10px", color: "#9ca3af", background: "#f3f4f6", padding: "1px 6px", borderRadius: "4px" }}>
                          скрыт
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>#{idx + 1} · {block.id}</span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={idx === 0}
                      title="Вверх"
                      style={{ ...actionBtn, opacity: idx === 0 ? 0.3 : 1 }}
                    >↑</button>
                    <button
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={idx === blocks.length - 1}
                      title="Вниз"
                      style={{ ...actionBtn, opacity: idx === blocks.length - 1 ? 0.3 : 1 }}
                    >↓</button>
                    <button
                      onClick={() => toggleVisible(block.id)}
                      title={block.visible ? "Скрыть" : "Показать"}
                      style={actionBtn}
                    >
                      {block.visible ? "👁" : "🙈"}
                    </button>
                    <button
                      onClick={() => setEditingId(isEditing ? null : block.id)}
                      style={{
                        ...actionBtn,
                        background: isEditing ? "#ede9fe" : "#fff",
                        color: isEditing ? "#6366f1" : "#374151",
                        borderColor: isEditing ? "#c4b5fd" : "#e5e7eb",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить блок "${BLOCK_NAMES[block.type]}"?`)) {
                          deleteBlock(block.id);
                        }
                      }}
                      title="Удалить"
                      style={{ ...actionBtn, color: "#ef4444", borderColor: "#fee2e2" }}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Inline editor */}
                {isEditing && (
                  <div style={{
                    borderTop: "1px solid #f3f4f6",
                    background: "#fafafa",
                    borderRadius: "0 0 10px 10px",
                  }}>
                    {/* Tabs */}
                    <BlockEditorTabs block={block} onChange={updateBlock} onClose={() => setEditingId(null)} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {blocks.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📄</div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>Страница пустая</p>
              <p style={{ fontSize: "13px", margin: 0 }}>Добавьте блоки из панели слева</p>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOverId("__end__"); }}
            onDrop={() => { setDragOverId(null); setDragId(null); }}
            style={{
              padding: "16px",
              border: `2px dashed ${dragOverId === "__end__" ? "#6366f1" : "#d1d5db"}`,
              borderRadius: "10px",
              background: dragOverId === "__end__" ? "#ede9fe" : "transparent",
              color: "#9ca3af",
              fontSize: "13px",
              textAlign: "center",
              transition: "all 0.15s",
            }}
          >
            {dragId ? "Перетащите сюда" : "Выберите блок из панели слева для добавления"}
          </div>
        </div>
      </main>

      {/* ── RIGHT: Settings ── */}
      <aside style={{ width: "240px", background: "#fff", borderLeft: "1px solid #e5e7eb", overflowY: "auto", flexShrink: 0, padding: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>
          Настройки страницы
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Статус</label>
            <div style={{
              padding: "8px 12px",
              background: initialData.status === "published" ? "#dcfce7" : "#fef9c3",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: initialData.status === "published" ? "#166534" : "#854d0e",
            }}>
              {initialData.status === "published" ? "✓ Опубликована" : "⏳ Черновик"}
            </div>
          </div>
          <div>
            <label style={labelStyle}>URL страницы</label>
            <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "8px", fontSize: "13px", color: "#6b7280", fontFamily: "monospace" }}>
              /{initialData.slug || slug}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Блоков на странице</label>
            <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "8px", fontSize: "24px", fontWeight: 700, color: "#111" }}>
              {blocks.length}
            </div>
          </div>

          {/* Editing hint */}
          {editingBlock && (
            <div style={{ background: "#ede9fe", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#4c1d95" }}>
              <p style={{ fontWeight: 700, margin: "0 0 4px" }}>✏️ Редактируется</p>
              <p style={{ margin: 0 }}>{BLOCK_NAMES[editingBlock.type]}</p>
            </div>
          )}

          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>
            <p style={{ fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>💡 Подсказка</p>
            Нажмите ✏️ для редактирования блока. Перетащите ⠿ для изменения порядка. Нажмите 🚀 для сохранения.
          </div>
        </div>
      </aside>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: "4px 8px",
  border: "1px solid #e5e7eb",
  borderRadius: "5px",
  fontSize: "13px",
  color: "#374151",
  background: "#fff",
  cursor: "pointer",
  lineHeight: 1,
};