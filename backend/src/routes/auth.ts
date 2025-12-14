import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Signup
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  asyncHandler(async (req, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        onboardingCompleted: true,
      },
    });

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '30d' });

    res.status(201).json({
      user,
      token,
    });
  })
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  asyncHandler(async (req, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '30d' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        onboardingCompleted: user.onboardingCompleted,
      },
      token,
    });
  })
);

// Complete Onboarding
router.post(
  '/complete-onboarding',
  asyncHandler(async (req, res: Response) => {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
      select: {
        id: true,
        email: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    res.json({ 
      message: 'Onboarding completed',
      user: updatedUser
    });
  })
);

// Request Password Reset
router.post(
  '/request-reset',
  [body('email').isEmail().normalizeEmail()],
  asyncHandler(async (req, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid email format' } });
    }

    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid leaking which emails exist
    // But only create token if user exists
    if (user) {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiry to 30 minutes from now
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      // Invalidate any existing unused tokens for this user
      await prisma.passwordReset.updateMany({
        where: {
          userId: user.id,
          used: false,
        },
        data: {
          used: true,
        },
      });

      // Create new reset token
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      // In dev mode, return the reset URL (in production, send email instead)
      if (process.env.NODE_ENV !== 'production') {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        return res.json({
          message: 'If an account exists, we sent a reset link.',
          devMode: true,
          resetUrl,
        });
      }
    }

    // Always return the same message
    res.json({
      message: 'If an account exists, we sent a reset link.',
    });
  })
);

// Reset Password
router.post(
  '/reset-password',
  [
    body('token').exists().isString(),
    body('password').isLength({ min: 6 }),
  ],
  asyncHandler(async (req, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
    }

    const { token, password } = req.body;

    // Find valid reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return res.status(400).json({ error: { message: 'Invalid or expired reset token' } });
    }

    if (resetToken.used) {
      return res.status(400).json({ error: { message: 'Reset token has already been used' } });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ error: { message: 'Reset token has expired' } });
    }

    // Hash new password (using same method as signup)
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    res.json({
      message: 'Password updated successfully',
    });
  })
);

export default router;
