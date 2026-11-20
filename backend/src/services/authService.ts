import { pool } from '../db/pool.js';
import argon2 from 'argon2';

export async function createUser(nombre: string, correo: string, password: string) {
  const password_hash = await argon2.hash(password);
  const result = await pool.query(
    'INSERT INTO users (nombre, correo, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, correo, role, creado_en',
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
