# API Utils

This package contains utility functions for the API.

## Password Hashing

This package provides secure password hashing and verification using Argon2.

### Installation

First, install the required dependency:

```bash
npm install argon2 @types/argon2
```

### Usage

```typescript
import { hashPassword, verifyPassword, needsRehash } from 'api-utils';

// Hash a password
const password = 'mySecurePassword123';
const hashedPassword = await hashPassword(password);
console.log('Hashed:', hashedPassword);

// Verify a password
const isValid = await verifyPassword(password, hashedPassword);
console.log('Password is valid:', isValid);

// Check if password needs rehashing (useful for updating security parameters)
const shouldRehash = needsRehash(hashedPassword);
if (shouldRehash) {
  const newHash = await hashPassword(password);
  // Update the hash in your database
}
```

### Security Features

- Uses **Argon2id** variant (recommended by security experts)
- Memory cost: 64 MB (2^16)
- Time cost: 3 iterations
- Parallelism: 1 thread
- Proper error handling with descriptive messages
- Rehash detection for security parameter updates

### Functions

#### `hashPassword(password: string): Promise<string>`

Hashes a plain text password using Argon2.

**Parameters:**

- `password` - The plain text password to hash

**Returns:**

- Promise that resolves to the hashed password string

**Throws:**

- Error if hashing fails

#### `verifyPassword(password: string, hashedPassword: string): Promise<boolean>`

Verifies a plain text password against its hash.

**Parameters:**

- `password` - The plain text password to verify
- `hashedPassword` - The hashed password to verify against

**Returns:**

- Promise that resolves to `true` if password matches, `false` otherwise

**Throws:**

- Error if verification fails

#### `needsRehash(hashedPassword: string): boolean`

Checks if a password hash needs to be updated with current security parameters.

**Parameters:**

- `hashedPassword` - The hashed password to check

**Returns:**

- `true` if the password needs rehashing, `false` otherwise

### Example Integration

```typescript
// In your user service
import { hashPassword, verifyPassword } from 'api-utils';

export class UserService {
  async createUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    // Save user with hashedPassword to database
    return this.userRepository.create({ email, password: hashedPassword });
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : null;
  }
}
```
