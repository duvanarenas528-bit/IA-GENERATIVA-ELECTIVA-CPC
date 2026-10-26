import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, accessSecret, { expiresIn: process.env.JWT_ACCESS_TTL || '15m' } as any);
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: process.env.JWT_REFRESH_TTL || '7d' } as any);
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessSecret);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshSecret);
  } catch {
    return null;
  }
};
