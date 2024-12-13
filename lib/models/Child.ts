// lib/models/Child.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IChild extends Document {
  childName: string;
  wishList: string;
  createdAt: Date;
}

const childSchema = new Schema<IChild>({
  childName: { type: String, required: true },
  wishList: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Child = mongoose.models.Child || mongoose.model<IChild>('Child', childSchema);

export default Child;
