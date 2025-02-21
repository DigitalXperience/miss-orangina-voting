// src/hooks/useVoting.ts
import { useState, useCallback, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface VoteStatus {
  hasVotedToday: boolean;
  candidateId: number | null;
  nextVoteDate: string;
}

interface TimeUntilNextVote {
  hours: number;
  minutes: number;
}

interface UseVotingOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useVoting(options: UseVotingOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);

  const getVoterId = useCallback(async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  }, []);

  const checkVoteStatus = useCallback(async () => {
    try {
      const voterId = await getVoterId();
      const response = await fetch(`/api/check-vote?voterId=${voterId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du statut de vote');
      }
      
      const data = await response.json();
      
      setVoteStatus({
        hasVotedToday: data.hasVotedToday,
        candidateId: data.candidateId,
        nextVoteDate: data.nextVoteDate
      });
    } catch (err) {
      console.error('Error checking vote status:', err);
      // Ne pas afficher d'erreur à l'utilisateur pour cette vérification
    }
  }, [getVoterId]);

  const submitVote = useCallback(async (candidateId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const voterId = await getVoterId();
      
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          voterId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si l'erreur est que l'utilisateur a déjà voté, mettre à jour le statut
        if (response.status === 403 && data.error === 'You have already voted today') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          setVoteStatus({
            hasVotedToday: true,
            candidateId: candidateId,
            nextVoteDate: tomorrow.toISOString().split('T')[0]
          });
          throw new Error('Vous avez déjà voté aujourd\'hui. Revenez demain !');
        }
        throw new Error(data.error || 'Une erreur est survenue lors du vote');
      }

      // Mettre à jour le statut après le vote réussi
      setVoteStatus({
        hasVotedToday: true,
        candidateId,
        nextVoteDate: data.nextVoteDate
      });

      options.onSuccess?.();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getVoterId, options]);

  const getTimeUntilNextVote = useCallback((): TimeUntilNextVote | null => {
    if (!voteStatus?.nextVoteDate) return null;

    const now = new Date();
    const nextVote = new Date(voteStatus.nextVoteDate);
    nextVote.setHours(0, 0, 0, 0);

    const diff = nextVote.getTime() - now.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }, [voteStatus]);

  // Vérifier le statut au chargement
  useEffect(() => {
    checkVoteStatus();
  }, [checkVoteStatus]);

  return {
    submitVote,
    checkVoteStatus,
    voteStatus,
    getTimeUntilNextVote,
    isLoading,
    error
  };
}