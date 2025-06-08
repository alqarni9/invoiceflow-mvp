import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Save to database
    const user = await prisma.user.create({
      data: {
        email,
      },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed', user },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate email error
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 