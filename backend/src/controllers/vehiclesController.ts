import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { generatePreperitajeReport } from '../services/gemini.js';
import { ZONE_LABELS } from '../services/preperitajeReport.js';

function toJsonParam(value: any) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

export async function createPreperitaje(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { placa, marca, linea, anio, kilometraje, color, combustible, transmision, respuestas, estado } = req.body;
    if (!placa) return res.status(400).json({ error: 'Placa requerida' });
    const result = await pool.query(
      `INSERT INTO preperitajes (user_id, placa, marca, linea, anio, kilometraje, color, combustible, transmision, respuestas, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        userId,
        placa,
        marca || null,
        linea || null,
        anio || null,
        kilometraje || null,
        color || null,
        combustible || null,
        transmision || null,
        toJsonParam(respuestas) ?? '{}',
        estado === 'completado' ? 'completado' : 'borrador',
      ]
    );
    return res.status(201).json({ preperitaje: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function listPreperitajes(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      `SELECT p.*, f.id AS foto_principal_id, f.zona AS foto_principal_zona
         FROM preperitajes p
         LEFT JOIN LATERAL (
           SELECT id, zona
             FROM preperitaje_fotos
            WHERE preperitaje_id = p.id AND user_id = p.user_id
            ORDER BY CASE zona
                       WHEN 'frontal' THEN 0
                       WHEN 'lateral' THEN 1
                       WHEN 'trasera' THEN 2
                       ELSE 3
                     END,
                     creado_en ASC
            LIMIT 1
         ) f ON true
        WHERE p.user_id = $1
        ORDER BY p.creado_en DESC`,
      [userId]
    );

    const preperitajes = result.rows.map((row) => {
      const { foto_principal_id, foto_principal_zona, ...preperitaje } = row;
      return {
        ...preperitaje,
        fotoPrincipalUrl: foto_principal_id
          ? `/api/preperitajes/${row.id}/fotos/${foto_principal_id}/archivo`
          : null,
        fotoPrincipalEtiqueta: foto_principal_zona
          ? ZONE_LABELS[foto_principal_zona] || foto_principal_zona
          : null,
      };
    });

    return res.json({ preperitajes });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function getPreperitaje(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM preperitajes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ preperitaje: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function updatePreperitaje(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { placa, marca, linea, anio, kilometraje, color, combustible, transmision, respuestas, estado } = req.body;
    const existing = await pool.query('SELECT id FROM preperitajes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    const result = await pool.query(
      `UPDATE preperitajes SET
         placa = COALESCE($1, placa),
         marca = COALESCE($2, marca),
         linea = COALESCE($3, linea),
         anio = COALESCE($4, anio),
         kilometraje = COALESCE($5, kilometraje),
         color = COALESCE($6, color),
         combustible = COALESCE($7, combustible),
         transmision = COALESCE($8, transmision),
         respuestas = COALESCE($9, respuestas),
         estado = COALESCE($10, estado),
         actualizado_en = NOW()
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [
        placa ?? null,
        marca ?? null,
        linea ?? null,
        anio ?? null,
        kilometraje ?? null,
        color ?? null,
        combustible ?? null,
        transmision ?? null,
        toJsonParam(respuestas),
        estado === 'completado' ? 'completado' : estado === 'borrador' ? 'borrador' : null,
        id,
        userId,
      ]
    );
    return res.json({ preperitaje: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function dashboardStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const totalRes = await pool.query('SELECT COUNT(*)::int AS total FROM preperitajes WHERE user_id = $1', [userId]);
    const completadosRes = await pool.query("SELECT COUNT(*)::int AS total FROM preperitajes WHERE user_id = $1 AND estado = 'completado'", [userId]);
    return res.json({
      stats: {
        total: totalRes.rows[0].total || 0,
        completados: completadosRes.rows[0].total || 0,
        conObservaciones: 0,
        alertas: 0,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

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
      [vehicle.id, userId, toJsonParam(report.contenido), report.resumen]
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
