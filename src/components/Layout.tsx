import { ReactNode } from 'react';
import StarField from './StarField';
import TopBar from './TopBar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  pageTitle?: string;
}

const Layout = ({ children, showNav = true, pageTitle }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/80 relative overflow-hidden">
      <StarField density={150} speed={0.5} />
      
      <div className="relative z-10 min-h-screen">
        {showNav && (
          <TopBar title={pageTitle} />
        )}
        
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
