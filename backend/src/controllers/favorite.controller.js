const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Favorite = require('../models/favorite.model');
const Resource = require('../models/resource.model');

// @desc    Add resource to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;

  // Check if resource exists
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Resource not found');
  }

  // Check if already favorited
  const existing = await Favorite.findOne({
    userId: req.user.id,
    resourceId
  });

  if (existing) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Resource already in favorites');
  }

  // Add to favorites
  const favorite = await Favorite.create({
    userId: req.user.id,
    resourceId
  });

  // Update resource favorite count
  await Resource.findByIdAndUpdate(resourceId, {
    $inc: { favoriteCount: 1 }
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: favorite
  });
});

// @desc    Remove resource from favorites
// @route   DELETE /api/favorites/:resourceId
// @access  Private
exports.removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    userId: req.user.id,
    resourceId: req.params.resourceId
  });

  if (!favorite) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Favorite not found');
  }

  await favorite.remove();

  // Update resource favorite count
  await Resource.findByIdAndUpdate(req.params.resourceId, {
    $inc: { favoriteCount: -1 }
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's favorite resources
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await Favorite.countDocuments({ userId: req.user.id });
  const favorites = await Favorite.find({ userId: req.user.id })
    .populate({
      path: 'resourceId',
      populate: [
        { path: 'uploadedBy', select: 'name' },
        { path: 'moduleId', populate: { path: 'subjectId' } }
      ]
    })
    .sort({ markedDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    success: true,
    data: favorites.map(f => f.resourceId),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});