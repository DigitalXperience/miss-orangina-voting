// src/pages/api/vote.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';
import { VOTING_START_DATE, VOTING_END_DATE } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidateId, voterId } = req.body;

  // Vérification des paramètres requis
  if (!candidateId || !voterId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Vérifier si nous sommes dans la période de vote
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const startDate = new Date(VOTING_START_DATE);
    const endDate = new Date(VOTING_END_DATE);

    if (now < startDate) {
      return res.status(403).json({ error: 'Voting has not started yet' });
    }

    if (now > endDate) {
      return res.status(403).json({ error: 'Voting period has ended' });
    }

    const connection = await pool.getConnection();

    try {
      // Vérifier si l'utilisateur a déjà voté aujourd'hui
      const [existingVote] = await connection.query(
        'SELECT id FROM daily_votes WHERE voter_id = ? AND vote_date = ?',
        [voterId, currentDate]
      );

      if (Array.isArray(existingVote) && existingVote.length > 0) {
        return res.status(403).json({ error: 'You have already voted today' });
      }

      // Démarrer une transaction
      await connection.beginTransaction();

      // Enregistrer le vote
      await connection.query(
        'INSERT INTO daily_votes (candidate_id, voter_id, vote_date, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [candidateId, voterId, currentDate, req.socket.remoteAddress, req.headers['user-agent']]
      );

      // Mettre à jour le compteur de votes
      await connection.query(
        `INSERT INTO vote_counts (candidate_id, vote_date, vote_count) 
         VALUES (?, ?, 1) 
         ON DUPLICATE KEY UPDATE vote_count = vote_count + 1`,
        [candidateId, currentDate]
      );

      await connection.commit();

      // Calculer la date du prochain vote
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Vote recorded successfully',
        nextVoteDate: tomorrow.toISOString().split('T')[0]
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error processing vote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}