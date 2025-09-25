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
- **Project Import Completed**: Successfully imported fresh GitHub clone and set up in Replit environment
- **Dependencies**: Installed all bun/npm dependencies with proper module support
- **Database Setup**: Created PostgreSQL database with proper schema migration and seeding (12 food items)
- **Environment Variables**: Configured admin credentials (admin/admin123), session secret, and Firebase placeholders
- **Backend Configuration**: Express server running on localhost:3001 with proper Firebase admin integration
- **Frontend Configuration**: Vite dev server on 0.0.0.0:5000 with Replit proxy support and allowedHosts enabled
- **Development Workflow**: Both frontend and backend running concurrently with proper environment variables
- **LSP Errors**: Resolved all TypeScript compilation errors and Firebase admin import issues
- **API Testing**: All endpoints working correctly (/api/food-items, /api/auth/*, /api/orders)
- **Deployment Setup**: Configured VM deployment with build and production start commands
- **Application Status**: Both frontend and backend fully functional with database connectivity
- **Database Integration**: PostgreSQL with Drizzle ORM, proper schema relations, and seed data
- **Authentication**: Admin panel login, mock user authentication, and Firebase integration ready
- **Current Status**: Ready for development and production deployment

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