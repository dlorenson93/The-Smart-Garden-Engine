import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import gardenRoutes from './routes/gardens';
import bedRoutes from './routes/beds';
import cropRoutes from './routes/crops';
import plantingRoutes from './routes/plantings';
import taskRoutes from './routes/tasks';
import integrationRoutes from './routes/integration';
import aiAssistantRoutes from './routes/ai-assistant';
import recommendationRoutes from './routes/recommendations';
import harvestRoutes from './routes/harvests';
import weatherRoutes from './routes/weather';
import wateringRoutes from './routes/watering';
import photosRoutes from './routes/photos';
import seedsRoutes from './routes/seeds';
import soilRoutes from './routes/soil';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/gardens', gardenRoutes);
app.use('/api/v1/beds', bedRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/plantings', plantingRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/integration', integrationRoutes);
app.use('/api/v1/ai', aiAssistantRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/harvests', harvestRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/watering', wateringRoutes);
app.use('/api/v1/photos', photosRoutes);
app.use('/api/v1/seeds', seedsRoutes);
app.use('/api/v1/soil', soilRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌱 Terra Plantari API running on port ${PORT}`);
});

export default app;
