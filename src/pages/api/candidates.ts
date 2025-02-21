// src/pages/api/candidates.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      // Récupérer les candidates avec leurs votes du jour et le total
      const [candidates] = await connection.execute(`
        SELECT 
          c.*,
          COALESCE(today.vote_count, 0) as todayVotes,
          COALESCE(total.total_votes, 0) as votes
        FROM candidates c
        LEFT JOIN (
          SELECT candidate_id, vote_count
          FROM vote_counts
          WHERE vote_date = ?
        ) today ON c.id = today.candidate_id
        LEFT JOIN (
          SELECT candidate_id, SUM(vote_count) as total_votes
          FROM vote_counts
          GROUP BY candidate_id
        ) total ON c.id = total.candidate_id
        ORDER BY total.total_votes DESC, today.vote_count DESC
      `, [currentDate]);

      return res.status(200).json(candidates);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}