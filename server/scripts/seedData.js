/**
 * Demo seed data for VIT Chennai marketplace.
 * Maps user-facing categories to existing Listing schema enums:
 *   textbooks | electronics | furniture | clothes | food | other
 *   (cycles, stationery, sports → other)
 */

const COLLEGE = 'VIT Chennai';
const DEMO_EMAIL = 'demo@vit.ac.in';
const DEMO_PASSWORD = 'Demo@2026';

const UNSPLASH = (id) =>
  `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop&q=80`;

const PHOTOS = {
  book: UNSPLASH('photo-1544947950-fa07a98d237f'),
  books: UNSPLASH('photo-1497633767263-8f055fb39708'),
  notes: UNSPLASH('photo-1456513080510-7bf3a84b82f8'),
  laptop: UNSPLASH('photo-1496181133206-80ce9b88a853'),
  macbook: UNSPLASH('photo-1517336714731-489689fd1ca8'),
  monitor: UNSPLASH('photo-1527443225-1269a08a2b50'),
  keyboard: UNSPLASH('photo-1618384887929-636d0027ed90'),
  mouse: UNSPLASH('photo-1527864550417-7fd91fc51a46'),
  tablet: UNSPLASH('photo-1544244015-0df4b3ffc6b0'),
  headphones: UNSPLASH('photo-1505740420928-5e560c06d30e'),
  sonyHeadphones: UNSPLASH('photo-1618366712010-f17aeecd8743'),
  calculator: UNSPLASH('photo-1561485452-672636b4689a'),
  powerbank: UNSPLASH('photo-1609091839311-22a9a8d2b6c8'),
  usbHub: UNSPLASH('photo-1625842260872-478920518a25'),
  lamp: UNSPLASH('photo-1507473889642-ef5231a4a7b5'),
  charger: UNSPLASH('photo-1591290618456-d855c5a8f9c8'),
  speaker: UNSPLASH('photo-1608043152269-423dbba4e7e1'),
  chair: UNSPLASH('photo-1506439773649-458e477e2414'),
  desk: UNSPLASH('photo-1518459031867-a89b4960f727'),
  beanbag: UNSPLASH('photo-1555041469-a586c61ea9bc'),
  shelf: UNSPLASH('photo-1594620302200-9a7622441563'),
  mattress: UNSPLASH('photo-1631049307264-da0ec9d70304'),
  mirror: UNSPLASH('photo-1616486338812-3ada1584d2a0'),
  rack: UNSPLASH('photo-1595428774223-ef52624120aa'),
  cycle: UNSPLASH('photo-1576437938673-1856cb018eb3'),
  hoodie: UNSPLASH('photo-1556821840-63e62a27b4a8'),
  labcoat: UNSPLASH('photo-1576091160399-112ba8d25d1d'),
  jacket: UNSPLASH('photo-1551028719-00167b16eac5'),
  shoes: UNSPLASH('photo-1542291026-7eec264c27ff'),
  sneakers: UNSPLASH('photo-1606107557195-0db6b4b2a4a4'),
  formal: UNSPLASH('photo-1602810318383-0dce8c8e44b8'),
  backpack: UNSPLASH('photo-1553062407-98eeb64c6a62'),
  kettle: UNSPLASH('photo-1607083206869-4a20b8648a13'),
  tupperware: UNSPLASH('photo-1589939705385-518e88a3ed57'),
  induction: UNSPLASH('photo-1556909114-f6e7ad7d4046'),
  coffee: UNSPLASH('photo-1495474472287-4d71bcdd2085'),
  badminton: UNSPLASH('photo-1626224583764-f37db8689afc'),
  football: UNSPLASH('photo-1614632534692-4259c8b4c0f4'),
  cricket: UNSPLASH('photo-1531415075098-d2178d799a4a'),
  yoga: UNSPLASH('photo-1544367567-0f2fcb009e0b'),
  dumbbells: UNSPLASH('photo-1517836357463-d25dfeac3438'),
  stationery: UNSPLASH('photo-1455390572741-bac2875e1e49'),
  misc: UNSPLASH('photo-1558618666-fcd25c85cd64'),
};

