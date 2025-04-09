
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, Users, Award, Calendar, School, LogOut } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
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
              <span>Welcome, {user.name}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent hover:bg-white/20 text-white border-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {user && (
        <div className="bg-tennis-green text-white">
          <nav className="container mx-auto py-2">
            <ul className="flex space-x-1">
              <li>
                <Link to="/" className={`px-4 py-2 rounded-md inline-flex items-center ${isActive('/') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  <Award className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/schools" className={`px-4 py-2 rounded-md inline-flex items-center ${isActive('/schools') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  <School className="h-4 w-4 mr-2" />
                  Schools
                </Link>
              </li>
              <li>
                <Link to="/teams" className={`px-4 py-2 rounded-md inline-flex items-center ${isActive('/teams') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/matches" className={`px-4 py-2 rounded-md inline-flex items-center ${isActive('/matches') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/standings" className={`px-4 py-2 rounded-md inline-flex items-center ${isActive('/standings') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  <Award className="h-4 w-4 mr-2" />
                  Standings
                </Link>
              </li>
            </ul>
          </nav>
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
