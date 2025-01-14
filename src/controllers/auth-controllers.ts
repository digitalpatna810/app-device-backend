import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwtConfig from "../config/jwt";
import { User, IUser } from "../models/user-model";
import {sendVerificationEmail, sendEmail} from "../services/email-service";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../middlewares/auth-middleware";
import { sendToken, sendTokenForAuth } from "../services/otp-service";
import { verifyOTP as firebaseVerifyOTP } from "../services/otp-service";

const OTP_EXPIRATION = 300;
const otpStore: Record<string, { otp: string, expiresAt: number, verifiedToResetPassword?: boolean }> = {};
const hashData = async (data: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
};

const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const generateAccessAndRefreshToken = async (userId: string, firstName: string, lastName: string, deviceId: string, role:string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const token = jwtConfig.generateToken(userId, firstName, lastName, deviceId, role);
    const refreshToken = jwtConfig.generateRefreshToken(userId);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { token, refreshToken };
  } catch (err) {
    console.error("Error generating tokens:", err);
    throw new Error("Token generation failed");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, phoneNumber } = req.body;

  try {

    if ((email || phoneNumber) && password) {
      const user = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      }).select("+password");

      if (!user) {
        res.status(400).json({
          status: 400,
          message: `${email ? "Email" : "Mobile"} not found`,
        });
        return;
      }

      const isMatch = await verifyPassword(password, user.password);

      if (!isMatch) {
        res.status(400).json({ status: 400, message: "Incorrect Password" });
        return;
      }

      const { token, refreshToken }: { token: string; refreshToken: string } =
        await generateAccessAndRefreshToken(user.id, user.firstName, user.lastName, user.deviceId, user.role);

      const loggedIn = await User.findById(user.id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      res
        .status(200)
        .cookie("token", token, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          status: 200,
          data: loggedIn,
          token,
          refreshToken,
          message: "Login successful",
        });

      return;
    } else {
      res.status(400).json({
        status: 400,
        message: "Please provide either mobile or both email and password",
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
    return;
  }
};

export const logOutUser = async (req: any, res: any): Promise<void> => {
  try {
   
    if (!req.user?.userId as any) {
      res
        .status(400)
        .json({ status: 400, message: "User not found or not logged in" });
      return;
    }

    await User.findByIdAndUpdate(
      req.user?.userId,
      { $set: { refreshToken: undefined } },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("token", options)
      .clearCookie("refreshToken", options)
      .json({
        status: 200,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Logout Error:", error);
    res
      .status(500)
      .json({ status: 500, message: "Server error during logout" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToekn =  req.body.refreshToken;

  if (!incomingRefreshToekn || incomingRefreshToekn === undefined) {
    res.status(401).json({ status: 401, message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToekn,
      process.env.JWT_SECRET_REFRESH!
    ) as DecodedToken;

    const user = await User.findById(decodedToken?.userId);

    if (!user) {
      res.status(401).json({ status: 401, message: "Invalid Token" });
      return;
    }

    if (incomingRefreshToekn !== user?.refreshToken) {
      res
        .status(401)
        .json({ status: 401, message: "Refresh Token is expired or Used" });
      return;
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { token, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.id, user.firstName, user.lastName, user.deviceId, user.role);

    res
      .status(200)
      .cookie("token", token, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        status: 200,
        refreshToken: newRefreshToken,
        message: "Access Token Refreshed Succesfully",
      });
    return;
  } catch (error) {
    res
      .status(401)
      .json({ status: 401, message: "Refresh Token is expired or Used" });
    return;
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      deviceId
    } = req.body;

    if (password !== confirmPassword) {
      res.status(401).json({ status: 401, message: "Password does't Match" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    
    if (existingUser) {
      res.status(409).json({
        status: 409,
        message: "User with this email or phone number already exists.",
      });
      return;
    }
    
    const hashedPassword = await hashData(password);

    const {customToken, user_uid} = await sendTokenForAuth(phoneNumber);
    console.log(customToken);
    // const isValid = await firebaseVerifyOTP(user_uid, customToken);
    // if (!isValid) {
    //   res.status(400).json({ status: 400, message: "Error in signing in" });
    //   return;
    // }
    const newUser: IUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      verificationToken: customToken,
      verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
      deviceId
    });

    const savedUser = await newUser.save();

    await sendVerificationEmail(email, customToken);

    const token = jwtConfig.generateToken(savedUser._id.toString(), savedUser.firstName, savedUser.lastName, savedUser.deviceId, savedUser.role);
    const refreshToken = jwtConfig.generateRefreshToken(
      savedUser._id.toString()
    );

    res.status(201).json({
      status: "Success",
      message: "Sign-up successful",
      data: {
        user: savedUser,
      },
      token,
      refreshToken: refreshToken,
    });

    return;
  } catch (error: any) {
    console.error("SignUp Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};
export const signInWithPhone = async (req: any, res: any): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).json({status:400, message: 'Provide Phone Number' });
    return;
  }
  const { customToken, user_uid } = await sendTokenForAuth(phoneNumber);
  if (!customToken) {
    res.status(400).json({status:400, message: 'Error creating custom token' });
          return;
  };
  res.status(200).json({ status: 200, message: "Custom token generated successfully", data: {customToken, user_uid} });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Invalide server error", error: error.message });
  }
  
}
let uid: any = null

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber } = req.body;

  try {
      const user = await User.findOne(email ? { email } : { phoneNumber });

      if (!user) {
          res.status(400).json({status:400, message: 'User not found', data: "Failed" });
          return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const key = email ? `otp:${email}` : `otp:${phoneNumber}`;
      otpStore[key] = { otp, expiresAt: Date.now() + OTP_EXPIRATION * 1000, verifiedToResetPassword: false };

      if (email) {
          try {
              await sendEmail(email, 'Password Reset Validation Code', `Your validation code is ${otp}`);
              res.status(200).json({
                  status: 200,
                  message: 'OTP sent to your email',
                  data: "Success",
                  id: user._id
              });
          } catch (error) {
              res.status(400).json({
                  status: 400,
                  message: 'Failed to send OTP',
                  data: "Failed"
              });
          }
          
      } else if (phoneNumber) {
          try {
            const { customToken, user_uid } = await sendToken(phoneNumber);
            uid = user_uid
            if (!customToken) {
              res.status(400).json({
                status: 400,
                message: "User Not found in firebase auth",
                data: customToken,
              });
              return;
            }
            res.status(200).json({
              status: 200,
              message: "Custom token generated for verification",
              data: customToken,
              id: user._id,
            });
          } catch (error: any) {
            console.error("Error generating custom token:", error.message);
            res.status(500).json({
              status: 500,
              message: "Failed to generate custom token",
              data: error.message,
            });
          }
          
      }
  } catch (error: any) {
      console.error(error);
      res.status(500).json({status:500, message: 'Server error', error: error.message, data:"Failed" });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber, otp } = req.body;
  console.log(phoneNumber, otp)
  try {
      const user = await User.findOne(email ? { email } : { phoneNumber });
      if (!user) {
          res.status(400).json({status:400, message: 'User not found', data: email ? email : phoneNumber });
          return;
      }
      const key = email ? `otp:${email}` : `otp:${phoneNumber}`;
      const storedOtpData = otpStore[key];
      if (email) {
          if (!storedOtpData || Date.now() > storedOtpData.expiresAt) {
              delete otpStore[key];
              res.status(400).json({status:400, message: 'OTP expired or invalid' });
              return;
          }

          if (storedOtpData.otp !== otp) {
              res.status(400).json({status:400, message: 'Incorrect OTP', data: otp });
              return;
          }
          otpStore[key].verifiedToResetPassword = true;
          res.status(200).json({status:200, message: 'OTP verified, proceed to reset password', data: user });
      } else if (phoneNumber) {
        const isValid = await firebaseVerifyOTP(uid, otp);
        console.log(isValid)
        if (!isValid) {
          res.status(400).json({ status: 400, message: "Invalid token", data: otp });
          return;
        }
  
        otpStore[key].verifiedToResetPassword = true;
        res.status(200).json({
          status: 200,
          message: "Token verified, proceed to reset password",
          data: user,
        });
      }
  } catch (error: any) {
      console.error(error);
      res.status(500).json({status:500, message: 'Server error', data: error.message });
  }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber, newPassword } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  try {
      const user = await User.findOne(email ? { email } : { phoneNumber });
      if (!user) {
          res.status(400).json({status:400, message: 'User not found', data: "Failed" });
          return;
      }
      if (!passwordRegex.test(newPassword)) {
          res.status(400).json({
              status:400,
              message: 'Max 8 characters, atleast one uppercase, lowercase, digit, special character.',
              data: "FailedError"
          });
          return;
      }
      const key = email ? `otp:${email}` : `otp:${phoneNumber}`;
      const storedOtpData = otpStore[key];

      if (!storedOtpData?.verifiedToResetPassword) {
          res.status(400).json({status:400, message: 'Unauthorized: Please verify OTP before resetting password', data:"Failed" });
          return;
      }
      const isMatch = await bcrypt.compare(newPassword, user?.password);
      console.log(isMatch)
      if (isMatch) {
          res.status(400).json({status:400, message: "New password cannot be the same as the old password", data: "FailedError" });
          return;
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      delete otpStore[key];
      res.status(200).json({status:200, message: 'Password reset successfully', data: "Success" });
  } catch (error: any) {
      console.error(error);
      res.status(500).json({status:500, message: 'Server error', error: error.message, data:"Failed" });
  }
};