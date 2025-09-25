import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Order } from "@/types/food";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, get from localStorage
    const orderData = localStorage.getItem(`order_${orderId}`);
    if (orderData) {
      const parsedOrder = JSON.parse(orderData);
      // Revive Date objects from strings
      parsedOrder.orderTime = new Date(parsedOrder.orderTime);
      parsedOrder.estimatedTime = new Date(parsedOrder.estimatedTime);
      setOrder(parsedOrder);
    } else {
      // If no order found, redirect to home
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => navigate("/")} data-testid="button-go-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your order is being prepared</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span data-testid="text-order-id">Order #{order.id}</span>
              <Badge variant="secondary" className="animate-pulse" data-testid="status-preparing">
                Preparing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium" data-testid={`order-item-name-${item.id}`}>
                      {item.name}
                    </span>
                    <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                  </div>
                  <span data-testid={`order-item-total-${item.id}`}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span data-testid="text-order-subtotal">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span data-testid="text-order-tax">₹{(order.subtotal * 0.05).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span data-testid="text-order-discount">-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.loyaltyPointsUsed > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Loyalty Points</span>
                  <span data-testid="text-order-loyalty-discount">-₹{order.loyaltyPointsUsed.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span data-testid="text-order-total">₹{order.total.toFixed(2)}</span>
            </div>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p data-testid="text-payment-method">
                Payment Method: {order.paymentMethod === 'cash' ? 'Cash on Pickup' : 'Card/UPI Payment'}
              </p>
              <p data-testid="text-estimated-time">
                Estimated ready time: {order.estimatedTime.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/")} data-testid="button-continue-shopping">
            Continue Shopping
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate("/menu")} data-testid="button-view-menu">
            View Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;