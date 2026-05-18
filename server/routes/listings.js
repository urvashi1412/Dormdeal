const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Listing = require('../models/Listing');
const protect = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'dormdeal', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/listings  — browse with filters & search
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, sort = 'newest', page = 1, limit = 20 } = req.query;
    const filter = { college: req.user.college, status: 'active' };

    if (category && category !== 'all') filter.category = category;
    if (search) filter.$text = { $search: search };

    const sortMap = { newest: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 } };
    const listings = await Listing.find(filter)
      .populate('seller', 'name avatar rating college')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);
    res.json({ listings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name avatar rating ratingCount college');
    if (!listing || listing.status === 'deleted') return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/listings  — create with up to 4 photos
router.post('/', protect, upload.array('photos', 4), async (req, res) => {
  try {
    const { title, description, price, category, condition, dorm } = req.body;
    const photos = req.files ? req.files.map(f => f.path) : [];
    const listing = await Listing.create({
      seller: req.user._id, college: req.user.college,
      title, description, price, category, condition, dorm, photos
    });
    await listing.populate('seller', 'name avatar rating');
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/listings/:id  — update (seller only)
router.patch('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your listing' });

    const allowed = ['title', 'description', 'price', 'condition', 'dorm', 'status'];
    allowed.forEach(f => { if (req.body[f] !== undefined) listing[f] = req.body[f]; });
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your listing' });
    listing.status = 'deleted';
    await listing.save();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/user/me  — my listings
router.get('/user/me', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id, status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
