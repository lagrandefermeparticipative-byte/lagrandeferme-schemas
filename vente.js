const { z } = require('zod');

// Un nombre de sujets vendus ne peut jamais être négatif ni décimal — un champ
// texte vidé ou mal saisi (ex: "12.5") doit être rejeté avant d'atteindre le
// calcul de recette, pas après.
const entierPositif = z.coerce.number().int('Doit être un nombre entier.').min(0, 'Ne peut pas être négatif.');
const montantPositif = z.coerce.number().min(0, 'Ne peut pas être négatif.');

const creerVenteSchema = z.object({
  lot_id: z.union([z.string(), z.number()]).refine(v => v !== '' && v !== null && v !== undefined, 'Le lot est requis.'),
  males_vendus: entierPositif.optional().default(0),
  femelles_vendues: entierPositif.optional().default(0),
  prix_male: montantPositif.optional().default(0),
  prix_femelle: montantPositif.optional().default(0),
  acheteur: z.string().trim().optional(),
  date_vente: z.string().optional(),
}).refine(
  (d) => d.males_vendus > 0 || d.femelles_vendues > 0,
  { message: 'Il faut vendre au moins un sujet (mâle ou femelle).', path: ['males_vendus'] }
);

const paiementVenteSchema = z.object({
  montant: z.coerce.number().min(0.01, 'Le montant doit être supérieur à 0.'),
});

module.exports = { creerVenteSchema, paiementVenteSchema };
