import express from "express";
import {
  login,
  logOutUser,
  refreshAccessToken,
  signUp,
  forgotPassword,
  resetPassword,
  verifyOTP,
  signInWithPhone
} from "../controllers/auth-controllers";
import { validateSignUpRequest } from "../middlewares/validate-request";
import { signupRateLimiter } from "../middlewares/rate-limit";
import { verifyJWT } from "../middlewares/auth-middleware";
import { verifyIdTokenForAuth } from "../services/otp-service";

const router = express.Router();


router.post("/sign-up", signupRateLimiter, validateSignUpRequest, signUp);
router.post("/login", login);
router.post("/signInWithPhone", signInWithPhone);
router.post("/verifyIdToken", verifyIdTokenForAuth);
router.post("/logout", verifyJWT, logOutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-Password", forgotPassword);
router.post("/verify-OTP", verifyOTP);
router.post("/reset-Password", resetPassword);

export default router;