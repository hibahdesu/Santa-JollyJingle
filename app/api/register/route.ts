// app/api/register/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose'; // Import the function
import mongoose from 'mongoose';
import Child from '@/lib/models/Child'; // Import the Child model

export async function POST(req: Request) {
  const { childName, wishList }: { childName: string; wishList: string } = await req.json();

  // Input validation
  if (!childName || !wishList) {
    return NextResponse.json({ error: 'Please provide both the name and wish list.' }, { status: 400 });
  }

  try {
    // Ensure the database connection is established
    if (mongoose.connections[0].readyState === 0) {
      await connectToDatabase();
    }

    // Create and save the new child document
    const newChild = new Child({ childName, wishList });
    await newChild.save();

    // Return success response
    return NextResponse.json(
      { message: 'Child information saved successfully!', childId: newChild._id },
      { status: 200 }
    );
  } catch (error) {
    // Log error (Consider using a better logging framework like Winston or Pino for production)
    console.error('Error saving child data:', error);

    // Return failure response
    return NextResponse.json(
      { error: 'Failed to save child information. Please try again later.' },
      { status: 500 }
    );
  }
}
