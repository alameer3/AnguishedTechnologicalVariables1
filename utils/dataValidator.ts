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
export const validateMovieData = (data: any): MovieData | null => {
  if (!data || typeof data !== 'object') return null;
  
  // Required fields
  if (!data.id || typeof data.id !== 'number') return null;
  
  const validated: MovieData = {
    id: data.id,
  };
  
  // Optional fields with validation
  if (data.title && typeof data.title === 'string') {
    validated.title = sanitizeHTML(data.title);
  }
  
  if (data.name && typeof data.name === 'string') {
    validated.name = sanitizeHTML(data.name);
  }
  
  if (data.overview && typeof data.overview === 'string') {
    validated.overview = sanitizeHTML(data.overview);
  }
  
  if (data.poster_path && typeof data.poster_path === 'string') {
    validated.poster_path = data.poster_path;
  }
  
  if (data.backdrop_path && typeof data.backdrop_path === 'string') {
    validated.backdrop_path = data.backdrop_path;
  }
  
  if (data.vote_average && typeof data.vote_average === 'number') {
    validated.vote_average = Math.max(0, Math.min(10, data.vote_average));
  }
  
  if (data.release_date && typeof data.release_date === 'string') {
    validated.release_date = data.release_date;
  }
  
  if (data.first_air_date && typeof data.first_air_date === 'string') {
    validated.first_air_date = data.first_air_date;
  }
  
  return validated;
};

// Validate person data from TMDB API
export const validatePersonData = (data: any): PersonData | null => {
  if (!data || typeof data !== 'object') return null;
  
  // Required fields
  if (!data.id || typeof data.id !== 'number') return null;
  if (!data.name || typeof data.name !== 'string') return null;
  
  const validated: PersonData = {
    id: data.id,
    name: sanitizeHTML(data.name),
  };
  
  // Optional fields
  if (data.profile_path && typeof data.profile_path === 'string') {
    validated.profile_path = data.profile_path;
  }
  
  if (data.known_for_department && typeof data.known_for_department === 'string') {
    validated.known_for_department = sanitizeHTML(data.known_for_department);
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