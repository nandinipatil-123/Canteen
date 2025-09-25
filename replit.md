# Canteen Food Ordering App - Replit Setup

## Project Overview
This is a React-based food ordering application built with Vite, TypeScript, and modern UI components. The app allows users to browse food items, add them to cart, and place orders.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React hooks + TanStack Query
- **Routing**: React Router DOM

## Key Features
- Browse food menu with categories
- Add/remove items from cart
- Responsive design
- Search functionality
- Hero section with promotions

## Configuration
- **Development Server**: Runs on port 5000 (configured for Replit)
- **Host**: 0.0.0.0 (allows Replit proxy access)
- **Build System**: Vite with SWC for fast compilation
- **HMR**: Hot module replacement enabled

## Recent Setup Changes (September 25, 2025)
- **Project Import Completed**: Successfully imported fresh GitHub clone
- **Dependencies**: Installed all npm dependencies (697 packages)
- **Database Setup**: Created PostgreSQL database with proper schema and seeding
- **Environment Variables**: Configured admin credentials (admin/admin123) and session secret
- **Backend Configuration**: Fixed host settings - backend uses localhost:3001
- **Frontend Configuration**: Vite configured for Replit proxy with 0.0.0.0:5000
- **Development Workflow**: Set up with proper environment variables including Firebase placeholders
- **Database Seeding**: Added 12 initial food items to database via direct SQL
- **API Testing**: All endpoints working correctly (/api/food-items, /api/auth/*)
- **Deployment Setup**: Configured VM deployment with build and run commands
- **Application Status**: Both frontend and backend running successfully
- **Production Ready**: Added static file serving for production mode
- **Firebase Integration**: Configured with placeholder values for development
- **Package Scripts**: Fixed to use npx for proper module execution

## Backend Configuration
- **Server**: Express.js running on port 3001
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Admin login with bcrypt hashing
- **Session Management**: Memory store for development, Redis for production
- **API Endpoints**: Food items CRUD operations with admin protection

## Development
- Uses mock data for food items (see `src/data/mockData.ts`)
- Cart functionality with localStorage persistence
- Component-based architecture with reusable UI components