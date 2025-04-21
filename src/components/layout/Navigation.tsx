
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  School,
  Users,
  LayoutDashboard,
  MapPin,
  Plus,
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="grid items-start px-4 text-sm">
      <Link
        to="/"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/') && "text-gray-900"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Home
      </Link>
      <Link
        to="/rankings"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/rankings') && "bg-gray-100 text-gray-900 font-medium"
        )}
      >
        <BarChart3 className="h-4 w-4" />
        APR Rankings
      </Link>
      <Link
        to="/match-entry"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/match-entry') && "bg-gray-100 text-gray-900 font-medium"
        )}
      >
        <Plus className="h-4 w-4" />
        Add Match
      </Link>
      <Link
        to="/matches"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/matches') && "text-gray-900"
        )}
      >
        <Calendar className="h-4 w-4" />
        All Matches
      </Link>
      <Link
        to="/schools"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/schools') && "text-gray-900"
        )}
      >
        <School className="h-4 w-4" />
        Schools
      </Link>
      <Link
        to="/districts"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/districts') && "text-gray-900"
        )}
      >
        <MapPin className="h-4 w-4" />
        Districts
      </Link>
      <Link
        to="/teams"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive('/teams') && "text-gray-900"
        )}
      >
        <Users className="h-4 w-4" />
        Teams
      </Link>
    </nav>
  );
};

export default Navigation;
