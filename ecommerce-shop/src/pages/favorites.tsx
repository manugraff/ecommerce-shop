import { MainLayout } from '../components/layout/main-layout';
import { ProtectedRoute } from '../components/auth/protected-route';
import { FavoritesPage } from '../cases/favorites/components/favorites-page';

export function FavoritesPageRoute() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <FavoritesPage />
      </MainLayout>
    </ProtectedRoute>
  );
}