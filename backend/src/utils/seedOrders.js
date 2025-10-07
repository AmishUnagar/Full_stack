import Order from '../models/Order.js';
import User from '../models/User.js';

export async function seedOrders() {
  try {
    // Find a user to create orders for
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Sample orders data
    const sampleOrders = [
      {
        userId: user._id,
        items: [
          {
            product: '1', // Using string ID for product
            title: 'Diamond Ring',
            price: 1499,
            quantity: 1,
            image: '/src/assets/img/ring/ring1.webp'
          }
        ],
        total: 1499,
        status: 'delivered',
        shippingAddress: {
          line1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India'
        }
      },
      {
        userId: user._id,
        items: [
          {
            product: '2', // Using string ID for product
            title: 'Gold Necklace',
            price: 2499,
            quantity: 1,
            image: '/src/assets/img/nacklase/nack1.jpg'
          }
        ],
        total: 2499,
        status: 'shipped',
        shippingAddress: {
          line1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India'
        }
      },
      {
        userId: user._id,
        items: [
          {
            product: '3', // Using string ID for product
            title: 'Pearl Earrings',
            price: 799,
            quantity: 2,
            image: '/src/assets/img/EarRing/er3.jpg'
          }
        ],
        total: 1598,
        status: 'processing',
        shippingAddress: {
          line1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India'
        }
      }
    ];

    // Clear existing orders for this user
    await Order.deleteMany({ userId: user._id });

    // Create new orders
    const orders = await Order.insertMany(sampleOrders);
    console.log(`Created ${orders.length} sample orders for user ${user.email}`);
    
    return orders;
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
}
