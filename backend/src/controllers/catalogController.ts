import { Request, Response } from 'express';
import { getMakes, getModels, getYears } from '../services/carCatalogService.js';

export async function catalogMakes(_req: Request, res: Response) {
  try {
    const result = await getMakes();
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al consultar el catálogo' });
  }
}

export async function catalogModels(req: Request, res: Response) {
  const make = String(req.query.make || '').trim();
  if (!make) return res.status(400).json({ error: 'La marca es obligatoria' });

  try {
    const result = await getModels(make);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al consultar los modelos' });
  }
}

export async function catalogYears(req: Request, res: Response) {
  const make = String(req.query.make || '').trim();
  const model = String(req.query.model || '').trim();
  if (!make || !model) return res.status(400).json({ error: 'Marca y modelo son obligatorios' });

  try {
    const result = await getYears(make, model);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al consultar los años' });
  }
}
