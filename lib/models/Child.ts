// lib/models/Child.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface to define the structure of the Child document
interface IChild extends Document {
  childName: string;
  wishList: string;
  createdAt: Date;
}

// Define the schema with the IChild interface
const childSchema = new Schema<IChild>({
  childName: { type: String, required: true },
  wishList: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model and reuse it if already defined
const Child = mongoose.models.Child || mongoose.model<IChild>('Child', childSchema);

export default Child;
