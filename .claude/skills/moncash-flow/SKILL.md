---
name: moncash-flow
description: Utiliser pour TOUT code touchant aux paiements, webhooks MonCash, transactions, versement du pot, calcul de frais, machine à états des groupes, ou schéma de base de données financier de Sòlid. Contient les règles d'intégrité non négociables ET le barème de frais réel MonCash (collecte + transfert).
---

# Skill — Gardien des flux d'argent Sòlid

Une tontine qui perd une gourde perd toute sa raison d'être : la confiance.
Ces règles ne sont JAMAIS optionnelles, même pour un prototype.

## Règle 0 : la source de vérité

Le webhook MonCash n'est JAMAIS la source de vérité seul. Séquence obligatoire
pour toute confirmation de paiement :

1. Webhook reçu → enregistrer l'événement brut (table `webhook_events`)
2. **Vérifier la transaction par un appel direct à l'API MonCash** (retrieve
   transaction par référence)
3. Seulement si la vérification confirme : marquer la cotisation `paid`
4. Émettre le reçu (horodaté, avec référence MonCash)

Un webhook falsifié ou rejoué est l'attaque n°1 contre ce type de système.

## Règle 1 : idempotence partout

- Chaque webhook porte une clé d'idempotence (référence transaction MonCash).
- Le même événement reçu deux fois = UNE seule écriture. Contrainte UNIQUE en
  base sur la référence, et le handler tolère le doublon silencieusement.
- Toute écriture financière est dans une transaction SQL atomique.

## Règle 2 : la machine à états est stricte

États d'un groupe : `forming → active → collecting → pot_ready → pot_sent → next_month | completed`
États d'une cotisation : `due → pending → paid | late | defaulted`

- Aucune transition manuelle, aucune transition sautée.
- **Le versement du pot ne part JAMAIS si l'état « toutes les cotisations du
  mois confirmées » n'est pas atteint** (9 cotisations `paid` avec netting).
- L'ordre des bénéficiaires est immuable après le passage `forming → active`
  (colonne protégée, aucun UPDATE autorisé — RLS + trigger de blocage).

## Règle 3 : le versement du pot = double contrôle

C'est le moment le plus dangereux (jusqu'à 45 000 HTG ou plus qui sortent).
Verrous obligatoires :

- Vérifier que le bénéficiaire = celui de l'ordre défini au lancement.
- Numéro MonCash du bénéficiaire confirmé (micro-versement test au 1er cycle).
- Tout changement de numéro bénéficiaire : délai de 48h + reconfirmation.
- Journal d'audit signé (table append-only `audit_log`) pour chaque sortie
  de fonds : qui, quoi, quand, référence, état avant/après.

## Règle 4 : anti-fraude par construction

- 1 compte MonCash = 1 identité KYC = 1 membre. Contrainte d'unicité stricte.
- L'organisatrice n'a JAMAIS accès aux fonds : rôle lecture + invitation +
  relance uniquement (RLS Supabase par rôle).
