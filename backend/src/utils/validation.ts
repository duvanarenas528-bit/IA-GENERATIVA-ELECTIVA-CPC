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

export const forgotPasswordSchema = z.object({
  correo: z.string().email('Correo inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
