import mongoose, { Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    team: { type: String, required: true, trim: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Leaderboard =
  mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
