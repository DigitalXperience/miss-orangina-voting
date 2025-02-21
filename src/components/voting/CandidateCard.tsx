import React from 'react';
import { Heart, Instagram, Facebook, Clock } from 'lucide-react';
import { useVoting } from '@/hooks/useVoting';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Candidate } from '@/types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
  onVoteSubmitted?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onVoteSubmitted
}) => {
  const { 
    submitVote, 
    voteStatus, 
    isLoading,
    checkVoteStatus 
  } = useVoting({
    onSuccess: () => {
      onVoteSubmitted?.();
    },
    // Gérer l'erreur silencieusement puisqu'on affiche déjà le statut
    onError: () => {}
  });

  const { id, name, city, photo_url, votes, todayVotes, social } = candidate;

  const handleVoteClick = async () => {
    if (voteStatus?.hasVotedToday) return; // Empêcher le vote si déjà voté
    try {
      await submitVote(id);
    } catch (error) {
      // Les erreurs sont gérées par les callbacks onSuccess/onError
    }
  };

  // Calcul du temps restant
  const getTimeRemaining = () => {
    if (!voteStatus?.nextVoteDate) return null;

    const now = new Date();
    const nextVote = new Date(voteStatus.nextVoteDate);
    nextVote.setHours(24, 0, 0, 0);

    const diff = nextVote.getTime() - now.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="card relative group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={photo_url}
          alt={`Miss Orangina Candidate - ${name}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-gray-300">{city}</p>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-gold" />
                <span className="text-white">{votes?.toLocaleString() || 0} total</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="w-3 h-3 text-green-500" />
                <span className="text-green-500">{todayVotes || 0} aujourd'hui</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {social?.instagram && (
                <a 
                  href={`https://instagram.com/${social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social?.facebook && (
                <a 
                  href={`https://facebook.com/${social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {voteStatus?.hasVotedToday ? (
            <div className="mt-3 bg-gray-800 rounded-md p-2 text-center">
              <p className="text-gray-300 text-sm flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                {timeRemaining ? (
                  `Prochain vote dans ${timeRemaining.hours}h ${timeRemaining.minutes}m`
                ) : (
                  'Vote déjà effectué aujourd\'hui'
                )}
              </p>
            </div>
          ) : (
            <button
              onClick={handleVoteClick}
              disabled={isLoading || voteStatus?.hasVotedToday}
              className={`w-full mt-3 py-2 rounded-md font-medium transition-all ${
                isLoading || voteStatus?.hasVotedToday
                  ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  : 'bg-gold text-black hover:bg-opacity-90'
              }`}
            >
              {isLoading ? 'Vote en cours...' : 'Voter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;