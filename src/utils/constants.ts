export const VOTING_END_DATE = '2025-02-28T18:00:00';
export const VOTING_START_DATE = '2025-02-19T00:00:00';

export const API_ENDPOINTS = {
  VOTE: '/api/vote',
  VERIFY_SMS: '/api/verify-sms',
  GET_CANDIDATES: '/api/candidates',
};

export const ERROR_MESSAGES = {
  ALREADY_VOTED: 'Vous avez déjà voté pour une candidate.',
  INVALID_PHONE: 'Numéro de téléphone invalide.',
  VOTING_CLOSED: 'La période de vote est terminée.',
  VOTING_NOT_STARTED: 'La période de vote n\'a pas encore commencé.',
};

export const SUCCESS_MESSAGES = {
  VOTE_REGISTERED: 'Votre vote a été enregistré avec succès !',
  CODE_SENT: 'Un code de vérification a été envoyé par SMS.',
};