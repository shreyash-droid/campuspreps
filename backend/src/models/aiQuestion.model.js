const mongoose = require('mongoose');

const aiQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [1000, 'Question cannot be more than 1000 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  resourceId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
    required: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create indexes
aiQuestionSchema.index({ resourceId: 1 });
aiQuestionSchema.index({ difficulty: 1 });
aiQuestionSchema.index({ tags: 1 });

module.exports = mongoose.model('AIQuestion', aiQuestionSchema);