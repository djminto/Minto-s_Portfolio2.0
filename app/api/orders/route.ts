import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email/sendEmail';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      companyName,
      packageType,
      websiteType,
      numPages,
      features,
      colorScheme,
      pageTypes,
      completionDate,
      budgetRange,
      description,
      paymentMethod,
      totalAmount,
      currency,
    } = body;

    await dbConnect();

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await Order.create({
      userId: (session.user as any).id,
      clientName,
      clientEmail,
      clientPhone,
      companyName,
      packageType,
      websiteType,
      numPages,
      features,
      colorScheme,
      pageTypes,
      completionDate,
      budgetRange,
      description,
      paymentMethod,
      totalAmount,
      currency,
      orderNumber,
      status: 'Pending',
    });

    // Fire-and-forget email notifications (don't block order creation on email failure)
    sendOrderConfirmation(clientEmail, orderNumber, packageType, totalAmount, currency).catch((e) => {
      console.error('Order confirmation email failed:', e);
    });
    sendAdminNotification(orderNumber, clientName, clientEmail, packageType, totalAmount).catch((e) => {
      console.error('Admin notification email failed:', e);
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Admins get all orders, regular users get only their own
    const isAdmin = (session.user as any)?.role === 'ADMIN';
    
    if (isAdmin) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json(orders);
    } else {
      const orders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
