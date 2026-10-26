import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { removeUploadedFile, UPLOADS_DIR } from '../middlewares/upload.js';
import { buildPreperitajeReport, PREFERITAJE_ZONAS } from '../services/preperitajeReport.js';

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

    const result = await pool.query(
      `SELECT f.filename, f.mime_type
         FROM preperitaje_fotos f
         JOIN preperitajes p ON p.id = f.preperitaje_id
        WHERE f.id = $1 AND f.preperitaje_id = $2 AND p.user_id = $3 AND f.user_id = $3`,
      [fotoId, id, userId]
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

    const preperitaje = await pool.query('SELECT * FROM preperitajes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (preperitaje.rows.length === 0) {
      return res.status(404).json({ error: 'Preperitaje no encontrado.' });
    }

    const usuario = await pool.query('SELECT nombre, correo FROM users WHERE id = $1', [userId]);
    const fotos = await pool.query(
      'SELECT * FROM preperitaje_fotos WHERE preperitaje_id = $1 AND user_id = $2 ORDER BY creado_en ASC',
      [id, userId]
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
