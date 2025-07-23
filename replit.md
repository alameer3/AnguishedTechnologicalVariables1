# Netflix Clone 2.0

## Overview

This is a Netflix clone application built with Next.js 13, featuring movie and TV show browsing, user authentication, and personalized favorites. The application replicates the Netflix user interface and functionality, allowing users to discover movies, TV shows, actors, and manage their favorite content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 13 with TypeScript for type safety and modern React features
- **Styling**: Tailwind CSS for utility-first styling with custom Netflix-like dark theme
- **UI Components**: Custom React components with consistent design patterns
- **Animation**: Framer Motion for smooth transitions and interactive animations
- **State Management**: React hooks (useState, useEffect) with Next.js built-in state handling

### Authentication System
- **Provider**: NextAuth.js v4 for secure authentication
- **OAuth**: Google Authentication integration
- **Session Management**: Server-side session handling with automatic token refresh
- **Protection**: Route-based authentication guards redirecting unauthenticated users

### Data Management
- **External API**: The Movie Database (TMDB) API for movie/TV show data
- **Database**: Firebase Firestore for user data and favorites storage
- **Real-time Updates**: Firebase real-time listeners for instant UI updates
- **Caching**: Next.js automatic caching for API responses

## Key Components

### Core Pages
- **Home**: Main dashboard with trending content and recommendations
- **TV Shows**: Dedicated TV series browsing with seasons/episodes
- **People**: Actor and crew member discovery and details
- **Favorites**: User's saved movies and actors collection
- **Details**: Comprehensive movie/show information with trailers and cast
- **Season**: Individual season details with episode listings
- **Cast**: Actor profile pages with filmography

### Reusable Components
- **Navbar**: Responsive navigation with search functionality
- **HomeBanner**: Hero section with featured content
- **Row**: Horizontal scrolling content rows
- **MoviesLine**: Individual movie/show cards
- **Person**: Actor profile cards
- **Trailer**: Video player integration for trailers
- **AddBookmark**: Favorite management functionality

### Firebase Integration
- **User Profiles**: Automatic user document creation on first login
- **Favorites Storage**: Separate collections for liked movies and actors
- **Real-time Sync**: Instant updates across devices for user preferences

## Data Flow

1. **Authentication Flow**:
   - User clicks Sign In → Google OAuth → NextAuth session creation → Firebase user document
   - Protected routes check session status → Redirect to sign-in if unauthenticated

2. **Content Discovery**:
   - TMDB API requests → Data transformation → Component rendering
   - Search functionality → Real-time API calls → Filtered results display

3. **Favorites Management**:
   - User interaction → Firebase Firestore write → Real-time listener update → UI refresh
   - Cross-device synchronization through Firebase real-time database

4. **Navigation Flow**:
   - Router-based navigation → Dynamic route parameters → Component-specific data fetching
   - Smooth transitions with Framer Motion animations

## External Dependencies

### APIs and Services
- **TMDB API**: Movie, TV show, and actor data with high-quality images
- **Firebase**: User authentication, real-time database, and cloud storage
- **Google OAuth**: Secure user authentication and profile management

### Key Libraries
- **next-auth**: Authentication solution with multiple provider support
- **framer-motion**: Animation library for smooth UI interactions
- **react-player**: Video player component for trailer playback
- **react-icons**: Comprehensive icon library for UI elements
- **firebase**: Backend-as-a-Service for data storage and real-time updates

### Development Tools
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with custom scrollbar plugins
- **PostCSS**: CSS processing with autoprefixer for browser compatibility

## Deployment Strategy

### Build Configuration
- **Next.js Build**: Static generation where possible with server-side rendering fallback
- **Image Optimization**: Next.js Image component with TMDB domain configuration
- **Environment Variables**: Secure API key and configuration management

### Production Considerations
- **Performance**: Image lazy loading, component code splitting, and API response caching
- **SEO**: Meta tags, structured data, and server-side rendering for better search visibility
- **Security**: Environment variable protection and secure authentication flows
- **Scalability**: Firebase's automatic scaling for user data and real-time features

### Current Deployment
- **Platform**: Netlify (as indicated in demo links)
- **Domain**: Custom domain configuration with HTTPS
- **Analytics**: Google verification setup for search console integration

## Future Enhancements

The application has a roadmap for additional features including:
- Episode-specific pages for detailed TV show content
- User profile management and customization
- Stripe payment integration for subscription management
- Enhanced search filters and recommendation algorithms