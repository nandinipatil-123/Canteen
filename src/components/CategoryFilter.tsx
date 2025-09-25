import { Button } from "./ui/button";
import { Coffee, Utensils, Cookie, Soup, Pizza, Salad } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "All": <Utensils className="w-4 h-4" />,
  "Breakfast": <Coffee className="w-4 h-4" />,
  "Lunch": <Pizza className="w-4 h-4" />,
  "Snacks": <Cookie className="w-4 h-4" />,
  "Beverages": <Coffee className="w-4 h-4" />,
  "Soups": <Soup className="w-4 h-4" />,
  "Salads": <Salad className="w-4 h-4" />,
};

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="transition-all duration-200"
        >
          {categoryIcons[category]}
          {category}
        </Button>
      ))}
    </div>
  );
};