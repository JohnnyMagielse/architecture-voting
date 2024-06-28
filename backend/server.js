import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './controllers/userController.js';
import votesRoutes from './controllers/votesController.js';
import authRoutes from './controllers/authController.js';
import { initLedger } from './services/contractService.js';

dotenv.config();

const initApp = async () => {
  console.log("Initializing ledger...");
  await initLedger();

  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(cors());
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/votes', votesRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

initApp().catch((err) => {
  console.error('Failed to initialize the application:', err);
});
