import { createHash, randomInt } from 'crypto';
import argon2 from 'argon2';
import { redis } from '../config/redis.js';
import { pool } from '../db/pool.js';
import { findUserByEmail } from './authService.js';

const CODE_TTL_SECONDS = 10 * 60;
const REQUEST_WINDOW_SECONDS = 15 * 60;
const MAX_REQUESTS = 3;
const VERIFY_WINDOW_SECONDS = 15 * 60;
const MAX_VERIFY_ATTEMPTS = 10;

export type PasswordResetRequest = {
  code: string | null;
  limited: boolean;
};

export type PasswordResetResult = {
  ok: boolean;
  error?: string;
  status?: number;
};

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function requestRateKey(correo: string) {
  return `pwdreset:request:${correo.toLowerCase()}`;
}

function verifyRateKey(ip: string) {
  return `pwdreset:verify:${ip}`;
}

function codeKey(tokenHash: string) {
  return `pwdreset:code:${tokenHash}`;
}

function userCodeKey(userId: string) {
  return `pwdreset:user:${userId}`;
}

async function revokeRefreshTokens(userId: string) {
  const stream = redis.scanStream({ match: `refresh:${userId}:*`, count: 100 });
  const keys: string[] = [];

  for await (const batch of stream) {
    keys.push(...(batch as string[]));
    if (keys.length >= 100) {
      await redis.del(...keys);
      keys.length = 0;
    }
  }

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function requestPasswordReset(correo: string): Promise<PasswordResetRequest> {
  const user = await findUserByEmail(correo);

  if (!user) {
    return { code: null, limited: false };
  }

  const rateKey = requestRateKey(correo);
  const requests = await redis.incr(rateKey);
  if (requests === 1) {
    await redis.expire(rateKey, REQUEST_WINDOW_SECONDS);
  }
  if (requests > MAX_REQUESTS) {
    return { code: null, limited: true };
  }

  const previousHash = await redis.get(userCodeKey(user.id));
  if (previousHash) {
    await redis.del(codeKey(previousHash));
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  const tokenHash = hashToken(code);

  await redis.set(codeKey(tokenHash), user.id, 'EX', CODE_TTL_SECONDS);
  await redis.set(userCodeKey(user.id), tokenHash, 'EX', CODE_TTL_SECONDS);

  return { code, limited: false };
}

export async function resetPassword(token: string, password: string, ip: string): Promise<PasswordResetResult> {
  const rateKey = verifyRateKey(ip);
  const attempts = await redis.incr(rateKey);
  if (attempts === 1) {
    await redis.expire(rateKey, VERIFY_WINDOW_SECONDS);
  }
  if (attempts > MAX_VERIFY_ATTEMPTS) {
    return {
      ok: false,
      error: 'Demasiados intentos. Solicita un código nuevo más tarde.',
      status: 429,
    };
  }

  const tokenHash = hashToken(token);
  const userId = await redis.get(codeKey(tokenHash));

  if (!userId) {
    return { ok: false, error: 'El código es inválido o ha expirado.' };
  }

  const passwordHash = await argon2.hash(password);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);

  await redis.del(codeKey(tokenHash));
  const currentHash = await redis.get(userCodeKey(userId));
  if (currentHash === tokenHash) {
    await redis.del(userCodeKey(userId));
  }
  await redis.del(rateKey);
  await revokeRefreshTokens(userId);

  return { ok: true };
}