const DORMS = [
  'Gandhi Block, Room 214',
  'K Block Hostel',
  'Main Hostel, Tower 3',
  'Q Block, 2nd Floor',
  'Tapti Hostel',
  'N Block PG near campus',
  'Silver Jubilee Tower',
  'M Block Men\'s Hostel',
];

const USERS = [
  { username: 'arjun_v', name: 'Arjun Venkatesh', email: DEMO_EMAIL, rating: 4.7, ratingCount: 19, avatar: UNSPLASH('photo-1507003211169-0a1dd7228f2d'), joinedMonthsAgo: 8 },
  { username: 'priya22', name: 'Priya Sharma', email: 'priya22@vit.ac.in', rating: 4.6, ratingCount: 24, avatar: UNSPLASH('photo-1494790108377-be9c29b29330'), joinedMonthsAgo: 6 },
  { username: 'megha_s', name: 'Megha Srinivasan', email: 'megha.s@vit.ac.in', rating: 4.4, ratingCount: 11, avatar: UNSPLASH('photo-1438761681033-6461ffad8d80'), joinedMonthsAgo: 10 },
  { username: 'rahul.cs', name: 'Rahul Krishnan', email: 'rahul.cs@vit.ac.in', rating: 4.8, ratingCount: 32, avatar: UNSPLASH('photo-1500648767791-00dcc994a43e'), joinedMonthsAgo: 14 },
  { username: 'isha_04', name: 'Isha Reddy', email: 'isha04@vit.ac.in', rating: 4.3, ratingCount: 8, avatar: UNSPLASH('photo-1534528741775-53994a69daeb'), joinedMonthsAgo: 4 },
  { username: 'aditya.k', name: 'Aditya Kumar', email: 'aditya.k@vit.ac.in', rating: 4.5, ratingCount: 16, avatar: UNSPLASH('photo-1472099645785-5658abf4ff4e'), joinedMonthsAgo: 7 },
  { username: 'ananya_vit', name: 'Ananya Iyer', email: 'ananya.vit@vit.ac.in', rating: 4.6, ratingCount: 21, avatar: UNSPLASH('photo-1517841905240-472988babdf9'), joinedMonthsAgo: 9 },
  { username: 'rohit_24', name: 'Rohit Menon', email: 'rohit24@vit.ac.in', rating: 4.2, ratingCount: 6, avatar: UNSPLASH('photo-1599566150163-29194dcdc141'), joinedMonthsAgo: 3 },
  { username: 'kavya.s', name: 'Kavya Subramanian', email: 'kavya.s@vit.ac.in', rating: 4.7, ratingCount: 27, avatar: UNSPLASH('photo-1524504388940-b1c1722653e1'), joinedMonthsAgo: 11 },
  { username: 'nikhil_m', name: 'Nikhil Mohan', email: 'nikhil.m@vit.ac.in', rating: 4.5, ratingCount: 13, avatar: UNSPLASH('photo-1560250097-0b93528c311a'), joinedMonthsAgo: 5 },
  { username: 'sneha.v', name: 'Sneha Varma', email: 'sneha.v@vit.ac.in', rating: 4.4, ratingCount: 10, avatar: UNSPLASH('photo-1487412720507-e7ab37603c6f'), joinedMonthsAgo: 12 },
  { username: 'vikram_7', name: 'Vikram Sundaram', email: 'vikram7@vit.ac.in', rating: 4.6, ratingCount: 18, avatar: UNSPLASH('photo-1519085360753-af0119f7cbe7'), joinedMonthsAgo: 6 },
];

