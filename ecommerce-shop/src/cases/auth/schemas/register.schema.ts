import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(255, 'Nome muito longo'),
    email: z
      .string()
      .email('Email inválido')
      .max(255, 'Email muito longo'),
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .max(72, 'Senha muito longa'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;