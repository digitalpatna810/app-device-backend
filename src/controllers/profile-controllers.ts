import { Request, Response } from "express";
import { User } from "../models/user-model";
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { uploadToCloudinary } from "./post-controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const profileController = async (req: Request, res: Response) => {
    const userId = req.body;
  
    try {
      if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          res.status(404).json({ status: 404, message: "User Not Found" }); 
          return;
        }
        res.status(200).json({
          status: 200,
          message: "Profile fetched successfully",
          data: user,
        });
      } else {
        res.status(400).json({ status: 400, message: "UserID Not Found" });
      }
    } catch (error) {
      res
        .status(404)
        .json({ status: 404, message: "User Not Found" });
    }
  };
export const editProfile = async (req: any, res: any): Promise<void> => {
  try {
    const  userId = req.user?.userId;
    const { firstName, lastName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email
    }, {new: true});
    if (!updatedUser) {
      res.status(400).json({
        status: 400,
        mesaage: "User not found"
      });
      return;
    }
    res.status(200).json({
      status: 200,
      mesaage: `User updated successfully`,
      data: updatedUser
    });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
}

export const editProfileImage = async (req: any, res: any): Promise<void> => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err.message });
    }
    try {
      const userId = req.user?.userId;
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
  
      const result = await uploadToCloudinary(req.file.buffer, 'images', 'image');
      if (!result) {
        res.status(400).json({ message: "Unable to upload image" });
        return;
      }
      const updatedProfile = await User.findByIdAndUpdate(userId, {
        profileImage: { url: result.secure_url, public_id: result.public_id }
      }, { new: true });
      if (!updatedProfile) {
        res.status(400).json({
          status: 400,
          message: "Unable to update image",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: "Profile image updated successfully",
        data: updatedProfile
      })
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }

  });
}