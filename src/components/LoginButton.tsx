import { Button } from "./ui/button";
import { useAuth } from "../lib/auth-context";

export function LoginButton() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <Button
      onClick={user ? logout : signInWithGoogle}
      variant="outline"
      className="w-full"
    >
      {user ? 'Sign Out' : 'Sign in with Google'}
    </Button>
  );
} 