import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Temporary storage for refresh tokens (use a database in production)
const refreshTokens: Set<string> = new Set();

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    // Store the refresh token
    refreshTokens.add(refreshToken);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required.' });
      return;
    }

    // Remove the refresh token from storage
    if (refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
      res.status(200).json({ message: 'Logged out successfully.' });
    } else {
      res.status(403).json({ message: 'Invalid refresh token.' });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required.' });
      return;
    }

    if (!refreshTokens.has(refreshToken)) {
      res.status(403).json({ message: 'Invalid refresh token.' });
      return;
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string; email: string };

    if (!decoded || !decoded.id || !decoded.email) {
      res.status(403).json({ message: 'Invalid refresh token.' });
      return;
    }

    // Generate a new access token
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(403).json({ message: 'Invalid refresh token.', error });
  }
};
