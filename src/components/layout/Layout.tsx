
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">APR Tennis</h2>
        </div>
        <Navigation />
      </div>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
