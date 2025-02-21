import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Génère une image SVG de placeholder
  const width = Number(req.query.dimensions[0]) || 300;
  const height = Number(req.query.dimensions[1]) || 400;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle">
        ${width} x ${height}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
}