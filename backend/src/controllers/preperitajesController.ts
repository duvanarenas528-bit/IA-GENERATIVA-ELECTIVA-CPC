import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { removeUploadedFile, UPLOADS_DIR } from '../middlewares/upload.js';
import { buildPreperitajeReport, PREFERITAJE_ZONAS } from '../services/preperitajeReport.js';
import { analyzePhotosWithGemini } from '../services/photoAnalysisService.js';
import {
  analizarCuestionarioConGemini,
  extraerComentariosCuestionario,
} from '../services/questionnaireAnalysisService.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value: string) {
  return UUID_RE.test(value);
}

function serializeFoto(row: any) {
  return {
    id: row.id,
    preperitajeId: row.preperitaje_id,
    zona: row.zona,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    creadoEn: row.creado_en,
    url: `/api/preperitajes/${row.preperitaje_id}/fotos/${row.id}/archivo`,
  };
}

export async function uploadPreperitajeFoto(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Selecciona una imagen para subir.' });
  }

  if (!isValidUuid(id)) {
    removeUploadedFile(file.filename);
    return res.status(404).json({ error: 'Preperitaje no encontrado.' });
  }

  const zona = typeof req.body?.zona === 'string' ? req.body.zona.trim() : '';
  if (!PREFERITAJE_ZONAS.includes(zona)) {
    removeUploadedFile(file.filename);
    return res.status(400).json({ error: 'La zona de la foto no es válida.' });
  }

  try {
    const owner = await pool.query('SELECT id FROM preperitajes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (owner.rows.length === 0) {
      removeUploadedFile(file.filename);
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const previous = await pool.query(
      'SELECT filename FROM preperitaje_fotos WHERE preperitaje_id = $1 AND zona = $2',
      [id, zona]
    );

    const result = await pool.query(
      `INSERT INTO preperitaje_fotos (preperitaje_id, user_id, zona, filename, mime_type, size_bytes)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (preperitaje_id, zona)
       DO UPDATE SET
         filename = EXCLUDED.filename,
         mime_type = EXCLUDED.mime_type,
         size_bytes = EXCLUDED.size_bytes,
         creado_en = NOW()
       RETURNING *`,
      [id, userId, zona, file.filename, file.mimetype, file.size]
    );

    removeUploadedFile(previous.rows[0]?.filename);

    return res.status(201).json({ foto: serializeFoto(result.rows[0]) });
  } catch (e) {
    removeUploadedFile(file.filename);
    console.error(e);
    return res.status(500).json({ error: 'No se pudo guardar la foto.' });
  }
}

export async function listPreperitajeFotos(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!isValidUuid(id)) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const owner = await pool.query('SELECT id FROM preperitajes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (owner.rows.length === 0) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const result = await pool.query(
      'SELECT * FROM preperitaje_fotos WHERE preperitaje_id = $1 AND user_id = $2 ORDER BY creado_en ASC',
      [id, userId]
    );

    return res.json({ fotos: result.rows.map(serializeFoto) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function getPreperitajeFotoArchivo(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id, fotoId } = req.params;

    if (!isValidUuid(id) || !isValidUuid(fotoId)) {
      return res.status(404).json({ error: 'Foto no encontrada.' });
    }

    const isAdmin = req.user?.role === 'admin';

    const result = await pool.query(
      `SELECT f.filename, f.mime_type
         FROM preperitaje_fotos f
         JOIN preperitajes p ON p.id = f.preperitaje_id
        WHERE f.id = $1 AND f.preperitaje_id = $2
          AND ($3::boolean OR (p.user_id = $4 AND f.user_id = $4))`,
      [fotoId, id, isAdmin, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto no encontrada.' });
    }

    const filePath = path.join(UPLOADS_DIR, path.basename(result.rows[0].filename));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo de la foto no está disponible.' });
    }

    res.setHeader('Cache-Control', 'private, max-age=60');
    res.type(result.rows[0].mime_type);
    return res.sendFile(filePath);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function getPreperitajeInforme(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!isValidUuid(id)) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const isAdmin = req.user?.role === 'admin';
    const preperitaje = await pool.query(
      'SELECT * FROM preperitajes WHERE id = $1 AND ($2::boolean OR user_id = $3)',
      [id, isAdmin, userId]
    );
    if (preperitaje.rows.length === 0) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const ownerId = preperitaje.rows[0].user_id;
    const usuario = await pool.query('SELECT nombre, correo FROM users WHERE id = $1', [ownerId]);
    const fotos = await pool.query(
      'SELECT * FROM preperitaje_fotos WHERE preperitaje_id = $1 AND user_id = $2 ORDER BY creado_en ASC',
      [id, ownerId]
    );

    const informe = buildPreperitajeReport(
      preperitaje.rows[0],
      fotos.rows,
      usuario.rows[0] || {}
    );

    return res.json({ informe });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function analizarFotosIA(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!isValidUuid(id)) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const preperitaje = await pool.query(
      'SELECT * FROM preperitajes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (preperitaje.rows.length === 0) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const fotos = await pool.query(
      'SELECT * FROM preperitaje_fotos WHERE preperitaje_id = $1 AND user_id = $2 ORDER BY creado_en ASC',
      [id, userId]
    );
    if (fotos.rows.length === 0) {
      return res.status(400).json({ error: 'Sube al menos una foto antes de analizar.' });
    }

    const analisis = await analyzePhotosWithGemini(preperitaje.rows[0], fotos.rows);

    await pool.query(
      'UPDATE preperitajes SET analisis_ia = $1::jsonb, analisis_ia_actualizado_en = NOW() WHERE id = $2 AND user_id = $3',
      [JSON.stringify(analisis), id, userId]
    );

    return res.json({ analisis });
  } catch (e: any) {
    console.error('Error al analizar fotos con IA:', e?.message || e);
    return res.status(502).json({ error: e?.message || 'No se pudo analizar las fotos con IA.' });
  }
}

