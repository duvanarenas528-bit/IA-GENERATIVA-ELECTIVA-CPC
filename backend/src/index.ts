import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vehiclesRouter, { reportsRouter } from './routes/vehicles.js';
import preperitajesRouter from './routes/preperitajes.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
