// src/pages/api/db.ts
import mysql from 'mysql2/promise';

// Configuration de la connexion MySQL
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// src/pages/api/candidates.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();

    try {
      const [candidates] = await connection.query(`
        SELECT 
          c.*,
          COALESCE(vc.vote_count, 0) as votes
        FROM candidates c
        LEFT JOIN vote_counts vc ON c.id = vc.candidate_id
        ORDER BY votes DESC
      `);

      return res.status(200).json(candidates);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}