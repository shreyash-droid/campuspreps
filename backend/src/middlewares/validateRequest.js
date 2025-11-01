const { StatusCodes } = require('http-status-codes');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error.details[0].message);
    }
    next();
  };
};

module.exports = validateRequest;