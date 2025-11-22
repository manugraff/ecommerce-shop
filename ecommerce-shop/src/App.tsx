import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { CartProvider } from './cases/cart/contexts/cart-context';
import { ToastProvider } from './contexts/toast-context';
import { ErrorBoundary } from './components/ui/error-boundary';
import { MainLayout } from './components/layout/main-layout';
import { HomePage } from './pages/home';
import { CategoryPage } from './pages/category-page';
import { ProductDetailsPage } from './pages/product-details';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <CartProvider>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </CartProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
