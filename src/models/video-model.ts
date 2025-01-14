import mongoose, { Schema, model } from 'mongoose';

const videoSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  videoTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true, 
  },
  uploadedAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'
  },
  category: {
    type: String,
    enum: ['medical', 'engineering', 'news', 'gallery'],
    required: true,
  },
}, { timestamps: true });

export const Video = model('Video', videoSchema);