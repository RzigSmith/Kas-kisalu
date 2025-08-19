# Kas Kisalu - Multi-Sector Business Website

## Overview

This is a full-stack web application for Kas Kisalu, a multi-sector business operating in construction, agriculture, livestock (élevage), and transportation. The application is built with React frontend, Express.js backend, and uses modern tooling including TypeScript, Tailwind CSS, and shadcn/ui components. The company is based in Kinshasa, RDC.

**Latest Update (August 19, 2025)**: Successfully completed migration from Replit Agent to Replit environment. Resolved dependency conflicts by using the simple-server.mjs fallback implementation. The server is configured to run on port 5000 with working API endpoints for health checks and contact form submissions. PostgreSQL database has been provisioned and is ready for use. All migration checklist items have been completed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth integration with session management
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **API Design**: RESTful endpoints with JSON responses
- **Storage**: DatabaseStorage implementation using PostgreSQL for persistent data

### Project Structure
The application follows a monorepo structure with clear separation:
- `client/` - Frontend React application
- `server/` - Backend Express.js application  
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files

## Key Components

### Frontend Components
- **Layout Components**: Header with navigation, Footer with links
- **Page Components**: Home, Construction, Agriculture, Elevage, Transport, About, Contact, NotFound
- **UI Components**: Extensive shadcn/ui component library (buttons, forms, cards, etc.)
- **Contact Form**: Form with validation using react-hook-form and Zod

### Backend Components
- **Routes**: RESTful API endpoints for contact form submission, message retrieval, and authentication
- **Authentication**: Replit Auth setup with OpenID Connect, user session management
- **Storage**: Abstract storage interface with PostgreSQL database implementation
- **Database Schema**: User, contact message, and session tables defined with Drizzle ORM
- **Database Connection**: Neon serverless PostgreSQL with connection pooling

### Shared Components
- **Schema Definitions**: Zod schemas for data validation shared between frontend and backend
- **Type Definitions**: TypeScript interfaces generated from database schema

## Data Flow

### Contact Form Submission
1. User fills out contact form on frontend
2. Form data validated using Zod schema on client-side
3. Data sent to `/api/contact` endpoint via POST request
4. Backend validates data again using shared schema
5. Message stored in database (currently in-memory storage)
6. Success/error response sent back to frontend
7. User sees confirmation toast notification

### Page Navigation
1. User clicks navigation links in header
2. Wouter handles client-side routing
3. Appropriate page component renders
4. Each sector page displays relevant information and services

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI/Styling**: Radix UI components, Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack React Query
- **Routing**: Wouter
- **Validation**: Zod with Hookform resolvers
- **Utilities**: date-fns, lucide-react icons

### Backend Dependencies  
- **Server**: Express.js, Node.js built-ins
- **Database**: Drizzle ORM, Neon Database serverless client
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Dependencies
- **Build Tools**: Vite, TypeScript compiler
- **Database Tools**: Drizzle Kit for migrations
- **Replit Integration**: Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR (Hot Module Replacement) 
- **Backend**: Alternative server implementation using Node.js built-in modules (simple-server.mjs)
- **Database**: In-memory storage for rapid development
- **Migration Status**: Resolved dependency conflicts with @tailwindcss/vite and cross-env by implementing standalone server
- **Working Endpoints**: /api/health, /api/contact (GET/POST)

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public/` directory
2. **Backend Build**: esbuild bundles server code to `dist/` directory  
3. **Static Serving**: Express serves built frontend files in production
4. **Database**: Switches to PostgreSQL with Neon Database connection

### Production Deployment
- **Start Command**: `npm start` runs the built Express server
- **Database Setup**: `npm run db:push` applies schema changes to PostgreSQL
- **Environment Variables**: `DATABASE_URL` required for database connection
- **Static Assets**: Frontend assets served directly by Express server

### Database Migration Strategy
- **Schema Definition**: Single source of truth in `shared/schema.ts`
- **Migration Generation**: Drizzle Kit generates SQL migrations automatically
- **Development**: Uses `db:push` for rapid schema iteration
- **Production**: Migrations applied via Drizzle Kit CLI commands

The application is designed to be easily deployable on platforms like Replit, with clear separation between development and production configurations.