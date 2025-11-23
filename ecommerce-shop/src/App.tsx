import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { AuthProvider } from './contexts/auth-context';
import { FavoritesProvider } from './contexts/favorites-context';
import { CartProvider } from './cases/cart/contexts/cart-context';
import { ToastProvider } from './contexts/toast-context';
import { ErrorBoundary } from './components/ui/error-boundary';
import { MainLayout } from './components/layout/main-layout';
import { HomePage } from './cases/catalog/components/home';
import { CategoryPage } from './cases/catalog/components/category-page';
import { ProductDetailsPage } from './cases/catalog/components/product-details';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { OrdersHistoryPage } from './pages/orders-history';
import { FavoritesPageRoute } from './pages/favorites';
import { CheckoutPage } from './cases/orders/components/checkout-page';
import { ProtectedRoute } from './components/auth/protected-route';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FavoritesProvider>
            <ToastProvider>
              <CartProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public routes without layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Routes with main layout */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/category/:categoryId" element={<CategoryPage />} />
                      <Route path="/product/:id" element={<ProductDetailsPage />} />
                      
                      {/* Protected routes */}
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrdersHistoryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/favorites"
                        element={
                          <ProtectedRoute>
                            <FavoritesPageRoute />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </CartProvider>
            </ToastProvider>
          </FavoritesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
