const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resourceId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
    required: true
  },
  markedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound unique index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);