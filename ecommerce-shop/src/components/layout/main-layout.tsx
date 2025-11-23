import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export function MainLayout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>
      <Footer />
    </div>
  );
}
