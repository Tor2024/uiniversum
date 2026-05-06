# План развития проекта 1universum (SaaS Конструктор Сайтов)

> **ВАЖНО:** Это живой документ. При получении новых задач, дополняй этот файл.
> **Правило:** Перед началом работы ВСЕГДА читать этот файл. При сбое или новом чате — весь контекст здесь.

---

## 🔴 ТЕКУЩИЙ СТАТУС (читать в первую очередь при новом чате)

### Деплой и доступ
- **Сайт:** https://1universum.vercel.app
- **Админка:** https://1universum.vercel.app/admin/login — пароль `181077`
- **GitHub:** https://github.com/Tor2024/uiniversum (ветка master)
- **Vercel Token:** хранится в .env.local (VERCEL_TOKEN) — не коммитить!
- **GitHub Token:** хранится в .env.local (GITHUB_TOKEN) — не коммитить!

### Команды деплоя
```bash
npx next build
vercel --token "VERCEL_TOKEN_FROM_ENV" --yes --prod
git add -A; git commit -m "описание"; git push origin master
```

---

## 🟢 ЧТО УЖЕ СДЕЛАНО

### Инфраструктура
- Next.js 16.2.4, React 19, Tailwind 4, next-intl (de/en/ru)
- Авторизация: bcryptjs, cookie admin_token, middleware защита
- API: /api/auth, /api/auth/logout, /api/contact (сохраняет в JSON), /api/upload, /api/publish (GitHub Octokit), /api/clone-preset, /api/booking
- Все env variables на Vercel: ADMIN_PASSWORD_HASH, ADMIN_TOKEN_HASH, GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_DEFAULT_LANGUAGE, REVALIDATION_SECRET, NODE_ENV

### Админ-панель (полностью на русском)
- Переключатель языка RU/DE/EN в шапке (localStorage)
- Все страницы с подсказками: Dashboard, Шаблоны, Страницы, Медиа, Дизайн, Заявки, Навигация, Настройки, Редактор
- Редактор блоков: показывает список 22 блоков с русскими названиями

### Шаблоны (пресеты)
- Карточки: мини-макет с цветами, шрифтами, услугами, статистикой, отзывом, кнопкой «Применить»
- **Переработанные пресеты (полный немецкий контент + немецкое право):**
  - `restaurant_modern.json` — «Das Feuer» (Dishoom стиль): тёмный #1C1208, золото #C9A96E, Playfair Display. Меню с аллергенами LMIV, MwSt 19%, DSGVO
  - `restaurant_pizza.json` — «Napoli Vera» (Pizzeria Vetri стиль): белый #FAFAF8, красный #D63B1F, DM Serif Display. Storytelling, MwSt 7%/19%
  - `barbershop_classic.json` — «Herr Schmidt» (Bruno's стиль): чёрный #0D0D0D, золото #B8860B, Oswald. 6 услуг, PAngV, политика отмены
  - `spa_center.json` — «Tranquil Spa» (Ocean Gaze стиль): бежевый #F5F0EB, коричневый #A67C52, Cormorant Garamond. HWG, DSGVO

---

## 🔴 СЛЕДУЮЩИЕ ЗАДАЧИ (строго по порядку)

### ЗАДАЧА 1: Живые превью шаблонов (В ПРОЦЕССЕ — 50%)

**Уже создано:**
- `src/app/[lang]/preview/[presetId]/page.tsx` ✅ — роут с preview banner и кнопкой «Использовать»
- `src/components/presets/` ✅ — папка создана

**Осталось создать:**

**A) `src/components/presets/PresetRenderer.tsx`**
Полноценный рендерер сайта из данных пресета. Структура:
```
<PresetSiteNav preset locale />        ← Navbar с логотипом и ссылками
<PresetHero preset locale />           ← Fullscreen hero с overlay
<PresetAbout preset locale />          ← About: image left + text right (или centered)
<PresetServices preset locale />       ← Services/Menu grid
<PresetTestimonials preset locale />   ← Отзывы на тёмном/светлом фоне
<PresetFAQ preset locale />            ← FAQ accordion
<PresetContact preset locale />        ← Контакты + карта
<PresetFooter preset locale />         ← Footer с legal info
```
- Стили: CSS переменные из `preset.design.tokens` (уже генерируются через `generateCssVariables`)
- Google Fonts: динамически из `tokens.fontDisplay` и `tokens.fontBody`
- Layout зависит от `preset.layout.style` (dark_elegant / clean_minimal / dark_masculine)
- Адаптивность: mobile-first

