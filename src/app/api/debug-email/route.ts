import { NextResponse } from 'next/server';
import { testEmailConnection } from '@/lib/email';

export async function GET() {
  const result = await testEmailConnection();
  
  return NextResponse.json({
    ...result,
    config: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      // Don't leak full password but show if it's there
      passSet: !!process.env.EMAIL_SERVER_PASSWORD,
      fromEmail: process.env.EMAIL_SERVER_USER,
      adminEmail: process.env.ADMIN_EMAIL,
    }
  });
}
