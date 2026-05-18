const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const protect = require('../middleware/auth');

// GET /api/messages/conversations  — all chat threads for current user
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Get the latest message per roomId involving this user
    const threads = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$roomId', lastMessage: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$lastMessage' } },
      { $sort: { createdAt: -1 } }
    ]);

    // Populate manually after aggregate
    const populated = await Message.populate(threads, [
      { path: 'sender',   select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' },
      { path: 'listing',  select: 'title photos price status' }
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/:roomId  — messages in a room
router.get('/:roomId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { roomId: req.params.roomId, receiver: req.user._id, read: false },
      { read: true }
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages  — send a message
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, listingId, receiverId, body } = req.body;
    const message = await Message.create({
      roomId, listing: listingId,
      sender: req.user._id, receiver: receiverId, body
    });
    await message.populate([
      { path: 'sender',   select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' },
      { path: 'listing',  select: 'title photos price' }
    ]);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/messages/unread/count
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
