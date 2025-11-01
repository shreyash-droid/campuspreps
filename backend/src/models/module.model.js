const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a module name'],
    trim: true
  },
  moduleNumber: {
    type: Number,
    required: [true, 'Please provide a module number']
  },
  subjectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Create indexes
moduleSchema.index({ subjectId: 1, moduleNumber: 1 }, { unique: true });

module.exports = mongoose.model('Module', moduleSchema);