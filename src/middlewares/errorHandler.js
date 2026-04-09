const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof AppError)) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry. Resource already exists.';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;