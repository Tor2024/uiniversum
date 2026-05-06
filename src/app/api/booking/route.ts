import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import presetData from '../../../../data/presets/restaurant_modern.json';

const submissionsPath = path.join(process.cwd(), 'data', 'forms', 'submissions.json');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const slots = presetData.booking?.enabled ? presetData.booking.slots : [];
  
  return NextResponse.json({
    date: date || new Date().toISOString().split('T')[0],
    availableSlots: slots,
    duration: presetData.booking?.duration || 120
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, guests, message } = body;

    // Валидация
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, email, date, time)' },
        { status: 400 }
      );
    }

    const newSubmission = {
      id: `booking_${Date.now()}`,
      type: 'booking',
      name,
      email,
      phone: phone || '',
      date,
      time,
      guests: guests || 1,
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Чтение существующих заявок
    let submissions: any[] = [];
    try {
      const content = await fs.readFile(submissionsPath, 'utf-8');
      submissions = JSON.parse(content);
    } catch (error) {
      // Файл не существует или пуст, начинаем с пустого массива
      submissions = [];
    }

    // Добавление новой заявки
    submissions.push(newSubmission);

    // Запись обратно в файл
    await fs.writeFile(submissionsPath, JSON.stringify(submissions, null, 2));

    // TODO: Добавить отправку Email/Telegram уведомлений (как в contact/route.ts)

    return NextResponse.json({ 
      success: true, 
      message: 'Booking received successfully' 
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process booking' },
      { status: 500 }
    );
  }
}