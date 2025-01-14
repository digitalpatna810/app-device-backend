import { Request, Response } from 'express';
import { Post } from '../models/post-model';
import { Video } from '../models/video-model';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { sendEmail } from '../services/email-service';
import { User } from '../models/user-model';
import {sendNotification} from "../services/notification-service"

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string, resourceType: 'image' | 'video' | 'raw' | 'auto'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadPdf = async (req: any, res: any) => {
  const uploadSingle = upload.single('pdf');

  uploadSingle(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading PDF', error: err.message });
    }

    try {
      const userId = req.user?.userId;
      const { title, description, category } = req.body;

      if (!category) {
        return res.status(400).json({ message: 'Category is required' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No PDF file provided' });
      }

      const result = await uploadToCloudinary(req.file.buffer, 'pdf-uploads', 'raw');

      if (!result) {
        return res.status(400).json({ message: 'Unable to upload PDF' });
      }

      const newPost = new Post({
        userId,
        title,
        description,
        category,
        pdf: { url: result.secure_url, public_id: result.public_id },
        uploadedAt: new Date(),
      });

      const savedPost = await newPost.save();

      res.status(201).json({
        message: 'PDF uploaded successfully',
        data: savedPost,
      });
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      res.status(500).json({ message: 'Failed to upload PDF', error });
    }
  });
};

