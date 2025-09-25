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
- Verified Vite configuration with port 5000 and host 0.0.0.0 for Replit compatibility
- Successfully started workflow running `npm run dev`
- Configured deployment for autoscale with build and preview commands
- Project fully imported and running without errors
- Application accessible via Replit's web preview

## Development
- Uses mock data for food items (see `src/data/mockData.ts`)
- Cart functionality with localStorage persistence
- Component-based architecture with reusable UI components