import { Button } from "./ui/button";
import { User, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { signInWithGoogle, signOutUser } from "../lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

export const AuthButton = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="font-medium">{user.displayName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/orders" className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOutUser()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={signInWithGoogle}>
      <User className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  );
};