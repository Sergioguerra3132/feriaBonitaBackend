const AnswerManager = require("./AnswerManager");

function validateSchema(schema) {
    return (req, res, next) => {
      
      const { error } = schema.validate(req.body);

      if (error) {
        const err = new Error(error.details[0].message);
        err.status = 400;
        return next(err);
      }
  
      next(); // No error, proceed to the next middleware
    };
  }
  
  module.exports = validateSchema;