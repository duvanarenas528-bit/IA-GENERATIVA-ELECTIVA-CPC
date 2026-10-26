import { pool } from '../db/pool.js';
import argon2 from 'argon2';
import { redis } from '../config/redis.js';

const RATE_LIMIT_WINDOW = 15 * 60; // 15 min
const RATE_LIMIT_MAX = 5;

export async function getRateKey(correo: string, ip: string) {
  return `login:rate:${correo.toLowerCase()}:${ip}`;
}

export async function checkRateLimit(correo: string, ip: string) {
  const key = await getRateKey(correo, ip);
  const count = await redis.get(key);
  const attempts = count ? parseInt(count) : 0;
  if (attempts >= RATE_LIMIT_MAX) {
    const ttl = await redis.ttl(key);
    return { blocked: true, ttl };
  }
  return { blocked: false };
}

export async function incrementRateLimit(correo: string, ip: string) {
  const key = await getRateKey(correo, ip);
  const multi = redis.multi();
  multi.incr(key);
  multi.expire(key, RATE_LIMIT_WINDOW);
  await multi.exec();
}

export async function clearRateLimit(correo: string, ip: string) {
  const key = await getRateKey(correo, ip);
  await redis.del(key);
}

export async function createUser(nombre: string, correo: string, password: string) {
  const password_hash = await argon2.hash(password);
  const result = await pool.query(
    'INSERT INTO users (nombre, correo, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, correo, creado_en',
    [nombre, correo.toLowerCase(), password_hash]
  );
  return result.rows[0];
}

export async function findUserByEmail(correo: string) {
  const result = await pool.query('SELECT * FROM users WHERE correo = $1', [correo.toLowerCase()]);
  return result.rows[0];
}

export async function verifyPassword(hash: string, password: string) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
