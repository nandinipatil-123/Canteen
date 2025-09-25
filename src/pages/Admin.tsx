import { useState, useEffect } from "react";
import { useFoodItems, useCreateFoodItem, useUpdateFoodItem, useDeleteFoodItem, useToggleAvailability } from "@/hooks/useFoodItems";
import { AuthService } from "@/lib/services/foodService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, ToggleLeft, ToggleRight, LogOut, Lock } from "lucide-react";
import { toast } from "sonner";
import type { FoodItem } from "@/types/food";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: foodItems = [], isLoading, refetch } = useFoodItems();
  const createFoodItem = useCreateFoodItem();
  const updateFoodItem = useUpdateFoodItem();
  const deleteFoodItem = useDeleteFoodItem();
  const toggleAvailability = useToggleAvailability();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    tags: '',
    available: true,
    preparationTime: '',
  });

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const isAdmin = await AuthService.checkAuth();
        setIsAuthenticated(isAdmin);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      tags: '',
      available: true,
      preparationTime: '',
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      category: formData.category,
      image: formData.image,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      available: formData.available,
      preparationTime: parseInt(formData.preparationTime),
    };

    if (editingItem) {
      // Update existing item
      updateFoodItem.mutate({ id: editingItem.id, updates: itemData }, {
        onSuccess: () => {
          toast.success("Food item updated successfully!");
          setIsDialogOpen(false);
          resetForm();
          refetch();
        },
        onError: () => {
          toast.error("Failed to update food item");
        }
      });
    } else {
      // Create new item
      createFoodItem.mutate(itemData, {
        onSuccess: () => {
          toast.success("Food item created successfully!");
          setIsDialogOpen(false);
          resetForm();
          refetch();
        },
        onError: () => {
          toast.error("Failed to create food item");
        }
      });
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      tags: item.tags.join(', '),
      available: item.available,
      preparationTime: item.preparationTime.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteFoodItem.mutate(id, {
        onSuccess: () => {
          toast.success("Food item deleted successfully!");
          refetch();
        },
        onError: () => {
          toast.error("Failed to delete food item");
        }
      });
    }
  };

  const handleToggle = (id: string, name: string) => {
    toggleAvailability.mutate(id, {
      onSuccess: () => {
        toast.success(`${name} availability toggled!`);
        refetch();
      },
      onError: () => {
        toast.error("Failed to toggle availability");
      }
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const success = await AuthService.login(loginData.username, loginData.password);
      if (success) {
        setIsAuthenticated(true);
        toast.success("Logged in successfully!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Food Admin Panel</h1>
          <p className="text-muted-foreground">Manage your food menu items</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preparationTime">Prep Time (minutes) *</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">Image Path *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/food-example.jpg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Vegetarian, Spicy, Hot"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createFoodItem.isPending || updateFoodItem.isPending}>
                  {editingItem ? 'Update Item' : 'Create Item'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {foodItems.map((item) => (
          <Card key={item.id} className={`${!item.available ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
                <Badge variant={item.available ? 'default' : 'secondary'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {item.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">₹{item.price}</span>
                <span className="text-sm text-muted-foreground">{item.preparationTime} min</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(item.id, item.name)}
                  disabled={toggleAvailability.isPending}
                  className="flex-1"
                >
                  {item.available ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={deleteFoodItem.isPending}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;