# StoryWeaver - Interactive Story Editor

## Overview

StoryWeaver is a modern interactive story editor that allows users to create nonlinear, branching narratives using a visual node-based interface. The application combines the intuitive design of tools like Figma and Notion with specialized features for interactive storytelling. Users can create story nodes representing different narrative elements (story text, choices, conditions, variables, media), connect them to form branching paths, and export their creations to HTML.

The application is designed for writers, game developers, and content creators who want to build interactive fiction, choose-your-own-adventure stories, or educational content with multiple pathways.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with a comprehensive design system supporting both dark and light themes
- **UI Components**: Radix UI primitives wrapped in custom components following the shadcn/ui pattern for accessibility and consistency
- **State Management**: React hooks for local state, TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing between the project browser and editor views
- **Canvas Interaction**: Custom implementation for the visual node editor with drag-and-drop, zoom, and pan functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js providing a RESTful API
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **API Design**: Resource-based REST endpoints for projects, story nodes, node groups, and assets
- **Development Setup**: Vite for fast development builds and hot module replacement

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Neon's serverless platform
- **Schema Design**: Relational structure with projects containing story nodes, node groups for organization, and assets for media files
- **Connection Management**: Connection pooling through Neon's serverless driver for efficient database access

### Authentication and Authorization
- **Current State**: Session-based authentication infrastructure present but not fully implemented
- **User Management**: Basic user schema exists for future authentication features
- **Security**: Environment-based configuration for database credentials

### Theme and Styling System
- **Design Approach**: Modern, professional interface inspired by creative tools like Figma and Linear
- **Color System**: Comprehensive CSS custom properties supporting automatic dark/light mode switching
- **Component Variants**: Consistent button, card, and input styling with proper focus states and accessibility
- **Typography**: Inter font for UI elements, JetBrains Mono for code displays

### Node System Architecture
- **Node Types**: Eight distinct node types (start, story, choice, end, css, variable, condition, audio, video) each with specific properties and behaviors
- **Connection System**: Flexible linking between nodes to create story flows and branching narratives
- **Data Structure**: JSON-based storage for node properties, positions, and relationships
- **Rendering**: Custom React components for each node type with visual indicators and editing capabilities

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Comprehensive primitive components for accessibility-compliant interfaces
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for design system
- **Lucide React**: Consistent icon library for interface elements
- **Google Fonts**: Web font loading for Inter and JetBrains Mono typography

### Development Tools
- **Vite**: Fast build tool and development server with React plugin support
- **TypeScript**: Static type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundling for production builds

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Form state management with validation support

### Additional Libraries
- **Date-fns**: Date formatting and manipulation utilities
- **Class Variance Authority**: Type-safe CSS class generation for component variants
- **Zod**: Runtime type validation for API data and form inputs
- **Wouter**: Lightweight routing solution for single-page application navigation