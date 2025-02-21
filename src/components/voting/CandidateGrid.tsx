// src/components/voting/CandidateGrid.tsx
import React, { useState, useCallback } from 'react';
import { CandidateCard } from './CandidateCard';
import type { Candidate } from '@/types/candidate';

interface CandidateGridProps {
  initialCandidates: Candidate[];
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({ initialCandidates }) => {
  const [candidates, setCandidates] = useState(initialCandidates);

  const refreshCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/candidates');
      const updatedCandidates = await response.json();
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error('Error refreshing candidates:', error);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onVoteSubmitted={refreshCandidates}
        />
      ))}
    </div>
  );
};

export default CandidateGrid;