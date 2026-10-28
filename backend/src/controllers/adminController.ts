import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { ZONE_LABELS } from '../services/preperitajeReport.js';

type AdminPart = {
  condition?: string;
  severity?: string;
};

function parseParts(value: unknown): AdminPart[] {
  if (Array.isArray(value)) return value as AdminPart[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as AdminPart[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function summarizeParts(value: unknown) {
  const parts = parseParts(value);
  const totalPartes = parts.length;
  const partesBuenas = parts.filter((part) => (part.condition || 'good') === 'good').length;
  const hallazgos = parts.filter(
    (part) => (part.condition || 'good') !== 'good' && part.condition !== 'not-applicable'
  );
  const criticos = hallazgos.filter(
    (part) => part.condition === 'broken' || part.severity === 'alta'
  ).length;

  return {
    totalPartes,
    partesBuenas,
    hallazgos: hallazgos.length,
    score: totalPartes ? Math.round((partesBuenas / totalPartes) * 100) : 0,
    riesgo: criticos > 0 ? 'alto' : hallazgos.length > 0 ? 'medio' : 'bajo',
  };
}

export async function adminOverview(_req: AuthRequest, res: Response) {
  try {
    const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS usuarios,
        (SELECT COUNT(*)::int FROM preperitajes) AS total,
        (SELECT COUNT(*)::int FROM preperitajes WHERE estado = 'completado') AS completados,
        (SELECT COUNT(*)::int FROM preperitajes WHERE estado = 'borrador') AS borradores,
        (SELECT COUNT(*)::int FROM preperitajes WHERE creado_en >= NOW() - INTERVAL '24 hours') AS ultimas_24h,
        (SELECT COUNT(*)::int FROM preperitajes WHERE creado_en >= NOW() - INTERVAL '7 days') AS ultimos_7_dias,
        (SELECT COUNT(*)::int FROM preperitaje_fotos) AS fotos,
        (
          SELECT COUNT(*)::int
            FROM preperitajes p
           WHERE EXISTS (
             SELECT 1
               FROM jsonb_array_elements(
                 CASE
                   WHEN jsonb_typeof(p.respuestas) = 'array' THEN p.respuestas
                   ELSE '[]'::jsonb
                 END
               ) AS parte
              WHERE COALESCE(parte->>'condition', 'good') NOT IN ('good', 'not-applicable')
           )
        ) AS con_hallazgos
    `);

    const recentResult = await pool.query(`
      SELECT
        p.*,
        u.nombre AS usuario_nombre,
        u.correo AS usuario_correo,
        f.id AS foto_principal_id,
        f.zona AS foto_principal_zona
      FROM preperitajes p
      JOIN users u ON u.id = p.user_id
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
      ORDER BY COALESCE(p.actualizado_en, p.creado_en) DESC
      LIMIT 50
    `);

    const recientes = recentResult.rows.map((row) => {
      const {
        respuestas,
        foto_principal_id,
        foto_principal_zona,
        usuario_nombre,
        usuario_correo,
        ...preperitaje
      } = row;

      return {
        ...preperitaje,
        usuario: {
          nombre: usuario_nombre,
          correo: usuario_correo,
        },
        fotoPrincipalUrl: foto_principal_id
          ? `/api/preperitajes/${row.id}/fotos/${foto_principal_id}/archivo`
          : null,
        fotoPrincipalEtiqueta: foto_principal_zona
          ? ZONE_LABELS[foto_principal_zona] || foto_principal_zona
          : null,
        ...summarizeParts(respuestas),
      };
    });

    const stats = statsResult.rows[0];

    return res.json({
      stats: {
        usuarios: stats.usuarios,
        total: stats.total,
        completados: stats.completados,
        borradores: stats.borradores,
        ultimas24h: stats.ultimas_24h,
        ultimos7dias: stats.ultimos_7_dias,
        fotos: stats.fotos,
        conHallazgos: stats.con_hallazgos,
      },
      recientes,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
