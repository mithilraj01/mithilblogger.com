import mongoose, { Schema, Model } from 'mongoose';
import { IContent } from '@/types';

const ContentSchema = new Schema<IContent>(
  {
    websiteId: {
      type: String,
      required: true,
      ref: 'Website',
    },
    url: {
      type: String,
    },
    rawText: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['blog', 'product', 'service', 'landing'],
      default: 'blog',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ContentSchema.index({ websiteId: 1 });
ContentSchema.index({ createdAt: -1 });

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
