// pages/api/admin/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

function getDateRangeFilter(range: string) {
  switch (range) {
    case 'today':
      return 'DATE(created_at) = CURRENT_DATE';
    case 'week':
      return 'created_at >= NOW() - INTERVAL 7 DAY';
    case 'month':
      return 'created_at >= NOW() - INTERVAL 30 DAY';
    default:
      return '1=1'; // Pas de filtre
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dateRange = 'week', region = 'all' } = req.query;
  const dateFilter = getDateRangeFilter(dateRange as string);
  const regionFilter = region === 'all' ? '1=1' : 'c.region = ?';

  const connection = await pool.getConnection();
  try {
    // Paramètres pour les requêtes
    const params = region === 'all' ? [] : [region];

    // Total des votes avec filtres
    const [totalVotes] = await connection.execute(
      `SELECT COUNT(*) as total 
       FROM daily_votes dv
       JOIN candidates c ON c.id = dv.candidate_id
       WHERE ${dateFilter} AND ${regionFilter}`,
      params
    );

    // Votes par jour
    const [votesByDate] = await connection.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM daily_votes dv
      JOIN candidates c ON c.id = dv.candidate_id
      WHERE ${dateFilter} AND ${regionFilter}
      GROUP BY DATE(created_at)
      ORDER BY date
    `, params);

    // Stats par candidate
    const [candidateStats] = await connection.execute(`
      SELECT 
        c.name,
        c.region,
        COUNT(dv.id) as votes
      FROM candidates c
      LEFT JOIN daily_votes dv ON c.id = dv.candidate_id AND ${dateFilter}
      WHERE ${regionFilter}
      GROUP BY c.id, c.name, c.region
      ORDER BY votes DESC
    `, params);

    // Stats par région
    const [regionStats] = await connection.execute(`
      SELECT 
        c.region,
        COUNT(dv.id) as votes
      FROM candidates c
      LEFT JOIN daily_votes dv ON c.id = dv.candidate_id AND ${dateFilter}
      GROUP BY c.region
      ORDER BY votes DESC
    `);

    // Tendances (comparaison avec la période précédente)
    const [trends] = await connection.execute(`
      SELECT 
        'current' as period,
        COUNT(*) as votes
      FROM daily_votes
      WHERE ${dateFilter}
      UNION ALL
      SELECT 
        'previous' as period,
        COUNT(*) as votes
      FROM daily_votes
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 2 * 
        CASE 
          WHEN '${dateRange}' = 'today' THEN 1
          WHEN '${dateRange}' = 'week' THEN 7
          WHEN '${dateRange}' = 'month' THEN 30
          ELSE 30
        END DAY)
      AND created_at < DATE_SUB(NOW(), INTERVAL
        CASE 
          WHEN '${dateRange}' = 'today' THEN 1
          WHEN '${dateRange}' = 'week' THEN 7
          WHEN '${dateRange}' = 'month' THEN 30
          ELSE 30
        END DAY)
    `);

    return res.status(200).json({
      totalVotes: totalVotes[0].total,
      votesByDate,
      candidateStats,
      regionStats,
      trends: {
        current: trends[0].votes,
        previous: trends[1].votes,
        change: ((trends[0].votes - trends[1].votes) / trends[1].votes * 100).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
}