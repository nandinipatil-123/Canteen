import { useState, useMemo } from "react";
import { FoodCard } from "@/components/FoodCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Menu = () => {
  const { addToCart } = useCart();
  const { data: foodItems = [], isLoading, error } = useFoodItems();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ["All", ...Array.from(new Set(foodItems.map(item => item.category)))];
  
  const filteredAndSortedItems = useMemo(() => {
    let items = foodItems;
    
    // Filter by category
    if (selectedCategory !== "All") {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort items
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "time":
          return a.preparationTime - b.preparationTime;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return items;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
          <p className="text-muted-foreground">Choose from our wide variety of delicious items</p>
        </div>
        
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for food, ingredients, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="time">Preparation Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedItems.length} items
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Error loading menu</h2>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <FoodCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No items found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;