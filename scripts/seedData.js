const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

// Sample data for seeding
const sampleItems = [
  {
    name: 'MacBook Pro 16"',
    description: 'High-performance laptop for professionals',
    category: 'electronics',
    price: 2499.99,
    stock: 25,
    status: 'active',
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features',
    category: 'electronics',
    price: 999.99,
    stock: 50,
    status: 'active',
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    category: 'electronics',
    price: 299.99,
    stock: 100,
    status: 'active',
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    category: 'furniture',
    price: 199.99,
    stock: 30,
    status: 'active',
  },
  {
    name: 'Standing Desk',
    description: 'Adjustable height standing desk',
    category: 'furniture',
    price: 499.99,
    stock: 15,
    status: 'active',
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    category: 'appliances',
    price: 89.99,
    stock: 40,
    status: 'active',
  },
  {
    name: 'Blender',
    description: 'High-speed blender for smoothies',
    category: 'appliances',
    price: 79.99,
    stock: 35,
    status: 'active',
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily use',
    category: 'sports',
    price: 129.99,
    stock: 60,
    status: 'active',
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise',
    category: 'sports',
    price: 29.99,
    stock: 80,
    status: 'active',
  },
  {
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells set 5-50 lbs',
    category: 'sports',
    price: 199.99,
    stock: 20,
    status: 'active',
  },
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    const items = await Item.insertMany(sampleItems);
    console.log(`Inserted ${items.length} items`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
