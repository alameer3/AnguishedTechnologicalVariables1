# YEMEN_FLIX

## Overview
YEMEN_FLIX is an advanced Yemeni streaming platform built with Next.js, TypeScript, and Firebase. It offers browsing movies and series, user favorites, detailed film pages, and a responsive design. The project aims to provide a localized streaming experience with a distinct Yemeni identity, leveraging a robust and production-ready codebase.

## User Preferences
- Development environment: Standard Replit
- TypeScript preferred for type safety
- Responsive design is a priority
- Arabic language support
- Maintain Netflix aesthetic
- Production-ready code quality
- Fix all security and technical issues
- Leave `.env.example` keys unchanged permanently
- Request approval before applying any UI enhancements
- Adhere to security standards and best practices
- Do not repeat mistakes and work with strict precision
- Verify every step before proceeding
- Always check LSP diagnostics and successful build

## System Architecture
The platform is built on Next.js 15.4.3 and TypeScript. Firebase is used for data storage. Styling is managed with Tailwind CSS, and animations are handled by Framer Motion. Video playback utilizes React Player.

Key architectural decisions include:
- **UI/UX:** A dedicated Yemeni brand identity with a distinctive red YEMEN_FLIX logo, updated favicon, and meta tags. Advanced visual and typography enhancements include sophisticated font systems (Inter and Cairo), precise Netflix color palettes using CSS variables, advanced text effects (gradient text, multi-layered text-shadow), and interactive buttons with shimmer effects. Responsive typography uses `clamp()`, and complex shadows with multi-layered `box-shadow` are implemented. Glass morphism and backdrop-filter are used for advanced transparency. Icons have interactive effects, and a custom Netflix-accurate scrollbar is implemented. Hover effects on movie cards include advanced scaling and shadowing.
- **Technical Implementations:** Integration with TMDB API for movie and series data. Authentication is set up with NextAuth.js (though a dummy session is used for demonstration purposes, with a guest access system allowing optional sign-up). Firestore collections include `netflixUsers`, `feedBack`, `likeMovie`, and `likeActress`. Image optimization is handled via Next.js Image component, `DynamicImageOptimizer`, and `useImageOptimization` hook. `performanceOptimizer` with `useDebounce` and `useThrottle` is implemented, alongside a `PerformanceMonitor` for Core Web Vitals. `AccessibilityProvider` ensures WCAG guideline compliance.
- **Security & Error Handling:** Comprehensive error handling with a global error boundary and a `dataValidator.ts` for content validation and XSS protection using DOMPurify. Security headers are enhanced, and Firebase Rules are secured with user-specific access control. Strict TypeScript usage eliminates `any` types. ESLint is configured with strict TypeScript rules.
- **Features:** Browsing, favoriting, detailed pages for movies/series/actors, promotional video integration, and SEO optimization with structured data. Advanced search includes voice and visual search. Infinite scroll is implemented for content loading.

## External Dependencies
- **Firebase:** Backend for data storage (Firestore).
- **TMDB API:** Source for movie and series data.
- **NextAuth.js:** For user authentication (though currently bypassed for demo purposes).
- **React Player:** For video playback.