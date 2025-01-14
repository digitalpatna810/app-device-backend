import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || "device-jwt",
  refreshToken: process.env.JWT_SECRET_REFRESH || "device-refresh",
  expiresIn: "1d",
  refresh_expiresIN: "10d",

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token.");
    }
  },

  generateToken(userId: string, firstName: string, lastName: string, deviceId: string, role: string) {
    return jwt.sign({ userId, firstName, lastName, deviceId, role }, this.secret, {
      expiresIn: this.expiresIn,
    });
  },
  
  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, this.refreshToken, {
      expiresIn: this.refresh_expiresIN,
    });
  },
};

export default jwtConfig;