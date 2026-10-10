import express from 'express';
import mongoose from 'mongoose';
import database, { connectDatabase } from './config/database.js';
import { Activity } from './models/activity.js';
import { Leaderboard } from './models/leaderboard.js';
import { Team } from './models/team.js';
import { User } from './models/user.js';
import { Workout } from './models/workout.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';

app.use(express.json());

const fallbackUsers = [
  { id: 'user-1', username: 'mila', email: 'mila@example.com', team: 'Comets', points: 1248 },
  { id: 'user-2', username: 'noah', email: 'noah@example.com', team: 'Comets', points: 1480 },
];

const fallbackTeams = [
  { id: 'team-1', name: 'Comets', captain: 'noah', members: ['noah', 'mila'], points: 2728 },
  { id: 'team-2', name: 'Rockets', captain: 'kat', members: ['kat', 'leo'], points: 1210 },
];

const fallbackActivities = [
  { id: 'activity-1', user: 'mila', type: 'run', duration: 32, distance: 4.2, calories: 240, points: 96 },
  { id: 'activity-2', user: 'noah', type: 'strength', duration: 28, distance: 0, calories: 210, points: 84 },
];

const fallbackLeaderboard = [
  { id: 'leaderboard-1', username: 'noah', team: 'Comets', rank: 1, points: 1480 },
  { id: 'leaderboard-2', username: 'mila', team: 'Comets', rank: 2, points: 1248 },
];

const fallbackWorkouts = [
  { id: 'workout-1', name: 'Tempo Run', category: 'cardio', duration: 30, difficulty: 'moderate', description: 'Steady endurance training session.' },
  { id: 'workout-2', name: 'Leg Day Blast', category: 'strength', duration: 45, difficulty: 'hard', description: 'Targeted lower-body strength circuit.' },
];

const usersRouter = express.Router();
usersRouter.get('/', async (_request, response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return response.json(fallbackUsers);
    }

    const records = await User.find().lean();
    return response.json(records.length > 0 ? records : fallbackUsers);
  } catch (error) {
    console.error('Failed to load users records:', error);
    return response.status(500).json({ message: 'Unable to load user data.' });
  }
});
usersRouter.post('/', async (request, response) => {
  try {
    const record = await User.create(request.body);
    return response.status(201).json(record);
  } catch (error) {
    console.error('Failed to create user:', error);
    return response.status(400).json({
      message: 'Unable to create user.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
usersRouter.put('/:id', async (request, response) => {
  try {
    const record = await User.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!record) {
      return response.status(404).json({ message: 'User not found.' });
    }
    return response.json(record);
  } catch (error) {
    console.error('Failed to update user:', error);
    return response.status(400).json({ message: 'Unable to update user.' });
  }
});
usersRouter.delete('/:id', async (request, response) => {
  try {
    const record = await User.findByIdAndDelete(request.params.id);
    if (!record) {
      return response.status(404).json({ message: 'User not found.' });
    }
    return response.json({ id: request.params.id, deleted: true });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return response.status(400).json({ message: 'Unable to delete user.' });
  }
});
app.use('/api/users/', usersRouter);

const teamsRouter = express.Router();
teamsRouter.get('/', async (_request, response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return response.json(fallbackTeams);
    }
    const records = await Team.find().lean();
    return response.json(records.length > 0 ? records : fallbackTeams);
  } catch (error) {
    console.error('Failed to load teams records:', error);
    return response.status(500).json({ message: 'Unable to load team data.' });
  }
});
teamsRouter.post('/', async (request, response) => {
  try {
    const record = await Team.create(request.body);
    return response.status(201).json(record);
  } catch (error) {
    console.error('Failed to create team:', error);
    return response.status(400).json({ message: 'Unable to create team.' });
  }
});
teamsRouter.put('/:id', async (request, response) => {
  try {
    const record = await Team.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!record) {
      return response.status(404).json({ message: 'Team not found.' });
    }
    return response.json(record);
  } catch (error) {
    console.error('Failed to update team:', error);
    return response.status(400).json({ message: 'Unable to update team.' });
  }
});
teamsRouter.delete('/:id', async (request, response) => {
  try {
    const record = await Team.findByIdAndDelete(request.params.id);
    if (!record) {
      return response.status(404).json({ message: 'Team not found.' });
    }
    return response.json({ id: request.params.id, deleted: true });
  } catch (error) {
    console.error('Failed to delete team:', error);
    return response.status(400).json({ message: 'Unable to delete team.' });
  }
});
app.use('/api/teams/', teamsRouter);

const activitiesRouter = express.Router();
activitiesRouter.get('/', async (_request, response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return response.json(fallbackActivities);
    }
    const records = await Activity.find().lean();
    return response.json(records.length > 0 ? records : fallbackActivities);
  } catch (error) {
    console.error('Failed to load activities records:', error);
    return response.status(500).json({ message: 'Unable to load activity data.' });
  }
});
activitiesRouter.post('/', async (request, response) => {
  try {
    const record = await Activity.create(request.body);
    return response.status(201).json(record);
  } catch (error) {
    console.error('Failed to create activity:', error);
    return response.status(400).json({ message: 'Unable to create activity.' });
  }
});
activitiesRouter.put('/:id', async (request, response) => {
  try {
    const record = await Activity.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!record) {
      return response.status(404).json({ message: 'Activity not found.' });
    }
    return response.json(record);
  } catch (error) {
    console.error('Failed to update activity:', error);
    return response.status(400).json({ message: 'Unable to update activity.' });
  }
});
activitiesRouter.delete('/:id', async (request, response) => {
  try {
    const record = await Activity.findByIdAndDelete(request.params.id);
    if (!record) {
      return response.status(404).json({ message: 'Activity not found.' });
    }
    return response.json({ id: request.params.id, deleted: true });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return response.status(400).json({ message: 'Unable to delete activity.' });
  }
});
app.use('/api/activities/', activitiesRouter);

