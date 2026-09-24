const { z } = require('zod');

const idRequis = z.union([z.string(), z.number()]).refine(v => v !== '' && v !== null && v !== undefined, 'Champ requis.');

const creerInvestisseurSchema = z.object({
  utilisateur_id: idRequis,
  projet_id: idRequis,
  mise: z.coerce.number().min(0.01, 'La mise doit être supérieure à 0.'),
  preference_paiement: z.string().trim().optional(),
  numero_mobile_money: z.string().trim().optional(),
  coordonnees_bancaires: z.string().trim().optional(),
  type_investisseur: z.enum(['retail', 'landowner', 'institutional']).optional().default('retail'),
});

const paiementInvestisseurSchema = z.object({
  montant: z.coerce.number().min(0.01, 'Le montant doit être supérieur à 0.'),
});

module.exports = { creerInvestisseurSchema, paiementInvestisseurSchema };
