import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { db } from "./db";
import { foodItems } from "./db/schema";
import { eq } from "drizzle-orm";

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

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});