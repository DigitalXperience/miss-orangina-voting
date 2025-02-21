import React from 'react';
import Layout from '@/components/layout/Layout';
import { useVoteSystem } from '@/hooks/useVoteSystem';
import { useDeviceIdentifier } from '@/hooks/useDeviceIdentifier';

const VoteTestPage = () => {
  const { deviceId, isLoading: isLoadingDevice } = useDeviceIdentifier();
  const { hasVoted, isLoading, votedFor, error, castVote } = useVoteSystem();

  // Fonction de test pour voter
  const testVote = async (candidateId: number) => {
    await castVote(candidateId);
  };

  // Fonction pour réinitialiser les votes (pour les tests)
  const resetVotes = () => {
    if (deviceId) {
      localStorage.removeItem(`vote_${deviceId}`);
      localStorage.removeItem('device_identifier');
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Test du Système de Vote</h1>

        {/* État du système */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">État du Système</h2>
          <div className="space-y-2">
            <p>Device ID: {isLoadingDevice ? 'Chargement...' : deviceId || 'Non disponible'}</p>
            <p>A déjà voté: {hasVoted ? 'Oui' : 'Non'}</p>
            <p>Vote pour: {votedFor ? `Candidate ${votedFor}` : 'Personne'}</p>
            <p>Chargement: {isLoading ? 'Oui' : 'Non'}</p>
            {error && <p className="text-red-500">Erreur: {error}</p>}
          </div>
        </div>

        {/* Boutons de test */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((candidateId) => (
              <button
                key={candidateId}
                onClick={() => testVote(candidateId)}
                disabled={hasVoted || isLoading}
                className="px-4 py-2 bg-gold text-black rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voter pour Candidate {candidateId}
              </button>
            ))}
          </div>

          <button
            onClick={resetVotes}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Réinitialiser les votes (Test)
          </button>
        </div>

        {/* Log des actions */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions de Test</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Cliquez sur un bouton pour voter pour une candidate</li>
            <li>Essayez de voter à nouveau (devrait être bloqué)</li>
            <li>Rafraîchissez la page (le vote devrait persister)</li>
            <li>Utilisez le bouton de réinitialisation pour effacer votre vote</li>
            <li>Vérifiez que vous pouvez voter à nouveau après réinitialisation</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default VoteTestPage;