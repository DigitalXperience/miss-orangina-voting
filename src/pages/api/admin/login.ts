// pages/api/admin/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { pool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const connection = await pool.getConnection();
    try {
      const [admins] = await connection.execute(
        'SELECT * FROM admins WHERE email = ?',
        [email]
      );

      if (!Array.isArray(admins) || admins.length === 0) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const admin = admins[0];
      const validPassword = await compare(password, admin.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      // Créer le token JWT
      const token = sign(
        {
          adminId: admin.id,
          email: admin.email,
          role: admin.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );

      // Configuration du cookie
      res.setHeader('Set-Cookie', `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict`);

      return res.status(200).json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}