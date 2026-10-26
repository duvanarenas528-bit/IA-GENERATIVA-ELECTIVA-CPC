import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { generatePreperitajeReport } from '../services/gemini.js';

export async function createVehicle(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { placa, marca, modelo, anio, kilometraje, color, observaciones } = req.body;
    if (!placa) return res.status(400).json({ error: 'Placa requerida' });
    const result = await pool.query(
      'INSERT INTO vehicles (user_id, placa, marca, modelo, anio, kilometraje, color, observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [userId, placa, marca || null, modelo || null, anio || null, kilometraje || null, color || null, observaciones || null]
    );
    return res.status(201).json({ vehicle: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function listVehicles(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const result = await pool.query('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY creado_en DESC', [userId]);
    return res.json({ vehicles: result.rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function getVehicle(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ vehicle: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function generateReport(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const v = await pool.query('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [id, userId]);
    if (v.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    const vehicle = v.rows[0];
    const report = await generatePreperitajeReport(vehicle);
    const result = await pool.query(
      'INSERT INTO reports (vehicle_id, user_id, contenido, resumen) VALUES ($1,$2,$3,$4) RETURNING *',
      [vehicle.id, userId, report.contenido, report.resumen]
    );
    return res.status(201).json({ report: result.rows[0], esSimulado: report.esSimulado });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function listReports(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const result = await pool.query('SELECT r.*, v.placa, v.marca, v.modelo, v.anio, v.kilometraje FROM reports r JOIN vehicles v ON v.id = r.vehicle_id WHERE r.user_id = $1 ORDER BY r.creado_en DESC', [userId]);
    return res.json({ reports: result.rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function getReport(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await pool.query('SELECT r.*, v.placa, v.marca, v.modelo, v.anio, v.kilometraje, v.color FROM reports r JOIN vehicles v ON v.id = r.vehicle_id WHERE r.id = $1 AND r.user_id = $2', [id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ report: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
