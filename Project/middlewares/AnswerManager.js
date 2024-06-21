const errorcodesenum = require('../structs/errors/errorcodes.js');
const errorCodes = require('../structs/errors/errorcodemapping.js');

class AnswerManager {
  static handleSuccess(res, data, message = 'Operation successful', status = 200) {
    res.status(status).json({
      status: 'success',
      message: message,
      data: data,
    });
  }

  static handleError(res, err) {
    
    const statusCode = err.status || errorcodesenum.INTERNAL_SERVER_ERROR;
    const errorMessage = errorCodes[statusCode] || 'Unknown Error';
    if(process.env.NODE_ENV==="development")
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: err.printMessage,
            developmentMessage: err.message || errorMessage,
            
          });
    }
    else
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: err.printMessage,
          });
    }

  }

  static handleFieldValidationError(res, err) {
    
    const statusCode = errorcodesenum.FIELDS_MISSING;
    const errorMessage = errorCodes[statusCode] || 'Unknown Error';
    if(process.env.NODE_ENV==="development")
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: errorMessage,
            developmentMessage: err.ValidationError || errorMessage,
            
          });
    }
    else
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: errorMessage,
          });
    }

  }
}

module.exports = AnswerManager;
