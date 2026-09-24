const { z } = require('zod');

// Règle qui n'était vérifiée QUE côté web (Dashboard.js) et jamais côté
// backend avant ce schéma : si des sujets sont retenus pour la reproduction,
// il faut savoir de quel lot ils proviennent, sinon la clôture insère un
// enregistrement avec lot_id_reproduction = null en silence.
const clotureProjetSchema = z.object({
  taux_perte_reel: z.coerce.number().optional(),
  taux_perte_applique: z.coerce.number().min(0).max(100),
  justification: z.string().trim().min(1, 'Une justification est obligatoire.'),
  sujets_retenus_reproduction: z.coerce.number().int().min(0).optional().default(0),
  lot_id_reproduction: z.union([z.string(), z.number(), z.null()]).optional(),
}).refine(
  (d) => d.sujets_retenus_reproduction === 0 || !!d.lot_id_reproduction,
  { message: 'Précise de quel lot proviennent les sujets retenus pour la reproduction.', path: ['lot_id_reproduction'] }
);

const bonusSchema = z.object({
  bonus_pourcentage: z.coerce.number().min(0).max(100),
  justification: z.string().trim().min(1, 'Une justification est obligatoire.'),
});

module.exports = { clotureProjetSchema, bonusSchema };
