import logger from "../logs/logger.js";

export default function errorHandler(err, req, res, next) {
    console.log('Nombre del error: ', err.name);
    console.log('Mensaje del error: ', err.message);

    console.error(err.stack); // Log the error stack trace for debugging
    // logger.error(err.stack); // Uncomment if you want to log the error using a logger
    // Send a generic error response

    logger.error(`Error: ${err.name} - ${err.message}`); // Log the error with a logger
    // Check for specific error types and respond accordingly
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors // Assuming err.errors contains validation error details
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Unauthorized',
            error: err.message // Include the error message for unauthorized access
        });
    }
    if (err.name === 'NotFoundError') {
        return res.status(404).json({
            message: 'Resource Not Found',
            error: err.message // Include the error message for not found resources
        });
    }
    // Handle other types of errors
    return res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {} // Show error message only in development
    });
}