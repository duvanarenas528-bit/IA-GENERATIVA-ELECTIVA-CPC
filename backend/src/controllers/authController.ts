import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { createUser, findUserByEmail, verifyPassword, checkRateLimit, incrementRateLimit, clearRateLimit } from '../services/authService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { redis } from '../config/redis.js';
import { AuthRequest } from '../middlewares/auth.js';

const isProd = process.env.NODE_ENV === 'production';

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
    return res.status(201).json({ user: { id: user.id, nombre: user.nombre, correo: user.correo } });
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
    return res.json({ user: { id: user.id, nombre: user.nombre, correo: user.correo } });
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
    const user = await pool.query('SELECT id, nombre, correo FROM users WHERE id = $1', [payload.id]);
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
    return res.json({ user: { id: u.id, nombre: u.nombre, correo: u.correo } });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'No autorizado' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    const result = await pool.query('SELECT id, nombre, correo, creado_en FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    return res.json({ user: result.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
