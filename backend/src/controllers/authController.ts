import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation.js';
import { createUser, findUserByEmail, verifyPassword } from '../services/authService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { redis } from '../config/redis.js';
import { AuthRequest } from '../middlewares/auth.js';
import { pool } from '../db/pool.js';
import { removeUploadedFile, UPLOADS_DIR } from '../middlewares/upload.js';
import { buildStoragePath, removeStoredImage, uploadImage } from '../utils/storage.js';
import { requestPasswordReset, resetPassword } from '../services/passwordResetService.js';

const isProd = process.env.NODE_ENV === 'production';
const showResetCode = !isProd && process.env.PASSWORD_RESET_SHOW_CODE !== 'false';
const cookieSameSite = (process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax')) as 'lax' | 'none' | 'strict';
const cookieSecure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProd;
const baseCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  path: '/',
} as const;

function serializeUser(row: any) {
  const updatedAt = row.avatar_actualizado_en ? new Date(row.avatar_actualizado_en).getTime() : 0;
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
    role: row.role || 'user',
    creado_en: row.creado_en,
    avatar: row.avatar_filename ? `/api/auth/avatar?v=${updatedAt}` : null,
  };
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('refresh_token', baseCookieOptions);
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
    const accessToken = generateAccessToken({ id: user.id, correo: user.correo, nombre: user.nombre, role: user.role || 'user' });
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
    const user = await findUserByEmail(correo);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const accessToken = generateAccessToken({ id: user.id, correo: user.correo, nombre: user.nombre, role: user.role || 'user' });
    const refreshToken = generateRefreshToken({ id: user.id });
    await redis.set(`refresh:${user.id}:${refreshToken}`, 'valid', 'EX', 7 * 24 * 60 * 60);
    setAuthCookies(res, accessToken, refreshToken);
    return res.json({ user: serializeUser(user) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Datos inválidos' });
    }

    const result = await requestPasswordReset(parsed.data.correo);
    if (result.limited) {
      return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' });
    }

    const response: { message: string; code?: string } = {
      message: 'Si el correo está registrado, se generó un código de recuperación.',
    };
    if (showResetCode && result.code) {
      response.code = result.code;
    }

    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function resetPasswordWithCode(req: Request, res: Response) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Datos inválidos' });
    }

    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const result = await resetPassword(parsed.data.token, parsed.data.password, ip);

    if (!result.ok) {
      return res.status(result.status || 400).json({ error: result.error || 'No se pudo restablecer la contraseña' });
    }

    return res.json({ message: 'Contraseña actualizada correctamente.' });
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
      'SELECT id, nombre, correo, role, creado_en, avatar_filename, avatar_actualizado_en FROM users WHERE id = $1',
      [payload.id]
    );
    if (user.rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    const u = user.rows[0];
    const accessToken = generateAccessToken({ id: u.id, correo: u.correo, nombre: u.nombre, role: u.role || 'user' });
    res.cookie('access_token', accessToken, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000,
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
      'SELECT id, nombre, correo, role, creado_en, avatar_filename, avatar_actualizado_en FROM users WHERE id = $1',
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

  let uploadedUrl: string | null = null;

  try {
    const previous = await pool.query('SELECT avatar_filename FROM users WHERE id = $1', [userId]);
    if (previous.rows.length === 0) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const storagePath = buildStoragePath('avatars', userId || 'unknown', file.mimetype);
    uploadedUrl = await uploadImage(storagePath, file.buffer, file.mimetype);

    const result = await pool.query(
      `UPDATE users
          SET avatar_filename = $1,
              avatar_mime_type = $2,
              avatar_actualizado_en = NOW()
        WHERE id = $3
        RETURNING id, nombre, correo, role, creado_en, avatar_filename, avatar_actualizado_en`,
      [uploadedUrl, file.mimetype, userId]
    );

    await removeStoredImage(previous.rows[0]?.avatar_filename);
    removeUploadedFile(previous.rows[0]?.avatar_filename);

    return res.status(201).json({ user: serializeUser(result.rows[0]) });
  } catch (e) {
    if (uploadedUrl) {
      await removeStoredImage(uploadedUrl);
    }
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

    const storedValue = avatar.avatar_filename;
    res.setHeader('Cache-Control', 'private, max-age=300');

    if (typeof storedValue === 'string' && /^https?:\/\//i.test(storedValue)) {
      return res.redirect(storedValue);
    }

    const filePath = path.join(UPLOADS_DIR, path.basename(storedValue || ''));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo de la foto de perfil no está disponible.' });
    }

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
        RETURNING id, nombre, correo, role, creado_en, avatar_filename, avatar_actualizado_en`,
      [userId]
    );

    await removeStoredImage(previous.rows[0]?.avatar_filename);
    removeUploadedFile(previous.rows[0]?.avatar_filename);

    return res.json({ user: serializeUser(result.rows[0]) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'No se pudo eliminar la foto de perfil.' });
  }
}
