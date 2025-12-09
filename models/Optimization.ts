import mongoose, { Schema, Model } from 'mongoose';
import { IOptimization } from '@/types';

const OptimizationSchema = new Schema<IOptimization>(
  {
    contentId: {
      type: String,
      required: true,
      ref: 'Content',
    },
    optimizedText: {
      type: String,
      required: true,
    },
    entities: {
      type: [String],
      default: [],
    },
    citations: {
      type: [String],
      default: [],
    },
    suggestedFAQs: [{
      question: String,
      answer: String,
    }],
    suggestedHeadings: {
      type: [String],
      default: [],
    },
    modelUsed: {
      type: String,
      enum: ['openai', 'gemini'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
OptimizationSchema.index({ contentId: 1 });
OptimizationSchema.index({ createdAt: -1 });

const Optimization: Model<IOptimization> = mongoose.models.Optimization || mongoose.model<IOptimization>('Optimization', OptimizationSchema);

export default Optimization;
