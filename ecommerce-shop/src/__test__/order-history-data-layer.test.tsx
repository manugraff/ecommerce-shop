// Test file to verify the data layer implementation
// This file demonstrates how to use the implemented hooks

import { useMyOrders } from '../cases/orders/hooks';
import { useAuth } from '../contexts/auth-context';

function OrderHistoryTestComponent() {
  const { customerData, loading: authLoading } = useAuth();
  const { data: orders, isLoading, error } = useMyOrders();

  if (authLoading) {
    return <div>Loading user...</div>;
  }

  if (!customerData) {
    return <div>Please login to view order history</div>;
  }

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  return (
    <div>
      <h2>Order History for {customerData.name}</h2>
      {orders?.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders?.map((order) => (
            <li key={order.id}>
              Order #{order.id} - {order.status} - ${order.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { OrderHistoryTestComponent };