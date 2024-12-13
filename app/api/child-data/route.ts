//app/api/child-data/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  wishList: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Child = mongoose.models.Child || mongoose.model('Child', childSchema);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  if (!childId) {
    return NextResponse.json({ error: 'Child ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const childData = await Child.findById(childId);

    if (!childData) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({
      childName: childData.childName,
      wishList: childData.wishList,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch child data' }, { status: 500 });
  }
}
