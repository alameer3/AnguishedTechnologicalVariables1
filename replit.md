# Netflix Clone 2.0 - replit.md

## Overview

This is a modern Netflix clone built with Next.js 13, featuring Google authentication, movie/TV show browsing, bookmarking functionality, and TMDB API integration. The application provides a full streaming service UI with user personalization features including favorites management and actor following.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth transitions and interactions
- **UI Components**: Custom React components with responsive design
- **State Management**: React hooks (useState, useEffect) and NextAuth session management

### Backend Architecture
- **API Routes**: Next.js API routes for authentication
- **Authentication**: NextAuth.js v4 with Google OAuth provider
- **External APIs**: TMDB (The Movie Database) API for movie/TV data
- **Data Fetching**: Server-side rendering with getServerSideProps

### Data Storage
- **Database**: Firebase Firestore for user data and bookmarks
- **Collections Structure**:
  - `netflixUsers`: User profile data
  - `likeMovie`: User's bookmarked movies/shows
  - `likeActress`: User's followed actors
  - `feedBack`: User feedback submissions

## Key Components

### Core Pages
- **Landing Page**: Sign-in page with Netflix-style hero section
- **Home Page**: Main dashboard with movie rows and hero banner
- **TV Shows**: Dedicated TV series browsing
- **People**: Actor/actress discovery and following
- **Favorites**: User's bookmarked content
- **Details Pages**: Individual movie/show information
- **Cast Pages**: Actor profiles and filmography
- **Season Pages**: TV show season details and episodes

### Reusable Components
- **Navbar**: Navigation with search functionality
- **Row**: Horizontal scrolling movie/show lists
- **MoviesLine**: Individual movie/show cards
- **HomeBanner**: Hero section with featured content
- **Trailer**: Video player integration with ReactPlayer
- **AddBookmark**: Bookmark management functionality

### Authentication Flow
- Google OAuth integration via NextAuth.js
- Session management across all pages
- Protected routes requiring authentication
- Automatic user document creation in Firestore

## Data Flow

1. **Authentication**: Users sign in with Google → NextAuth creates session → User data stored in Firestore
2. **Content Discovery**: TMDB API fetches movie/TV data → Displayed in categorized rows
3. **Bookmarking**: User interactions → Firestore updates → Real-time UI updates
4. **Search**: User input → TMDB search API → Filtered results display
5. **Navigation**: Dynamic routing with Next.js router → Page transitions with Framer Motion

## External Dependencies

### APIs
- **TMDB API**: Movie, TV show, and actor data
- **YouTube**: Trailer video playback via ReactPlayer

### Services
- **Firebase**: User data storage and real-time updates
- **Google OAuth**: User authentication
- **Vercel/Netlify**: Deployment and hosting

### Key Libraries
```json
{
  "next": "13.1.1",
  "react": "18.2.0",
  "next-auth": "^4.18.7",
  "firebase": "^9.15.0",
  "framer-motion": "^8.0.2",
  "react-player": "^2.11.0",
  "tailwindcss": "^3.2.4"
}
```

## Deployment Strategy

### Environment Variables Required
- `NEXT_PUBLIC_API_KEY`: TMDB API key
- `NEXT_PUBLIC_AUTH_URL`: Application base URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `NEXT_PUBLIC_SECRET`: NextAuth secret
- Firebase configuration variables (API key, project ID, etc.)

### Build Process
- Next.js optimized production build
- Static asset optimization for images from TMDB
- Tailwind CSS purging for minimal bundle size
- TypeScript compilation and type checking

### Performance Optimizations
- Image optimization with Next.js Image component
- Lazy loading for movie/show cards
- Horizontal scrolling with ref-based navigation
- Skeleton loading states for better UX
- Responsive design for all device sizes

### Security Considerations
- Environment variables for sensitive data
- Firebase security rules for user data access
- NextAuth secure session management
- TMDB API rate limiting considerations