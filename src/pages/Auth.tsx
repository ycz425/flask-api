import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkle, LogIn } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle } = useAuth();
  
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigate to the page the user was trying to access, or to /courses as default
      const from = (location.state as any)?.from?.pathname || '/courses';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-pattern animate-fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">Course Dash</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome to Course Dash</h1>
          <p className="text-muted-foreground">Sign in to manage your courses and study materials</p>
        </div>
        
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button className="w-full flex items-center justify-center gap-2 h-12 animate-slide-up" onClick={handleSignIn}>
              <LogIn className="h-5 w-5" />
              <span>Sign in with Google</span>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
