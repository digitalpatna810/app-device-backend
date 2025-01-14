import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return value.length > 0;
        },
        message: 'Title cannot be blank',
      },
    },
    description: {
      type: String,
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
  },
  { timestamps: true }
);

export const Post = model('Post', postSchema);