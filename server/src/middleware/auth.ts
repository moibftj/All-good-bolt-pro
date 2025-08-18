import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as any;
    
    // Verify user still exists and is valid
    const user = await UserModel.findById(decoded.id, decoded.role);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Check if account is locked
    const isLocked = await UserModel.isAccountLocked(user);
    if (isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    secret,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'talk-to-my-lawyer',
      audience: 'talk-to-my-lawyer-users'
    }
  );

  const refreshToken = jwt.sign(
    { 
      id: user.id,
      type: 'refresh'
    },
    secret,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      issuer: 'talk-to-my-lawyer',
      audience: 'talk-to-my-lawyer-users'
    }
  );

  return { accessToken, refreshToken };
};