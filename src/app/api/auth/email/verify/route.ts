import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const CODES_DIR = path.join(process.cwd(), '.temp', 'email-codes');

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    }
    
    // Читаем сохраненный код
    const fileName = Buffer.from(email).toString('base64').replace(/[/+=]/g, '_');
    const filePath = path.join(CODES_DIR, `${fileName}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Code not found or expired' }, { status: 400 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const codeData = JSON.parse(fileContent);
    
    // Проверяем срок действия (10 минут)
    if (Date.now() > codeData.expiresAt) {
      fs.unlinkSync(filePath); // Удаляем просроченный код
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }
    
    // Проверяем совпадение кода
    if (codeData.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    
    // Успешная проверка - удаляем код
    fs.unlinkSync(filePath);
    
    // Создаем ответ с установкой куки авторизации
    // В реальном проекте здесь должна быть генерация JWT токена
    const response = NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully',
      redirect: '/admin/dashboard'
    });
    
    // Устанавливаем куку авторизации (упрощенно)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    response.cookies.set({
      name: 'user_email_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 дней
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Email verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}