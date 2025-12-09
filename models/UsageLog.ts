import mongoose, { Schema, Model } from 'mongoose';
import { IUsageLog } from '@/types';

const UsageLogSchema = new Schema<IUsageLog>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    tokenCost: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Index for faster queries
UsageLogSchema.index({ userId: 1, timestamp: -1 });
UsageLogSchema.index({ timestamp: -1 });

const UsageLog: Model<IUsageLog> = mongoose.models.UsageLog || mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);

export default UsageLog;