const BOOKS = [
  { title: 'Organic Chemistry 7th Edition', price: 35, photo: PHOTOS.book, condition: 'good' },
  { title: 'Engineering Mathematics Vol. 1', price: 28, photo: PHOTOS.books, condition: 'like-new' },
  { title: 'Data Structures using C++', price: 22, photo: PHOTOS.book, condition: 'good' },
  { title: 'Computer Networks — Tanenbaum', price: 30, photo: PHOTOS.books, condition: 'fair' },
  { title: 'DBMS by Korth', price: 40, photo: PHOTOS.book, condition: 'good' },
  { title: 'Operating System Concepts', price: 32, photo: PHOTOS.books, condition: 'like-new' },
  { title: 'Python Crash Course', price: 18, photo: PHOTOS.book, condition: 'good' },
  { title: 'Digital Logic Design', price: 15, photo: PHOTOS.notes, condition: 'fair' },
  { title: 'Signals & Systems', price: 38, photo: PHOTOS.books, condition: 'good' },
  { title: 'Machine Learning Notes (printed)', price: 12, photo: PHOTOS.notes, condition: 'like-new' },
  { title: 'Calculus Workbook', price: 10, photo: PHOTOS.notes, condition: 'good' },
  { title: 'JEE Reference Books Set', price: 45, photo: PHOTOS.books, condition: 'fair' },
  { title: 'CAT Preparation Books', price: 25, photo: PHOTOS.books, condition: 'good' },
  { title: 'GRE Official Guide', price: 42, photo: PHOTOS.book, condition: 'like-new' },
  { title: 'Quantitative Aptitude — RS Aggarwal', price: 14, photo: PHOTOS.book, condition: 'good' },
  { title: 'Competitive Coding Handbook', price: 20, photo: PHOTOS.notes, condition: 'new' },
  { title: 'Linear Algebra — Gilbert Strang', price: 48, photo: PHOTOS.book, condition: 'good' },
  { title: 'Discrete Mathematics', price: 26, photo: PHOTOS.books, condition: 'like-new' },
  { title: 'Theory of Computation', price: 34, photo: PHOTOS.book, condition: 'good' },
  { title: 'Software Engineering — Pressman', price: 29, photo: PHOTOS.books, condition: 'fair' },
];

const ELECTRONICS = [
  { title: 'MacBook Air M1 (2020)', price: 650, photo: PHOTOS.macbook, condition: 'like-new' },
  { title: 'HP Pavilion Laptop 15', price: 420, photo: PHOTOS.laptop, condition: 'good' },
  { title: 'Dell 24" Monitor', price: 85, photo: PHOTOS.monitor, condition: 'good' },
  { title: 'Mechanical Keyboard — Keychron', price: 55, photo: PHOTOS.keyboard, condition: 'like-new' },
  { title: 'Logitech Gaming Mouse', price: 25, photo: PHOTOS.mouse, condition: 'good' },
  { title: 'iPad Air 4th Gen', price: 380, photo: PHOTOS.tablet, condition: 'like-new' },
  { title: 'Samsung Galaxy Tab S6 Lite', price: 180, photo: PHOTOS.tablet, condition: 'good' },
  { title: 'boAt Rockerz Headphones', price: 18, photo: PHOTOS.headphones, condition: 'fair' },
  { title: 'Sony WH-1000XM4', price: 150, photo: PHOTOS.sonyHeadphones, condition: 'like-new' },
  { title: 'Casio FX-991EX Calculator', price: 22, photo: PHOTOS.calculator, condition: 'good' },
  { title: 'Anker 20000mAh Power Bank', price: 28, photo: PHOTOS.powerbank, condition: 'good' },
  { title: 'USB-C Hub 7-in-1', price: 20, photo: PHOTOS.usbHub, condition: 'new' },
  { title: 'LED Study Lamp', price: 12, photo: PHOTOS.lamp, condition: 'good' },
  { title: 'Wireless Charger Pad', price: 15, photo: PHOTOS.charger, condition: 'like-new' },
  { title: 'JBL Bluetooth Speaker', price: 40, photo: PHOTOS.speaker, condition: 'good' },
];

const FURNITURE = [
  { title: 'Study Table with Drawer', price: 45, photo: PHOTOS.desk, condition: 'good' },
  { title: 'Office Chair — Adjustable', price: 55, photo: PHOTOS.chair, condition: 'fair' },
  { title: 'Bean Bag (Large)', price: 25, photo: PHOTOS.beanbag, condition: 'good' },
  { title: '3-Tier Bookshelf', price: 35, photo: PHOTOS.shelf, condition: 'like-new' },
  { title: 'Foldable Study Table', price: 30, photo: PHOTOS.desk, condition: 'good' },
  { title: 'Single Mattress (3 inch)', price: 40, photo: PHOTOS.mattress, condition: 'fair' },
  { title: 'Bedside Lamp', price: 10, photo: PHOTOS.lamp, condition: 'good' },
  { title: 'Full-Length Mirror', price: 18, photo: PHOTOS.mirror, condition: 'like-new' },
  { title: 'Storage Rack for Hostel', price: 22, photo: PHOTOS.rack, condition: 'good' },
  { title: 'Shoe Rack — 4 Tier', price: 12, photo: PHOTOS.rack, condition: 'fair' },
];

