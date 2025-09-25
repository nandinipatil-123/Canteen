import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import admin from "firebase-admin";
import { db } from "./db";
import { foodItems, orders, orderItems } from "./db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyFirebaseToken, AuthenticatedRequest } from "./middleware/auth";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = 'localhost';

// Trust first proxy for secure headers and real IP addresses
app.set('trust proxy', 1);

// Admin credentials from environment - NO DEFAULTS for security
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  console.error('❌ Security Error: ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables are required');
  console.error('💡 To generate password hash: node -e "console.log(require(\'bcryptjs\').hashSync(\'your-password\', 12))"');
  process.exit(1);
}

// Secure configuration
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error('❌ Security Error: SESSION_SECRET environment variable is required');
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = isProduction ? process.env.FRONTEND_URL : 'http://localhost:5000';

// Validate required production environment variables
if (isProduction && !process.env.FRONTEND_URL) {
  console.error('❌ Security Error: FRONTEND_URL environment variable is required in production');
  process.exit(1);
}

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow iframe embedding for Replit
}));

// Middleware  
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Add size limit

// Configure session store
let sessionStore;
if (isProduction) {
  // Production: Use Redis store
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const redisClient = createClient({ url: redisUrl });
  redisClient.connect().catch(console.error);
  sessionStore = new RedisStore({ client: redisClient });
} else {
  // Development: MemoryStore is acceptable
  console.warn('⚠️  Using MemoryStore for sessions in development. Use Redis in production.');
}

app.use(session({
  store: sessionStore,
  secret: SESSION_SECRET,
  name: 'adminSessionId', // Custom session cookie name
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  cookie: {
    secure: isProduction, // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // Strict CSRF protection
  }
}));

// Authentication middleware for admin operations
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(req.session as any)?.isAdmin) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Routes

