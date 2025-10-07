import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Product from '../models/Product.js'
import { seedOrders } from './seedOrders.js'

dotenv.config()

async function run() {
  try {
    await connectDB()
    const samples = [
      { title: 'The Yashashvi Om Ring', description: 'Elegant ring', images: [], price: 700, originalPrice: 850, category: 'ring', tags: ['ring'], rating: 4.6, stock: 25 },
      { title: 'The Elijah Gold Chain', description: 'Gold chain', images: [], price: 900, originalPrice: 1250, category: 'chain', tags: ['chain'], rating: 4.4, stock: 40 },
      { title: 'Anurita Hoop Earrings', description: 'Hoop earrings', images: [], price: 1200, originalPrice: 1250, category: 'earrings', tags: ['earrings'], rating: 4.7, stock: 30 },
      { title: 'Cursive A Necklace', description: 'Necklace', images: [], price: 900, originalPrice: 1100, category: 'necklace', tags: ['necklace'], rating: 4.5, stock: 20 },
      { title: 'Radiant Charms Bracelet', description: 'Bracelet', images: [], price: 550, originalPrice: 1000, category: 'bracelets', tags: ['bracelets'], rating: 4.2, stock: 15 },
      { title: 'Michael Kors Watch', description: 'Women watch', images: [], price: 1200, originalPrice: 1450, category: 'watch', tags: ['watch'], rating: 4.3, stock: 12 },
    ]
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(samples)
      console.log('Seeded products:', samples.length)
    } else {
      console.log('Products already exist, skipping seeding (count =', count, ')')
    }
    
    // Seed orders for testing
    await seedOrders()
  } catch (e) {
    console.error(e)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

run()