const CLOTHES = [
  { title: 'Nike Hoodie (Size M)', price: 35, photo: PHOTOS.hoodie, condition: 'like-new' },
  { title: 'Lab Coat — Chemistry Dept', price: 15, photo: PHOTOS.labcoat, condition: 'good' },
  { title: 'Winter Jacket — North Face', price: 65, photo: PHOTOS.jacket, condition: 'good' },
  { title: 'Nike Running Shoes (Size 9)', price: 45, photo: PHOTOS.shoes, condition: 'fair' },
  { title: 'Adidas Campus Sneakers', price: 40, photo: PHOTOS.sneakers, condition: 'good' },
  { title: 'Traditional Kurta Set', price: 25, photo: PHOTOS.formal, condition: 'like-new' },
  { title: 'Formal Shirt — Van Heusen', price: 18, photo: PHOTOS.formal, condition: 'good' },
  { title: 'College Backpack — Fjällräven', price: 50, photo: PHOTOS.backpack, condition: 'good' },
];

const KITCHEN = [
  { title: 'Electric Kettle 1.5L', price: 15, photo: PHOTOS.kettle, condition: 'good' },
  { title: 'Induction Cooktop', price: 35, photo: PHOTOS.induction, condition: 'like-new' },
  { title: 'Microwave-Safe Container Set', price: 8, photo: PHOTOS.tupperware, condition: 'new' },
  { title: 'French Press Coffee Maker', price: 12, photo: PHOTOS.coffee, condition: 'good' },
  { title: 'Non-Stick Pan + Spatula', price: 14, photo: PHOTOS.kettle, condition: 'fair' },
];

const CYCLES = [
  { title: 'Hero Sprint Cycle (26")', price: 75, photo: PHOTOS.cycle, condition: 'good' },
  { title: 'Firefox Road Runner MTB', price: 120, photo: PHOTOS.cycle, condition: 'fair' },
  { title: 'Gear Cycle — Montra', price: 95, photo: PHOTOS.cycle, condition: 'good' },
  { title: 'Single Speed Campus Cycle', price: 45, photo: PHOTOS.cycle, condition: 'fair' },
  { title: 'BSA Ladybird Cycle', price: 55, photo: PHOTOS.cycle, condition: 'good' },
];

const STATIONERY = [
  { title: 'Scientific Calculator + Stationery Kit', price: 12, photo: PHOTOS.stationery, condition: 'new' },
  { title: 'Whiteboard Markers (pack of 12)', price: 5, photo: PHOTOS.stationery, condition: 'new' },
  { title: 'A4 Notebook Bundle (5 pcs)', price: 8, photo: PHOTOS.notes, condition: 'new' },
  { title: 'Drawing Instruments Set', price: 10, photo: PHOTOS.stationery, condition: 'like-new' },
  { title: 'Desk Organizer + Lamp Combo', price: 18, photo: PHOTOS.lamp, condition: 'good' },
];

const SPORTS = [
  { title: 'Yonex Badminton Racket', price: 30, photo: PHOTOS.badminton, condition: 'good' },
  { title: 'Nike Football — Size 5', price: 15, photo: PHOTOS.football, condition: 'fair' },
  { title: 'Cricket Kit (bat + pads)', price: 85, photo: PHOTOS.cricket, condition: 'good' },
  { title: 'Yoga Mat — 6mm', price: 12, photo: PHOTOS.yoga, condition: 'like-new' },
  { title: 'Adjustable Dumbbells (5kg pair)', price: 25, photo: PHOTOS.dumbbells, condition: 'good' },
];

