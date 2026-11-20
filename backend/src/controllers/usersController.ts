import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { isGoodCondition } from '../services/questionnaireCatalog.js';

function parseJson(value: unknown): any {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function partsFrom(respuestas: unknown): any[] {
  const parsed = parseJson(respuestas);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.parts)) return parsed.parts;
  if (parsed && typeof parsed === 'object') return Object.values(parsed);
  return [];
}

function scoreFrom(respuestas: unknown): number {
  const parts = partsFrom(respuestas).filter((part) => !!part && typeof part === 'object');
  if (parts.length === 0) return 0;
  const good = parts.filter((part) => isGoodCondition(part.condition)).length;
  return Math.round((good / parts.length) * 100);
}

function isApproved(row: any, score: number): boolean {
  const analisis = parseJson(row.analisis_ia);
  if (!analisis) return score >= 70;
  const hallazgos = Array.isArray(analisis.hallazgos) ? analisis.hallazgos : [];
  const tieneAlta = hallazgos.some(
    (h: any) => String(h?.severidad || '').toLowerCase() === 'alta'
  );
  return !tieneAlta && (score >= 60 || hallazgos.length === 0);
}

export async function getProfileStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      `SELECT p.*, u.correo AS transferido_a_correo
         FROM preperitajes p
         LEFT JOIN users u ON u.id = p.transferido_a_id
        WHERE p.user_id = $1 OR p.propietario_anterior_id = $1
        ORDER BY p.creado_en DESC`,
      [userId]
    );
    const received = await pool.query(
      'SELECT COUNT(*)::int AS total FROM preperitajes WHERE transferido_a_id = $1 AND user_id = $1',
      [userId]
    );

    const rows = result.rows;
    const completados = rows.filter((row) => row.estado === 'completado');
    const aprobados = completados.filter((row) => isApproved(row, scoreFrom(row.respuestas)));
    const tasaAprobacionIA = completados.length
      ? Math.round((aprobados.length / completados.length) * 100)
      : 0;

    const durations = completados
      .map((row) => {
        const start = Date.parse(row.creado_en);
        const end = Date.parse(row.actualizado_en || row.creado_en);
        return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, end - start) : 0;
      })
      .filter((ms) => ms > 0);
    const tiempoPromedioMinutos = durations.length
      ? Math.round(durations.reduce((sum, ms) => sum + ms, 0) / durations.length / 60000)
      : 0;

    const peritajes = rows.map((row) => {
      const score = scoreFrom(row.respuestas);
      return {
        id: row.id,
        placa: row.placa,
        marca: row.marca || null,
        linea: row.linea || null,
        anio: row.anio || null,
        estado: row.estado,
        creadoEn: row.creado_en || null,
        actualizadoEn: row.actualizado_en || null,
        score,
        aprobadoIA: isApproved(row, score),
        tieneAnalisisIA: !!parseJson(row.analisis_ia),
        transferidoA: row.transferido_a_correo || null,
      };
    });

    return res.json({
      stats: {
        total: rows.length,
        completados: completados.length,
        tasaAprobacionIA,
        tiempoPromedioMinutos,
        certificados: completados.length,
        transferidosRecibidos: received.rows[0]?.total || 0,
      },
      peritajes,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al calcular las estadísticas del perfil' });
  }
}
