# Дизайн-система 1universum (Warm Minimalism 2.0)

> **Роль:** Senior UI/UX Art Director.
> **Стиль:** Warm Minimalism 2.0 (Теплый минимализм нового поколения).

## 1. Concept
Визуальная метафора "Чистый холст". Эмоциональная логика: спокойствие и уверенность. Стиль выбран для создания ощущения премиум-сервиса (Premium Trust).

## 2. Color System (Design Tokens)

| Роль | HEX | Название | Функция |
| :--- | :--- | :--- | :--- |
| **Background** | `#F8F7F4` | Warm White | Основной фон (теплее, чем #FFFFFF) |
| **Surface** | `#FFFFFF` | Pure White | Карточки, модальные окна, сайдбар |
| **Primary Text** | `#1A1A1A` | Near Black | Заголовки, основной текст (WCAG AAA) |
| **Secondary Text**| `#6B6B6B` | Warm Grey | Подписи, описания, метаданные |
| **Border** | `#E5E3DE` | Soft Beige | Границы, разделители |
| **Accent (CTA)** | `#C9A96E` | Premium Gold | Кнопки, ссылки, акценты |
| **Accent Hover** | `#B8941F` | Deep Gold | Наведение |
| **Gradient** | `linear-gradient(135deg, #C9A96E 0%, #E8D5B7 100%)` | Gold Sheen | Градиенты |

## 3. Typography System

| Роль | Шрифт (Google Fonts) | Причина |
| :--- | :--- | :--- |
| **Display** | `Playfair Display` (Serif) | Элегантность, премиум-крючок. Кириллица есть. |
| **Heading** | `Inter` (Sans-Serif) | Читабельность, современный SaaS. |
| **Body** | `Inter` (Sans-Serif) | Идеальная читаемость (en, de, ru). |
| **Mono / Data** | `JetBrains Mono` | Технические данные, код, цены. |

## 4. UI Tokens
- **Border Radius:** `12px` (мягкие углы).
- **Shadow Style:** `soft` (размытые тени).
- **Spacing Feel:** `airy` (много воздуха).
- **Button Style:** `soft` (фоновые кнопки).
- **Grid System:** `modular` (12-колоночная сетка).

## 5. Implementation Notes
- **CSS:** `backdrop-filter: blur(10px)` для стеклянных эффектов.
- **Tailwind:** Кастомные токены в `tailwind.config.ts`.
- **Behavior:** `transition: all 200ms ease-out`. Ховер карточек: `translateY(-4px)`.
- **Mobile:** Минимальная высота тапа 44px, отступы 24px.