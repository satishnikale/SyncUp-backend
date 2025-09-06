import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import httpStatus from "http-status";

export const userMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header instead of localStorage
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Authorization header with Bearer token is required",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user information to the request object for use in subsequent middleware/controllers
    req.user = decoded;

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Token has expired" });
    }

    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Authentication failed" });
  }
};
