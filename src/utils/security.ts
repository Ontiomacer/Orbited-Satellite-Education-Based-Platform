/**
 * Security utilities for the Satellite Tracking Platform
 */

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'VITE_WORQHAT_API_KEY',
  ];

  const missing = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

// API key validation
export const validateApiKey = (apiKey: string): boolean => {
  // Worqhat API keys typically start with 'wqh_'
  if (!apiKey.startsWith('wqh_')) {
    console.warn('API key format may be incorrect. Worqhat keys typically start with "wqh_"');
    return false;
  }
  
  // Check minimum length
  if (apiKey.length < 20) {
    console.warn('API key appears to be too short');
    return false;
  }
  
  return true;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

// Content Security Policy helper
export const getCSPDirectives = () => ({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://api.worqhat.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.worqhat.com', 'wss:'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
});

// Secure storage helper
export const secureStorage = {
  set: (key: string, value: any, expireMinutes?: number) => {
    const item = {
      value,
      timestamp: Date.now(),
      expire: expireMinutes ? Date.now() + (expireMinutes * 60 * 1000) : null,
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store item in localStorage:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check if expired
      if (parsed.expire && Date.now() > parsed.expire) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.value;
    } catch (error) {
      console.warn('Failed to retrieve item from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
};

// Initialize security on app start
export const initializeSecurity = () => {
  try {
    validateEnvironment();
    
    const apiKey = import.meta.env.VITE_WORQHAT_API_KEY;
    if (apiKey && !validateApiKey(apiKey)) {
      console.warn('API key validation failed. Please check your configuration.');
    }
    
    console.log('✅ Security initialization complete');
  } catch (error) {
    console.error('❌ Security initialization failed:', error);
    throw error;
  }
};

export default {
  validateEnvironment,
  validateApiKey,
  sanitizeInput,
  RateLimiter,
  getCSPDirectives,
  secureStorage,
  initializeSecurity,
};