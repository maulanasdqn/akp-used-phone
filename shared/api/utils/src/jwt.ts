import * as jwt from 'jsonwebtoken';
import { SignOptions, JwtPayload } from 'jsonwebtoken';

export interface CustomJWTPayload extends JwtPayload {
  userId: string;
  email: string;
  roleId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET =
  process.env['JWT_REFRESH_SECRET'] ?? 'your-super-secret-refresh-key';

/**
 * Generate access and refresh tokens for a user
 */
export function generateTokens(payload: {
  userId: string;
  email: string;
  roleId: string;
}): TokenPair {
  const accessTokenOptions: SignOptions = {
    expiresIn: 15 * 60,
  };
  const refreshTokenOptions: SignOptions = {
    expiresIn: 10 * 24 * 60 * 60,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, accessTokenOptions);
  const refreshToken = jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    refreshTokenOptions
  );
  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): CustomJWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): CustomJWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as CustomJWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Refresh token verification failed');
  }
}

/**
 * Generate a new access token using a refresh token
 */
export function refreshAccessToken(refreshToken: string): string {
  const decoded = verifyRefreshToken(refreshToken);
  const payload = {
    userId: decoded.userId,
    email: decoded.email,
    roleId: decoded.roleId,
  };
  const options: SignOptions = {
    expiresIn: 15 * 60,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Decode token without verification (useful for extracting payload from expired tokens)
 */
export function decodeToken(token: string): CustomJWTPayload | null {
  const decoded = jwt.decode(token) as CustomJWTPayload;
  return decoded;
}
