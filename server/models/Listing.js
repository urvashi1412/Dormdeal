const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college:     { type: String, required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true,
                 enum: ['textbooks', 'furniture', 'electronics', 'clothes', 'food', 'other'] },
  condition:   { type: String, required: true,
                 enum: ['new', 'like-new', 'good', 'fair', 'poor'] },
  photos:      [{ type: String }],
  dorm:        { type: String, default: '' },
  status:      { type: String, default: 'active', enum: ['active', 'sold', 'deleted'] },
  createdAt:   { type: Date, default: Date.now }
});

listingSchema.index({ college: 1, status: 1, category: 1 });
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
