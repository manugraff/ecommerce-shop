import { OrderList } from '../cases/orders/components/order-list';
import { MainLayout } from '../components/layout/main-layout';
import { ProtectedRoute } from '../components/auth/protected-route';
import type { OrderDTO } from '../cases/orders/dtos';

export function OrderHistoryPage() {
  const handleOrderClick = (order: OrderDTO) => {
    // Future enhancement: Navigate to order detail page
    console.log('Order clicked:', order);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Meus Pedidos
              </h1>
              <p className="text-gray-600 mt-1">
                Acompanhe o status dos seus pedidos e veja o histórico de compras
              </p>
            </div>
            
            <OrderList onOrderClick={handleOrderClick} />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}