import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { createUser, findUserByEmail, verifyPassword, checkRateLimit, incrementRateLimit, clearRateLimit } from '../services/authService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { redis } from '../config/redis.js';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { removeUploadedFile, UPLOADS_DIR } from '../middlewares/upload.js';

const isProd = process.env.NODE_ENV === 'production';

function serializeUser(row: any) {
  const updatedAt = row.avatar_actualizado_en ? new Date(row.avatar_actualizado_en).getTime() : 0;
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
    creado_en: row.creado_en,
    avatar: row.avatar_filename ? `/api/auth/avatar?v=${updatedAt}` : null,
  };
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 15 * 60 * 1000,
    path: '/',
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Datos inválidos' });
    }
    const { nombre, correo, password } = parsed.data;
    const existing = await findUserByEmail(correo);
    if (existing) {
      // No revelar que existe
      return res.status(400).json({ error: 'No se pudo registrar con esos datos' });
    }
    const user = await createUser(nombre, correo, password);
    const accessToken = generateAccessToken({ id: user.id, correo: user.correo, nombre: user.nombre });
    const refreshToken = generateRefreshToken({ id: user.id });
    await redis.set(`refresh:${user.id}:${refreshToken}`, 'valid', 'EX', 7 * 24 * 60 * 60);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({ user: serializeUser(user) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Datos inválidos' });
    }
    const { correo, password } = parsed.data;
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const rate = await checkRateLimit(correo, ip);
    if (rate.blocked) {
      return res.status(429).json({ error: 'Demasiados intentos. Intenta nuevamente más tarde.' });
    }
    const user = await findUserByEmail(correo);
    if (!user) {
      await incrementRateLimit(correo, ip);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) {
      await incrementRateLimit(correo, ip);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    await clearRateLimit(correo, ip);
    const accessToken = generateAccessToken({ id: user.id, correo: user.correo, nombre: user.nombre });
    const refreshToken = generateRefreshToken({ id: user.id });
    await redis.set(`refresh:${user.id}:${refreshToken}`, 'valid', 'EX', 7 * 24 * 60 * 60);
    setAuthCookies(res, accessToken, refreshToken);
    return res.json({ user: serializeUser(user) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      const payload: any = verifyRefreshToken(refreshToken);
      if (payload?.id) {
        await redis.del(`refresh:${payload.id}:${refreshToken}`);
      }
    }
    clearAuthCookies(res);
    return res.json({ message: 'Sesión cerrada' });
  } catch (e) {
    console.error(e);
    return res.json({ message: 'Sesión cerrada' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: 'No autorizado' });
    const payload: any = verifyRefreshToken(refreshToken);
    if (!payload?.id) return res.status(401).json({ error: 'No autorizado' });
    const exists = await redis.get(`refresh:${payload.id}:${refreshToken}`);
    if (!exists) return res.status(401).json({ error: 'No autorizado' });
    const user = await pool.query(
      'SELECT id, nombre, correo, creado_en, avatar_filename, avatar_actualizado_en FROM users WHERE id = $1',
      [payload.id]
    );
    if (user.rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    const u = user.rows[0];
    const accessToken = generateAccessToken({ id: u.id, correo: u.correo, nombre: u.nombre });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return res.json({ user: serializeUser(u) });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'No autorizado' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    const result = await pool.query(
      'SELECT id, nombre, correo, creado_en, avatar_filename, avatar_actualizado_en FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    return res.json({ user: serializeUser(result.rows[0]) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function uploadAvatar(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Selecciona una imagen para tu foto de perfil.' });
  }

  try {
    const previous = await pool.query('SELECT avatar_filename FROM users WHERE id = $1', [userId]);
    if (previous.rows.length === 0) {
      removeUploadedFile(file.filename);
      return res.status(401).json({ error: 'No autorizado' });
    }

    const result = await pool.query(
      `UPDATE users
          SET avatar_filename = $1,
              avatar_mime_type = $2,
              avatar_actualizado_en = NOW()
        WHERE id = $3
        RETURNING id, nombre, correo, creado_en, avatar_filename, avatar_actualizado_en`,
      [file.filename, file.mimetype, userId]
    );

    removeUploadedFile(previous.rows[0]?.avatar_filename);

    return res.status(201).json({ user: serializeUser(result.rows[0]) });
  } catch (e) {
    removeUploadedFile(file.filename);
    console.error(e);
    return res.status(500).json({ error: 'No se pudo guardar la foto de perfil.' });
  }
}

export async function getAvatar(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const result = await pool.query(
      'SELECT avatar_filename, avatar_mime_type FROM users WHERE id = $1',
      [userId]
    );
    const avatar = result.rows[0];

    if (!avatar?.avatar_filename) {
      return res.status(404).json({ error: 'Foto de perfil no encontrada.' });
    }

    const filePath = path.join(UPLOADS_DIR, path.basename(avatar.avatar_filename));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo de la foto de perfil no está disponible.' });
    }

    res.setHeader('Cache-Control', 'private, max-age=300');
    res.type(avatar.avatar_mime_type || 'image/jpeg');
    return res.sendFile(filePath);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function deleteAvatar(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const previous = await pool.query('SELECT avatar_filename FROM users WHERE id = $1', [userId]);
    if (previous.rows.length === 0) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const result = await pool.query(
      `UPDATE users
          SET avatar_filename = NULL,
              avatar_mime_type = NULL,
              avatar_actualizado_en = NOW()
        WHERE id = $1
        RETURNING id, nombre, correo, creado_en, avatar_filename, avatar_actualizado_en`,
      [userId]
    );

    removeUploadedFile(previous.rows[0]?.avatar_filename);

    return res.json({ user: serializeUser(result.rows[0]) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'No se pudo eliminar la foto de perfil.' });
  }
}
