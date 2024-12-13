//app/api/register/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose'; // Import the function
import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  wishList: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Child = mongoose.models.Child || mongoose.model('Child', childSchema);

export async function POST(req: Request) {
  const { childName, wishList }: { childName: string; wishList: string } = await req.json();

  if (!childName || !wishList) {
    return NextResponse.json({ error: 'Please provide both the name and wish list.' }, { status: 400 });
  }

  try {
    await connectToDatabase();  

    const newChild = new Child({ childName, wishList });
    await newChild.save();

    return NextResponse.json({ message: 'Child information saved successfully!', childId: newChild._id }, { status: 200 });
  } catch (error) {
    console.error('Error saving child data:', error);
    return NextResponse.json({ error: 'Failed to save child information. Please try again later.' }, { status: 500 });
  }
}
