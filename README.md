
# Canteen Food Ordering App

A modern React-based food ordering application for canteens and cafeterias. Built with TypeScript, Vite, and a Node.js backend with PostgreSQL database.

## 🚀 Features

- **Menu Browsing**: Browse food items with categories (Breakfast, Lunch, Snacks, Beverages)
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Place orders and track them
- **Admin Panel**: Manage food items, categories, and orders
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for data fetching
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **bcrypt** for password hashing
- **express-session** for authentication

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Configure your `.env` file with:
   - `DATABASE_URL` - PostgreSQL connection string
   - `ADMIN_USERNAME` - Admin login username
   - `ADMIN_PASSWORD_HASH` - Hashed admin password
   - `SESSION_SECRET` - Session encryption key

5. Generate admin password hash:
   ```bash
   npm run generate-admin-hash
   ```

6. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## 🚀 Development

Start the development server (runs both frontend and backend):
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5000`
- Backend API on `http://localhost:3001`

### Individual Commands

- **Frontend only**: `npm run dev:client`
- **Backend only**: `npm run dev:server`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## 🗄️ Database

### Available Scripts

- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data

## 🔧 API Endpoints

### Food Items
- `GET /api/food-items` - Get all food items
- `GET /api/food-items/:id` - Get single food item
- `POST /api/food-items` - Create food item (admin only)
- `PATCH /api/food-items/:id` - Update food item (admin only)
- `DELETE /api/food-items/:id` - Delete food item (admin only)

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check` - Check admin session

## 📱 Pages

- **Home** (`/`) - Hero section and featured items
- **Menu** (`/menu`) - Browse all food items with filtering
- **Cart** (`/cart`) - View and manage cart items
- **Checkout** (`/checkout`) - Place orders
- **Admin** (`/admin`) - Admin panel for managing items

## 🎨 Styling

This project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent design
- **Custom CSS variables** for theming
- **Responsive design** patterns

## 🔒 Security

- Password hashing with bcrypt
- Session-based authentication
- CORS protection
- Input validation
- SQL injection prevention via Drizzle ORM

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
├── server/             # Backend API code
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

## 🚀 Deployment

This project is configured for deployment on Replit with automatic scaling.

The deployment runs:
- Build command: `npm run build`
- Start command: `npm run preview`

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.