export async function transferirPreperitaje(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const correo = String(req.body?.correo || '').trim().toLowerCase();
  const notas = String(req.body?.notas || '').trim();

  if (!isValidUuid(id)) {
    return res.status(404).json({ error: 'Preperitaje no encontrado.' });
  }
  if (!correo) {
    return res.status(400).json({ error: 'Escribe el correo del nuevo dueño.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id, user_id FROM preperitajes WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [id, userId]
    );
    if (existing.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const target = await client.query(
      'SELECT id, nombre, correo FROM users WHERE LOWER(correo) = $1',
      [correo]
    );
    if (target.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No existe una cuenta en AutoCheck con ese correo.' });
    }
    if (target.rows[0].id === userId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No puedes transferirte el preperitaje a tu propia cuenta.' });
    }

    const folio = `TRASP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    await client.query(
      `UPDATE preperitajes
          SET user_id = $1,
              propietario_anterior_id = $2,
              transferido_a_id = $1,
              transferido_en = NOW(),
              transferencia_folio = $3,
              transferencia_notas = $4,
              actualizado_en = NOW()
        WHERE id = $5`,
      [target.rows[0].id, userId, folio, notas || null, id]
    );
    await client.query('UPDATE preperitaje_fotos SET user_id = $1 WHERE preperitaje_id = $2', [
      target.rows[0].id,
      id,
    ]);

    await client.query('COMMIT');

    return res.json({
      transferencia: {
        folio,
        nuevoDueno: {
          id: target.rows[0].id,
          nombre: target.rows[0].nombre,
          correo: target.rows[0].correo,
        },
        notas: notas || null,
        transferidoEn: new Date().toISOString(),
      },
    });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error(e);
    return res.status(500).json({ error: 'No se pudo completar el traspaso' });
  } finally {
    client.release();
  }
}

export async function analizarCuestionarioIA(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!isValidUuid(id)) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const preperitaje = await pool.query(
      'SELECT * FROM preperitajes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (preperitaje.rows.length === 0) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const comentarios = extraerComentariosCuestionario(preperitaje.rows[0].respuestas);
    if (comentarios.length === 0) {
      return res.status(400).json({
        error: 'El cuestionario aún no tiene comentarios escritos para analizar.',
      });
    }

    const analisis = await analizarCuestionarioConGemini(preperitaje.rows[0]);

    await pool.query(
      `UPDATE preperitajes
          SET analisis_cuestionario = $1::jsonb,
              analisis_cuestionario_actualizado_en = NOW()
        WHERE id = $2 AND user_id = $3`,
      [JSON.stringify(analisis), id, userId]
    );

    return res.json({ analisis });
  } catch (e: any) {
    console.error('Error al analizar el cuestionario con IA:', e?.message || e);
    return res.status(502).json({ error: e?.message || 'No se pudo analizar el cuestionario con IA.' });
  }
}
