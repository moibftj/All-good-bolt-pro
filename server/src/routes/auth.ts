import express from 'express';
import { UserModel } from '../models/User';
import { generateTokens, AuthRequest, authenticateToken } from '../middleware/auth';
import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validatePasswordChange,
  sanitizeInput
} from '../middleware/validation';
import {
  authLimiter,
  passwordResetLimiter,
  createAccountLimiter,
  csrfProtection
} from '../middleware/security';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService';
import crypto from 'crypto';

const router = express.Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Registration endpoint
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    const { email, name, password, role, discountCode } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email, role);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // If discount code is provided, verify it exists
    let referredBy = null;
    if (discountCode) {
      const referrer = await UserModel.findByDiscountCode(discountCode);
      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid discount code'
        });
      }
      referredBy = referrer.id;
    }

    // Create user
    const user = await UserModel.createUser({
      email,
      name,
      password,
      role,
      discountCode: referredBy
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // If user was referred, increment referrer's points
    if (referredBy) {
      try {
        const referrer = await UserModel.findById(referredBy, 'remote_employee');
        if (referrer) {
          await UserModel.updateUser(referredBy, 'remote_employee', {
            referral_points: (referrer.referral_points || 0) + 1
          } as Partial<any>);
        }
      } catch (referralError) {
        console.error('Failed to update referral points:', referralError);
        // Don't fail registration if referral update fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.email_verified,
          discountCode: user.discount_code,
          referralPoints: user.referral_points,
          lettersUsed: user.letters_used
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Apply account-specific rate limiting
    const accountLimiter = createAccountLimiter(email);
    accountLimiter(req, res, async () => {
      try {
        // Find user
        const user = await UserModel.findByEmail(email, role);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
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

        // Verify password
        const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
          // Increment login attempts
          await UserModel.incrementLoginAttempts(user.id, role);
          
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Reset login attempts on successful login
        await UserModel.resetLoginAttempts(user.id, role);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens({
          id: user.id,
          email: user.email,
          role: user.role
        });

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              emailVerified: user.email_verified,
              discountCode: user.discount_code,
              referralPoints: user.referral_points,
              lettersUsed: user.letters_used,
              subscriptionPlan: user.subscription_plan
            },
            tokens: {
              accessToken,
              refreshToken
            }
          }
        });

      } catch (innerError) {
        console.error('Login inner error:', innerError);
        res.status(500).json({
          success: false,
          message: 'Internal server error during login'
        });
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Logout endpoint (client-side token removal, server-side token blacklisting could be added)
router.post('/logout', authenticateToken, (req: AuthRequest, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Password reset request
router.post('/forgot-password', passwordResetLimiter, validatePasswordResetRequest, async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await UserModel.findByEmail(email, role);
    if (!user) {
      // Don't reveal whether user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES || '3600000')); // 1 hour

    // Update user with reset token
    await UserModel.updateUser(user.id, role, {
      password_reset_token: resetToken,
      password_reset_expires: resetExpires
    } as Partial<any>);

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Password reset
router.post('/reset-password', authLimiter, validatePasswordReset, async (req, res) => {
  try {
    const { token, password, role } = req.body;

    // Find user by reset token (need to check all roles for this)
    const roles = ['user', 'remote_employee', 'admin'];
    let user = null;
    let userRole = null;

    for (const r of roles) {
      try {
        const { dbManager } = require('../config/database');
        
        // Check connection before querying
        const isConnected = await dbManager.testConnection(r);
        if (!isConnected) {
          continue; // Skip this role if connection is not available
        }
        
        const query = 'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()';
        const result = await dbManager.query(r, query, [token]);
        if (result.rows.length > 0) {
          user = result.rows[0];
          userRole = r;
          break;
        }
      } catch (err) {
        console.error(`Error checking role ${r} for password reset:`, err);
        continue;
      }
    }

    if (!user || !userRole) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    await UserModel.updatePassword(user.id, userRole, password);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password (for logged-in users)
router.post('/change-password', authenticateToken, csrfProtection, validatePasswordChange, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Get current user
    const user = await UserModel.findById(userId, userRole);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidCurrentPassword = await UserModel.verifyPassword(currentPassword, user.password_hash);
    if (!isValidCurrentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update to new password
    await UserModel.updatePassword(userId, userRole, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const user = await UserModel.findById(userId, userRole);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          discountCode: user.discount_code,
          referralPoints: user.referral_points,
          lettersUsed: user.letters_used,
          subscriptionPlan: user.subscription_plan
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;