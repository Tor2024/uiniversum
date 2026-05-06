'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'

interface BookingFormProps {
  locale: string
}

export default function BookingForm({ locale }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (status === 'success') {
    return (
      <div className="text-center p-8">
        <div className="text-2xl mb-4">✓</div>
        <h3 className="text-xl font-bold mb-2">
          {locale === 'de' ? 'Reservierung bestätigt' : locale === 'en' ? 'Booking Confirmed' : 'Бронирование подтверждено'}
        </h3>
        <p className="text-gray-600">
          {locale === 'de' ? 'Wir haben Ihre Anfrage erhalten.' : locale === 'en' ? 'We have received your request.' : 'Мы получили ваш запрос.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">
          {locale === 'de' ? 'Name' : locale === 'en' ? 'Name' : 'Имя'}
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {locale === 'de' ? 'E-Mail' : locale === 'en' ? 'Email' : 'Эл. почта'}
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {locale === 'de' ? 'Telefon' : locale === 'en' ? 'Phone' : 'Телефон'}
        </label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'de' ? 'Datum' : locale === 'en' ? 'Date' : 'Дата'}
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'de' ? 'Uhrzeit' : locale === 'en' ? 'Time' : 'Время'}
          </label>
          <select
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200 bg-white"
          >
            <option value="">--:--</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="19:30">19:30</option>
            <option value="20:00">20:00</option>
            <option value="20:30">20:30</option>
            <option value="21:00">21:00</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {locale === 'de' ? 'Gäste' : locale === 'en' ? 'Guests' : 'Гости'}
        </label>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200 bg-white"
        >
          {[1,2,3,4,5,6,7,8].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {locale === 'de' ? 'Nachricht (optional)' : locale === 'en' ? 'Message (optional)' : 'Сообщение (необязательно)'}
        </label>
        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-accent text-white py-4 px-6 rounded-md hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 font-medium"
      >
        {status === 'loading' 
          ? (locale === 'de' ? 'Wird gesendet...' : locale === 'en' ? 'Sending...' : 'Отправка...')
          : (locale === 'de' ? 'Tisch reservieren' : locale === 'en' ? 'Reserve Table' : 'Забронировать столик')
        }
      </button>

      {status === 'error' && (
        <p className="text-red-600 text-sm text-center">
          {locale === 'de' ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' : locale === 'en' ? 'An error occurred. Please try again.' : 'Произошла ошибка. Пожалуйста, попробуйте снова.'}
        </p>
      )}
    </form>
  )
}