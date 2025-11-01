const express = require('express');
const {
  generateQuestions,
  getQuestions
} = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/generate', generateQuestions);
router.get('/questions/:resourceId', getQuestions);

module.exports = router;