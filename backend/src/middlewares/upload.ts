import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), 'uploads');

export const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const ALLOWED_MIME_TYPES = Object.keys(EXT_BY_MIME);
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadPreperitajePhoto = multer({
  storage: multer.memoryStorage(),
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
  if (/^https?:\/\//i.test(filename) || filename.includes('/') || filename.includes('\\')) return;
  const filePath = path.join(UPLOADS_DIR, path.basename(filename));
  fs.promises.unlink(filePath).catch(() => {});
}
