import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vehiclesRouter, { reportsRouter } from './routes/vehicles.js';
import preperitajesRouter from './routes/preperitajes.js';
import adminRouter from './routes/admin.js';
import catalogRouter from './routes/catalog.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, origin || true);
    }
    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/preperitajes', preperitajesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
