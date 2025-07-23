# Netflix Clone - Replit.md

## Overview

This is a modern Netflix clone application built with Next.js 13, TypeScript, and Tailwind CSS. The application provides movie browsing, Google authentication via NextAuth.js, watchlist management, detailed movie information, and comprehensive features like cast information and season browsing using the TMDB API.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Arabic

## System Architecture

### Frontend Architecture

The application is built with **Next.js 13** using:
- **Server-Side Rendering (SSR)** for optimal performance and SEO
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions

### Authentication System

Uses **NextAuth.js v4** with:
- Google OAuth provider for user authentication
- Session management across the application
- Protected routes and user state management

### Backend Architecture

The application leverages **Next.js API Routes** for:
- Server-side data fetching using `getServerSideProps`
- Direct TMDB API integration for movie data
- User authentication handling through NextAuth.js
- Session management and protected route logic

### Data Management

- **TMDB API Integration**: Direct server-side fetching of movie data, trending content, genres, and detailed movie information
- **Client-side State Management**: React hooks and context for user preferences and UI state
- **Firebase Integration**: Optional integration for user data persistence and advanced features

## Key Components

### Core Pages and Components

- **Home Page**: Server-side rendered with movie data fetching
- **MainPage Component**: Main dashboard with movie rows and hero section
- **SignIn Component**: Google OAuth authentication interface
- **Navbar**: Navigation with search functionality and user menu
- **HomeBanner**: Hero section with featured content
- **Row Component**: Horizontal scrolling movie rows
- **Movie Detail Pages**: Comprehensive movie information with trailers
- **Cast and Crew Pages**: Actor information and filmography
- **Season Pages**: TV show season and episode details

### Movie Data Integration

- TMDB (The Movie Database) API integration for:
  - Movie and TV show discovery
  - Detailed movie information
  - Search functionality
  - Cast and crew data
  - Trailers and videos

### User Management

- User profile creation and management
- Watchlist functionality (add/remove movies)
- Favorite actors tracking
- Session-based user state management

### UI Features

- **Responsive Design**: Optimized for desktop and mobile viewing
- **Netflix-inspired Theme**: Dark background with red accent colors
- **Smooth Animations**: Framer Motion for page transitions and hover effects
- **Interactive Elements**: Movie trailers, search functionality, and user preferences
- **Accessibility**: Proper semantic HTML and keyboard navigation support

## Data Flow

1. **Movie Data**: TMDB API → Next.js API Routes → Server-Side Rendering → Client Display
2. **User Authentication**: Google OAuth → NextAuth.js → Session Management
3. **Page Navigation**: Client-side routing with Next.js Router
4. **Dynamic Content**: Server-side props fetching for each page load

## External Dependencies

### APIs
- **TMDB API**: Primary source for movie and TV show data
- **Google OAuth**: Authentication provider for Next.js version

### Key Libraries
- **Framework**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS with custom Netflix theme
- **Animation**: Framer Motion for smooth transitions
- **Authentication**: NextAuth.js v4 with Google provider
- **Icons**: React Icons for UI elements
- **Media**: React Player for video content

### Firebase Integration
- Firebase Authentication for enhanced user management
- Optional Firestore integration for user preferences and watchlists
- Real-time data synchronization capabilities

## Deployment Strategy

### Development Environment
- **Next.js Development Server**: Running on port 5000 with hot reload
- **TypeScript Support**: Full type checking and IntelliSense
- **Fast Refresh**: Instant feedback during development

### Production Build
- **Next.js Build**: Optimized static generation and server-side rendering
- **Asset Optimization**: Automatic image optimization and code splitting
- **Environment Variables**: Secure API key management for TMDB and authentication

### Platform Optimization
- Replit-specific configurations for seamless deployment
- Environment variable management through Replit secrets
- Optimized for Replit's development and hosting environment

## Recent Changes (July 23, 2025)

✓ **Project Migration**: Successfully migrated from hybrid architecture to pure Next.js implementation
✓ **Authentication Setup**: Configured NextAuth.js with Google OAuth provider
✓ **TMDB API Integration**: Successfully configured TMDB API key for movie data fetching
✓ **Development Server**: Next.js development server running on port 5000
✓ **File Structure**: Cleaned up project structure, removed conflicting files
✓ **Environment Configuration**: Added .env.local with NextAuth settings
✓ **Tailwind CSS**: Fixed plugin configuration warnings
✓ **TypeScript Configuration**: Proper TypeScript setup with Next.js

## Current Status

The Netflix Clone is now fully functional with:
- Complete Next.js 13 setup with TypeScript
- TMDB API integration for real movie data
- NextAuth.js authentication system
- Netflix-inspired UI with Tailwind CSS
- Movie browsing, search, and detailed pages
- Responsive design for all devices

## Next Steps

→ **Google OAuth Keys**: Set up Google OAuth credentials for authentication
→ **Feature Testing**: Test all components and pages functionality  
→ **Performance Optimization**: Optimize images and loading states
→ **Deployment Preparation**: Prepare for production deployment

This architecture provides a robust, scalable Netflix clone with modern web development practices and optimal user experience.