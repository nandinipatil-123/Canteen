import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { ClockIcon, ShoppingBagIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  preparing: "bg-orange-500",
  ready: "bg-green-500",
  delivered: "bg-gray-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading, error } = useOrders();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Sign In to View Your Orders</h1>
        <p className="text-gray-600 mb-8">
          Please sign in with Google to see your order history and track your meals.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-600 mb-4">Failed to load orders</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">
          You haven't placed any orders yet. Browse our menu and place your first order!
        </p>
        <Button asChild>
          <a href="/menu">Browse Menu</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
        <p className="text-gray-600">
          Welcome back, {user.displayName || user.email}! Here's your order history.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge 
                    className={`${statusColors[order.status as keyof typeof statusColors]} text-white`}
                  >
                    {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.foodItem.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.foodItem.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Qty: {item.quantity}</span>
                          <span className="text-gray-500">•</span>
                          <span className="font-medium">
                            ${(item.priceAtTime / 100).toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${((item.priceAtTime / 100) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};