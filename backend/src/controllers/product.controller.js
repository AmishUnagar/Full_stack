import Product from '../models/Product.js';

export async function list(req, res) {
  const { category, sort } = req.query;
  const filter = {};
  if (category) filter.category = category;
  let query = Product.find(filter);
  if (sort === 'price_asc') query = query.sort({ price: 1 });
  if (sort === 'price_desc') query = query.sort({ price: -1 });
  if (sort === 'popular') query = query.sort({ rating: -1 });
  const products = await query.limit(100);
  res.json({ products });
}

export async function getById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
}

export async function create(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
}

export async function update(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
}

export async function remove(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}