export const uploadImage = async (req: any, res: Response) => {
  
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err.message });
    }

    try {
      const userId = req.user?.userId;
      
      const { title, description, category } = req.body;
      const user: any = await User.findById(userId).select("email deviceId").lean();
      if (!user || !user.email) {
        res.status(400).json({ status: 400, message: "User details not found or email is missing" });
        return;
      }
      if (!title || !description || !category) {
        res.status(400).json({ status: 400, message: "Provide all info" });
        return;
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const result = await uploadToCloudinary(req.file.buffer, 'images', 'image');
      if (!result) {
        res.status(400).json({ message: "Unable to upload image" });
        return;
      }
      const newPost = new Post({
        userId,
        title,
        description,
        category,
        images: [{ url: result.secure_url, public_id: result.public_id }],
      });

      const savedPost = await newPost.save();
      await sendEmail(user?.email, "Application Status", "Your application is under review");
      if (user.deviceId) {
        await sendNotification(user?.deviceId, "Application Status", "Your application is under review");
      }
      res.status(201).json({
        message: 'Image uploaded successfully',
        data: savedPost,
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
};

export const uploadVideo = async (req: any, res: Response) => {
  const uploadSingle = upload.single('video');
  uploadSingle(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading video', error: err.message });
    }

    try {
      const userId = req.user?.userId;
      console.log(userId)
      const user: any = await User.findById(userId).select("email deviceId").lean();
      if (!user || !user.email || !user.deviceId) {
        res.status(400).json({ status: 400, message: "User details not found or email or deviceId is missing" });
        return;
      }
      const { videoTitle, description } = req.body;
      if (!videoTitle || !description) {
        res.status(400).json({ status: 400, message: "Provide videoTitle and description" });
        return;
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No video file provided' });
      }
      const result = await uploadToCloudinary(req.file.buffer, 'videos', 'video');
      if (!result) {
        res.status(400).json({ message: "Unable to upload image" });
        return;
      }
      const newVideo = new Video({
        userId,
        videoTitle,
        description,
        videoUrl: result.secure_url,
        public_id: result.public_id,
        uploadedAt: new Date(),
      });

      const savedVideo = await newVideo.save();
      await sendEmail(user?.email, "Application Status", "Your application is under review");
      if (user.deviceId) {
        await sendNotification(user?.deviceId, "Application Status", "Your application is under review");
      }
      res.status(200).json({
        message: 'Video uploaded successfully',
        data: savedVideo,
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      res.status(500).json({
        message: 'Failed to upload video',
        error: error.message,
      });
    }
  });
};

export const getUserPosts = async (req: any, res: Response):Promise<void> => {
  try {
    const userId = req.user?.userId;
    const posts = await Post.find({ userId });
    const videos = await Video.find({ userId });
    if (posts.length === 0 || videos.length===0) {
      res.status(400).json({ status: 400, message: "Unable to retrieve posts" })
      return
    }
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: {posts, videos},
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPostById = async (req: Request, res: Response):Promise<void> => {
  try {
    const postId = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400).json({ status: 400, message: "Unable to retrieve post" })
      return;
    }
    res.status(200).json({
      status: 200,
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getVideoById = async (req: Request, res: Response):Promise<void> => {
  try {
    const videoId = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(400).json({ status: 400, message: "Unable to retrieve video" })
      return;
    }
    res.status(200).json({
      status: 200,
      message: 'video fetched successfully',
      data: video,
    });
  } catch (error: any) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteContent = async (req: any, res: any): Promise<void> => {
  try {
    const { postId, videoId } = req.body;
    if (!postId && !videoId) {
      return res.status(400).json({
        status: 400,
        message: "Either postId or videoId must be provided.",
      });
    }
    const deletedContent = postId
      ? await Post.findByIdAndDelete(postId)
      : await Video.findByIdAndDelete(videoId);
    if (!deletedContent) {
      return res.status(404).json({
        status: 400,
        message: "Content not found or already deleted.",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Content deleted successfully.",
      data: deletedContent,
    });
  } catch (error: any) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const filterPosts = async (req: any, res: any): Promise<void> => {
  try {
    const validTags = ['medical', 'engineering', 'news', 'gallery'];
    const { tag } = req.body;

    if (!tag || !validTags.includes(tag.toLowerCase())) {
      res.status(400).json({
        status: 400,
        message: "Provide a valid tag",
      });
      return;
    }

    const posts = await Post.find({ category: tag.toLowerCase() });
    const videos = await Video.find({ category: tag.toLowerCase() });
    if (posts.length === 0 && videos.length===0) {
      res.status(400).json({
        status: 400,
        message: "No contents available",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      data: {posts,videos},
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
export const filterPostsUser = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const validTags = ['medical', 'engineering', 'news', 'gallery'];
    const { tag } = req.body;

    if (!tag || !validTags.includes(tag.toLowerCase())) {
      res.status(400).json({
        status: 400,
        message: "Provide a valid tag",
      });
      return;
    }

    const posts = await Post.find({userId, category: tag.toLowerCase() });
    const videos = await Video.find({userId, category: tag.toLowerCase() });
    if (posts.length === 0 && videos.length === 0) {
      res.status(400).json({
        status: 400,
        message: "No contents available",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Contents retrieved successfully",
      data: {posts, videos},
    });
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
export const filterWithTime = async (req: Request, res: any): Promise<void> => {
  try {
    const { past } = req.body;
    const cuttoffDate = new Date();
    cuttoffDate.setDate(cuttoffDate.getDate() - Number(past));
    const filteredPosts = await Post.find({
      createdAt: { $gte: cuttoffDate }
    });
    const filteredVideos = await Video.find({
      createdAt: { $gte: cuttoffDate }
    });
    if (filteredPosts.length === 0 && filteredVideos.length === 0) {
      res.status(400).json({
        status: 400,
        message: "No contents available",
      });
      return;
    }; 
    res.status(200).json({
      status: 200,
      message: "Contents retrieved successfully",
      data: {filteredPosts, filteredVideos},
    });
  } catch (error:any) {
    console.error("Error fetching contents:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
}
export const searchByKeyword = async (req: any, res: any):Promise<void>=>{
  try {
    
    const { keyword } = req.body;
    if (!keyword || typeof keyword !== "string") {
      res.status(400).json({
        status: 400,
        message: "Keyword is required and must be a string",
      });
      return;
    }
    const matchingPosts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ]
    });
    const matchingVideos = await Video.find({
      $or: [
        { videoTitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ]
    });
    if (matchingPosts.length === 0 && matchingVideos.length===0) {
      res.status(400).json({
        status: 400,
        message: "No Posts Found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: "Matching posts fetched successfully",
      data: {matchingPosts, matchingVideos},
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message
    })
  }
}