const OTHER = [
  { title: 'Laptop Stand — Aluminium', price: 20, photo: PHOTOS.desk, condition: 'like-new' },
  { title: 'Thermal Flask 1L', price: 8, photo: PHOTOS.misc, condition: 'good' },
  { title: 'Umbrella — Compact', price: 6, photo: PHOTOS.misc, condition: 'fair' },
  { title: 'Extension Board 4-Socket', price: 7, photo: PHOTOS.misc, condition: 'good' },
  { title: 'Mini Fan for Desk', price: 10, photo: PHOTOS.misc, condition: 'like-new' },
];

const DESCRIPTIONS = {
  textbooks: [
    'Used for one semester. No markings inside. Selling because I switched branches.',
    'Bought new last year — cover has minor wear but pages are clean throughout.',
    'Has a few pencil notes in margins. Nothing that blocks the text.',
    'Good for CAT prep. Finished the syllabus, don\'t need it anymore.',
    'Kept in a zip cover. No water damage or torn pages.',
  ],
  electronics: [
    'Works perfectly. Minor scratches on the body from daily use in hostel.',
    'Battery still holds well. Comes with original charger.',
    'Used for online classes. Upgraded so selling this one.',
    'Tested everything before listing. No issues at all.',
    'Small scratch near the port — purely cosmetic, functions fine.',
  ],
  furniture: [
    'Used for one year in hostel. Sturdy, no wobble. Pickup from K Block.',
    'Folds flat for moving. Selling because I\'m shifting to PG.',
    'Clean condition. Can help carry to your room if nearby.',
    'Bought from senior, used one semester. Still in good shape.',
  ],
  clothes: [
    'Worn maybe 3-4 times. Washed and kept in cupboard.',
    'Size didn\'t fit after ordering online. Tags removed but unworn.',
    'Perfect for VIT winters. No stains or tears.',
    'Selling because I\'m graduating and clearing out.',
  ],
  food: [
    'Used in hostel kitchen. Works fine, cleaned before listing.',
    'Barely used — bought for a week and then ate at mess mostly.',
    'All parts included. Pickup from Gandhi Block.',
  ],
  other: [
    'Used for gym and sports. Still in working condition.',
    'Kept in dry storage. Minor wear from regular use.',
    'Selling cheap because I\'m leaving campus next month.',
    'Works as expected. Happy to demo before you buy.',
  ],
};

/** Realistic multi-turn chats keyed by listing title substring */
const CONVERSATION_SCRIPTS = [
  {
    match: /MacBook|Laptop|iPad/,
    lines: [
      { from: 'buyer', text: 'Hi, is this still available?' },
      { from: 'seller', text: 'Yes, still available.' },
      { from: 'buyer', text: 'Can you do $600? I can pick up today.' },
      { from: 'seller', text: 'Lowest I can do is $620. It\'s in really good condition.' },
      { from: 'buyer', text: 'Fair enough. Where can we meet?' },
      { from: 'seller', text: 'Library entrance after 5 pm works for me.' },
    ],
  },
  {
    match: /Chair|Table|Desk/,
    lines: [
      { from: 'buyer', text: 'Hey, is the chair still up for sale?' },
      { from: 'seller', text: 'Yeah it is.' },
      { from: 'buyer', text: 'Any wobble or broken parts?' },
      { from: 'seller', text: 'Nope, fully stable. Used it for study only.' },
      { from: 'buyer', text: 'I\'ll be near the library after 5. Can you bring it down?' },
      { from: 'seller', text: 'Sure, see you then.' },
    ],
  },
  {
    match: /Python|C\+\+|DBMS|Networks/,
    lines: [
      { from: 'buyer', text: 'Hi, is this book still available?' },
      { from: 'seller', text: 'Yes!' },
      { from: 'buyer', text: 'Does it have a lot of written notes inside?' },
      { from: 'seller', text: 'Just a few pencil marks. Nothing heavy.' },
      { from: 'buyer', text: 'Can we meet near the main block tomorrow?' },
      { from: 'seller', text: 'Works for me, around 4 pm?' },
    ],
  },
  {
    match: /Cycle/,
    lines: [
      { from: 'buyer', text: 'Is the cycle still available?' },
      { from: 'seller', text: 'Yes, still here.' },
      { from: 'buyer', text: 'When was the last service done?' },
      { from: 'seller', text: 'About a month ago. Brakes and gears are fine.' },
      { from: 'buyer', text: 'Can I test ride near hostel gate?' },
      { from: 'seller', text: 'Sure, I\'m free evening 6 onwards.' },
    ],
  },
  {
    match: /.*/,
    lines: [
      { from: 'buyer', text: 'Hi, is this still available?' },
      { from: 'seller', text: 'Yes it is.' },
      { from: 'buyer', text: 'Would you take $30 for it?' },
      { from: 'seller', text: 'Could do $35, it\'s barely used.' },
      { from: 'buyer', text: 'Deal. Where can we meet on campus?' },
      { from: 'seller', text: 'Main block canteen around 6?' },
      { from: 'buyer', text: 'Perfect, see you then.' },
    ],
  },
];

