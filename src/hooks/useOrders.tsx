import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  foodItem: {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
  };
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  totalAmount: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

// Fetch user orders
export const useOrders = () => {
  const { user } = useAuth();
  
  return useQuery<Order[]>({
    queryKey: ["orders", user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }
      
      const response = await fetch(`/api/orders`, {
        credentials: 'include', // Include cookies for session auth
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      return response.json();
    },
    enabled: !!user?.uid,
  });
};

// Create new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (orderData: {
      items: { foodItemId: string; quantity: number }[];
      notes?: string;
    }) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: 'include', // Include cookies for session auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders", user?.uid] });
    },
  });
};