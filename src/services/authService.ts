// src/services/authService.ts
import { db } from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT_ROUNDS = 10;

export class AuthService {
  async register(phone: string, password: string): Promise<{ token: string; role: string }> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const info = db.prepare(
      'INSERT INTO users (firstName, lastName, phone, password) VALUES (?, ?, ?, ?)'
    ).run('', '', phone, hash);
    const userId = info.lastInsertRowid as number;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    return { token, role: 'user' };
  }

  async login(phone: string, password: string): Promise<{ token: string; role: string }> {
    const user = db.prepare('SELECT id, password, role FROM users WHERE phone = ?').get(phone) as any;
    if (!user) throw new Error('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, role: user.role };
  }

  getAccount(userId: number) {
    return db
      .prepare('SELECT id, firstName, lastName, phone, role FROM users WHERE id = ?')
      .get(userId);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId) as any;
    if (!user) throw new Error('User not found');
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error('Old password incorrect');
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, userId);
  }
}

export const authService = new AuthService();
