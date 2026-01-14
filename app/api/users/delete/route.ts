import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findOneAndDelete({ email: email.toLowerCase() });

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully', email: deletedUser.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to delete all users (use with caution!)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const result = await User.deleteMany({});

    return NextResponse.json(
      { message: 'All users deleted successfully', count: result.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete all users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
