import mongoose, { Schema, Model } from 'mongoose';
import { IWebsite } from '@/types';

const WebsiteSchema = new Schema<IWebsite>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    domain: {
      type: String,
      required: true,
    },
    cmsType: {
      type: String,
      enum: ['wordpress', 'webflow', 'shopify', 'custom'],
      required: true,
    },
    cmsConfig: {
      apiUrl: String,
      apiKey: String,
      webhookUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
WebsiteSchema.index({ userId: 1 });
WebsiteSchema.index({ domain: 1 });

const Website: Model<IWebsite> = mongoose.models.Website || mongoose.model<IWebsite>('Website', WebsiteSchema);

export default Website;
