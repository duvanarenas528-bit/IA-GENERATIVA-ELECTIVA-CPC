import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const ALLOWED_MIME_TYPES = Object.keys(EXT_BY_MIME);
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] || '.img';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadPreperitajePhoto = multer({
  storage,
  limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!EXT_BY_MIME[file.mimetype]) {
      return cb(new Error('Formato no válido. Solo se permiten imágenes JPG, PNG o WEBP.'));
    }
    cb(null, true);
  },
});

export function removeUploadedFile(filename?: string | null) {
  if (!filename) return;
  const filePath = path.join(UPLOADS_DIR, path.basename(filename));
  fs.promises.unlink(filePath).catch(() => {});
}
