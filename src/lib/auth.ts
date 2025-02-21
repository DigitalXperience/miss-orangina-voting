// src/lib/auth.ts
import { verify } from 'jsonwebtoken';

export async function verifyAuth(token: string): Promise<boolean> {
  try {
    // Vérifier le token JWT
    const decoded = verify(token, process.env.JWT_SECRET || '');
    return !!decoded;
  } catch (error) {
    return false;
  }
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export function getAuthUser(token: string): AuthUser | null {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || '') as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}