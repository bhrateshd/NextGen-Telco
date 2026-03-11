/**
 * JWT Auth Controller
 * Generates and validates JWT tokens
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'nextgen-telco-secret-key-change-in-prod';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

class AuthController {
  /**
   * Generate JWT token
   */
  static generateToken(payload) {
    try {
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
      });
      return token;
    } catch (error) {
      throw new Error('Failed to generate token');
    }
  }

  /**
   * Validate JWT token
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256']
      });
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Token expired');
        err.statusCode = 401;
        err.code = 'TOKEN_EXPIRED';
        throw err;
      }
      if (error.name === 'JsonWebTokenError') {
        const err = new Error('Invalid token');
        err.statusCode = 401;
        err.code = 'INVALID_TOKEN';
        throw err;
      }
      throw error;
    }
  }

  /**
   * Hash password
   */
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare password
   */
  static async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }

  /**
   * Refresh token
   */
  static refreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
        ignoreExpiration: true
      });
      
      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY, algorithm: 'HS256' }
      );
      
      return newToken;
    } catch (error) {
      const err = new Error('Failed to refresh token');
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = AuthController;
