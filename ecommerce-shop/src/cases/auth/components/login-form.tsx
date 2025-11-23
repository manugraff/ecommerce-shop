import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../schemas';
import { useAuth } from '../../../contexts/auth-context';
import { useToast } from '../../../contexts/toast-context';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const redirectTo = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await signIn(data.email, data.password);
      showToast('Login realizado com sucesso!', 'success');
      navigate(redirectTo);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Email ou senha incorretos';
      
      if (errorMessage.includes('Invalid login credentials')) {
        showToast('Email ou senha incorretos', 'error');
      } else {
        showToast('Erro ao fazer login. Tente novamente.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
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
          autoComplete="current-password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-linear-to-r from-rose-500 to-pink-500 px-4 py-2 text-white font-medium hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Não tem conta?{' '}
        <Link to="/register" className="font-medium text-rose-600 hover:text-rose-500">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
