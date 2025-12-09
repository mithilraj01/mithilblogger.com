import mongoose, { Schema, Model } from 'mongoose';
import { ISubscription } from '@/types';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      unique: true,
    },
    plan: {
      type: String,
      enum: ['starter', 'growth', 'agency'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'trial', 'none'],
      default: 'active',
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
