import { NextFunction} from "express";
import jwt from "jsonwebtoken";

export interface DecodedToken {
    userId: string;
  iat?: number;
  exp?: number;
}

export const verifyJWT = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Not authorized, token is required" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    req.user = decoded;

    // Call the next middleware
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};
export const authorizeAdmin = (req:any, res:any, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
      next();
  } else {
      res.status(400).send("Not authorized as an admin");
  }
}
