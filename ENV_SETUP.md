# Настройка окружения (.env.local) — Полное руководство

Этот файл содержит инструкции по получению всех необходимых ключей и токенов для работы проекта 1universum.

> **ВАЖНО:** Ни в коем случае не коммитьте файл `.env.local` в GitHub! Он добавлен в `.gitignore`.

---

## 1. GitHub (Обязательно для работы конструктора)

Система сохраняет изменения (публикацию сайта) напрямую в ваш репозиторий через GitHub API.

1.  Перейдите на [GitHub Developer Settings](https://github.com/settings/tokens?type=beta).
2.  Нажмите **"Generate new token (Classic)"**.
3.  Настройте токен:
    *   **Note:** `1universum-deploy-token`
    *   **Expiration:** `No expiration` (или на год).
    *   **Scopes (галочки):** Выберите `repo` (полный доступ к репозиториям). Это разрешит чтение и запись файлов.
4.  Нажмите **"Generate token"** и **скопируйте** сгенерированный токен (он показывается только один раз!).

**Впишите в `.env.local`:**
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=ВашGitHubUsername
GITHUB_REPO=имя-репозитория
GITHUB_BRANCH=main
```

---

## 2. Vercel (Хостинг и Деплой)

Проект задеплоен на Vercel. Чтобы сайт обновлялся автоматически после сохранения в конструкторе, убедитесь, что Vercel подключен к вашему GitHub репозиторию.

1.  Зайдите на [Vercel Dashboard](https://vercel.com/dashboard).
2.  Выберите ваш проект -> **Settings** -> **Git**.
3.  Убедитесь, что "Production Branch" стоит на `main` (или той, которую вы указали в `GITHUB_BRANCH`).
4.  **Домен:** В разделе "Domains" можно привязать свой домен.

**Впишите в `.env.local`:**
```env
# Обычно не требуется токен для самого Vercel, если он сам деплоит при коммите.
# Но если вы используете Vercel API для чего-то специфического:
# VERCEL_TOKEN=xxxxxxxx
```

---

## 3. Telegram Bot (Уведомления о заказах)

Получайте уведомления о новых заявках прямо в Telegram.

1.  В Telegram найдите пользователя **@BotFather**.
2.  Отправьте команду `/newbot`.
3.  Следуйте инструкциям: придумайте имя и username (должен оканчиваться на `Bot`, например `MySiteBot`).
4.  BotFather выдаст **HTTP API Token**. Скопируйте его.
5.  **Получение Chat ID:**
    *   Добавьте вашего бота в группу или начните с ним чат.
    *   Отправьте боту сообщение `/start`.
    *   Перейдите по ссылке: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
    *   Найдите в JSON ответе поле `"chat":{"id":...}`. Это и есть `TELEGRAM_CHAT_ID`.

**Впишите в `.env.local`:**
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=123456789
```

---

## 4. Gmail / Google SMTP (Отправка Email)

Используется для отправки писем клиентам и уведомлений админу.

**Вариант А: Gmail (Пароль приложения)**
1.  Включите **Двухфакторную аутентификацию** в Google Account.
2.  Перейдите в [App Passwords](https://myaccount.google.com/apppasswords).
3.  Создайте новый пароль для "Mail" -> "Other (Custom name)" -> `1universum`.
4.  Скопируйте 16-значный пароль (без пробелов).

**Впишите в `.env.local`:**
```env
GMAIL_USER=vasiliy.pupkin@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
CONTACT_EMAIL_FROM=vasiliy.pupkin@gmail.com
CONTACT_EMAIL_TO=vasiliy.pupkin@gmail.com
```

---

## 5. Оплата (Stripe / PayPal) — Опционально

По умолчанию в пресетах (Fashion Store, Restaurant) стоит **"Оплата наличными при получении" (Cash)**.
Если вы хотите принимать карты:

### Stripe (Рекомендуется)
1.  Зарегистрируйтесь на [Stripe](https://stripe.com).
2.  В панели управления перейдите в **Developers** -> **API keys**.
3.  Скопируйте **Publishable key** (pk_test_...) и **Secret key** (sk_test_...).
4.  Вставьте ключи в настройки сайта через админ-панель или `.env`.

**Впишите в `.env.local` (если используете серверную часть):**
```env
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### PayPal
1.  Зарегистрируйтесь в [PayPal Developer](https://developer.paypal.com).
2.  Создайте "Sandbox Account" для тестов и "Live Account" для реальных денег.
3.  Получите Client ID и Secret.

---

## 6. Пароль Администратора

Хешируйте пароль через bcrypt для безопасности.

**Как получить хеш:**
Запустите в терминале (или Node.js консоли):
```bash
node -e "const bcrypt = require('bcryptjs'); const pwd = 'ВАШ_ПАРОЛЬ'; bcrypt.hash(pwd, 10).then(hash => console.log(hash));"
```

**Впишите в `.env.local`:**
```env
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_TOKEN_HASH=любая-сложная-строка-для-cookie
```

---

## 7. Unsplash API (Для стоковых фото)

Позволяет вставлять красивые фото прямо в редакторе.

1.  Зарегистрируйтесь на [Unsplash Developers](https://unsplash.com/developers).
2.  Создайте новое приложение (New Application).
3.  Скопируйте **Access Key**.

**Впишите в `.env.local`:**
```env
UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxx
```

---

## Итоговый пример файла `.env.local`

```env
# GitHub (Обязательно)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=myuser
GITHUB_REPO=my-site-repo
GITHUB_BRANCH=main

# Admin Auth
ADMIN_PASSWORD_HASH=$2a$10$..........
ADMIN_TOKEN_HASH=my-secret-token-string

# Telegram Notifications
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=12345678

# Email (Gmail)
GMAIL_USER=myemail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
CONTACT_EMAIL_FROM=myemail@gmail.com
CONTACT_EMAIL_TO=myemail@gmail.com

# Payment (Optional - Default: Cash)
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Media (Optional)
# UNSPLASH_ACCESS_KEY=xxxxxxxx