// pages/index.tsx
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { CandidateGrid } from '@/components/voting/CandidateGrid';
import type { Candidate } from '@/types/candidate';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Votez pour votre candidate préférée</h2>
          <p className="text-lg text-gray-300 mb-8">
            Participez à l'élection de Miss Orangina 2025 en votant pour votre candidate favorite.
            Vous pouvez voter une fois par jour jusqu'au 28 février 2025.
          </p>
          
          <CandidateGrid initialCandidates={candidates} />
        </div>
      </main>
    </Layout>
  );
}