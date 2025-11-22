export function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
}
