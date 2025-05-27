import * as argon2 from 'argon2';

/**
 * Hash a password using Argon2
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, // Use Argon2id variant (recommended)
      memoryCost: 2 ** 16, // 64 MB memory cost
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
    });
    return hashedPassword;
  } catch (error) {
    throw new Error(
      `Failed to hash password: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Verify a password against its hash using Argon2
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to verify against
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isValid = await argon2.verify(hashedPassword, password);
    return isValid;
  } catch (error) {
    throw new Error(
      `Failed to verify password: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Check if a password needs to be rehashed (useful for updating hash parameters)
 * @param hashedPassword - The hashed password to check
 * @returns boolean - True if the password needs rehashing
 */
export function needsRehash(hashedPassword: string): boolean {
  try {
    return argon2.needsRehash(hashedPassword, {
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.warn(
      'Failed to check if password needs rehashing:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    // If we can't determine, assume it needs rehashing for safety
    return true;
  }
}
