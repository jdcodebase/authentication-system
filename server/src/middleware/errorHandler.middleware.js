import env from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    err.statusCode = 409;

    const field = Object.keys(err.keyValue)[0];
    err.message = `${field} already exists.`;
    err.errors = [];
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = "Validation failed.";
    err.errors = Object.values(err.errors).map((error) => error.message);
  }

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "Invalid resource ID.";
    err.errors = [];
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
