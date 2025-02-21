interface Candidate {
  id: number;
  name: string;
  city: string;
  photo: string;
  votes: number;
  social?: {
    instagram?: string;
    facebook?: string;
  };
}

export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Bernice Tambou",
    city: "Douala",
    photo: "/candidates/bernice-tambou.jpg",
    votes: 0,
    social: {
      instagram: "bernice.tambou",
    }
  },
  {
    id: 2,
    name: "Princesse Kowo",
    city: "Yaoundé",
    photo: "/candidates/princesse-kowo.jpg",
    votes: 0,
    social: {
      instagram: "princesse.kowo",
    }
  },
  {
    id: 3,
    name: "Ayissi Atangana",
    city: "Bafoussam",
    photo: "/candidates/ayissi-atangana.jpg",
    votes: 0,
    social: {
      instagram: "ayissi.atangana",
    }
  },
  // Candidates sans photos pour le moment - utilisation d'un placeholder
  {
    id: 4,
    name: "Candidate 4",
    city: "Douala",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+4",
    votes: 0
  },
  {
    id: 5,
    name: "Candidate 5",
    city: "Yaoundé",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+5",
    votes: 0
  },
  {
    id: 6,
    name: "Candidate 6",
    city: "Garoua",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+6",
    votes: 0
  },
  {
    id: 7,
    name: "Candidate 7",
    city: "Maroua",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+7",
    votes: 0
  },
  {
    id: 8,
    name: "Candidate 8",
    city: "Ngaoundéré",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+8",
    votes: 0
  },
  {
    id: 9,
    name: "Candidate 9",
    city: "Bamenda",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+9",
    votes: 0
  },
  {
    id: 10,
    name: "Candidate 10",
    city: "Ebolowa",
    photo: "https://placehold.co/300x400/1f2937/ffffff?text=Candidate+10",
    votes: 0
  }
];