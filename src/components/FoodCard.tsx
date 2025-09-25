import { FoodItem } from "@/types/food";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export const FoodCard = ({ item, onAddToCart }: FoodCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">Sold Out</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-background/90 text-foreground backdrop-blur">
            <Clock className="w-3 h-3 mr-1" />
            {item.preparationTime} min
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">₹{item.price}</span>
        <Button 
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          size="sm"
          className="group/btn"
        >
          <Plus className="w-4 h-4 mr-1 group-hover/btn:rotate-90 transition-transform" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};