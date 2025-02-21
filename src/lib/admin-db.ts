// lib/admin-db.ts
import { pool } from '@/lib/db';
import { hash } from 'bcryptjs';

export interface Admin {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role_id: number;
  is_active: boolean;
  last_login: Date | null;
}

export interface AdminRole {
  id: number;
  name: string;
  description: string | null;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const connection = await pool.getConnection();
  try {
    const [admins] = await connection.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    return Array.isArray(admins) && admins.length > 0 ? admins[0] : null;
  } finally {
    connection.release();
  }
}

export async function createAdmin({
  email,
  password,
  firstName,
  lastName,
  roleId
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleId: number;
}): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const hashedPassword = await hash(password, 10);
    
    const [result] = await connection.execute(
      `INSERT INTO admins (email, password, first_name, last_name, role_id)
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, firstName || null, lastName || null, roleId]
    );

    return result.insertId;
  } finally {
    connection.release();
  }
}

export async function logAdminAccess(adminId: number, action: string, ip?: string, userAgent?: string) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `INSERT INTO admin_access_logs (admin_id, action, ip_address, user_agent)
       VALUES (?, ?, ?, ?)`,
      [adminId, action, ip || null, userAgent || null]
    );
  } finally {
    connection.release();
  }
}

export async function updateAdminLastLogin(adminId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [adminId]
    );
  } finally {
    connection.release();
  }
}

export async function getAdminRole(roleId: number): Promise<AdminRole | null> {
  const connection = await pool.getConnection();
  try {
    const [roles] = await connection.execute(
      'SELECT * FROM admin_roles WHERE id = ?',
      [roleId]
    );

    return Array.isArray(roles) && roles.length > 0 ? roles[0] : null;
  } finally {
    connection.release();
  }
}