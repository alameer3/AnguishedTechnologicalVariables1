// Security utilities for headers and HTTPS redirection
import { NextRequest, NextResponse } from 'next/server';

export const addSecurityHeaders = (response: NextResponse): NextResponse => {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Remove server information
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');
  
  return response;
};

export const enforceHTTPS = (request: NextRequest): NextResponse | null => {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  const url = request.nextUrl.clone();
  
  // Check if request is not HTTPS
  if (url.protocol !== 'https:' && !url.hostname.includes('localhost')) {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  
  return null;
};

// API key validation
export const validateAPIKey = (apiKey: string | undefined): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Check for minimum length and format
  if (apiKey.length < 20) {
    return false;
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    'test',
    'demo',
    'example',
    'placeholder',
    'your_key_here',
    '123456'
  ];
  
  const lowerKey = apiKey.toLowerCase();
  return !suspiciousPatterns.some(pattern => lowerKey.includes(pattern));
};

// Content validation for user inputs
export const validateContent = (content: string, type: 'search' | 'feedback' | 'general'): boolean => {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  const trimmed = content.trim();
  
  // Check minimum and maximum lengths
  const limits = {
    search: { min: 1, max: 100 },
    feedback: { min: 10, max: 1000 },
    general: { min: 1, max: 500 }
  };
  
  const { min, max } = limits[type];
  if (trimmed.length < min || trimmed.length > max) {
    return false;
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /<iframe/i,
    /eval\s*\(/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(content));
};