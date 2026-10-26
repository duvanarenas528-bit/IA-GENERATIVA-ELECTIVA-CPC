import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { register, login, logout, refresh, me, uploadAvatar, getAvatar, deleteAvatar } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';
import { MAX_PHOTO_SIZE_BYTES, uploadPreperitajePhoto } from '../middlewares/upload.js';

const router = Router();

function handleAvatarUpload(req: Request, res: Response, next: NextFunction) {
  uploadPreperitajePhoto.single('avatar')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: `La imagen supera el tamaño máximo de ${MAX_PHOTO_SIZE_BYTES / (1024 * 1024)} MB.`,
        });
      }
      return res.status(400).json({ error: 'No se pudo subir la foto de perfil.' });
    }
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : 'Archivo no válido.' });
    }
    next();
  });
}

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.post('/refresh', requireAuth, refresh);
router.get('/me', requireAuth, me);
router.get('/avatar', requireAuth, getAvatar);
router.post('/avatar', requireAuth, handleAvatarUpload, uploadAvatar);
router.delete('/avatar', requireAuth, deleteAvatar);

export default router;