- Nouveaux membres : positions tardives uniquement (épargne d'abord). L'accès
  aux positions 1-3 se débloque par le score de fiabilité.
- Retards : rappels auto J-3 / J-1 / J, escalade organisatrice J+2, gel de
  position J+5 — tout automatique, rien de manuel.

## Règle 5 : traçabilité = défense

- Chaque paiement → reçu horodaté instantané avec référence MonCash.
- Chaque ligne d'historique affiche sa référence — c'est la preuve du membre
  ET la nôtre en cas de litige.
- Les événements webhook bruts sont conservés tels quels (debugging + audit).

---

## Règle 6 : le barème de frais MonCash réel (source : tableau officiel, catégories marchands)

**Ne jamais calculer un frais MonCash comme une estimation ou un pourcentage
deviné. Deux barèmes distincts s'appliquent, à des moments différents du
cycle — ne pas les confondre.**

### 6.1 — Frais de collecte (quand un membre cotise)

S'applique sur chaque paiement entrant du client vers le compte marchand.
Pourcentage du montant collecté, selon la catégorie du compte marchand.

| Catégorie | Limite portefeuille | Compte bancaire obligatoire | Frais sur collecte |
|---|---|---|---|
| Bronze | 100 000 HTG | Non | 0,5 % |
| Silver | 2 000 000 HTG | Optionnel | 2 % |
| Gold | 3 000 000 HTG | Oui | 2 % |

```ts
type MerchantTier = "bronze" | "silver" | "gold";

const COLLECTION_FEE_RATE: Record<MerchantTier, number> = {
  bronze: 0.005,
  silver: 0.02,
  gold: 0.02,
};

function calculateCollectionFee(amount: number, tier: MerchantTier): number {
  return Math.round(amount * COLLECTION_FEE_RATE[tier]);
}
```

### 6.2 — Frais de transfert / décaissement (versement du pot vers un autre wallet)

**C'est un barème à PALIERS FIXES, pas un pourcentage.** S'applique quand
l'argent sort du compte marchand vers le wallet MonCash du bénéficiaire —
c'est-à-dire le versement du pot. Identique quelle que soit la catégorie
marchand (Bronze/Silver/Gold) : c'est le tarif normal MonCash→MonCash.

| Tranche (HTG) | Frais (HTG) |
|---|---|
| 20 – 249 | Gratuit |
| 250 – 499 | 5 |
| 500 – 999 | 10 |
| 1 000 – 1 999 | 25 |
| 2 000 – 3 999 | 35 |
| 4 000 – 7 999 | 50 |
| 8 000 – 11 999 | 60 |
| 12 000 – 19 999 | 70 |
| 20 000 – 39 999 | 75 |
| 40 000 – 59 999 | 100 |
| 60 000 – 75 000 | 120 |
| 75 000 – 100 000 | 130 |

⚠️ **Le barème officiel s'arrête à 100 000 HTG.** Pour un versement au-delà
(groupes à gros pots en Silver/Gold), le tarif n'est pas documenté ici —
NE PAS extrapoler une valeur. Marquer `[TARIF A CONFIRMER AUPRES DE MONCASH]`
dans le code et bloquer le versement automatique au-delà de 100 000 HTG tant
que ce n'est pas confirmé.

```ts
const TRANSFER_FEE_TIERS: Array<{ min: number; max: number; fee: number }> = [
  { min: 20,    max: 249,    fee: 0 },
  { min: 250,   max: 499,    fee: 5 },
  { min: 500,   max: 999,    fee: 10 },
  { min: 1000,  max: 1999,   fee: 25 },
  { min: 2000,  max: 3999,   fee: 35 },
  { min: 4000,  max: 7999,   fee: 50 },
  { min: 8000,  max: 11999,  fee: 60 },
  { min: 12000, max: 19999,  fee: 70 },
  { min: 20000, max: 39999,  fee: 75 },
  { min: 40000, max: 59999,  fee: 100 },
  { min: 60000, max: 75000,  fee: 120 },
  { min: 75000, max: 100000, fee: 130 },
];

function calculateTransferFee(amount: number): number {
  const tier = TRANSFER_FEE_TIERS.find(t => amount >= t.min && amount <= t.max);
  if (!tier) {
    throw new Error(
      `Montant ${amount} HTG hors barème connu (>100 000 HTG). ` +
      `Tarif à confirmer auprès de MonCash avant tout versement automatique.`
    );
  }
  return tier.fee;
}
```

### 6.3 — Où ces frais s'appliquent dans le cycle de vie d'un groupe

- **Cotisation d'un membre** → `calculateCollectionFee()`, appliqué et
  enregistré au moment de la vérification API (Règle 0).
- **Versement du pot au bénéficiaire** → `calculateTransferFee()`, appliqué
  et journalisé dans `audit_log` (Règle 3) avant l'exécution du transfert.
- Ces deux frais sont distincts, calculés séparément, et doivent apparaître
  comme deux lignes séparées dans tout export comptable ou reçu détaillé —
  ne jamais les fusionner en un seul montant affiché.

## Schéma minimal attendu (Supabase)

`users` (kyc_status, moncash_number UNIQUE, trust_score, merchant_tier) ·
`groups` (state, amount, pot_day) ·
`memberships` (group_id, user_id, position — immuable après activation) ·
`contributions` (month, state, moncash_ref UNIQUE, paid_at, collection_fee) ·
`payouts` (month, beneficiary, state, moncash_ref, verified_by_api, transfer_fee) ·
`webhook_events` (raw payload, idempotency_key UNIQUE) ·
`audit_log` (append-only)

RLS activé sur TOUTES les tables. Un membre ne voit que ses groupes ;
l'organisatrice voit ses groupes en lecture ; personne ne modifie une
position ni une écriture financière.

## Checklist avant de proposer une PR touchant l'argent

- [ ] Vérification API après webhook (jamais webhook seul)
- [ ] Idempotence testée (rejouer le même webhook = aucune double écriture)
- [ ] Transitions d'état validées par la machine, pas par du code ad hoc
- [ ] Aucun versement possible avec une cotisation manquante (test inclus)
- [ ] Frais de collecte ET de transfert calculés via les fonctions du
      barème (§6), jamais estimés ou codés en dur ailleurs
- [ ] Montant de versement > 100 000 HTG bloqué avec message explicite
      (tarif non confirmé), jamais silencieusement traité à 0 ou extrapolé
- [ ] audit_log alimenté sur toute sortie de fonds (avec le frais appliqué)
- [ ] RLS vérifiées pour les 3 rôles (membre, organisatrice, admin)
- [ ] Aucun secret en dur ; variables d'environnement uniquement
