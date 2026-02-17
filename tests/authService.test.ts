// Fix: Import Jest globals to resolve 'Cannot find name describe/it/expect' errors
import { describe, it, expect } from '@jest/globals';
import { AuthService } from '../services/authService';

describe('AuthService', () => {
  it('should generate a unique 16-byte hex salt', () => {
    const salt1 = AuthService.generateSalt();
    const salt2 = AuthService.generateSalt();
    expect(salt1).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(salt1).not.toEqual(salt2);
  });

  it('should hash a password consistently with the same salt', async () => {
    const password = 'securePassword123';
    const salt = 'random_salt_hex';
    const hash1 = await AuthService.hashPassword(password, salt);
    const hash2 = await AuthService.hashPassword(password, salt);
    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(password);
  });

  it('should verify a correct password', async () => {
    const password = 'mySecretPassword';
    const salt = AuthService.generateSalt();
    const hash = await AuthService.hashPassword(password, salt);
    
    const isValid = await AuthService.verifyPassword(password, hash, salt);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'correctPassword';
    const salt = AuthService.generateSalt();
    const hash = await AuthService.hashPassword(password, salt);
    
    const isValid = await AuthService.verifyPassword('wrongPassword', hash, salt);
    expect(isValid).toBe(false);
  });
});