import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password, fullName, confirmPassword, role, adminPassword } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user is trying to register as ADMIN
    let userRole = role || 'USER';
    if (userRole === 'ADMIN') {
      const adminPassword_env = process.env.ADMIN_PASSWORD;
      
      // Validate admin password
      if (!adminPassword || adminPassword !== adminPassword_env) {
        return NextResponse.json(
          { error: 'Invalid admin password. Cannot register as admin.' },
          { status: 403 }
        );
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: userRole,
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
