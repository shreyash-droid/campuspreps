const express = require('express');
const {
  getPendingResources,
  moderateResource,
  getModerationStats
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/resources/pending', getPendingResources);
router.put('/resources/:id/moderate', moderateResource);
router.get('/stats', getModerationStats);

module.exports = router;