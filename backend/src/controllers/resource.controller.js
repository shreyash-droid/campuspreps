const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Resource = require('../models/resource.model');
const Subject = require('../models/subject.model');
const Module = require('../models/module.model');

// @desc    Get all resources with filters and pagination
// @route   GET /api/resources
// @access  Private
exports.getResources = asyncHandler(async (req, res) => {
  const { 
    year, 
    subject, 
    module, 
    type, 
    status = 'approved',
    page = 1, 
    limit = 10,
    search
  } = req.query;

  const query = { status };

  // Add filters
  if (year) {
    const subjects = await Subject.find({ year });
    query.moduleId = { $in: await Module.find({ subjectId: { $in: subjects } }).distinct('_id') };
  }

  if (subject) {
    const modules = await Module.find({ subjectId: subject });
    query.moduleId = { $in: modules.map(m => m._id) };
  }

  if (module) {
    query.moduleId = module;
  }

  if (type) {
    query.resourceType = type;
  }

  // Add text search
  if (search) {
    query.$text = { $search: search };
  }

  const total = await Resource.countDocuments(query);
  const resources = await Resource.find(query)
    .populate([
      { path: 'uploadedBy', select: 'name' },
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

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Private
exports.getResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate([
      { path: 'uploadedBy', select: 'name' },
      { path: 'moduleId', populate: { path: 'subjectId' } }
    ]);

  if (!resource) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Resource not found');
  }

  // Update view count
  resource.viewCount += 1;
  await resource.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: resource
  });
});

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
exports.createResource = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.uploadedBy = req.user.id;

  const resource = await Resource.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: resource
  });
});

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
exports.updateResource = asyncHandler(async (req, res) => {
  let resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Resource not found');
  }

  // Make sure user is resource owner or admin
  if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error('Not authorized to update this resource');
  }

  resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: resource
  });
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
exports.deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Resource not found');
  }

  // Make sure user is resource owner or admin
  if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error('Not authorized to delete this resource');
  }

  await resource.remove();

  res.status(StatusCodes.OK).json({
    success: true,
    data: {}
  });
});