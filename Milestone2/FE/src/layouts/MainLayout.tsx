import type { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FilterBar from '../components/Fiter';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-72 shrink-0">
              <FilterBar />
            </aside>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}