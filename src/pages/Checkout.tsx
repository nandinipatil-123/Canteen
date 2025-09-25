import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, HandCoins, Loader2, Ticket, Gift, Star, LogIn } from "lucide-react";
import { CheckoutState, Coupon, Order } from "@/types/food";
import { MockAuthService } from "@/lib/services/foodService";

const mockCoupons: Coupon[] = [
  { code: "STUDENT10", type: "percentage", value: 10, description: "Student discount", minOrderAmount: 100 },
  { code: "FIRST20", type: "percentage", value: 20, description: "First order discount", minOrderAmount: 200 },
  { code: "SAVE50", type: "fixed", value: 50, description: "₹50 off", minOrderAmount: 300 }
];

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    couponCode: "",
    discount: 0,
    loyaltyPointsUsed: 0,
    paymentMethod: null,
    isProcessing: false,
    orderPlaced: false
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250); // Mock user loyalty points
  const [notes, setNotes] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + tax - checkoutState.discount - checkoutState.loyaltyPointsUsed;

  useEffect(() => {
    if (cartItems.length === 0 && !checkoutState.isProcessing) {
      navigate("/cart");
    }
  }, [cartItems, navigate, checkoutState.isProcessing]);

  // Show authentication required if user is not signed in
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      
      try {
        const user = await MockAuthService.login(loginData.username, loginData.password);
        if (user) {
          window.location.reload(); // Simple way to refresh auth state
        } else {
          toast({
            title: "Invalid credentials",
            description: "Please check your username and password",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Login failed",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setIsLoggingIn(false);
      }
    };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LogIn className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-600 mb-8">
          Please sign in to place your order and track your meals.
        </p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter username (Snehith)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter password (12345678)"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateCoupon = (code: string) => {
    const coupon = mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return null;
    
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      toast({
        title: "Invalid coupon",
        description: `Minimum order amount ₹${coupon.minOrderAmount} required`,
        variant: "destructive"
      });
      return null;
    }
    
    return coupon;
  };

  const applyCoupon = () => {
    const coupon = validateCoupon(checkoutState.couponCode);
    if (!coupon) return;

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    setCheckoutState(prev => ({ ...prev, discount }));
    toast({
      title: "Coupon applied!",
      description: `${coupon.description} - ₹${discount.toFixed(2)} discount applied`
    });
  };

  const applyLoyaltyPoints = (points: number) => {
    const maxPoints = Math.min(loyaltyPoints, Math.floor(finalTotal + checkoutState.loyaltyPointsUsed));
    const pointsToUse = Math.min(points, maxPoints);
    setCheckoutState(prev => ({ ...prev, loyaltyPointsUsed: pointsToUse }));
  };

  const processPayment = async () => {
    setCheckoutState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Create order in database
      const orderData = {
        items: cartItems.map(item => ({
          foodItemId: item.id,
          quantity: item.quantity
        })),
        notes: notes || undefined
      };
      
      const result = await createOrderMutation.mutateAsync(orderData);
      
      // Update loyalty points
      setLoyaltyPoints(prev => prev - checkoutState.loyaltyPointsUsed + Math.floor(finalTotal / 10));
      
      // Clear cart
      clearCart();
      
      // Show success toast with order ID
      toast({
        title: "Order placed successfully! 🎉",
        description: `Order ID: ${result.order.id.slice(0, 8).toUpperCase()} - Your order is being prepared`,
      });
      
      // Navigate to orders page to see the new order
      navigate("/orders");
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCheckoutState(prev => ({ ...prev, isProcessing: false }));
    }
  };


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid={`cart-item-name-${item.id}`}>{item.name}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground" data-testid={`cart-item-qty-${item.id}`}>Qty: {item.quantity}</span>
                        <span data-testid={`item-total-${item.id}`}>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Discount & Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Have a coupon?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={checkoutState.couponCode}
                    onChange={(e) => setCheckoutState(prev => ({ ...prev, couponCode: e.target.value }))}
                    data-testid="input-coupon"
                  />
                  <Button onClick={applyCoupon} variant="outline" data-testid="button-apply-coupon">
                    Apply
                  </Button>
                </div>
                
                {/* Special Instructions */}
                <div className="mt-4">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Special Instructions (Optional)
                  </Label>
                  <textarea
                    id="notes"
                    placeholder="Add any special instructions for your order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full p-3 border border-input rounded-md resize-none text-sm"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {notes.length}/200 characters
                  </div>
                </div>
                
                {/* Student Loyalty Points */}
                <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-950">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Student Loyalty Points</span>
                    <Badge variant="secondary" data-testid="text-loyalty-balance">{loyaltyPoints} available</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use your loyalty points to reduce your total (1 point = ₹1)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Points to use"
                      max={Math.min(loyaltyPoints, Math.floor(finalTotal + checkoutState.loyaltyPointsUsed))}
                      value={checkoutState.loyaltyPointsUsed || ""}
                      onChange={(e) => applyLoyaltyPoints(Number(e.target.value) || 0)}
                      data-testid="input-loyalty-points"
                    />
                    <Button
                      variant="outline"
                      onClick={() => applyLoyaltyPoints(Math.min(loyaltyPoints, Math.floor(finalTotal + checkoutState.loyaltyPointsUsed)))}
                      data-testid="button-max-points"
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={checkoutState.paymentMethod || ""}
                  onValueChange={(value) => setCheckoutState(prev => ({ ...prev, paymentMethod: value as 'cash' | 'card' }))}
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors">
                    <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
                    <HandCoins className="w-5 h-5 text-green-600" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Cash on Pickup</div>
                        <div className="text-sm text-muted-foreground">Pay when you collect your order</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors">
                    <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Card/UPI Payment</div>
                        <div className="text-sm text-muted-foreground">Pay now with card or UPI</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span data-testid="text-tax">₹{tax.toFixed(2)}</span>
                  </div>
                  {checkoutState.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span data-testid="text-coupon-discount">-₹{checkoutState.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {checkoutState.loyaltyPointsUsed > 0 && (
                    <div className="flex justify-between text-purple-600">
                      <span>Loyalty Points Used</span>
                      <span data-testid="text-loyalty-discount">-₹{checkoutState.loyaltyPointsUsed.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-final-total">₹{finalTotal.toFixed(2)}</span>
                </div>
                
                <Button
                  className="w-full mt-4"
                  size="lg"
                  disabled={!checkoutState.paymentMethod || createOrderMutation.isPending || finalTotal <= 0}
                  onClick={processPayment}
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - ₹${finalTotal.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;