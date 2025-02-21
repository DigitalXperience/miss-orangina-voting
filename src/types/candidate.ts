// src/types/candidate.ts
export interface SocialLinks {
  instagram?: string;
  facebook?: string;
}

export interface Candidate {
  id: number;
  name: string;
  city: string;
  photo: string;
  votes: number;      // Total des votes
  todayVotes: number; // Votes du jour
  social?: SocialLinks;
}