"use client";

import { useState } from "react";
import Link from "next/link";

interface DashboardClientProps {
  siteTitle: string;
  blocksCount: number;
  preset: string;
  isFirstTime: boolean;
}

// ─── Setup Steps ──────────────────────────────────────────────────────────────

const SETUP_STEPS = [
  {
    id: "template",
    icon: "🎨",
    title: "Выберите шаблон",
    desc: "Начните с готового дизайна для вашего бизнеса",
    href: "/admin/presets",
    cta: "Выбрать шаблон",
    hint: "32 готовых шаблона: ресторан, барбершоп, фитнес, юрист и другие. Каждый с полным контентом на немецком языке.",
    done: false,
  },
  {
    id: "content",
    icon: "✏️",
    title: "Настройте контент",
    desc: "Измените тексты, фото и контактные данные",
    href: "/admin/editor/home",
    cta: "Редактировать",
    hint: "Нажмите на любой блок чтобы изменить текст. Перетащите блоки чтобы изменить порядок. Добавьте новые блоки из библиотеки слева.",
    done: false,
  },
  {
    id: "design",
    icon: "🖌️",
    title: "Настройте дизайн",
    desc: "Цвета, шрифты и стиль вашего сайта",
    href: "/admin/design",
    cta: "Изменить дизайн",
    hint: "Выберите цвета с помощью пипетки. Шрифты из 30+ вариантов. Скругление кнопок, тени и другие параметры.",
    done: false,
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Заполните настройки",
    desc: "Название сайта, логотип, контакты, SEO",
    href: "/admin/settings",
    cta: "Открыть настройки",
    hint: "Укажите название вашего бизнеса, адрес, телефон и email. Это отобразится на сайте и в поисковиках.",
    done: false,
  },
  {
    id: "publish",
    icon: "🚀",
    title: "Опубликуйте сайт",
    desc: "Нажмите «Сохранить» в любом разделе",
    href: "/admin/editor/home",
    cta: "Перейти к редактору",
    hint: "После нажатия «Сохранить» изменения автоматически публикуются через GitHub. Сайт обновится за 1-2 минуты.",
    done: false,
  },
];

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: "🎨", label: "Шаблоны", desc: "32 готовых дизайна", href: "/admin/presets", color: "#6366f1" },
  { icon: "✏️", label: "Редактор", desc: "Блоки страницы", href: "/admin/editor/home", color: "#22c55e" },
  { icon: "🖌️", label: "Дизайн", desc: "Цвета и шрифты", href: "/admin/design", color: "#f59e0b" },
  { icon: "🖼️", label: "Медиа", desc: "Фото и видео", href: "/admin/media", color: "#3b82f6" },
  { icon: "🔗", label: "Навигация", desc: "Меню сайта", href: "/admin/menu", color: "#8b5cf6" },
  { icon: "⚙️", label: "Настройки", desc: "SEO и контакты", href: "/admin/settings", color: "#6b7280" },
];

// ─── Help Tips ────────────────────────────────────────────────────────────────

const HELP_TIPS = [
  {
    q: "С чего начать?",
    a: "Перейдите в «Шаблоны» и выберите подходящий для вашего бизнеса. Нажмите «Применить» — сайт сразу получит готовый дизайн и контент.",
  },
  {
    q: "Как изменить текст на сайте?",
    a: "Откройте «Редактор» → нажмите ✏️ на любом блоке → измените текст → нажмите «Сохранить». Изменения появятся на сайте через 1-2 минуты.",
  },
  {
    q: "Как добавить своё фото?",
    a: "Откройте «Медиа» → перетащите фото или нажмите для выбора. Затем в редакторе блока нажмите 🖼️ рядом с полем изображения.",
  },
  {
    q: "Как изменить цвета сайта?",
    a: "Откройте «Дизайн» → нажмите на цветной квадрат рядом с нужным цветом → выберите новый цвет → нажмите «Сохранить».",
  },
  {
    q: "Как добавить новый раздел на страницу?",
    a: "В редакторе нажмите на нужный блок в левой панели (например «Отзывы» или «FAQ») — он добавится в конец страницы.",
  },
  {
    q: "Когда сайт обновится после изменений?",
    a: "После нажатия «Сохранить» изменения публикуются в GitHub, Vercel автоматически обновляет сайт. Обычно 1-2 минуты.",
  },
];

