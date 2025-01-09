class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent Error class constructor
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Convert to string for startsWith
    this.isOperational = true; // Mark as operational error for better handling

    Error.captureStackTrace(this, this.constructor); // Captures the stack trace, excluding this constructor
  }
}

module.exports = AppError;