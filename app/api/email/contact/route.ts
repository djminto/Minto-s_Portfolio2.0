import { NextRequest, NextResponse } from 'next/server';

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

    // Use EmailJS to send email
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: name,
          from_email: email,
          phone: phone || 'Not provided',
          subject: subject,
          message: message,
        },
      }),
    });

    if (!emailjsResponse.ok) {
      const errorText = await emailjsResponse.text();
      console.error('[Contact Form] EmailJS error:', errorText);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('[Contact Form] Email sent successfully via EmailJS');
    return NextResponse.json({ ok: true, message: 'Email sent successfully' });
  } catch (err: any) {
    console.error('[Contact Form] Error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
