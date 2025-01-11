import mongoose, { Schema, Document, model } from 'mongoose';

export interface IImage extends Document {
  userId:Schema.Types.ObjectId,
  title: string;
  imagePath: string;
  order: number; 
}

const imageSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
const Image = model<IImage>('Image', imageSchema);

export default Image