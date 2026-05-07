# План развития проекта 1universum (SaaS Конструктор Сайтов)

> **ВАЖНО:** Это живой документ. При получении новых задач, дополняй этот файл.
> **Правило:** Перед началом работы ВСЕГДА читать этот файл. При сбое или новом чате — весь контекст здесь.

---

## ТЕКУЩИЙ СТАТУС (читать в первую очередь при новом чате)

### Деплой и доступ
- **Сайт:** https://1universum.vercel.app
- **Админка:** https://1universum.vercel.app/admin/login — пароль `181077`
- **GitHub:** https://github.com/Tor2024/uiniversum (ветка master)
- **Vercel:** автодеплой из master через GitHub
- **Vercel Token:** хранится в .env.local (VERCEL_TOKEN) — не коммитить!
- **GitHub Token:** хранится в .env.local (GITHUB_TOKEN) — не коммитить!

### Команды деплоя
```bash
npx next build
git add -A && git commit -m "описание" && git push origin master
```

---

## ЧТО УЖЕ СДЕЛАНО

### Инфраструктура
- Next.js 16.2.4, React 19, Tailwind 4, next-intl (de/en/ru)
- Авторизация: bcryptjs, cookie admin_token, middleware защита
- API: /api/auth, /api/auth/logout, /api/contact, /api/upload, /api/publish (GitHub Octokit), /api/clone-preset, /api/booking
- Все env variables на Vercel

### Админ-панель
- Все страницы: Dashboard, Шаблоны, Страницы, Медиа, Дизайн, Заявки, Навигация, Настройки, Редактор
- Редактор блоков: показывает список 22 блоков (UI-заглушка, не работает полноценно)

### Живые превью шаблонов (ЗАДАЧА 1 — ВЫПОЛНЕНА)
- `src/components/presets/PresetRenderer.tsx` — полный рендерер сайта из JSON пресета
  - Секции: Nav, Hero, About, Services/Menu, Testimonials, FAQ, Contact, Footer
  - CSS переменные из токенов, 3 языка (de/en/ru), адаптивность
- `src/app/[lang]/preview/[presetId]/page.tsx` — роут превью с баннером
- Кнопка "Vorschau" в каждой карточке /admin/presets

### Пресеты — статус по образцам

#### Переделаны по реальным сайтам-образцам:
- `barbershop_classic.json` — по brunosbarbers.com
  - Announcement bar, dual hero, quick links (4 кнопки)
  - 6 service tabs с детальными прайс-листами
  - Hairstyle Guide (6 стилей), Products с табами
  - Who We Are (3 фото), Vision, Core Values, Branches (3 филиала), Newsletter
- `beauty_salon.json` — по aestheticbarnj.com
  - Announcement bar "$10/UNIT TOX", hero "FEEL CONFIDENT. LOOK RADIANT."
  - 3 категории услуг (Skin Care / Wellness / Injectables)
  - Credentials bar, body map, SYLFIRM-X spotlight, hair restoration
  - 250+ Google reviews, medical skincare section, Meet Founder, consultation CTA
- `spa_center.json` — по oceangazebeauty.co.uk
  - Coastal/calm стиль, marquee text, 5-star badge
  - 3 core specialties (Massage+MLD / Facials / Brows+Lashes)
  - Featured new treatment (Maderotherapy), Why Choose Us (3 cards)
  - Meet Therapist (Lea), FAQ accordion, coastal CTA

#### Созданы с нуля (хороший контент, но без визуального образца):
- `fitness_gym.json` — по fhittingroom.com: kettlebell-фокус, "Training DONE RIGHT", 3 варианта (Intro/Studio/Home), 4 HIIT-факта, макс. 8 человек
- `coffee_shop.json` — по thecoffeemovement.com: ультраминимализм, 2 локации, только часы
- `bakery.json` — по napoleonsbakery.com: "Wir machen Koeln suesser!", custom cakes главный продукт, "Was backen wir gerade?"
- `yoga_studio.json` — по powerhousepilates.ca: онлайн-студия, 19EUR/мес, 3 signature серии (Kern/Stark/Flow Pilates)
- `dental_clinic.json` — по dentalia.com: 360-диагностика бесплатно, Google-карусель отзывов
- `law_firm.json` — по alazazi.com: тёмный фон, stats bar, 6 practice areas, "Besprechen Sie vertraulich" CTA
- `real_estate.json` — по luxuryportfolio.com: "Die Kunst, schoen zu leben", lifestyle коллекции

#### Ещё не переделаны по образцам (нужны скриншоты):
- `restaurant_modern.json` — образец: dishoom.com (скриншоты есть в public/media/references/)
- `restaurant_pizza.json` — образец: pizzeriavetri.com (скриншоты есть)

#### Созданы базово (7 штук, первая партия):
- `beauty_salon`, `fitness_gym`, `coffee_shop`, `bakery`, `yoga_studio`, `dental_clinic`, `law_firm`, `real_estate`
  (все переделаны по образцам — см. выше)

