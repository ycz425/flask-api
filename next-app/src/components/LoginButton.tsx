'use client';

import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";

export function LoginButton() {
  const { user, login, logout } = useAuth();

  return (
    <Button
      onClick={user ? logout : login}
      variant="outline"
      className="w-full"
    >
      {user ? 'Sign Out' : 'Sign in with Google'}
    </Button>
  );
} 