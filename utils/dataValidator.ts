// Data validation utilities for API responses
export interface MovieData {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

export interface PersonData {
  id: number;
  name: string;
  profile_path?: string;
  known_for_department?: string;
}

// Sanitize HTML content to prevent XSS
export const sanitizeHTML = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate movie/TV show data from TMDB API
export const validateMovieData = (data: unknown): MovieData | null => {
  if (!data || typeof data !== 'object') return null;
  
  const movieData = data as Record<string, any>;
  
  // Required fields
  if (!movieData.id || typeof movieData.id !== 'number') return null;
  
  const validated: MovieData = {
    id: movieData.id,
  };
  
  // Optional fields with validation
  if (movieData.title && typeof movieData.title === 'string') {
    validated.title = sanitizeHTML(movieData.title);
  }
  
  if (movieData.name && typeof movieData.name === 'string') {
    validated.name = sanitizeHTML(movieData.name);
  }
  
  if (movieData.overview && typeof movieData.overview === 'string') {
    validated.overview = sanitizeHTML(movieData.overview);
  }
  
  if (movieData.poster_path && typeof movieData.poster_path === 'string') {
    validated.poster_path = movieData.poster_path;
  }
  
  if (movieData.backdrop_path && typeof movieData.backdrop_path === 'string') {
    validated.backdrop_path = movieData.backdrop_path;
  }
  
  if (movieData.vote_average && typeof movieData.vote_average === 'number') {
    validated.vote_average = Math.max(0, Math.min(10, movieData.vote_average));
  }
  
  if (movieData.release_date && typeof movieData.release_date === 'string') {
    validated.release_date = movieData.release_date;
  }
  
  if (movieData.first_air_date && typeof movieData.first_air_date === 'string') {
    validated.first_air_date = movieData.first_air_date;
  }
  
  return validated;
};

// Validate person data from TMDB API
export const validatePersonData = (data: unknown): PersonData | null => {
  if (!data || typeof data !== 'object') return null;
  
  const personData = data as Record<string, any>;
  
  // Required fields
  if (!personData.id || typeof personData.id !== 'number') return null;
  if (!personData.name || typeof personData.name !== 'string') return null;
  
  const validated: PersonData = {
    id: personData.id,
    name: sanitizeHTML(personData.name),
  };
  
  // Optional fields
  if (personData.profile_path && typeof personData.profile_path === 'string') {
    validated.profile_path = personData.profile_path;
  }
  
  if (personData.known_for_department && typeof personData.known_for_department === 'string') {
    validated.known_for_department = sanitizeHTML(personData.known_for_department);
  }
  
  return validated;
};

// Validate and sanitize user input
export const validateUserInput = (input: string, maxLength: number = 500): string => {
  if (!input || typeof input !== 'string') return '';
  
  return sanitizeHTML(input.trim().slice(0, maxLength));
};

// Check if URL is safe for external resources
export const isValidImageURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'image.tmdb.org' || 
           parsedUrl.hostname.endsWith('.googleapis.com') ||
           parsedUrl.hostname.endsWith('.gstatic.com');
  } catch {
    return false;
  }
};

// Rate limiting for API calls
const apiCallCache = new Map<string, number>();
const API_CALL_LIMIT = 50; // calls per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export const isAPICallAllowed = (endpoint: string): boolean => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  const entries = Array.from(apiCallCache.entries());
  for (const [key, timestamp] of entries) {
    if (timestamp < windowStart) {
      apiCallCache.delete(key);
    }
  }
  
  // Count calls in current window
  const callsInWindow = Array.from(apiCallCache.values())
    .filter(timestamp => timestamp > windowStart).length;
  
  if (callsInWindow >= API_CALL_LIMIT) {
    return false;
  }
  
  apiCallCache.set(`${endpoint}-${now}`, now);
  return true;
};

// Content validation for different input types
export const validateContent = (content: string, type: string): boolean => {
  if (!content || typeof content !== 'string') return false;
  
  // Remove potentially dangerous patterns
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /data:text\/html/gi
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) return false;
  }
  
  // Type-specific validation
  switch (type) {
    case 'search':
      return content.length <= 100 && content.trim().length > 0;
    case 'feedback':
      return content.length <= 1000 && content.trim().length > 0;
    case 'general':
      return content.length <= 500 && content.trim().length > 0;
    default:
      return true;
  }
};