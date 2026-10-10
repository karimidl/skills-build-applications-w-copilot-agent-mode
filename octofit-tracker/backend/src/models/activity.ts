import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    distance: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
