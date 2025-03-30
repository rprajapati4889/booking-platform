
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Booking Platform
        </Link>
        
        <nav className="flex items-center gap-4">
          {authState.isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-1"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-1"
              >
                <Link to="/booking">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Book Now</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm hidden md:inline">
                  {authState.user?.firstName} {authState.user?.lastName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
