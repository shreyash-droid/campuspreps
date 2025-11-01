const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const resourceSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
  
  resourceType: Joi.string()
    .valid('notes', 'pyq', 'video')
    .required()
    .messages({
      'any.only': 'Resource type must be either notes, pyq, or video',
      'any.required': 'Resource type is required'
    }),
  
  moduleId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid module ID',
      'any.required': 'Module ID is required'
    })
});

const moderationSchema = Joi.object({
  status: Joi.string()
    .valid('approved', 'rejected')
    .required()
    .messages({
      'any.only': 'Status must be either approved or rejected',
      'any.required': 'Status is required'
    }),
  
  rejectionReason: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  resourceSchema,
  moderationSchema
};