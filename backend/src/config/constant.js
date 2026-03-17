// Taux par défaut

/** Coefficient ETD (Equivalent TD) par type d'enseignement */
const EQUIVALENCE_RATES = {
  CM: 1.5,  // 1h CM = 1.5h ETD
  TD: 1.0,  // 1h TD = 1.0h ETD
  TP: 0.75, // 1h TP = 0.75h ETD
};

/** Service contractuel annuel en heures ETD */
const CONTRACTUAL_SERVICE = {
  permanent: 192, // heures ETD / an
  vacataire: 0,   // pas de service minimum (toutes les heures sont complémentaires)
};

/** Taux horaires par défaut en FCFA (heures complémentaires uniquement) */
const HOURLY_RATES = {
  assistant: 5000,
  maitre_assistant: 6500,
  professeur: 8000,
  vacataire: 4000,
};

/** Types d'enseignement valides */
const HOUR_TYPES = ['CM', 'TD', 'TP'];

/** Grades valides */
const TEACHER_GRADES = ['assistant', 'maitre_assistant', 'professeur'];

/** Statuts valides */
const TEACHER_STATUSES = ['permanent', 'vacataire'];

/** Rôles utilisateur */
const USER_ROLES = ['admin', 'rh', 'enseignant'];

module.exports = {
  EQUIVALENCE_RATES,
  CONTRACTUAL_SERVICE,
  HOURLY_RATES,
  HOUR_TYPES,
  TEACHER_GRADES,
  TEACHER_STATUSES,
  USER_ROLES,
};
