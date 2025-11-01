const express = require('express');
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/favorite.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFavorites)
  .post(addFavorite);

router.delete('/:resourceId', removeFavorite);

module.exports = router;