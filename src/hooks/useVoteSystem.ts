import { useState, useEffect } from 'react';
import { useDeviceIdentifier } from './useDeviceIdentifier';

interface UseVoteSystemResult {
  hasVoted: boolean;
  isLoading: boolean;
  votedFor: number | null;
  error: string | null;
  castVote: (candidateId: number) => Promise<void>;
}

export const useVoteSystem = (): UseVoteSystemResult => {
  const { deviceId, isLoading: isLoadingDevice, error: deviceError } = useDeviceIdentifier();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si l'utilisateur a déjà voté au chargement
  useEffect(() => {
    if (deviceId) {
      const storedVote = localStorage.getItem(`vote_${deviceId}`);
      if (storedVote) {
        const { candidateId } = JSON.parse(storedVote);
        setHasVoted(true);
        setVotedFor(candidateId);
      }
      setIsLoading(false);
    }
  }, [deviceId]);

  const castVote = async (candidateId: number) => {
    if (!deviceId) {
      setError('Impossible d\'identifier votre appareil');
      return;
    }

    if (hasVoted) {
      setError('Vous avez déjà voté');
      return;
    }

    try {
      setIsLoading(true);

      const voteData = {
        candidateId,
        timestamp: new Date().toISOString(),
        deviceId
      };

      localStorage.setItem(`vote_${deviceId}`, JSON.stringify(voteData));
      
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'STORE_VOTE',
          payload: voteData
        });
      }

      setHasVoted(true);
      setVotedFor(candidateId);

    } catch (err) {
      console.error('Erreur lors du vote:', err);
      setError('Une erreur est survenue lors du vote');
    } finally {
      setIsLoading(false);
    }
  };

  // Propage les erreurs du deviceIdentifier
  useEffect(() => {
    if (deviceError) {
      setError(deviceError);
    }
  }, [deviceError]);

  return {
    hasVoted,
    isLoading: isLoading || isLoadingDevice,
    votedFor,
    error,
    castVote
  };
};