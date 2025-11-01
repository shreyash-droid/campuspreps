const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subject name'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please specify the year'],
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    required: [true, 'Please specify the semester'],
    min: 1,
    max: 8
  },
  code: {
    type: String,
    required: [true, 'Please provide a subject code'],
    unique: true
  }
}, {
  timestamps: true
});

// Create indexes
subjectSchema.index({ year: 1, semester: 1 });
subjectSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);