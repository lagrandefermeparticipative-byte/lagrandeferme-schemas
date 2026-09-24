const { z } = require('zod');

const montantPositif = z.coerce.number().min(0, 'Ne peut pas être négatif.');

const creerDepenseSchema = z.object({
  libelle: z.string().trim().min(1, 'Le libellé est requis.'),
  categorie: z.string().trim().optional(),
  montant_prevu: montantPositif.optional().default(0),
  montant_reel: montantPositif.optional().default(0),
  statut: z.enum(['planifiee', 'engagee', 'payee', 'annulee']).optional().default('planifiee'),
  date_depense: z.string().optional(),
  fournisseur: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

const paiementDepenseSchema = z.object({
  montant: z.coerce.number().min(0.01, 'Le montant doit être supérieur à 0.'),
  description: z.string().trim().optional(),
});

module.exports = { creerDepenseSchema, paiementDepenseSchema };
