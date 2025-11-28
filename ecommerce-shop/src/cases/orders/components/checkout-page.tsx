import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth-context';
import { useCart } from '../../cart/contexts/cart-context';
import { orderService } from '../services/order.service';
import { OrderSummary } from './order-summary';
import { useToast } from '../../../contexts/toast-context';
import type { CreateOrderDTO } from '../dtos';

export function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { customerData, user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const items = cart.items;

  const handleConfirmOrder = async () => {
    if (!customerData) {
      showToast('Erro: dados do cliente não encontrados', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Seu carrinho está vazio', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const total = items.reduce((sum: number, item) => sum + item.lineTotal, 0);

      const orderData: CreateOrderDTO = {
        customer: {
          id: customerData.id,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
      };

      const order = await orderService.createOrder(orderData);

      showToast(`Pedido #${order.id} confirmado com sucesso!`, 'success');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Failed to create order:', error);
      showToast('Erro ao processar pedido. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Adicione produtos ao carrinho para finalizar seu pedido
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Pedido</h1>
          <p className="mt-2 text-gray-600">
            Olá, {customerData?.name || user?.email}! Revise seu pedido abaixo.
          </p>
        </div>

        <OrderSummary items={items} />

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Continuar Comprando
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processando...' : 'Confirmar Compra'}
          </button>
        </div>

        {!customerData && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Alguns dados do cliente estão faltando. O pedido pode falhar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}