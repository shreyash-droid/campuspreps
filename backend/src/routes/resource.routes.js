const express = require('express');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resource.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // Apply protection to all routes

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResource)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;