const leaderboardRouter = express.Router();
leaderboardRouter.get('/', async (_request, response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return response.json(fallbackLeaderboard);
    }
    const records = await Leaderboard.find().lean();
    return response.json(records.length > 0 ? records : fallbackLeaderboard);
  } catch (error) {
    console.error('Failed to load leaderboard records:', error);
    return response.status(500).json({ message: 'Unable to load leaderboard data.' });
  }
});
leaderboardRouter.post('/', async (request, response) => {
  try {
    const record = await Leaderboard.create(request.body);
    return response.status(201).json(record);
  } catch (error) {
    console.error('Failed to create leaderboard entry:', error);
    return response.status(400).json({ message: 'Unable to create leaderboard entry.' });
  }
});
leaderboardRouter.put('/:id', async (request, response) => {
  try {
    const record = await Leaderboard.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!record) {
      return response.status(404).json({ message: 'Leaderboard entry not found.' });
    }
    return response.json(record);
  } catch (error) {
    console.error('Failed to update leaderboard entry:', error);
    return response.status(400).json({ message: 'Unable to update leaderboard entry.' });
  }
});
leaderboardRouter.delete('/:id', async (request, response) => {
  try {
    const record = await Leaderboard.findByIdAndDelete(request.params.id);
    if (!record) {
      return response.status(404).json({ message: 'Leaderboard entry not found.' });
    }
    return response.json({ id: request.params.id, deleted: true });
  } catch (error) {
    console.error('Failed to delete leaderboard entry:', error);
    return response.status(400).json({ message: 'Unable to delete leaderboard entry.' });
  }
});
app.use('/api/leaderboard/', leaderboardRouter);

const workoutsRouter = express.Router();
workoutsRouter.get('/', async (_request, response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return response.json(fallbackWorkouts);
    }
    const records = await Workout.find().lean();
    return response.json(records.length > 0 ? records : fallbackWorkouts);
  } catch (error) {
    console.error('Failed to load workouts records:', error);
    return response.status(500).json({ message: 'Unable to load workout data.' });
  }
});
workoutsRouter.post('/', async (request, response) => {
  try {
    const record = await Workout.create(request.body);
    return response.status(201).json(record);
  } catch (error) {
    console.error('Failed to create workout:', error);
    return response.status(400).json({ message: 'Unable to create workout.' });
  }
});
workoutsRouter.put('/:id', async (request, response) => {
  try {
    const record = await Workout.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!record) {
      return response.status(404).json({ message: 'Workout not found.' });
    }
    return response.json(record);
  } catch (error) {
    console.error('Failed to update workout:', error);
    return response.status(400).json({ message: 'Unable to update workout.' });
  }
});
workoutsRouter.delete('/:id', async (request, response) => {
  try {
    const record = await Workout.findByIdAndDelete(request.params.id);
    if (!record) {
      return response.status(404).json({ message: 'Workout not found.' });
    }
    return response.json({ id: request.params.id, deleted: true });
  } catch (error) {
    console.error('Failed to delete workout:', error);
    return response.status(400).json({ message: 'Unable to delete workout.' });
  }
});
app.use('/api/workouts/', workoutsRouter);

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: database.readyState === 1 ? 'connected' : 'connecting',
    apiUrl: baseUrl,
    baseUrl,
  });
});

connectDatabase().catch((error) => {
  console.error('Unable to connect to MongoDB:', error);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening on port ${port}`);
  console.log(`API base URL: ${baseUrl}`);
});