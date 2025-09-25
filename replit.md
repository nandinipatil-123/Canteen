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
- Fixed missing dependencies by running `npm install`
- Set up PostgreSQL database with proper schema and migrations
- Configured admin authentication with bcrypt password hashing
- Seeded database with initial food items (12 items)
- Fixed drizzle config paths to use correct schema location
- Set up environment variables for admin credentials and database
- Configured workflow with proper environment variables
- Successfully started both frontend (port 5000) and backend (port 3001) servers
- Verified API endpoints are working correctly
- Configured deployment for autoscale with build commands
- Project fully imported and running without errors
- Application accessible via Replit's web preview

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