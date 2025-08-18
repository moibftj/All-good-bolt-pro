import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime! / 1000)
    });
  }
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime! / 1000)
    });
  }
});

// Very strict rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts from this IP, please try again in an hour.',
      retryAfter: Math.round(req.rateLimit.resetTime! / 1000)
    });
  }
});

// Account-specific rate limiting (by email)
const accountLimiters = new Map();

export const createAccountLimiter = (email: string) => {
  if (!accountLimiters.has(email)) {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per account per 15 minutes
      skipSuccessfulRequests: true,
      keyGenerator: () => email,
      handler: (req: Request, res: Response) => {
        res.status(429).json({
          success: false,
          message: 'Too many login attempts for this account, please try again later.',
          retryAfter: Math.round(req.rateLimit.resetTime! / 1000)
        });
      }
    });
    
    accountLimiters.set(email, limiter);
    
    // Clean up old limiters after 1 hour
    setTimeout(() => {
      accountLimiters.delete(email);
    }, 60 * 60 * 1000);
  }
  
  return accountLimiters.get(email);
};

// CSRF protection for state-changing operations
export const csrfProtection = (req: Request, res: Response, next: any) => {
  // Skip CSRF for GET requests and OPTIONS
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.headers['authorization']?.split(' ')[1];

  if (!token || !sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token required'
    });
  }

  // Simple CSRF validation - in production, use a more sophisticated approach
  const expectedToken = Buffer.from(sessionToken).toString('base64').substring(0, 32);
  
  if (token !== expectedToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }

  next();
};

// Input size limiting
export const inputSizeLimiter = (req: Request, res: Response, next: any) => {
  const maxSize = 1024 * 1024; // 1MB
  const contentLength = req.headers['content-length'];
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request too large'
    });
  }
  
  next();
};