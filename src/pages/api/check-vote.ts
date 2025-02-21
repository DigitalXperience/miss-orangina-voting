// src/pages/api/check-vote.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voterId } = req.query;

  if (!voterId || typeof voterId !== 'string') {
    return res.status(400).json({ error: 'Missing voter ID' });
  }

  try {
    const connection = await pool.getConnection();
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      const [todayVote] = await connection.execute(
        `SELECT candidate_id, created_at 
         FROM daily_votes 
         WHERE voter_id = ? AND vote_date = ?`,
        [voterId, currentDate]
      );

      if (Array.isArray(todayVote) && todayVote.length > 0) {
        // L'utilisateur a déjà voté aujourd'hui
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return res.status(200).json({
          hasVotedToday: true,
          candidateId: todayVote[0].candidate_id,
          nextVoteDate: tomorrow.toISOString().split('T')[0]
        });
      }

      // L'utilisateur n'a pas encore voté aujourd'hui
      return res.status(200).json({
        hasVotedToday: false,
        candidateId: null,
        nextVoteDate: currentDate
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error checking vote status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}