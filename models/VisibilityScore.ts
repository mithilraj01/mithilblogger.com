import mongoose, { Schema, Model } from 'mongoose';
import { IVisibilityScore } from '@/types';

const VisibilityScoreSchema = new Schema<IVisibilityScore>(
  {
    contentId: {
      type: String,
      required: true,
      ref: 'Content',
    },
    chatgptScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    geminiScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rankingProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
VisibilityScoreSchema.index({ contentId: 1 });
VisibilityScoreSchema.index({ createdAt: -1 });

const VisibilityScore: Model<IVisibilityScore> = mongoose.models.VisibilityScore || mongoose.model<IVisibilityScore>('VisibilityScore', VisibilityScoreSchema);

export default VisibilityScore;
