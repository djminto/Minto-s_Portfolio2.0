import { NextRequest, NextResponse } from 'next/server';

const EMAILJS_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_ADMIN: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN || '',
  TEMPLATE_ID_CLIENT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT || '',
  PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY || '',
  API_ENDPOINT: 'https://api.emailjs.com/api/v1.0/email/send',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, clientName, clientEmail, packageType, totalAmount, currency } = body;

    if (!orderNumber || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const adminTemplateParams = {
      service_id: EMAILJS_CONFIG.SERVICE_ID,
      template_id: EMAILJS_CONFIG.TEMPLATE_ID_ADMIN,
      user_id: EMAILJS_CONFIG.PUBLIC_KEY,
      accessToken: EMAILJS_CONFIG.PRIVATE_KEY,
      template_params: {
        to_email: 'danielminto13@gmail.com',
        to_name: 'Daniel Minto',
        from_name: clientName,
        order_number: orderNumber,
        client_name: clientName,
        client_email: clientEmail,
        package_type: packageType,
        total_amount: `${currency} ${totalAmount.toLocaleString()}`,
        deposit_amount: `${currency} ${(totalAmount / 2).toLocaleString()}`,
        subject: `New Order Completed - ${orderNumber}`,
        message: `A new order has been completed by ${clientName}. Order details: Package - ${packageType}, Total Amount - ${currency} ${totalAmount.toLocaleString()}`,
      },
    };

    try {
      const adminResponse = await fetch(EMAILJS_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminTemplateParams),
      });

      const adminResult = await adminResponse.text();
      console.log('Admin response:', adminResponse.status, adminResult);

      if (adminResponse.ok) {
        console.log('Admin notification sent successfully');
      } else {
        console.error('Error sending admin notification:', adminResponse.statusText);
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }

    const clientTemplateParams = {
      service_id: EMAILJS_CONFIG.SERVICE_ID,
      template_id: EMAILJS_CONFIG.TEMPLATE_ID_CLIENT,
      user_id: EMAILJS_CONFIG.PUBLIC_KEY,
      accessToken: EMAILJS_CONFIG.PRIVATE_KEY,
      template_params: {
        to_email: clientEmail,
        to_name: clientName,
        from_name: "Minto's Portfolio",
        order_number: orderNumber,
        package_type: packageType,
        total_amount: `${currency} ${totalAmount.toLocaleString()}`,
        deposit_amount: `${currency} ${(totalAmount / 2).toLocaleString()}`,
        subject: `Order Confirmation - ${orderNumber}`,
        message: `Dear ${clientName},\n\nThank you for your order! We have successfully received your order (${orderNumber}) for the ${packageType} package.\n\nTotal Amount: ${currency} ${totalAmount.toLocaleString()}\n50% Deposit Required: ${currency} ${(totalAmount / 2).toLocaleString()}\n\nWe will contact you shortly to discuss the next steps and payment details.\n\nBest regards,\nMinto's Portfolio Team`,
      },
    };

    try {
      const clientResponse = await fetch(EMAILJS_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientTemplateParams),
      });

      const clientResult = await clientResponse.text();
      console.log('Client response:', clientResponse.status, clientResult);

      if (clientResponse.ok) {
        console.log('Client confirmation sent successfully');
      } else {
        console.error('Error sending client confirmation:', clientResponse.statusText);
      }
    } catch (error) {
      console.error('Error sending client confirmation:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Order completed and notifications sent',
    });
  } catch (error) {
    console.error('Error in order completion:', error);
    return NextResponse.json(
      { error: 'Failed to complete order', details: String(error) },
      { status: 500 }
    );
  }
}
