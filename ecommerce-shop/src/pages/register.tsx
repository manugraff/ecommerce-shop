import { RegisterForm } from '../cases/auth/components/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-linear-to-br from-rose-50 to-stone-100 py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Criar Nova Conta
          </CardTitle>
          <CardDescription className="text-gray-600">
            Crie sua conta para começar a comprar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
