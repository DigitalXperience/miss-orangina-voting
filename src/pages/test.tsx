// src/pages/test.tsx
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import CandidateGrid from '@/components/voting/CandidateGrid';
import { Fingerprint } from 'lucide-react';
import { useVoting } from '@/hooks/useVoting';
import type { Candidate } from '@/types/candidate';

export default function TestPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { voteStatus, getTimeUntilNextVote } = useVoting();
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    // Charger l'ID de l'appareil
    const getDeviceId = async () => {
      const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
      const fp = await FingerprintJS.default.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };

    getDeviceId();

    // Charger les candidates
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

  const timeUntilNext = voteStatus?.hasVotedToday ? getTimeUntilNextVote() : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Page de Test - Système de Vote</h1>
          
          <div className="space-y-2">
            <p className="flex items-center">
              <Fingerprint className="w-5 h-5 mr-2" />
              ID de l'appareil: {deviceId || 'Chargement...'}
            </p>
            
            {voteStatus?.hasVotedToday && timeUntilNext && (
              <div className="text-yellow-500">
                <p>Vous avez déjà voté aujourd'hui.</p>
                <p>Prochain vote possible dans {timeUntilNext.hours}h {timeUntilNext.minutes}m</p>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
          </div>
        ) : (
          <CandidateGrid 
            initialCandidates={candidates} 
          />
        )}
      </div>
    </Layout>
  );
}