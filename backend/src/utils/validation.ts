import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  correo: z.string().email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
