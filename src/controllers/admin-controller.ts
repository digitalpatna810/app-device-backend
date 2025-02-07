import { User, UserRole } from '../models/user-model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { sendNotification } from "../services/notification-service"
import { sendEmail } from '../services/email-service';
import { Post } from '../models/post-model';
import { Video } from '../models/video-model';
import { DeletedUser } from '../models/deletedUser-model';

//------------------------ADMIN AUTH----------------------------

export const signupAdmin = async (req: any, res: any) => {
  const { firstName, lastName, deviceId, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      firstName,
      lastName,
      deviceId,
      phoneNumber,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: newAdmin,
    });
  } catch (error: any) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
   
export const loginAdmin = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: UserRole.ADMIN });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({
        message: 'Admin logged in successfully',
        token,
        data: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        }
    });

    } catch (error: any) {
      console.error('Error logging in admin:', error);
      res.status(500).json({ message: 'Server error', error });
    }
};

//----------------------ADMIN PROFILE-------------------

export const getAdminProfile = async (req: any, res: any) => {
  try {
    console.log(req.user);
    const userId = req.user?.id;
    console.log(userId)
    const admin = await User.findById(userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
 
    res.status(200).json({ admin });
 
    } catch (error: any) {
      console.error('Error retrieving admin profile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
};
 
export const getUsersByIds = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    console.log(userIds)

    if (!userIds || !Array.isArray(userIds)) {
       res.status(400).json({ message: "Invalid user IDs" });
       return;
    }

   const users = await User.find({_id: {$in:userIds}}).select ("_id firstName lastName");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersList = await User.find().select("-password");
    if (usersList.length === 0) {
      res.status(400).json({ status: 400, message: "Users not found" });
      return;
    }
    res.status(200).json({ status: 400, message: "Users fetched successfully", data: usersList });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
}
export const updateUsersRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      role
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
      mesaage: `User's role updated to ${role}`,
      data: updatedUser
    });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
}
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: 400,
        message: "User not found",
      });
      return;
    }
    const newDeletedUser = new DeletedUser({
      originalUserId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      deviceId: user.deviceId,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
      verificationTokenExpiry: user.verificationTokenExpiry,
      refreshToken:user.refreshToken,
      profileImage: user.profileImage,
      role: user.role,
    });
    await newDeletedUser.save();

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(400).json({
        status: 400,
        message: "Unable to delete user"
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: "User deleted successfully and archived.",
      data: deletedUser
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const retrieveUser = async (req: any, res: any):Promise<void>=>{
  try {
    const { deletedEmail, deletedphoneNumber } = req.body; 
    if (!deletedEmail && !deletedphoneNumber) {
      res.status(400).json({
        status: 400,
        message: "Provide all info"
      });
      return;
    }
    const deletedUser = await DeletedUser.findOne(deletedEmail ? { email: deletedEmail } : { phoneNumber: deletedphoneNumber});
    if (!deletedUser) {
      res.status(404).json({
        status: 404,
        message: "Deleted user not found",
      });
      return;
    }
    const existingUser = await User.findOne({
      $or: [
        { email: deletedUser.email },
        { phoneNumber: deletedUser.phoneNumber },
      ],
    });

    if (existingUser) {
      res.status(400).json({
        status: 400,
        message: "User with the same email, phone number already exists",
      });
      return;
    }
    const restoredUser = new User({
      _id: deletedUser.originalUserId,
      firstName: deletedUser.firstName,
      lastName: deletedUser.lastName,
      deviceId: deletedUser.deviceId,
      phoneNumber: deletedUser.phoneNumber,
      email: deletedUser.email,
      profileImage: deletedUser.profileImage,
      password: deletedUser.password, 
      isVerified: deletedUser.isVerified,
      verificationToken: deletedUser.verificationToken,
      verificationTokenExpiry: deletedUser.verificationTokenExpiry,
      refreshToken: deletedUser.refreshToken,
      role: deletedUser.role,
    });
    const restoredUserSaved = await restoredUser.save();
    await DeletedUser.findByIdAndDelete(deletedUser._id);

    res.status(200).json({
      status: 200,
      message: "User restored successfully",
      data: restoredUserSaved,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
}
export const getAllUsersExceptAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersList = await User.find().select("-password");
    if (usersList.length === 0) {
      res.status(400).json({ status: 400, message: "Users not found" });
      return;
    }
    const userList = usersList.filter((user) => (
      user.role != "admin"
    ))
    res.status(200).json({ status: 200, message: "Users fetched successfully", data: userList });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
}
export const getDeletedUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedusersList = await DeletedUser.find().select("-password");
    if (deletedusersList.length === 0) {
      res.status(400).json({ status: 400, message: "Users not found" });
      return;
    }
    res.status(200).json({ status: 200, message: "Users fetched successfully", data: deletedusersList });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
}
//-----------------------------ADMIN CONTENT---------------------------

export const reviewPost = async (req: any, res: any): Promise<void> => {
    try {
        const { postId, videoId, approved  } = req.body;
      console.log(postId, approved);
        if (!postId && !videoId) {
            res.status(400).json({ status: 400, message: "Invalid contentId" });
            return;
        }

        const [userDetail, updatedContent] = await Promise.all([
          postId
              ? Post.findById(postId).select("userId").lean()
              : Video.findById(videoId).select("userId").lean(),
          postId
              ? Post.findByIdAndUpdate(
                    postId,
                    { status: approved },
                    { new: true }
                ).lean()
              : Video.findByIdAndUpdate(
                    videoId,
                    { status: approved },
                    { new: true }
                ).lean(),
      ]);

        if (!userDetail) {
            res.status(400).json({ status: 400, message: "Content not found" });
            return;
      }
      console.log(userDetail);
        const userDetails = await User.findById(userDetail.userId).select("firstName lastName email deviceId").lean();
        if (!userDetails || !userDetails.email) {
            res.status(400).json({ status: 400, message: "User details not found or email is missing" });
            return;
        }
        const message = approved === "Approved"
            ? `Dear ${userDetails.firstName} ${userDetails.lastName}, after reviewing your application we are proceeding with your application.`
            : `Dear ${userDetails.firstName} ${userDetails.lastName}, after reviewing your application we are NOT proceeding with your application. Better luck next time.`;
        
      await sendEmail(userDetails.email, "Application Status", message)
      if (userDetails.deviceId) {
        await sendNotification(userDetails.deviceId, "Application Status", message);
      }
        res.status(200).json({
            status: 200,
            message: "Content updated successfully",
            data: updatedContent,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getPosts = async (req: Request, res: Response):Promise<void> => {
  try {
    const posts = await Post.find();
    if (posts.length === 0) {
      res.status(400).json({ status: 400, message: "Unable to retrieve posts" })
      return
    }
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getVideos = async (req: Request, res: Response):Promise<void> => {
  try {
    const videos = await Video.find().lean();
    if (videos.length === 0) {
      res.status(400).json({ status: 400, message: "Unable to retrieve videos" })
      return
    }
    res.status(200).json({
      success: true,
      message: 'Videos fetched successfully',
      data: videos,
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos', error });
  }
};
export const getContent = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let content = await Post.findById(id);
    if (!content) {
      content = await Video.findById(id);
    }

    if (!content) {
      res.status(400).json({ status: 400, message: "Content not found" });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Content fetched successfully",
      data: content,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch videos', error });
  }
}