require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Copy server/env.example to server/.env and configure MongoDB.');
  await mongoose.connect(uri);
}

async function reset() {
  await connectDB();

  const User = require('../models/User');
  const Listing = require('../models/Listing');
  const Message = require('../models/Message');

  console.log('Removing all demo data…');

  await Promise.all([
    Message.deleteMany({}),
    Listing.deleteMany({}),
    User.deleteMany({}),
  ]);

  try {
    await mongoose.connection.db.collection('demo_meta').deleteMany({});
  } catch {
    // collection may not exist
  }

  try {
    const wishlistPath = require('path').join(__dirname, '../../client/public/demo-wishlist.json');
    require('fs').unlinkSync(wishlistPath);
  } catch {
    // file may not exist
  }

  console.log('Demo data reset complete. Run `npm run seed` to repopulate.');

  await mongoose.disconnect();
}

reset().catch((err) => {
  console.error('Reset failed:', err.message);
  process.exit(1);
});
