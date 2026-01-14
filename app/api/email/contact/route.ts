import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sendEmail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    console.log('[Contact Form] Full body received:', JSON.stringify(body, null, 2));
    console.log('[Contact Form] Extracted fields:', { name, email, phone, subject, message: message ? `${message.substring(0, 50)}...` : 'MISSING' });

    if (!name || !email || !subject || !message) {
      console.error('[Contact Form] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields: name, email, subject, and message are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL_ADDRESS || process.env.ADMIN_EMAIL || 'danielminto13@gmail.com';

    console.log(`[Contact Form] Sending to admin email: ${adminEmail}`);

    const result = await sendEmail(adminEmail, subject, 'contact', {
      from_name: name,
      reply_to: email,
      phone: phone || 'Not provided',
      message: message,
    });

    if (!result.success) {
      console.error('[Contact Form] Email failed:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
    }

    console.log('[Contact Form] Email sent successfully');
    return NextResponse.json({ ok: true, message: 'Email sent successfully' });
  } catch (err: any) {
    console.error('[Contact Form] Error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
