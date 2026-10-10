import mongoose from 'mongoose';
import { Activity } from '../models/activity.js';
import { Leaderboard } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await mongoose.connect(connectionString);

    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});

    const users = await User.insertMany([
      { username: 'mila', email: 'mila@example.com', password: 'octofit123', team: 'Comets', points: 1248 },
      { username: 'noah', email: 'noah@example.com', password: 'octofit123', team: 'Comets', points: 1480 },
      { username: 'kat', email: 'kat@example.com', password: 'octofit123', team: 'Rockets', points: 1210 },
    ]);

    const teams = await Team.insertMany([
      { name: 'Comets', captain: 'noah', members: ['noah', 'mila'], points: 2728 },
      { name: 'Rockets', captain: 'kat', members: ['kat', 'leo'], points: 1210 },
    ]);

    const activities = await Activity.insertMany([
      { user: 'mila', type: 'run', duration: 32, distance: 4.2, calories: 240, points: 96 },
      { user: 'noah', type: 'strength', duration: 28, distance: 0, calories: 210, points: 84 },
      { user: 'kat', type: 'ride', duration: 26, distance: 8.5, calories: 195, points: 78 },
    ]);

    const leaderboard = await Leaderboard.insertMany([
      { username: 'noah', team: 'Comets', rank: 1, points: 1480 },
      { username: 'mila', team: 'Comets', rank: 2, points: 1248 },
      { username: 'kat', team: 'Rockets', rank: 3, points: 1210 },
    ]);

    const workouts = await Workout.insertMany([
      { name: 'Tempo Run', category: 'cardio', duration: 30, difficulty: 'moderate', description: 'Steady endurance training session.' },
      { name: 'Leg Day Blast', category: 'strength', duration: 45, difficulty: 'hard', description: 'Targeted lower-body strength circuit.' },
      { name: 'Mobility Flow', category: 'recovery', duration: 20, difficulty: 'easy', description: 'Stretch and recovery session for flexibility.' },
    ]);

    console.log(
      `Database seeding complete: ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${leaderboard.length} leaderboard entries, ${workouts.length} workouts`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
