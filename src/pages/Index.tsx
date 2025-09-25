import { HeroSection } from "@/components/HeroSection";
import { FoodCard } from "@/components/FoodCard";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Clock } from "lucide-react";

const Index = () => {
  const { addToCart } = useCart();
  const { data: foodItems = [], isLoading } = useFoodItems();
  
  // Get featured items (first 6 available items)
  const featuredItems = foodItems.filter(item => item.available).slice(0, 6);
  
  // Get popular items (items with high mock popularity)
  const popularItems = foodItems.slice(3, 7);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Special Offers Section */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Daily Specials</h3>
              <p className="text-muted-foreground text-sm">Get 20% off on selected items every day!</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Loyalty Points</h3>
              <p className="text-muted-foreground text-sm">Earn points with every order and get free meals!</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Pickup</h3>
              <p className="text-muted-foreground text-sm">Order ahead and skip the queue completely!</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Items</h2>
              <p className="text-muted-foreground">Our most loved dishes</p>
            </div>
            <Link to="/menu">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <FoodCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Popular This Week */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Trending</Badge>
            <h2 className="text-3xl font-bold mb-2">Popular This Week</h2>
            <p className="text-muted-foreground">Based on what others are ordering</p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item, index) => (
                <div key={item.id} className="relative">
                  <Badge className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground">
                    #{index + 1}
                  </Badge>
                  <FoodCard item={item} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;