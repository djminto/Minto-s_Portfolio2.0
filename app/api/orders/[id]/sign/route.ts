import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const { signatureData } = await request.json();

    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify the user owns this order (either by userId or email match)
    const userId = (session.user as any).id;
    const userEmail = session.user.email;
    const isOwner = order.userId === userId || order.clientEmail === userEmail;
    
    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    order.proposalSigned = true;
    order.signatureData = signatureData;
    order.signedAt = new Date();
    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Proposal signed successfully' 
    });
  } catch (error) {
    console.error('Error signing proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
