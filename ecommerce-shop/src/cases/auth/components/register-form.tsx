import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../schemas';
import { supabase } from '../../../lib/supabase';
import { customerService } from '../../customers/services/customer.service';
import { useToast } from '../../../contexts/toast-context';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Step 1: Create Supabase user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          showToast('Este email já está cadastrado', 'error');
        } else {
          showToast(`Erro ao criar conta: ${authError.message}`, 'error');
        }
        return;
      }

      if (!authData.user) {
        showToast('Erro ao criar conta', 'error');
        return;
      }

      // Step 2: Create Customer in backend
      try {
        await customerService.create({
          supabaseUserId: authData.user.id,
          name: data.name,
          email: data.email,
        });

        showToast('Conta criada com sucesso!', 'success');
        navigate('/');
      } catch (backendError) {
        // Backend failed - notify user
        console.error('Failed to create customer in backend:', backendError);
        showToast(
          'Conta criada no Supabase, mas erro ao sincronizar com backend. Por favor, contate o suporte.',
          'error'
        );
        // Note: In production, implement rollback here by calling Supabase admin API
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Erro ao criar conta. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmar Senha
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-linear-to-r from-rose-500 to-pink-500 px-4 py-2 text-white font-medium hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
          Entrar
        </Link>
      </p>
    </form>
  );
}
