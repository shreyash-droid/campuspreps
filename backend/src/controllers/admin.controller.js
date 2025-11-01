const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Resource = require('../models/resource.model');

// @desc    Get all pending resources
// @route   GET /api/admin/resources/pending
// @access  Private/Admin
exports.getPendingResources = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await Resource.countDocuments({ status: 'pending' });
  const resources = await Resource.find({ status: 'pending' })
    .populate([
      { path: 'uploadedBy', select: 'name email' },
      { path: 'moduleId', populate: { path: 'subjectId' } }
    ])
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    success: true,
    data: resources,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Moderate a resource (approve/reject)
// @route   PUT /api/admin/resources/:id/moderate
// @access  Private/Admin
exports.moderateResource = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Status must be either approved or rejected');
  }

  if (status === 'rejected' && !rejectionReason) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Rejection reason is required when rejecting a resource');
  }

  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Resource not found');
  }

  if (resource.status !== 'pending') {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Resource has already been moderated');
  }

  resource.status = status;
  if (status === 'rejected') {
    resource.rejectionReason = rejectionReason;
  }
  
  await resource.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: resource
  });
});

// @desc    Get moderation statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getModerationStats = asyncHandler(async (req, res) => {
  const [total, pending, approved, rejected] = await Promise.all([
    Resource.countDocuments(),
    Resource.countDocuments({ status: 'pending' }),
    Resource.countDocuments({ status: 'approved' }),
    Resource.countDocuments({ status: 'rejected' })
  ]);

  const recentActivity = await Resource.find()
    .select('title status updatedAt')
    .sort({ updatedAt: -1 })
    .limit(5);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      total,
      pending,
      approved,
      rejected,
      recentActivity
    }
  });
});