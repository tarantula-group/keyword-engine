var winston = require('winston');

module.exports = function errorHandler(err, req, res, next) {
    winston.info(err);

    var errorToSend = {
        errorMessage: err.message,
        errorName: err.name,
        errorStack: err.stack,
        errorCode: err.code
    };

    if (err.originalError) {
        Object.assign(errorToSend, {
            originalError: err.originalError.message,
            originalErrorStack: err.originalError.stack
        })
    }

    res.status(400).json(errorToSend);
};
