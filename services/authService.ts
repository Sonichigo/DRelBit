
export class AuthService {
  private static async bufferToHex(buffer: ArrayBuffer): Promise<string> {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static generateSalt(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  static async verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
    const newHash = await this.hashPassword(password, salt);
    return newHash === storedHash;
  }
}