// Rate limiting for login attempts (simple in-memory store)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// POST /api/auth/login - Admin login with rate limiting and secure password validation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Check rate limiting
    const attempts = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
    const now = Date.now();
    
    if (attempts.count >= MAX_LOGIN_ATTEMPTS && (now - attempts.lastAttempt) < LOCKOUT_TIME) {
      return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    }
    
    // Secure password validation using bcrypt
    const isValidUsername = username === ADMIN_USERNAME;
    const isValidPassword = isValidUsername ? await bcrypt.compare(password, ADMIN_PASSWORD_HASH!) : false;
    
    if (!isValidUsername || !isValidPassword) {
      // Update failed attempt counter
      attempts.count = (attempts.count || 0) + 1;
      attempts.lastAttempt = now;
      loginAttempts.set(clientIp, attempts);
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Clear failed attempts on successful login
    loginAttempts.delete(clientIp);
    
    // Regenerate session ID to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      (req.session as any).isAdmin = true;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        
        res.json({ success: true, message: 'Logged in successfully' });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout - Admin logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    
    // Clear session cookie with same options as when it was set
    res.clearCookie('adminSessionId', {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'strict'
    });
    
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// GET /api/auth/check - Check authentication status
app.get('/api/auth/check', (req, res) => {
  const isAdmin = !!(req.session as any)?.isAdmin;
  res.json({ isAdmin });
});

// GET /api/food-items - Get all food items
app.get('/api/food-items', async (req, res) => {
  try {
    const items = await db.select().from(foodItems);
    res.json(items.map(item => ({
      ...item,
      id: item.id.toString(),
    })));
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/food-items/:id - Get single food item
app.get('/api/food-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [item] = await db.select().from(foodItems).where(eq(foodItems.id, id));
    
    if (!item) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json({
      ...item,
      id: item.id.toString(),
    });
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/food-items - Create new food item (admin only)
app.post('/api/food-items', requireAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, tags, available, preparationTime } = req.body;
    
    if (!name || !description || !price || !category || !image || !preparationTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const [newItem] = await db.insert(foodItems).values({
      name,
      description,
      price: Number(price),
      category,
      image,
      tags: tags || [],
      available: available !== false,
      preparationTime: Number(preparationTime),
    }).returning();
    
    res.status(201).json({
      ...newItem,
      id: newItem.id.toString(),
    });
  } catch (error) {
    console.error('Error creating food item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/food-items/:id - Update food item (admin only)
app.patch('/api/food-items/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [updatedItem] = await db.update(foodItems)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(foodItems.id, id))
      .returning();
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json({
      ...updatedItem,
      id: updatedItem.id.toString(),
    });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/food-items/:id - Delete food item (admin only)
app.delete('/api/food-items/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deletedItem] = await db.delete(foodItems)
      .where(eq(foodItems.id, id))
      .returning();
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/food-items/:id/toggle - Toggle availability (admin only)
app.post('/api/food-items/:id/toggle', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get current item
    const [currentItem] = await db.select().from(foodItems).where(eq(foodItems.id, id));
    if (!currentItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    // Toggle availability
    const [updatedItem] = await db.update(foodItems)
      .set({
        available: !currentItem.available,
        updatedAt: new Date(),
      })
      .where(eq(foodItems.id, id))
      .returning();
    
    res.json({
      ...updatedItem,
      id: updatedItem.id.toString(),
    });
  } catch (error) {
    console.error('Error toggling food item availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders API endpoints

// Mock user credentials for development
const MOCK_USER = {
  username: 'Snehith',
  password: '12345678', // Plain text for simplicity in mock mode
  uid: 'mock-snehith-uid',
  email: 'snehith@example.com',
  name: 'Snehith'
};

// Session-based mock authentication check
const requireMockAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(req.session as any)?.mockUser) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Mock user authentication endpoints
app.post('/api/auth/mock-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Simple validation for mock user
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      // Set mock user in session
      (req.session as any).mockUser = {
        uid: MOCK_USER.uid,
        email: MOCK_USER.email,
        name: MOCK_USER.name
      };
      
      res.json({ 
        success: true, 
        user: {
          uid: MOCK_USER.uid,
          email: MOCK_USER.email,
          displayName: MOCK_USER.name
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Mock login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/mock-logout', (req, res) => {
  delete (req.session as any).mockUser;
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/mock-check', (req, res) => {
  const mockUser = (req.session as any)?.mockUser;
  if (mockUser) {
    res.json({ 
      authenticated: true, 
      user: {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.name
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// GET /api/orders - Get all orders for authenticated user (supports both Firebase and mock auth)
app.get('/api/orders', async (req, res) => {
  try {
    let userId = null;
    let userEmail = null;
    let userName = null;

    // Check for Firebase auth token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        userId = decodedToken.uid;
        userEmail = decodedToken.email || '';
        userName = decodedToken.name;
      } catch (firebaseError) {
        // Firebase auth failed, check for mock auth
        const mockUser = (req.session as any)?.mockUser;
        if (mockUser) {
          userId = mockUser.uid;
          userEmail = mockUser.email;
          userName = mockUser.name;
        }
      }
    } else {
      // No auth header, check for mock auth
      const mockUser = (req.session as any)?.mockUser;
      if (mockUser) {
        userId = mockUser.uid;
        userEmail = mockUser.email;
        userName = mockUser.name;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Get orders for the authenticated user only
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
    
    // For each order, get its items with food details
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            priceAtTime: orderItems.priceAtTime,
            foodItem: {
              id: foodItems.id,
              name: foodItems.name,
              description: foodItems.description,
              image: foodItems.image,
              category: foodItems.category,
            }
          })
          .from(orderItems)
          .leftJoin(foodItems, eq(orderItems.foodItemId, foodItems.id))
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          totalAmount: order.totalAmount / 100, // Convert from cents to dollars
          orderItems: items
        };
      })
    );
    
    const formattedOrders = ordersWithItems;
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders - Create a new order for authenticated user (supports both Firebase and mock auth)
app.post('/api/orders', async (req, res) => {
  try {
    let userId = null;
    let userEmail = null;
    let userName = null;

    // Check for Firebase auth token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        userId = decodedToken.uid;
        userEmail = decodedToken.email || '';
        userName = decodedToken.name;
      } catch (firebaseError) {
        // Firebase auth failed, check for mock auth
        const mockUser = (req.session as any)?.mockUser;
        if (mockUser) {
          userId = mockUser.uid;
          userEmail = mockUser.email;
          userName = mockUser.name;
        }
      }
    } else {
      // No auth header, check for mock auth
      const mockUser = (req.session as any)?.mockUser;
      if (mockUser) {
        userId = mockUser.uid;
        userEmail = mockUser.email;
        userName = mockUser.name;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { items, notes } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }
    
    // Validate items structure
    for (const item of items) {
      if (!item.foodItemId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid item structure. Each item needs foodItemId and positive quantity' });
      }
    }
    
    // Get food item details and validate they exist
    const foodItemIds = items.map(item => item.foodItemId);
    const dbFoodItems = await db
      .select()
      .from(foodItems)
      .where(eq(foodItems.id, foodItemIds[0])); // We'll check each one individually
    
    // Check each food item exists and is available
    for (const item of items) {
      const [foodItem] = await db
        .select()
        .from(foodItems)
        .where(eq(foodItems.id, item.foodItemId));
      
      if (!foodItem) {
        return res.status(404).json({ error: `Food item not found: ${item.foodItemId}` });
      }
      
      if (!foodItem.available) {
        return res.status(400).json({ error: `Food item not available: ${foodItem.name}` });
      }
    }
    
    // Calculate server-side total from database prices for security
    let calculatedTotal = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const [foodItem] = await db
        .select()
        .from(foodItems)
        .where(eq(foodItems.id, item.foodItemId));
      
      if (!foodItem) {
        return res.status(404).json({ error: `Food item not found: ${item.foodItemId}` });
      }
      
      if (!foodItem.available) {
        return res.status(400).json({ error: `Food item not available: ${foodItem.name}` });
      }
      
      const itemTotal = foodItem.price * item.quantity;
      calculatedTotal += itemTotal;
      
      validatedItems.push({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        priceAtTime: foodItem.price,
      });
    }
    
    // Add tax (5%)
    const finalTotal = Math.round(calculatedTotal * 1.05);
    
    // Create the order with calculated total
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: userId,
        userEmail: userEmail,
        userName: userName || null,
        totalAmount: finalTotal, // Already in cents from database
        status: 'pending',
        notes: notes || null,
      })
      .returning();
    
    // Create order items
    const orderItemsData = validatedItems.map(item => ({
      orderId: newOrder.id,
      foodItemId: item.foodItemId,
      quantity: item.quantity,
      priceAtTime: item.priceAtTime,
    }));
    
    const createdOrderItems = await db
      .insert(orderItems)
      .values(orderItemsData)
      .returning();
    
    res.status(201).json({
      order: {
        ...newOrder,
        totalAmount: newOrder.totalAmount / 100, // Convert back to dollars for response
      },
      orderItems: createdOrderItems,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app build, only in production
if (isProduction) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const buildPath = path.join(__dirname, '../../dist');
  
  app.use(express.static(buildPath));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});