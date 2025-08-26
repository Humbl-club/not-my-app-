/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(`[ERROR] ${req.requestId}:`, err);
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send error response
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      status: statusCode,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    }
  });
};