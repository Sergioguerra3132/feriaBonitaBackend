// errorHandlerMiddleware.js

 const AnswerManager = require('./AnswerManager'); // adjust the path as needed

 const errorHandler = (err, req, res, next) => {
   AnswerManager.handleError(res, err);
 };
 
 module.exports = errorHandler;
 