#### Ещё не созданы (17 из 28 оставшихся):
- `fashion_store`, `jewelry_store`, `boutique_hotel`, `travel_agency`
- `photographer_portfolio`, `wedding_photographer`, `musician`, `personal_blog`
- `online_courses`, `saas_startup`, `web_agency`, `business_consulting`
- `construction_company`, `auto_service`, `logistics`, `kindergarten`
- `non_profit`, `interior_designer`, `local_classifieds`, `coworking_space`

### Скриншоты образцов (в public/media/references/)
- brunosbarbers.com — 5 файлов (ИСПОЛЬЗОВАН для barbershop_classic)
- aestheticbarnj.com — 4 файла (ИСПОЛЬЗОВАН для beauty_salon)
- oceangazebeauty.co.uk — 7 файлов (ИСПОЛЬЗОВАН для spa_center)
- fhittingroom.com — 6 файлов (ИСПОЛЬЗОВАН для fitness_gym)
- thecoffeemovement.com — 5 файлов (ИСПОЛЬЗОВАН для coffee_shop)
- napoleonsbakery.com — 3 файла (ИСПОЛЬЗОВАН для bakery)
- powerhousepilates.ca — 5 файлов (ИСПОЛЬЗОВАН для yoga_studio)
- dishoom.com — 4 файла (НЕ ИСПОЛЬЗОВАН — нужно переделать restaurant_modern)
- pizzeriavetri.com — 3 файла (НЕ ИСПОЛЬЗОВАН — нужно переделать restaurant_pizza)
- brucegitlinlaw.com — 4 файла (НЕ ИСПОЛЬЗОВАН — нужно переделать law_firm)
- dentalia.com — 4 файла (ИСПОЛЬЗОВАН для dental_clinic)

---

## СЛЕДУЮЩИЕ ЗАДАЧИ (строго по порядку)

### ЗАДАЧА A: Переделать restaurant_modern по dishoom.com
- Образец: dishoom.com — тёмный, storytelling "love letter to Bombay"
- Структура: hero с цитатой, "Peruse Menus/Book/Store" секция, locations list
- Меню: категории с описаниями, seasonal specials, recipes section
- Store section, awards, newsletter
- Скриншоты: public/media/references/www.dishoom.com_*

### ЗАДАЧА B: Переделать restaurant_pizza по pizzeriavetri.com
- Образец: pizzeriavetri.com — "4 days. 4 ingredients.", неаполитанская пицца
- Структура: hero с storytelling о тесте, "The Dough" секция, seasonal items
- Меню: Antipasti / Salads / Pizza (Neapolitan 12" + Metro 28") / Calzone / Pizza Kits
- Homemade limoncello секция
- Скриншоты: public/media/references/www.pizzeriavetri.com_*

### ЗАДАЧА C: Переделать law_firm по brucegitlinlaw.com
- Образец: brucegitlinlaw.com — скриншоты есть, сайт не открывается через fetch
- Скриншоты: public/media/references/brucegitlinlaw.com_*

### ЗАДАЧА D: Создать следующие 7 пресетов (вторая партия)
Порядок:
1. `fashion_store` — juste.uk стиль
2. `jewelry_store` — Maison Doree стиль
3. `boutique_hotel` — numberonebruton.com стиль
4. `travel_agency` — тёмно-синий/оранжевый
5. `photographer_portfolio` — ivoryfayre.co.uk стиль
6. `wedding_photographer` — daniloandsharon.com стиль
7. `musician` — чёрный/фиолетовый, GEMA

### ЗАДАЧА E: Рабочий редактор блоков (/admin/editor)
КРИТИЧНО — сейчас редактор это заглушка. Нужно:
- Кнопка "Изменить" открывает форму редактирования полей блока
- Кнопка "Удалить" удаляет блок
- Drag-and-drop порядка блоков (dnd-kit уже подключён)
- Кнопка "Опубликовать" сохраняет через /api/publish
- Добавление нового блока из библиотеки

### ЗАДАЧА F: UI выбора шрифтов в /admin/design
- 20+ Google Fonts сгруппированных по категориям
- Live preview без перезагрузки
- Сохранение через /api/publish

---

## Технический стек
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend/API:** Next.js Route Handlers (Octokit, Nodemailer)
- **State/Data:** JSON files -> GitHub (Single Source of Truth)
- **UI Libs:** @dnd-kit (drag-and-drop), next-intl (i18n)

## Структура файлов
- `data/site.json` — Мета, дизайн, SEO
- `data/presets/*.json` — Шаблоны (28+ штук)
- `src/app/[lang]/page.tsx` — Главная (Рендер блоков)
- `src/app/admin/*` — Все страницы админки
- `src/components/presets/PresetRenderer.tsx` — Рендерер превью
- `src/lib/blocks-registry.ts` — Типы блоков
- `src/lib/design-tokens.ts` — Дизайн-система
- `public/media/references/` — Скриншоты сайтов-образцов
- `.env.local` — Пароли, GitHub токены, Telegram
