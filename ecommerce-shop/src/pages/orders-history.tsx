import { useMyOrders } from '../cases/orders/hooks/use-my-orders';
import { OrderCard } from '../components/orders/order-card';
import { Skeleton } from '../components/ui/skeleton';

export function OrdersHistoryPage() {
  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useMyOrders();

  // Loading State
  if (isLoadingOrders) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (ordersError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>
          
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar pedidos</h3>
            <p className="text-gray-500">
              Ocorreu um erro ao buscar seus pedidos. Tente novamente mais tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>
          
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Você ainda não fez pedidos</h3>
            <p className="text-gray-500 mb-6">
              Quando você fizer sua primeira compra, seus pedidos aparecerão aqui.
            </p>
            <a 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
            >
              Começar a comprar
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Orders List
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o status dos seus pedidos e veja o histórico de compras
          </p>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}