import { NextResponse } from 'next/server';
import { testEmailConnection } from '@/lib/email';

export async function GET() {
  const result = await testEmailConnection();
  
  return NextResponse.json({
    ...result,
    config: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      // Don't leak full password but show if it's there
      passSet: !!process.env.SMTP_PASSWORD,
      fromEmail: process.env.SMTP_FROM_EMAIL,
      adminEmail: process.env.ADMIN_EMAIL,
    }
  });
}