**B) Обновить `src/app/admin/presets/page.tsx`**
Добавить кнопку «Предпросмотр» в каждую карточку:
```tsx
<a href={`/de/preview/${p.id}`} target="_blank">
  👁 Vorschau
</a>
```

**C) Обновить `middleware.ts`**
Добавить `/de/preview/*` в исключения (не требует авторизации):
```ts
if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
  // auth check
}
// /de/preview/* — публичный, проходит через intlMiddleware
```
(Сейчас middleware уже правильный — preview роут публичный, проверить что работает)

---

### ЗАДАЧА 2: UI выбора шрифтов в /admin/design

В `src/app/admin/design/page.tsx` добавить секцию «Шрифты»:
- 20+ Google Fonts сгруппированных: Serif (Playfair Display, Cormorant Garamond, Libre Baskerville...), Sans-Serif (Inter, DM Sans, Raleway...), Display (Oswald, Montserrat, Space Grotesk...), Handwriting (Dancing Script, Lora...)
- При клике: обновляет `data/site.json` через `/api/publish`
- Live preview: текст меняет шрифт через CSS переменную без перезагрузки

---

### ЗАДАЧА 3: Продолжить пресеты (осталось 24 из 28)

Порядок (по референсам пользователя):
1. `beauty_salon.json` — aestheticbarnj.com стиль: белый #FDFCFB, роза #D4A0A0, Cormorant Garamond + Raleway. Split-screen hero, HWG
2. `fitness_gym.json` — fhittingroom.com стиль: чёрный #0A0A0A, оранжевый #FF4500, Montserrat ExtraBold. Видео-фон, HIIT факты
3. `coffee_shop.json` — thecoffeemovement.com стиль: тёплый белый #F7F3EE, кофейный #2C1A0E, Libre Baskerville. Ультраминимализм
4. `bakery.json` — napoleonsbakery.com стиль: кремовый #FFF8F0, шоколад #3D2B1F, Playfair Display + Nunito
5. `yoga_studio.json` — powerhousepilates.ca стиль: белый #FAFAF8, тёмно-синий #1A1A2E, розовый #E8A0BF, Raleway
6. `dental_clinic.json` — dentalia.com стиль: белый #FFFFFF, синий #003087, Inter. HWG строго
7. `law_firm.json` — alazazi.com стиль: тёмно-синий #0F1923, золото #C9A96E, Libre Baskerville. BRAO
8. `real_estate.json` — luxuryportfolio.com стиль: белый #FAFAF8, золото #8B7355, Cormorant Garamond. MaBV
9. `fashion_store.json` — juste.uk стиль: белый #FFFFFF, чёрный #1A1A1A, DM Sans. Widerrufsrecht 14 Tage
10. `jewelry_store.json` — Maison Doree стиль: кремовый #F5F0E8, антик-золото #C9A96E, Cormorant Garamond
11. `boutique_hotel.json` — numberonebruton.com стиль: тёмный дуб #2C2416, пергамент #F5EDD8, Playfair Display. Beherbergungsrecht
12. `travel_agency.json` — тёмно-синий #0A2342, оранжевый #F5A623, Montserrat. §§ 651a ff. BGB
13. `photographer_portfolio.json` — ivoryfayre.co.uk стиль: чёрный #1A1A1A, золото #C9A96E, Cormorant Garamond
14. `wedding_photographer.json` — daniloandsharon.com стиль: кремовый #F8F4EF, роза #D4A0A0, Playfair Display Italic
15. `musician.json` — чёрный #0A0A0A, фиолетовый #7B2FBE, Space Grotesk. GEMA
16. `personal_blog.json` — 121-salon.com стиль: белый #FAFAF8, шалфей #6B9E78, Lora. Impressum обязателен для блогов
17. `online_courses.json` — тёмно-синий #0F172A, индиго #6366F1, Inter. Fernunterrichtsschutzgesetz
18. `saas_startup.json` — secgra.com стиль: тёмно-синий #0A0F1E, cyan #00D4FF, Inter. DSGVO
19. `web_agency.json` — adaline.ai стиль: чёрный #0D0D0D, фиолетовый #A855F7, Syne + Inter
20. `business_consulting.json` — тёмно-синий #1A2332, золото #C9A96E, Libre Baskerville
21. `construction_company.json` — чёрный #1A1A1A, оранжевый #F5A623, Montserrat. VOB
22. `auto_service.json` — чёрный #0D0D0D, красный #E63946, Oswald. KFZ-Recht
23. `logistics.json` — синий #003087, оранжевый #F5A623, Montserrat. CMR, GüKG
24. `kindergarten.json` — коралловый #FF6B6B, бирюзовый #4ECDC4, Nunito. KiTaG, DSGVO для детей

