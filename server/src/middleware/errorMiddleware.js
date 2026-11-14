
export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;
  next(error);
};

export const errorMiddleware = (error, req, res, next) => {
  console.error("API Error:", error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Invalid MongoDB ObjectId
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  // Duplicate MongoDB record
  else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this information already exists.";
  }

  // Invalid JWT
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  // Expired JWT
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired.";
  }

  // Malformed JSON request
  else if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    statusCode = 400;
    message = "Invalid JSON request body.";
  }

  // Hide internal server errors in production
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Something went wrong. Please try again later.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
