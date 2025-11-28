import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../schemas';
import { supabase } from '../../../lib/supabase';
import { customerService } from '../../customers/services/customer.service';
import { useToast } from '../../../contexts/toast-context';

const RATE_LIMIT_COOLDOWN = 300;
const RATE_LIMIT_STORAGE_KEY = 'supabase_rate_limit_until';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(() => {

    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (stored) {
      const timestamp = parseInt(stored, 10);
      if (timestamp > Date.now()) {
        return timestamp;
      }
      localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
    }
    return null;
  });
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!rateLimitedUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((rateLimitedUntil - Date.now()) / 1000));
      setCooldownRemaining(remaining);

      if (remaining <= 0) {
        setRateLimitedUntil(null);
        setCooldownRemaining(0);
        localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
      }
    }, 1000);

    setCooldownRemaining(Math.max(0, Math.ceil((rateLimitedUntil - Date.now()) / 1000)));

    return () => clearInterval(interval);
  }, [rateLimitedUntil]);

  const isRateLimited = rateLimitedUntil !== null && Date.now() < rateLimitedUntil;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {

    if (isRateLimited) {
      showToast(
        `Aguarde ${cooldownRemaining} segundos antes de tentar novamente.`,
        'error'
      );
      return;
    }

    setIsLoading(true);

    try {

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

        const errorMessage = authError.message?.toLowerCase() || '';
        const errorStatus = authError.status || (authError as any).__isAuthError && 429;
        const isRateLimitError =
          errorStatus === 429 ||
          errorMessage.includes('rate limit') ||
          errorMessage.includes('too many requests') ||
          errorMessage.includes('no api key') ||
          (authError as any).code === 'over_request_rate_limit' ||
          (authError as any).code === '429';

        if (isRateLimitError) {

          const cooldownEnd = Date.now() + RATE_LIMIT_COOLDOWN * 1000;
          setRateLimitedUntil(cooldownEnd);
          setCooldownRemaining(RATE_LIMIT_COOLDOWN);
          localStorage.setItem(RATE_LIMIT_STORAGE_KEY, cooldownEnd.toString());

          showToast(
            'Limite de registros atingido. O Supabase (plano gratuito) permite poucos cadastros por hora. Por favor, aguarde 5 minutos.',
            'error'
          );
          return;
        }

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

      try {
        await customerService.create({
          name: data.name,

        });

        showToast('Conta criada com sucesso!', 'success');
        navigate('/');
      } catch (backendError: any) {

        console.error('Failed to create customer in backend:', backendError);

        if (backendError.response?.status === 400) {
          showToast('Dados inválidos. Verifique as informações fornecidas.', 'error');
        } else if (backendError.response?.status === 422) {
          const errors = backendError.response.data?.errors;
          if (errors?.length) {
            showToast(`Erro de validação: ${errors[0].message}`, 'error');
          } else {
            showToast('Dados inválidos. Verifique as informações fornecidas.', 'error');
          }
        } else if (backendError.response?.status === 500) {

          showToast(
            'Erro interno do servidor. Tente novamente em alguns instantes ou entre em contato com suporte.',
            'error'
          );
        } else if (backendError.response?.status >= 400 && backendError.response?.status < 500) {
          showToast('Erro na solicitação. Verifique os dados e tente novamente.', 'error');
        } else {
          showToast(
            'Conta criada no sistema de autenticação, mas houve um problema ao criar o perfil. Entre em contato com suporte.',
            'error'
          );
        }

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

      {}
      {isRateLimited && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            ⚠️ O Supabase (plano gratuito) limita o número de cadastros por hora.
            Aguarde o tempo indicado ou tente fazer login se já tiver uma conta.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || isRateLimited}
        className="w-full rounded-md bg-linear-to-r from-rose-500 to-pink-500 px-4 py-2 text-white font-medium hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRateLimited
          ? `Aguarde ${Math.floor(cooldownRemaining / 60)}:${(cooldownRemaining % 60).toString().padStart(2, '0')}`
          : isLoading
            ? 'Criando conta...'
            : 'Criar Conta'}
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