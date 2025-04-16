import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Award, 
  Calendar, 
  School, 
  LogOut, 
  FolderTree, 
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', icon: <Award className="h-4 w-4 mr-2" />, label: 'Dashboard' },
    { path: '/schools', icon: <School className="h-4 w-4 mr-2" />, label: 'Schools' },
    { path: '/districts', icon: <FolderTree className="h-4 w-4 mr-2" />, label: 'Districts' },
    { path: '/teams', icon: <Users className="h-4 w-4 mr-2" />, label: 'Teams' },
    { path: '/matches', icon: <Calendar className="h-4 w-4 mr-2" />, label: 'Matches' },
    { path: '/standings', icon: <Award className="h-4 w-4 mr-2" />, label: 'Standings' },
    { path: '/rankings', icon: <BarChart3 className="h-4 w-4 mr-2" />, label: 'Rankings' },
    { path: '/simulator', icon: <Rocket className="h-4 w-4 mr-2" />, label: 'Simulator' },
  ];
  
  const scrollNav = (direction: 'left' | 'right') => {
    const navElement = document.getElementById('desktop-nav');
    if (!navElement) return;
    
    const scrollAmount = 150;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
      
    navElement.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };
  
  const renderNavLinks = () => (
    navLinks.map(link => (
      <li key={link.path}>
        <Link 
          to={link.path} 
          className={`px-4 py-2 rounded-md inline-flex items-center whitespace-nowrap ${isActive(link.path) ? 'bg-white/20' : 'hover:bg-white/10'}`}
          onClick={() => isMobile && setIsDrawerOpen(false)}
        >
          {link.icon}
          {link.label}
        </Link>
      </li>
    ))
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-tennis-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <h1 className="text-xl font-bold">Tennis Team Manager</h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Welcome, {user.name}</span>
              {isMobile ? (
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent hover:bg-white/20 text-white border-white"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-[80vh]">
                    <div className="p-4 flex flex-col">
                      <DrawerClose className="ml-auto">
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </DrawerClose>
                      <div className="py-6">
                        <span className="text-lg font-medium mb-4 block">Menu</span>
                        <ul className="space-y-2">
                          {renderNavLinks()}
                        </ul>
                        <div className="mt-6 pt-6 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={logout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent hover:bg-white/20 text-white border-white"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>
      </header>
      
      {user && !isMobile && (
        <div className="bg-tennis-green text-white relative">
          <div className="container mx-auto flex items-center">
            <button 
              onClick={() => scrollNav('left')} 
              className="p-2 bg-tennis-green hover:bg-tennis-green/80 z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="overflow-x-auto scrollbar-hide" id="desktop-nav" style={{ scrollBehavior: 'smooth' }}>
              <nav className="py-2">
                <ul className="flex flex-nowrap space-x-1 min-w-max">
                  {renderNavLinks()}
                </ul>
              </nav>
            </div>
            
            <button 
              onClick={() => scrollNav('right')} 
              className="p-2 bg-tennis-green hover:bg-tennis-green/80 z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1 py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Tennis Team Manager. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
