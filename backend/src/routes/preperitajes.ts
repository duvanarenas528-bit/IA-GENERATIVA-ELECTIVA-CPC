import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAuth } from '../middlewares/auth.js';
import { MAX_PHOTO_SIZE_BYTES, uploadPreperitajePhoto } from '../middlewares/upload.js';
import {
  getPreperitajeFotoArchivo,
  getPreperitajeInforme,
  listPreperitajeFotos,
  uploadPreperitajeFoto,
} from '../controllers/preperitajesController.js';

const router = Router();

function handlePhotoUpload(req: Request, res: Response, next: NextFunction) {
  uploadPreperitajePhoto.single('foto')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: `La imagen supera el tamaño máximo de ${MAX_PHOTO_SIZE_BYTES / (1024 * 1024)} MB.`,
        });
      }
      return res.status(400).json({ error: 'No se pudo subir la imagen.' });
    }
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : 'Archivo no válido.' });
    }
    next();
  });
}

router.use(requireAuth);

router.get('/:id/informe', getPreperitajeInforme);
router.get('/:id/fotos', listPreperitajeFotos);
router.post('/:id/fotos', handlePhotoUpload, uploadPreperitajeFoto);
router.get('/:id/fotos/:fotoId/archivo', getPreperitajeFotoArchivo);

export default router;
