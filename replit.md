# Overview

This is a URL shortener application called "Link Automator" built with a full-stack TypeScript architecture. The application allows users to create shortened links, track analytics, manage webhooks, configure custom domains, and access functionality via API tokens. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/building
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build System**: Vite with custom configuration for aliases and development features

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with structured error handling
- **Build System**: esbuild for production bundling

## Database Schema
- **Users**: Authentication and user management
- **Links**: Core URL shortening functionality with metadata
- **Clicks**: Analytics tracking for link interactions
- **Webhooks**: External notification system configuration
- **Custom Domains**: Domain management for branded short links
- **API Tokens**: Authentication tokens for programmatic access

## Key Features
- **Link Management**: Create, edit, delete, and organize shortened URLs
- **Analytics**: Track clicks, user agents, referrers, and geographic data
- **Webhooks**: Real-time notifications for link events
- **Custom Domains**: Brand short links with custom domains
- **API Access**: RESTful API with token-based authentication
- **Responsive Design**: Mobile-first responsive interface

## Development Workflow
- **Development**: Concurrent frontend (Vite) and backend (tsx) servers
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Code Quality**: TypeScript strict mode with path aliases

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **Connection**: Environment variable `DATABASE_URL` required

## UI Components
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Replit Integration**: Configured for Replit development environment
- **Vite Plugins**: Runtime error overlay and development cartographer
- **Font Integration**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono)

## Runtime Dependencies
- **Express.js**: Web framework for API routes
- **Drizzle ORM**: Database toolkit and ORM
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form validation and management
- **Zod**: Runtime type validation
- **Axios**: HTTP client for external requests
- **date-fns**: Date manipulation utilities