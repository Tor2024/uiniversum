import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, message } = data

    // Валидация
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const submission = {
      id: `sub_${Date.now()}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    }

    // 1. Сохранение в data/forms/submissions.json
    const formsDir = path.join(process.cwd(), 'data', 'forms')
    const submissionsPath = path.join(formsDir, 'submissions.json')

    if (!existsSync(formsDir)) {
      await mkdir(formsDir, { recursive: true })
    }

    let submissions: any[] = []
    if (existsSync(submissionsPath)) {
      const content = await readFile(submissionsPath, 'utf-8')
      submissions = JSON.parse(content)
    }

    submissions.push(submission)
    await writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf-8')

    // 2. Отправка Email через Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: process.env.CONTACT_EMAIL_FROM || process.env.GMAIL_USER,
        to: process.env.CONTACT_EMAIL_TO || process.env.GMAIL_USER,
        subject: `Neue Kontaktanfrage von ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nNachricht: ${message}`,
        html: `
          <h2>Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Nachricht:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    }

    // 3. Уведомление в Telegram
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
      const telegramText = `📬 <b>Neue Kontaktanfrage</b>\n\n<b>Name:</b> ${name}\n<b>Email:</b> ${email}\n<b>Nachricht:</b> ${message}`

      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText,
          parse_mode: 'HTML'
        })
      })
    }

    return NextResponse.json({ success: true, message: 'Form submitted successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
