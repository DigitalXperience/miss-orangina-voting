import type { Candidate } from '@/types/candidate';

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Kamdem",
    city: "Douala",
    photo: "/api/placeholder/300/400",
    votes: 1234,
    social: {
      instagram: "sarah.kamdem",
      facebook: "sarahkamdem.officiel"
    }
  },
  {
    id: 2,
    name: "Michelle Biya",
    city: "Yaoundé",
    photo: "/api/placeholder/300/400",
    votes: 1156,
    social: {
      instagram: "michelle.biya"
    }
  },
  // Ajoutez d'autres candidates selon vos besoins...
];