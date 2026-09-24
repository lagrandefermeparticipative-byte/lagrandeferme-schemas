// Transforme le résultat d'un safeParse Zod en deux formats utiles :
// - un objet { champ: message } pour afficher l'erreur sous le bon champ de formulaire (web/mobile)
// - une phrase unique jointe, pour les réponses API (même style que l'ancien middleware validerChamps)
const formaterErreursZod = (zodError) => {
  const parChamp = {};
  for (const issue of zodError.issues) {
    const champ = issue.path[0] || '_global';
    if (!parChamp[champ]) parChamp[champ] = issue.message;
  }
  return { parChamp, message: zodError.issues.map(i => i.message).join(' ') };
};

module.exports = { formaterErreursZod };
