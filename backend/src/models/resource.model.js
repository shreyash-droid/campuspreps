const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  resourceType: {
    type: String,
    enum: ['notes', 'pyq', 'video'],
    required: [true, 'Please specify the resource type']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide a file URL or video link']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  moduleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Module',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
resourceSchema.index({ moduleId: 1, status: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ title: 'text', description: 'text' });

// Virtual populate for favorites
resourceSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'resourceId',
  count: true
});

module.exports = mongoose.model('Resource', resourceSchema);