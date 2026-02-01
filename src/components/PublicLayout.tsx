import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdSidebar } from './AdSidebar';

interface PublicLayoutProps {
  children: ReactNode;
  withSidebar?: boolean;
  hero?: ReactNode;
}

export const PublicLayout = ({ children, withSidebar = false, hero }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        {hero && <div className="mb-4">{hero}</div>}
        <div className="container py-6 lg:py-10">
          {withSidebar ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8 min-w-0 order-1">
                {children}
              </div>

              {/* Sidebar: Appears below content on mobile, with margin */}
              <aside className="lg:col-span-4 lg:border-l lg:border-divider lg:pl-8 order-2 mt-8 lg:mt-0">
                <div className="sticky top-24">
                  <AdSidebar />
                </div>
              </aside>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
