
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle, Sparkle, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication status from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    navigate('/');
  };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <Sparkle className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Course Dash</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                className="text-sm font-medium"
                onClick={() => navigate('/')}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost"
                className="text-sm font-medium"
              >
                Courses
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/auth">
                <Button 
                  variant="outline"
                  className="rounded-full px-6"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  className="rounded-full px-6 shadow-soft"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