export default function DashboardClient({ siteTitle, blocksCount, preset, isFirstTime }: DashboardClientProps) {
  const [openTip, setOpenTip] = useState<number | null>(null);
  const [showSetup, setShowSetup] = useState(isFirstTime);

  const presetName = preset.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: "1100px" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>
          👋 Добро пожаловать!
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          Панель управления вашим сайтом · <strong>{siteTitle}</strong>
        </p>
      </div>

      {/* ── SETUP WIZARD (first time or toggled) ── */}
      {showSetup && (
        <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", borderRadius: "16px", padding: "28px", marginBottom: "28px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px" }}>🚀 Настройте сайт за 5 шагов</h2>
              <p style={{ fontSize: "14px", opacity: 0.85, margin: 0 }}>Следуйте этому плану чтобы запустить сайт быстро и правильно</p>
            </div>
            <button
              onClick={() => setShowSetup(false)}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}
            >
              Скрыть
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {SETUP_STEPS.map((step, i) => (
              <a
                key={step.id}
                href={step.href}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "16px",
                  textDecoration: "none",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  transition: "background 0.15s",
                  backdropFilter: "blur(4px)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{step.icon}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>Шаг {i + 1}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{step.title}</div>
                <div style={{ fontSize: "12px", opacity: 0.8, lineHeight: 1.4 }}>{step.desc}</div>
                <div style={{ fontSize: "11px", opacity: 0.65, lineHeight: 1.4, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "8px", marginTop: "4px" }}>
                  💡 {step.hint}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── STATUS CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { icon: "🎨", label: "Активный шаблон", value: presetName, sub: "Нажмите чтобы сменить", href: "/admin/presets", color: "#6366f1" },
          { icon: "🧱", label: "Блоков на главной", value: String(blocksCount), sub: "Нажмите чтобы редактировать", href: "/admin/editor/home", color: "#22c55e" },
          { icon: "🌐", label: "Сайт", value: "Опубликован", sub: "Открыть в новой вкладке", href: "/de", color: "#3b82f6", external: true },
        ].map((card) => (
          <a
            key={card.label}
            href={card.href}
            target={card.external ? "_blank" : undefined}
            rel={card.external ? "noopener noreferrer" : undefined}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "18px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              transition: "box-shadow 0.15s",
              border: "1px solid #f3f4f6",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)")}
          >
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: `${card.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              {card.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{card.label}</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.value}</div>
              <div style={{ fontSize: "11px", color: card.color, marginTop: "2px" }}>{card.sub} →</div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: 0 }}>⚡ Быстрые действия</h2>
            {!showSetup && (
              <button
                onClick={() => setShowSetup(true)}
                style={{ fontSize: "12px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                📋 План настройки
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {QUICK_ACTIONS.map((action) => (
              <a
                key={action.href}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  textDecoration: "none",
                  border: "1px solid #f3f4f6",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
              >
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{action.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{action.label}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>{action.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── HELP / FAQ ── */}
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px" }}>❓ Частые вопросы</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {HELP_TIPS.map((tip, i) => (
              <div key={i} style={{ border: "1px solid #f3f4f6", borderRadius: "8px", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenTip(openTip === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: openTip === i ? "#f5f3ff" : "#f9fafb",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{tip.q}</span>
                  <span style={{ color: "#6366f1", fontSize: "16px", flexShrink: 0, transform: openTip === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openTip === i && (
                  <div style={{ padding: "10px 14px", background: "#fafafa", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                    {tip.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT'S NEXT ── */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "24px", flexShrink: 0 }}>✅</span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#166534", margin: "0 0 4px" }}>Что сделать прямо сейчас</p>
          <p style={{ fontSize: "13px", color: "#15803d", margin: 0, lineHeight: 1.6 }}>
            1. Перейдите в <a href="/admin/presets" style={{ color: "#166534", fontWeight: 700 }}>Шаблоны</a> и выберите подходящий для вашего бизнеса →
            2. Откройте <a href="/admin/settings" style={{ color: "#166534", fontWeight: 700 }}>Настройки</a> и заполните название, адрес и контакты →
            3. В <a href="/admin/editor/home" style={{ color: "#166534", fontWeight: 700 }}>Редакторе</a> нажмите «Сохранить» — сайт опубликован!
          </p>
        </div>
      </div>
    </div>
  );
}
