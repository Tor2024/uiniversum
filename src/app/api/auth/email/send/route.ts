import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const CODES_DIR = path.join(process.cwd(), '.temp', 'email-codes');

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(email: string, code: string, locale: string = 'ru'): Promise<boolean> {
  console.log(`[EMAIL] To: ${email}, Code: ${code}`);
  return true;
}

function saveCode(email: string, code: string): void {
  if (!fs.existsSync(CODES_DIR)) {
    fs.mkdirSync(CODES_DIR, { recursive: true });
  }
  
  const codeData = {
    code: code,
    email: email,
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000
  };
  
  const fileName = Buffer.from(email).toString('base64').replace(/[/+=]/g, '_');
  fs.writeFileSync(
    path.join(CODES_DIR, `${fileName}.json`),
    JSON.stringify(codeData)
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'ru' } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    const code = generateCode();
    saveCode(email, code);
    
    const sent = await sendEmail(email, code, locale);
    if (!sent) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    const responseData: any = { 
      success: true, 
      message: 'Verification code sent'
    };
    
    if (process.env.NODE_ENV !== 'production') {
      responseData.code = code;
    }
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}