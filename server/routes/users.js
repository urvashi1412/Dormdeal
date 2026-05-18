const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// GET /api/users/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me  — update profile
router.patch('/me', protect, async (req, res) => {
  try {
    const allowed = ['name', 'avatar', 'dorm'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/users/:id/rate  — rate a seller after a transaction
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { score } = req.body; // 1–5
    if (score < 1 || score > 5) return res.status(400).json({ message: 'Score must be 1–5' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newCount = user.ratingCount + 1;
    user.rating = ((user.rating * user.ratingCount) + score) / newCount;
    user.ratingCount = newCount;
    await user.save();
    res.json({ rating: user.rating, ratingCount: user.ratingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
