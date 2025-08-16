# Overview

LogiSmart is a comprehensive mobile web application designed to provide intelligent logistics and customs management solutions for African users. The application offers end-to-end shipment management, including tariff calculation, package tracking, HS code search, AI-powered customs assistance, and real-time logistics support. Built as a Progressive Web App (PWA) with a mobile-first approach, LogiSmart aims to simplify complex international shipping processes through an intuitive interface and intelligent automation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and follows a modern component-based architecture. The application uses **Vite** as the build tool and development server, providing fast hot-module replacement and optimized bundling. The UI is constructed with **shadcn/ui** components built on top of **Radix UI** primitives, ensuring accessibility and consistent design patterns.

**State Management**: The application uses **TanStack Query (React Query)** for server state management, providing efficient caching, background updates, and optimistic updates. Local component state is managed through React's built-in `useState` and `useContext` hooks.

**Routing**: Client-side routing is handled by **Wouter**, a lightweight routing library that provides declarative routing without the overhead of React Router.

**Styling**: The application uses **Tailwind CSS** with custom CSS variables for theming, allowing for consistent design tokens and easy theme customization. The design system includes custom color schemes optimized for the LogiSmart brand.

**Internationalization**: Multi-language support is implemented through a custom context-based solution supporting French and English, with plans for additional African languages.

## Backend Architecture
The server is built using **Express.js** with **TypeScript** in an ESM (ES Modules) environment. The architecture follows RESTful principles with a modular route organization pattern.

**Database Layer**: The application uses **Drizzle ORM** with **PostgreSQL** as the primary database, accessed through **Neon Database** serverless connection. The ORM provides type-safe database queries and migrations through a schema-first approach.

**Authentication**: Integrated **Replit Auth** using OpenID Connect (OIDC) for secure user authentication and session management. Sessions are stored in PostgreSQL using `connect-pg-simple` for persistence.

**API Design**: RESTful endpoints organized by feature domains (shipments, tracking, HS codes, chat messages) with consistent error handling and response formatting.

## Data Storage Solutions
**Primary Database**: PostgreSQL hosted on Neon Database, providing serverless scaling and connection pooling. The database schema includes tables for users, shipments, tracking events, documents, HS codes, regulatory alerts, chat messages, and session storage.

**File Storage**: Google Cloud Storage integration for document uploads and storage, with support for various document types including customs declarations, invoices, and shipping labels.

**Caching Strategy**: Client-side caching through TanStack Query with configurable stale times and background refetching for optimal user experience.

## Authentication and Authorization
**Authentication Provider**: Replit Auth with OIDC integration, supporting secure login flows and token management.

**Session Management**: Server-side sessions stored in PostgreSQL with configurable TTL (7 days default) and secure cookie settings.

**Authorization**: Route-level authentication middleware protecting sensitive endpoints, with user context passed through authenticated requests.

# External Dependencies

## Third-Party Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling and automatic scaling
- **Google Cloud Storage**: Document and file storage service for shipping documents, customs declarations, and user uploads
- **Replit Auth**: Authentication service providing OIDC-based secure login and user management

## Key Libraries and Frameworks
- **React 18**: Frontend framework with hooks and concurrent features
- **Express.js**: Web application framework for the backend API
- **Drizzle ORM**: Type-safe ORM for PostgreSQL database interactions
- **TanStack Query**: Server state management and caching solution
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI primitives
- **Wouter**: Lightweight client-side routing solution
- **Zod**: TypeScript-first schema validation library
- **React Hook Form**: Form state management and validation
- **date-fns**: Modern JavaScript date utility library
- **Uppy**: File upload library with multiple transport options

## Development Tools
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Static type checking across the entire codebase
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS plugin
- **Drizzle Kit**: Database migration and schema management tools