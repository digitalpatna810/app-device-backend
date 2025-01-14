import rateLimit from "express-rate-limit";

export const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many signup attempts, please try again later."
});