# @lagrandeferme/schemas

Schémas de validation [Zod](https://zod.dev) partagés entre le backend
(`lagrandeferme`), le web (`lagrandeferme`/frontend) et le mobile
(`lagrandeferme-app`).

Ce paquet ne contient que des règles de validation pures — aucune dépendance
à Express, React ou React Native. Il définit une seule fois ce qu'est une
vente, une dépense, un paiement ou une clôture valides, pour que les trois
codebases appliquent exactement les mêmes règles au lieu de les réimplémenter
chacune de leur côté.

## Installation

Dans `lagrandeferme` (backend + web) et dans `lagrandeferme-app` :

```
npm install zod github:MrBako/lagrandeferme-schemas
```

## Usage — backend (Express)

```js
const { creerVenteSchema } = require('@lagrandeferme/schemas');
const { formaterErreursZod } = require('@lagrandeferme/schemas/erreurs');

const validerAvecZod = (schema) => (req, res, next) => {
  const resultat = schema.safeParse(req.body);
  if (!resultat.success) {
    const { message } = formaterErreursZod(resultat.error);
    return res.status(400).json({ message });
  }
  req.body = resultat.data; // valeurs coercées (nombres, défauts appliqués)
  next();
};

router.post('/', auth, validerAvecZod(creerVenteSchema), creerVente);
```

## Usage — web ou mobile (React / React Native)

```js
import { creerVenteSchema } from '@lagrandeferme/schemas';
import { formaterErreursZod } from '@lagrandeferme/schemas/erreurs';

const soumettre = () => {
  const resultat = creerVenteSchema.safeParse(form);
  if (!resultat.success) {
    setErreursChamps(formaterErreursZod(resultat.error).parChamp);
    return; // bloqué avant le moindre appel réseau
  }
  api.post('/ventes', resultat.data);
};
```

## Pourquoi pas plus de logique métier ici ?

Ce paquet reste volontairement limité à la *forme et aux contraintes* des
données (types, bornes, champs requis, règles conditionnelles simples). Les
calculs métier (rendement, liquidation, valorisation du cheptel) restent dans
chaque codebase — les partager demanderait une vraie fusion en monorepo, ce
qui a été jugé disproportionné pour la taille actuelle du projet.

## Garantie d'intégrité en base

Ce paquet valide ce qui *entre* dans l'API. Il ne remplace pas des contraintes
SQL (`NOT NULL`, `CHECK`, `FOREIGN KEY`) côté PostgreSQL, qui restent la seule
garantie valable si la base est modifiée hors de l'API (migration, script,
accès direct).
