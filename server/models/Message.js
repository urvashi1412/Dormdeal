const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId:    { type: String, required: true },   // listingId + '_' + buyerId
  listing:   { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body:      { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
