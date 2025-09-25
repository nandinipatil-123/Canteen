import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodService } from "@/lib/services/foodService";
import type { FoodItem } from "@/types/food";

export const useFoodItems = () => {
  return useQuery({
    queryKey: ["foodItems"],
    queryFn: FoodService.getAllFoodItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFoodItemsByCategory = (category?: string) => {
  return useQuery({
    queryKey: ["foodItems", "category", category],
    queryFn: () => category ? FoodService.getFoodItemsByCategory(category) : FoodService.getAllFoodItems(),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFoodItem = (id: string) => {
  return useQuery({
    queryKey: ["foodItems", id],
    queryFn: () => FoodService.getFoodItemById(id),
    enabled: !!id,
  });
};

export const useCreateFoodItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>) => 
      FoodService.createFoodItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
    },
  });
};

export const useUpdateFoodItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      FoodService.updateFoodItem(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      queryClient.invalidateQueries({ queryKey: ["foodItems", variables.id] });
    },
  });
};

export const useDeleteFoodItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: FoodService.deleteFoodItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
    },
  });
};

export const useToggleAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: FoodService.toggleAvailability,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      queryClient.invalidateQueries({ queryKey: ["foodItems", id] });
    },
  });
};