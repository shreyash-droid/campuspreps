const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const AIQuestion = require('../models/aiQuestion.model');

// @desc    Generate questions from resource content
// @route   POST /api/ai/generate
// @access  Private
exports.generateQuestions = asyncHandler(async (req, res) => {
  const { resourceId, content, difficulty = 'medium', count = 5 } = req.body;

  if (!content) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Content is required for question generation');
  }

  // AI prompt template for question generation
  const prompt = `Generate ${count} ${difficulty} level questions with answers based on the following content:
  
  ${content}
  
  Format each question as:
  Q: [question text]
  A: [detailed answer]
  
  Make sure questions test understanding and not just memorization.`;

  try {
    // Make API call to OpenAI/Gemini
    const response = await fetch(process.env.AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",  // or relevant Gemini model
        messages: [{
          role: "system",
          content: "You are an expert academic question generator."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7
      })
    });

    const aiResponse = await response.json();
    
    // Parse AI response and create questions
    const questions = parseAIResponse(aiResponse.choices[0].message.content);
    
    // Save questions to database
    const savedQuestions = await AIQuestion.create(
      questions.map(q => ({
        questionText: q.question,
        answer: q.answer,
        difficulty,
        resourceId,
        tags: extractTags(content)
      }))
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: savedQuestions
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw new Error('Error generating questions: ' + error.message);
  }
});

// @desc    Get questions for a resource
// @route   GET /api/ai/questions/:resourceId
// @access  Private
exports.getQuestions = asyncHandler(async (req, res) => {
  const { difficulty, limit = 10 } = req.query;
  const query = { resourceId: req.params.resourceId };

  if (difficulty) {
    query.difficulty = difficulty;
  }

  const questions = await AIQuestion.find(query)
    .limit(parseInt(limit));

  res.status(StatusCodes.OK).json({
    success: true,
    data: questions
  });
});

// Helper function to parse AI response
const parseAIResponse = (response) => {
  const questions = [];
  const parts = response.split('\n\n');

  for (let part of parts) {
    const qMatch = part.match(/Q: (.*)/);
    const aMatch = part.match(/A: (.*)/);
    
    if (qMatch && aMatch) {
      questions.push({
        question: qMatch[1].trim(),
        answer: aMatch[1].trim()
      });
    }
  }

  return questions;
};

// Helper function to extract relevant tags from content
const extractTags = (content) => {
  // Simple implementation - extract capitalized words as potential topics
  const topics = content.match(/[A-Z][a-z]{2,}/g) || [];
  return [...new Set(topics)]; // Remove duplicates
};