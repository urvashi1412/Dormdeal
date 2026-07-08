const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const {
  COLLEGE,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  USERS,
  buildListings,
  pickPostedDate,
  pickConversation,
  DEMO_USER_LISTINGS,
  monthsAgo,
} = require('./seedData');

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Copy server/env.example to server/.env and configure MongoDB.');
  await mongoose.connect(uri);
}

async function seed() {
  await connectDB();

  const User = require('../models/User');
  const Listing = require('../models/Listing');
  const Message = require('../models/Message');

  const rng = mulberry32(20260703);

  console.log('Clearing existing data…');
  await Promise.all([
    Message.deleteMany({}),
    Listing.deleteMany({}),
    User.deleteMany({}),
  ]);

  // ── Users ──
  console.log('Creating VIT students…');
  const userByEmail = {};
  const userByUsername = {};

  for (const u of USERS) {
    const password = u.email === DEMO_EMAIL ? DEMO_PASSWORD : 'Password@123';
    const user = await User.create({
      name: u.name,
      email: u.email,
      password,
      college: COLLEGE,
      avatar: u.avatar,
      rating: u.rating,
      ratingCount: u.ratingCount,
      createdAt: monthsAgo(u.joinedMonthsAgo),
    });
    userByEmail[u.email] = user;
    userByUsername[u.username] = user;
  }

  const allUsers = Object.values(userByEmail);
  const demoUser = userByEmail[DEMO_EMAIL];

  // ── Listings ──
  console.log('Creating listings…');
  const catalog = buildListings(rng);
  const demoTitleSet = new Set(DEMO_USER_LISTINGS.map(d => d.ref));
  const demoStatusMap = Object.fromEntries(DEMO_USER_LISTINGS.map(d => [d.ref, d.status]));

  const createdListings = [];
  const listingByTitle = {};

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    let seller = demoTitleSet.has(item.title)
      ? demoUser
      : pick(rng, allUsers.filter(u => u._id.toString() !== demoUser._id.toString()));

    let status = 'active';
    if (demoTitleSet.has(item.title)) {
      status = demoStatusMap[item.title];
    } else if (rng() < 0.14) {
      status = 'sold';
    }

    const listing = await Listing.create({
      seller: seller._id,
      college: COLLEGE,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      condition: item.condition,
      photos: item.photos,
      dorm: item.dorm,
      status,
      createdAt: pickPostedDate(rng),
    });

    createdListings.push(listing);
    listingByTitle[item.title] = listing;
  }

  console.log(`  → ${createdListings.length} listings (${createdListings.filter(l => l.status === 'active').length} active, ${createdListings.filter(l => l.status === 'sold').length} sold)`);

  // ── Messages (~30 threads) ──
  console.log('Creating conversations…');
  const activeListings = createdListings.filter(l => l.status === 'active');
  const threadTargets = [];
  const usedPairs = new Set();

  const addThread = (listing, buyer) => {
    const key = `${listing._id}_${buyer._id}`;
    if (usedPairs.has(key)) return false;
    if (listing.seller.toString() === buyer._id.toString()) return false;
    usedPairs.add(key);
    threadTargets.push({ listing, buyer });
    return true;
  };

  // Demo user threads first (inbox + outbox)
  const demoAsBuyerListings = activeListings
    .filter(l => l.seller.toString() !== demoUser._id.toString())
    .slice(0, 5);
  demoAsBuyerListings.forEach(l => addThread(l, demoUser));

  const demoAsSellerListings = activeListings
    .filter(l => l.seller.toString() === demoUser._id.toString())
    .slice(0, 5);
  demoAsSellerListings.forEach(l => {
    const buyer = pick(rng, allUsers.filter(u => u._id.toString() !== demoUser._id.toString()));
    addThread(l, buyer);
  });

  // Fill remaining threads
  let attempts = 0;
  while (threadTargets.length < 30 && attempts < 200) {
    attempts += 1;
    const listing = pick(rng, activeListings);
    const buyer = pick(rng, allUsers);
    addThread(listing, buyer);
  }

  let messageCount = 0;
  for (let t = 0; t < threadTargets.length; t++) {
    const { listing, buyer } = threadTargets[t];
    const sellerId = listing.seller;
    const seller = allUsers.find(u => u._id.toString() === sellerId.toString());
    const roomId = `${listing._id}_${buyer._id}`;
    const lines = pickConversation(listing.title);

    const baseTime = Date.now() - (t + 1) * 3 * 60 * 60 * 1000;

    for (let m = 0; m < lines.length; m++) {
      const line = lines[m];
      const isBuyer = line.from === 'buyer';
      const sender = isBuyer ? buyer : seller;
      const receiver = isBuyer ? seller : buyer;
      const createdAt = new Date(baseTime + m * 4 * 60 * 1000);

      let body = line.text;
      if (body.includes('$30') && listing.price > 50) {
        const offer = Math.round(listing.price * 0.85);
        body = body.replace('$30', `$${offer}`);
      }
      if (body.includes('$600') && listing.title.includes('MacBook')) {
        body = body.replace('$600', `$${Math.round(listing.price * 0.92)}`);
      }
      if (body.includes('$620')) {
        body = body.replace('$620', `$${Math.round(listing.price * 0.95)}`);
      }
      if (body.includes('$35') && listing.price < 50) {
        body = body.replace('$35', `$${Math.max(5, listing.price - 3)}`);
      }

      const isUnreadForDemo =
        receiver._id.toString() === demoUser._id.toString() && m === lines.length - 1 && t < 4;

      await Message.create({
        roomId,
        listing: listing._id,
        sender: sender._id,
        receiver: receiver._id,
        body,
        read: !isUnreadForDemo,
        createdAt,
      });
      messageCount += 1;
    }
  }

  console.log(`  → ${threadTargets.length} threads, ${messageCount} messages`);

  // ── Demo metadata (wishlist IDs for reference — client wishlist uses localStorage) ──
  const wishlistTitles = [
    'Sony WH-1000XM4',
    'iPad Air 4th Gen',
    'Study Table with Drawer',
    'Yonex Badminton Racket',
    'Python Crash Course',
    'Office Chair — Adjustable',
    'Hero Sprint Cycle (26")',
    'Nike Running Shoes (Size 9)',
    'Dell 24" Monitor',
    'Engineering Mathematics Vol. 1',
    'JBL Bluetooth Speaker',
    'Winter Jacket — North Face',
    'Mechanical Keyboard — Keychron',
    'Cricket Kit (bat + pads)',
    'Electric Kettle 1.5L',
    'College Backpack — Fjällräven',
    'DBMS by Korth',
    'Adjustable Dumbbells (5kg pair)',
  ];

  const wishlistIds = wishlistTitles
    .map(title => listingByTitle[title]?._id)
    .filter(Boolean);

  await mongoose.connection.db.collection('demo_meta').deleteMany({ type: 'seed' });
  await mongoose.connection.db.collection('demo_meta').insertOne({
    type: 'seed',
    college: COLLEGE,
    demoLogin: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    wishlistListingIds: wishlistIds,
    notifications: [
      { text: 'Your item received a new message.', listingTitle: 'MacBook Air M1 (2020)' },
      { text: 'Someone liked your listing.', listingTitle: 'Data Structures using C++' },
      { text: 'Price updated on an item you viewed.', listingTitle: 'Sony WH-1000XM4' },
      { text: 'Item marked as sold.', listingTitle: 'Organic Chemistry 7th Edition' },
      { text: 'New item matching "python".', listingTitle: 'Python Crash Course' },
    ],
    seededAt: new Date(),
  });

  const wishlistPath = path.join(__dirname, '../../client/public/demo-wishlist.json');
  fs.writeFileSync(
    wishlistPath,
    JSON.stringify({ email: DEMO_EMAIL, listingIds: wishlistIds.map(String) }, null, 2)
  );
  console.log(`  → Wishlist file: client/public/demo-wishlist.json (${wishlistIds.length} items)`);

  // ── Summary ──
  const demoListings = createdListings.filter(l => l.seller.toString() === demoUser._id.toString());

  console.log('\n══════════════════════════════════════════');
  console.log('  DormDeal demo seed complete');
  console.log('══════════════════════════════════════════');
  console.log(`  College:    ${COLLEGE}`);
  console.log(`  Users:      ${allUsers.length}`);
  console.log(`  Listings:   ${createdListings.length}`);
  console.log(`  Messages:   ${messageCount} (${threadTargets.length} threads)`);
  console.log('');
  console.log('  Demo login (recommended for showcases):');
  console.log(`    Email:    ${DEMO_EMAIL}`);
  console.log(`    Password: ${DEMO_PASSWORD}`);
  console.log('');
  console.log(`  Demo user has ${demoListings.filter(l => l.status === 'active').length} active + ${demoListings.filter(l => l.status === 'sold').length} sold listings`);
  console.log('');
  console.log('  Other accounts: Password@123');
  console.log('  (e.g. priya22@vit.ac.in, rahul.cs@vit.ac.in)');
  console.log('');
  console.log('  Search tips: "chair", "python", "laptop", "cycle"');
  console.log('══════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
