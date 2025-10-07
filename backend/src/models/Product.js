import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, index: true }, // e.g., rings, necklaces
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);


