import { verifyToken } from "../utils/jwt.js";
import HttpError from "../utils/HttpError.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new HttpError("No Token, Authorization Denied", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      throw new HttpError("Invalid or Expired Token", 401);
    }
    req.user = verifiedToken;
    next();
  } catch (error) {
    console.log("error in token validation " + error);
    throw new HttpError("Invalid Token", 401);
  }
};
