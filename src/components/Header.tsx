import { Search, ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  cartItemsCount: number;
  onSearch: (query: string) => void;
}

export const Header = ({ cartItemsCount, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="Campus Bites Logo" 
                className="w-12 h-12 hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-foreground">Campus Bites</span>
                <div className="text-xs text-muted-foreground">Fresh • Fast • Delicious</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">Menu</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search food..."
                  className="pl-10 pr-4 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <ThemeToggle />
            
            <AuthButton />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">Menu</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search food..."
                    className="pl-10 pr-4 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};