---

### ЗАДАЧА 4: Полноценный рендерер блоков

Переписать `src/components/blocks/renderer.tsx`:
- Реализовать все 22 типа блоков с реальными стилями
- Каждый блок использует CSS переменные из токенов пресета
- Адаптивность mobile-first

---



---

## 1. Концепция проекта
Это SaaS-конструктор сайтов "One-Click Deploy".
- **Суть:** Пользователь форкает репозиторий, деплоит на Vercel и получает свой экземпляр конструктора для создания **одного** сайта.
- **Языки интерфейса:** Немецкий (de - основной), Английский (en), Русский (ru).
- **Логика:** Пользователь вводит пароль -> попадает в конструктор -> выбирает пресет ИЛИ строит сайт пошагово (визард) -> редактирует -> нажимает "Деплой" -> сайт обновляется через GitHub API.
- **Секретный вход:** После деплоя сайт работает как обычный сайт, но есть скрытый вход (например, `/admin`) для возврата в конструктор.

---

## 2. Статус реализации (Что уже есть)

### ✅ Сделано (База)
- [x] **Next.js 16.2.4** (App Router, React 19).
- [x] **Интернационализация:** Настроен `next-intl` (de, en, ru). Middleware для маршрутизации `[lang]`.
- [x] **Админ-панель (Базовая):** Структура `src/app/admin/`, лейаут с сайдбаром (Dashboard, Pages, Media, Design, Forms, Settings, Menu).
- [x] **Авторизация:** Вход по паролю (`bcryptjs`), защита роутов через `middleware.ts` (проверка cookie `admin_token`).
- [x] **Система данных (JSON):** Контент хранится в `data/` (site.json, navigation.json, pages/*.json).
- [x] **Дизайн-система:** `src/lib/design-tokens.ts`. Генерация CSS-переменных из JSON (`generateCssVariables`).
- [x] **Публикация:** `POST /api/publish` сохраняет JSON-файлы в GitHub через Octokit.
- [x] **Загрузка медиа:** `POST /api/upload` (сохранение в `public/media/`).
- [x] **Контактная форма:** `POST /api/contact` (Nodemailer + Telegram Bot).
- [x] **Реестр блоков:** `src/lib/blocks-registry.ts` (22 типа блоков: hero, text, gallery, booking, menu_food и т.д.).
- [x] **Пресеты:** Есть готовые JSON-конфигурации в `data/presets/` (fashion_store, restaurant_modern, barbershop, fitness и др.).

### ❌ Что нужно сделать (Критический путь)

#### Этап 1: Визуальный выбор пресетов (Каталог)
- [ ] **Страница каталога:** Создать страницу `/admin/presets` (или `/setup`), где отображаются 30 пресетов.
- [ ] **Превью:** Для каждого пресета нужна карточка с визуальным превью (статическое изображение или интерактивный iframe).
- [ ] **Полные пресеты:** Каждый из 30 пресетов должен быть **полностью заполнен** (тексты, картинки, контекст, примеры контента), а не содержать пустые поля.
- [ ] **Соответствие законам (DE):** Все 30 пресетов должны строго соответствовать законам Германии (Impressum, Datenschutz, GDPR). Шаблоны должны включать готовые юридические тексты на немецком.
- [ ] **Логика выбора:** При нажатии "Выбрать" — копирование данных из `data/presets/[name].json` в `data/site.json` и `data/pages/`.

#### Этап 2: Пошаговый визард (Wizard) для "Своего варианта"
Если пользователь не выбрал пресет, запускается визард с подсказками на выбранном языке.
- [ ] **Шаг 1: Тип сайта** (Магазин, Ресторан, Услуги и т.д.).
- [ ] **Шаг 2: Структура** (Меню, блоки, навигация) с примерами.
- [ ] **Шаг 3: Дизайн** (Цвета, шрифты — *с live-предпросмотром*).
- [ ] **Шаг 4: Контент** (Заполнение главной страницы с подсказками).
- [ ] **Шаг 5: Контакты и SEO.**

#### Этап 3: Улучшение редактора (Page Builder)
- [ ] **Рендеринг всех блоков:** Сейчас `page.tsx` рендерит только `hero`. Нужно реализовать динамический рендеринг всех 22 типов блоков из `blocks-registry.ts`.
- [ ] **Drag-and-Drop:** Реализовать сортировку блоков в админке (уже подключен `@dnd-kit`).
- [ ] **Визуальный редактор:** Обновить `src/app/admin/editor/[slug]/page.tsx` для полноценного редактирования.

#### Этап 4: Бизнес-логика (Контекстные функции)
Админ-панель должна менять функционал в зависимости от типа сайта (пресета).

**4.1. Barbershop / Beauty Salon (Запись)**
- [ ] **Админ:** Календарь слотов, управление услугами и ценами, история клиентов.
- [ ] **Клиент:** Выбор услуги, выбор времени, подтверждение (Telegram/Email).
- [ ] **Блок:** `booking_form` (логика есть, нужна интеграция с календарем).

**4.2. Fashion Store (Магазин)**
- [ ] **Админ:** Каталог товаров (цена, фото, наличие), заказы, клиенты.
- [ ] **Клиент:** Корзина, оформление заказа, личный кабинет.
- [ ] **Блоки:** `cards_grid` (товары), `pricing` (цены).

**4.3. Restaurant (Ресторан)**
- [ ] **Админ:** Управление меню (категории, блюда, "Скрыть/Показать"), статусы заказов (Новый/Готовится/Готов).
- [ ] **Клиент:** Просмотр меню, корзина, оформление заказа на стол.
- [ ] **Блок:** `menu_food`.

**4.4. Fitness / Yoga (Запись на тренировки)**
- [ ] **Админ:** Расписание залов, учет абонементов.
- [ ] **Клиент:** Запись на конкретный класс.

#### Этап 5: Деплой и "Скрытый вход"
- [ ] **Кнопка "Деплой":** Оптимизировать процесс коммита в GitHub (и триггер Vercel).
- [ ] **Скрытый вход:** Настроить `/admin` или специальный URL на готовом сайте для возврата в конструктор без доступа к GitHub.

#### Этап 6: Premium Enhancements (Фичи для премиум-продукта)
- [ ] **Live Preview:** Мгновенный предпросмотр изменений без перезагрузки (SSE/WebSocket).
- [ ] **Валидация данных:** Внедрить Zod для строгой проверки схем JSON (пресеты, блоки, формы).
- [ ] **UX/UI:** Интеграция Framer Motion (анимации), Lucide Icons, реализация Dark Mode для админки.
- [ ] **SEO Pro:** Генерация sitemap.xml, robots.txt, визуальный редактор мета-тегов (Google Snippet Preview).
- [ ] **Оптимизация медиа:** Авто-ресайз и конвертация в WebP/AVIF через Sharp при загрузке.
- [ ] **AI-ассистент:** Интеграция LLM для генерации контента (тексты, slogans) на базе описания бизнеса.
- [ ] **Аналитика:** Простые графики посещаемости в Dashboard (интеграция с GA или self-hosted).
- [ ] **Subscription Tiers:** Разделение функций на Free/Pro/Business (доступ к коду, Webhooks).
- [ ] **Мультиязычный редактор:** Удобный UI для переключения языков внутри редактора блоков (не ручной JSON).

#### Этап 7: Реальный Премиум Опыт (Для пользователя)
- [ ] **Smart Onboarding:** "1-Click Setup" — ввод названия и сферы -> AI (LLM) сам собирает сайт (тексты, картинки Unsplash, структура).
- [ ] **Варианты блоков (Variants):** Для каждого из 22 блоков сделать 3-4 визуальных стиля (например, Hero "С видео", "С формой", "Минимализм").
- [ ] **Unsplash/Pexels API:** Поиск и вставка стоковых фото прямо в редакторе без выхода на другие сайты.
- [ ] **Version History:** Кнопка "Undo" и выбор старых версий сайта из истории GitHub (защита от случайных удалений).
- [ ] **Custom Domain:** Пошаговая инструкция и проверка DNS для подключения своего домена (White Label).
- [ ] **Legal Automation (DE):** Автогенерация Impressum и Datenschutz на основе данных пользователя (без ручного копирования юридических текстов).
- [ ] **Scroll Animations:** Оживление блоков (Framer Motion) — сайт выглядит дорого уже при скролле.
- [ ] **Client Analytics:** Встроенный简单的 счетчик конверсий (сколько клиентов пришло через форму/кнопку) прямо в Dashboard.

#### Этап 8: Внедрение дизайн-системы (Warm Minimalism 2.0)
- [ ] **Обновить Tailwind Config:** Добавить кастомные цвета (Premium Gold, Warm White и др.) и шрифты (Playfair Display, Inter, JetBrains Mono).
- [ ] **Цветовая архитектура:** Интегрировать токены из `DESIGN_SYSTEM.md` в `src/lib/design-tokens.ts` и генерацию CSS переменных.
- [ ] **Типографическая система:** Обновить компоненты для использования Display/Heading/Body/Mono ролей.
- [ ] **UI Токены:** Реализовать Border Radius (12px), Soft Shadows, Airy Spacing, Soft Buttons.
- [ ] **Реализация эффектов:** Добавить `backdrop-filter: blur(10px)` для стеклянных элементов, переходы 200ms ease-out.
- [ ] **Мобильная адаптация:** Обеспечить тап-зоны 44px, сохранение "воздуха" на малых экранах.
- [ ] **Применение стиля ко всем компонентам:** Обновить админ-панель, каталог пресетов, страницы редактора в стиле Warm Minimalism 2.0.

#### Этап 9: Критическая инфраструктура (Только GitHub + Vercel)
- [ ] **Media Storage (GitHub Only):** Сохранение медиа (`public/media/`) ТОЛЬКО через коммит в GitHub (Octokit). Vercel Serverless имеет **read-only** систему, поэтому локальная загрузка не работает. 
    *   *Решение:* Файл загружается через `/api/upload`, конвертируется в Base64 и коммитится в репо (как в текущем `api/publish`).
    *   *Лимиты:* GitHub Free (100MB/файл, 1GB/репо). Для больших файлов использовать Sharp (WebP) перед коммитом.
- [ ] **Error Handling:** Глобальный обработчик ошибок (Error Boundary) и страницы `error.tsx` / `not-found.tsx` для админки и фронта.
- [ ] **Validation & Security:** Санитизация входящих данных (защита от XSS) в API (upload, contact, publish).
- [ ] **Testing:** Настройка Jest/Playwright для критических путей (Auth, Publish, Upload).
- [ ] **Logging:** Система логирования ошибок (например, Sentry или простой лог-файл) для отладки на продакшене.

#### Этап 10: Business-Ready "Под ключ"
- [ ] **Payment Integration:** Интеграция Stripe/PayPal для "Fashion Store" (корзина) и "Restaurant" (оплата заказа).
- [ ] **User Onboarding Config:** Визард первой настройки, сохраняющий `TELEGRAM_CHAT_ID` и `CONTACT_EMAIL_TO` через UI в `data/site.json` (без правки `.env`).
- [ ] **HTML Email Templates:** Красивые письма (подтверждение заказа, уведомление админа) с дизайном сайта instead of plain text.
- [ ] **Admin Notifications:** Визуальный счетчик новых заявок (badge) в сайдбаре админки.
- [ ] **SEO Runtime:** Генерация `sitemap.xml` и `robots.txt` через Next.js API/Route Handlers на основе `navigation.json`.

#### Этап 11: Защита и Полировка (Security & Polish)
- [ ] **Rate Limiting:** Защита API роутов (`/api/contact`, `/api/booking`) от спама (библиотека `express-rate-limit` или аналоги).
- [ ] **Favicon & Logo:** Удобная загрузка логотипа в визарде (авто-генерация разных размеров для Apple Touch Icon и т.д.).
- [ ] **Accessibility (a11y):** Проверка контрастности (WCAG AA) и навигации с клавиатуры для всех блоков.
- [ ] **Final Polish:** Анимации появления блоков при скролле (Framer Motion) на клиентской части сайта.

#### Этап 12: Синхронизация пресетов с Единой Дизайн-системой (Warm Minimalism 2.0)
- [ ] **Font Unification:** Обновить все 30 пресетов. Заменить шрифты (Lato, Oswald, Open Sans) на единую систему (**Playfair Display**, **Inter**, **JetBrains Mono**), описанную в `DESIGN_SYSTEM.md`.
- [ ] **Color Alignment:** Привести цвета пресетов (`colorAccent`, `colorBackground`, etc.) к палитре Premium Gold (`#C9A96E`) и Warm White (`#F8F7F4`), либо четко определить, когда пресет имеет право на свою цветовую схему (например, Barbershop Classic может быть темным).
- [ ] **Inheritance Logic & CSS Generation:**
    *   **База:** `src/lib/design-tokens.ts` содержит функцию `generateCssVariables(tokens)`.
    *   **Логика:** При загрузке сайта: 1. Читаем `data/site.json` -> 2. Берем `design.tokens` -> 3. Генерируем CSS переменные -> 4. Вставляем в `<head>` через `dangerouslySetInnerHTML`.
    *   **Результат:** Если выбран пресет "Barbershop", его токены (фон `#1A1A1A`) перезаписывают базовые. Если пресета нет — используется `warm_minimalism`.
- [ ] **Default View (Стандартный вид по умолчанию):**
    *   Если `site.json` -> `design.preset` = `warm_minimalism` (или пусто), подключаются стили из `DESIGN_SYSTEM.md`.
    *   Сайт не должен выглядеть "сломанным" или пустым. Он всегда имеет вид Warm Minimalism 2.0.

#### Этап 13: Форматирование текста и Контент-система
- [ ] **Rich Text Editor:** Реализовать WYSIWYG редактор для полей `text` и `desc` в блоках (поддержка **Bold**, *Italic*, ссылки, списки).
- [ ] **CSS Typography Classes:** В `src/app/[lang]/page.module.css` или Tailwind добавить классы:
    *   `.text-display` (Playfair Display, 72px, line-height 1.2).
    *   `.text-body` (Inter, 17px, line-height 1.7).
    *   `.text-mono` (JetBrains Mono, для цен/дат).
- [ ] **Localization Formatting:** Правила для разных языков:
    *   **DE:** Кавычки „..." , длинное тире (–).
    *   **RU:** Кавычки «...», тире (—).
    *   **EN:** Кавычки "...", тире (—).
- [ ] **Content Automation:** При выборе пресета, контент (Slogans, About) должен автоматически форматироваться под выбранный язык (через `site.json` -> `meta.language`).

#### Этап 14: Полная реализация MVP (Coding Steps)
*Порядок написания кода для запуска рабочего прототипа.*

- [ ] **Routing:** Создать маршруты `src/app/admin/presets/page.tsx`, `src/app/admin/editor/[slug]/page.tsx`, `src/app/admin/setup/page.tsx`. 
- [ ] **Component: PageRenderer:** Создать `src/components/blocks/renderer.tsx`.
    *   Функция `renderBlock(block, locale)` которая на основе `block.type` рендерит нужный компонент (Hero, Text, Gallery и т.д.).
    *   Импортируем все 22 компонента блоков. 
- [ ] **Data Fetching:** Обновить `src/app/[lang]/page.tsx`, чтобы он брал `data/pages/home.json` и прогонял через `PageRenderer`. 
- [ ] **UI: Presets List:** Создать `src/app/admin/presets/page.tsx`. Читать `data/presets/*.json`, выводить карточки с кнопкой "Выбрать". 
- [ ] **Logic: Clone Preset:** API `POST /api/clone-preset`. При выборе пресета, копировать файл из `data/presets/` в `data/site.json` и `data/pages/home.json`. 
- [ ] **Component: BlockEditor:** Обновить `src/app/admin/editor/[slug]/page.tsx`. Реализовать вкладки: "Библиотека блоков" (drag), "Холст" (drop), "Настройки" (редактирование JSON). 
- [ ] **Styling:** Применить `DESIGN_SYSTEM.md` к админке (цвета, шрифты Playfair/Inter). 

#### Этап 15: Production Readiness (Единая система, Удобство, Надежность, Защита, Бесплатно, Документация)
*Гарантия того, что все элементы проекта работают как единый, надежный, защищенный и бесплатный продукт с подробным описанием.*

- [ ] **Единый Дизайн (Unified Design):**
    *   **Проверка:** Все 30+ страниц и компонентов (`src/app/*`, `src/components/*`) должны использовать токены из `DESIGN_SYSTEM.md` (Warm Minimalism 2.0). 
    *   **Шрифты:** Playfair Display (Display), Inter (Body/Heading), JetBrains Mono (Mono) везде. 
    *   **Цвета:** Premium Gold (`#C9A96E`), Warm White (`#F8F7F4`) везде. 
    *   **UI Tokens:** Border Radius 12px, Soft Shadows, Airy Spacing. 

- [ ] **Удобство (UX) и Доступность (a11y):**
    *   **Tooltips:** Добавить подсказки (tooltip) ко всем кнопкам и иконкам в админке. 
    *   **Mobile:** Проверить Touch Targets (min 44px) и отступы на мобильных. 
    *   **WCAG AA:** Проверить контрастность текста и фонов (минимум 4.5:1). 

- [ ] **Надежность (Reliability):**
    *   **Error Boundaries:** Обновить `src/app/error.tsx` и `src/app/not-found.tsx` (красивые страницы ошибок). 
    *   **Fallbacks:** Если шрифт не загрузился — системные шрифты. Если картинка не загрузилась — плейсхолдер. 
    *   **Loading States:** Скелетоны (Skeletons) при загрузке данных. 

- [ ] **Защита (Security):**
    *   **Input Sanitization:** Проверить все API (`/api/contact`, `/api/upload`, `/api/publish`) на XSS и инъекции. 
    *   **Rate Limiting:** Защита форм от спама (библиотека `express-rate-limit`). 
    *   **HTTPS:** Vercel предоставляет бесплатно. Проверить, что админка и сайт работают по HTTPS. 

- [ ] **Бесплатность (Free Tiers Check):**
    *   **GitHub:** Убедиться, что размер репо < 1GB, файлы < 100MB. 
    *   **Vercel:** Трафик < 100GB/мес, сборки < 1000/мес. 
    *   **Telegram/Gmail:** He ожидать оплаты. 
    *   **Stripe:** По умолчанию "Оплата наличными". Stripe — опционально (комиссия ~2.9%). 

- [ ] **Подробное описание настройки (Documentation):**
    *   **ENV_SETUP.md:** Уже создан. Проверить актуальность ссылок. 
    *   **README.md:** Создать/Обновить. Инструкция "Как развернуть за 5 минут". 
    *   **Tooltips в UI:** В админке добавить "?" иконки с подсказками "Как это работает?". 

---

## 3. Структура файлов (Напоминание)
- `data/site.json` — Мета, дизайн, SEO.
- `data/presets/*.json` — Шаблоны (30 штук).
- `src/app/[lang]/page.tsx` — Главная (Рендер блоков).
- `src/app/admin/*` — Все страницы админки.
- `src/lib/blocks-registry.ts` — Типы блоков.
- `src/lib/design-tokens.ts` — Дизайн-система.
- `.env.local` — Пароли, GitHub токены, Telegram.

---

## 4. Технический стек
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4.
- **Backend/API:** Next.js Route Handlers (Octokit, Nodemailer).
- **State/Data:** JSON files -> GitHub (Single Source of Truth).
- **UI Libs:** @dnd-kit (drag-and-drop), next-intl (i18n).

---

## 5. Текущие задачи (To-Do List)
1. [ ] Создать страницу каталога пресетов (`/admin/presets`).
2. [ ] Реализовать динамический рендеринг всех блоков на фронте (не только hero).
3. [ ] Добавить live-предпросмотр шрифтов и цветов в `/admin/design`.
4. [ ] Реализовать бизнес-логику для "Barbershop" (календарь записи).