/** Listings owned by demo user (for My Listings page) */
const DEMO_USER_LISTINGS = [
  { ref: 'MacBook Air M1 (2020)', status: 'active' },
  { ref: 'Data Structures using C++', status: 'active' },
  { ref: 'Study Table with Drawer', status: 'active' },
  { ref: 'LED Study Lamp', status: 'active' },
  { ref: 'Nike Hoodie (Size M)', status: 'active' },
  { ref: 'Organic Chemistry 7th Edition', status: 'sold' },
  { ref: 'Logitech Gaming Mouse', status: 'sold' },
  { ref: 'Bean Bag (Large)', status: 'sold' },
];

/** Spread createdAt across realistic windows (minutes → months) */
const POSTED_OFFSETS = [
  { weight: 0.08, fn: () => mins(12) },
  { weight: 0.07, fn: () => mins(35) },
  { weight: 0.10, fn: () => mins(90) },
  { weight: 0.12, fn: () => hrs(5) },
  { weight: 0.15, fn: () => days(1) },
  { weight: 0.18, fn: () => days(3) },
  { weight: 0.15, fn: () => days(7) },
  { weight: 0.15, fn: () => days(21) },
];

function mins(n) { return new Date(Date.now() - n * 60 * 1000); }
function hrs(n) { return new Date(Date.now() - n * 60 * 60 * 1000); }
function days(n) { return new Date(Date.now() - n * 24 * 60 * 60 * 1000); }
function monthsAgo(n) { return new Date(Date.now() - n * 30 * 24 * 60 * 60 * 1000); }

function pickPostedDate(rng) {
  const x = rng();
  let acc = 0;
  for (const o of POSTED_OFFSETS) {
    acc += o.weight;
    if (x <= acc) return o.fn();
  }
  return days(14);
}

function buildListings(rng) {
  const toListing = (item, category, tag) => ({
    title: item.title,
    price: item.price,
    category,
    condition: item.condition,
    photos: [item.photo],
    dorm: DORMS[Math.floor(rng() * DORMS.length)],
    description: DESCRIPTIONS[category][Math.floor(rng() * DESCRIPTIONS[category].length)],
    tag,
  });

  return [
    ...BOOKS.map(b => toListing(b, 'textbooks', 'book')),
    ...ELECTRONICS.map(e => toListing(e, 'electronics', 'electronics')),
    ...FURNITURE.map(f => toListing(f, 'furniture', 'furniture')),
    ...CLOTHES.map(c => toListing(c, 'clothes', 'clothes')),
    ...KITCHEN.map(k => toListing(k, 'food', 'kitchen')),
    ...CYCLES.map(c => toListing(c, 'other', 'cycle')),
    ...STATIONERY.map(s => toListing(s, 'other', 'stationery')),
    ...SPORTS.map(s => toListing(s, 'other', 'sports')),
    ...OTHER.map(o => toListing(o, 'other', 'other')),
  ];
}

function pickConversation(listingTitle) {
  for (const script of CONVERSATION_SCRIPTS) {
    if (script.match.test(listingTitle)) return script.lines;
  }
  return CONVERSATION_SCRIPTS[CONVERSATION_SCRIPTS.length - 1].lines;
}

module.exports = {
  COLLEGE,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  USERS,
  DORMS,
  buildListings,
  pickPostedDate,
  pickConversation,
  DEMO_USER_LISTINGS,
  monthsAgo,
};
