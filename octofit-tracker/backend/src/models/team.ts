import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    captain: { type: String, required: true, trim: true },
    members: [{ type: String, default: [] }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;
