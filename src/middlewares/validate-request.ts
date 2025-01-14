import { body, ValidationChain } from "express-validator";
import { User } from "../models/user-model";

export const validateSignUpRequest: ValidationChain[] = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),
  
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("A valid phone number is required")
    .custom(async (value) => {
      const user = await User.findOne({ phoneNumber: value });
      if (user) {
        throw new Error("Phone number already exists");
      }
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("A valid email is required")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];