# FONCTIONNEL.md — Phase 2 : reskin Sòlid (analyse, mapping, statuts)

> Suivi de la transformation du système Cash App (Phase 1, `INVENTAIRE.md`)
> en Sòlid, selon `DESIGN.md` (la loi visuelle/produit) et
> `references/TONTINE_FLOW_REFERENCE.md` (la structure fonctionnelle).

Légende : ⬜ à faire · 🟡 en cours · ✅ fait

## 0. Fondations

| Item | Statut | Détail |
|---|---|---|
| Cartographie sémantique des couleurs | ✅ | Documentée dans `DESIGN.md` §3.1. `--color-green` = action primaire confirmée. Bleu/violet/orange/cyan = décoratifs, pas sémantiques. |
| Tokens de statut `--color-paid/wait/late` | ✅ | Dérivés de green/orange/red existants. `--color-soley` ajouté (seule teinte réellement nouvelle, halo du bénéficiaire du wonn). |
| Renommage `Chip` "primary" → "accent" | ✅ | Lève l'ambiguïté avec `PillButton`. Variantes `paid`/`wait`/`late` ajoutées au passage. |
| Suppression `pay.png` ($) | 🟡 Réintroduit | Retiré (icône lucide `ArrowLeftRight`), puis **réintroduit** en `DollarSign` (lucide, bold) au 3e onglet le 2026-07-18 sur demande explicite de l'utilisateur — voir §5. |
| Icônes UI pixelisées (PNG 16-32px) | ✅ | Remplacées par des icônes vectorielles `lucide-react` (`strokeWidth={2.5}`) via `AssetIcon` — plus de flou/pixelisation à aucune résolution. |
| Purge vocabulaire Cash App | ✅ | Voir §1-10 ci-dessous pour le détail écran par écran. Étape bitcoin/cashtag de l'onboarding : bitcoin retiré (zéro transposition), cashtag → "non itilizatè". |
| `DESIGN.md` déposé (racine) | ✅ | §3 remplacé par les tokens réels du repo + cartographie sémantique. |
| `.claude/skills/moncash-flow/SKILL.md` déposé | ✅ | Verbatim, non modifié. |

## 1. Correspondance écran par écran (`TONTINE_FLOW_REFERENCE.md` §1-10)

| § | Écran sòl | Traitement | Composants réutilisés |
|---|---|---|---|
| 1 | Accueil — carte de groupe | 🟡 Déplacé | `GroupCard` déplacé sur `/card` (`card-screen.tsx`, 2e icône de la tab bar) suite à la décision utilisateur du 2026-07-18 : `/home` redevient l'écran de solde façon Cash App (Cash Balance/Add Cash/Cash Out), destiné à afficher le solde d'un wallet réel à intégrer. Voir §5 ci-dessous. |
| 2 | Rejoindre/Créer un sòl (4 étapes) | ✅ Neuf, composé | Presets façon `AmountGrid`, `PillButton`, pattern de récap façon `CyclePaymentReviewScreen` — routes `/group/create/{amount,contribution,position,review}` |
| 3 | Détail de groupe — le wonn | ✅ Neuf | `WonnPath` (composant signature DESIGN.md §5, neuf), `group-detail-screen.tsx` — route `/group` |
| 4 | Moyen de versement | ✅ Adapté | `payment-details-screen.tsx` réutilisé quasi directement (structure de sélection), contenu réduit à MonCash seul (aucune méthode hors contexte haïtien) — route `/payment-hub/method` |
| 5 | Hub paiement | ✅ Neuf | `PaymentHubScreen` (neuf, `SettingsListRow`+`SurfaceCard`) — route `/payment-hub`, cible de l'onglet central de la tab bar |
| 6 | Éligibilité | ✅ Neuf | `CheckboxRow` variante `readOnly` (neuve) — route `/payment-hub/eligibility` |
| 7 | Historique | ✅ Neuf | `Chip` variantes `paid`/`wait`/`late` — deux catégories distinctes (cotisations/pots) — route `/payment-hub/history` |
| 8 | Profil | ✅ Adapté | `account-screen.tsx` quasi inchangé structurellement ; ajout Kategori kont (Bronze/Silver/Gold), Lang, lien Documents/Parennaj |
| 9 | Documents | ✅ Adapté | `account-help-screen.tsx` (pattern liste de cartes) réutilisé pour `documents-screen.tsx` — route `/account/documents` |
| 10 | Parrainage | ✅ Neuf | `refer-screen.tsx` (code copiable, récompense HTG, suivi) — route `/refer`, relié depuis Compte et depuis la carte "Envite" sur Sik yo |

## 2. Écrans sans équivalent (à concevoir neuf — voir point 6 du plan validé)

| Écran | Statut | Détail |
|---|---|---|
| Accepter/refuser une invitation | ✅ | `group-invite-screen.tsx` — pied de page double `PillButton` (Refize/Aksepte), accepter mène à `/group/create/position` (étape 3, montant/cotisation déjà fixés par le groupe) |
| Groupe en formation | ✅ | `group-forming-screen.tsx` — `WonnPath` sans bénéficiaire + liste `SettingsListRow` des invités (confirmé/en attente) |
| États de paiement distincts | ✅ | `payment-status-screen.tsx` — 3 variantes (`Chip` paid/wait/late), icône et chemin de résolution propres à chacune ; reliée depuis Historique (tap sur une ligne) et depuis la confirmation de kotizasyon |
| Fin de cycle | ✅ | `AddCashSuccessScreen` étendu (`variant="cycle-complete"`) — illustration `SoleyBurst` (SVG dessiné à la main, pas de génération Higgsfield sans validation préalable) |

## 3. Écrans Cash App retirés (zéro transposition possible)

- Onboarding "Verify Bitcoin" (fonctionnalité crypto, interdite par DESIGN.md).
- Flow "Pay" P2P (`pay-amount-screen.tsx`, envoi libre à un contact) — aucun
  équivalent dans le modèle fermé sur invitation de Sòlid ; remplacé par le
  Hub paiement (§5).
- `NewsCard`, tuiles de catégories, liste "Most Traded Monthly" (zone Stocks).
- Logos de marques tierces (Nike/Coca-Cola/Walmart/GE) sur l'écran Stocks.

## 4. Note ouverte

Le flow de Parrainage (§10) a été construit comme un écran unique (code +
suivi) plutôt que 3 étapes séquentielles distinctes mentionnées dans
`TONTINE_FLOW_REFERENCE.md` — jugé suffisant fonctionnellement pour un flow
informatif sans décision multi-étapes réelle. À reconfirmer avec
l'utilisateur si un flow en 3 écrans séparés est explicitement souhaité.

## 5. Ré-arbitrage Accueil / Card (2026-07-18)

Suite à un retour utilisateur, l'architecture de navigation change :

- **`/home` (1er onglet)** redevient l'écran de solde d'origine (structure
  Cash Balance / Add Cash / Cash Out / Savings / Bitcoin / Stocks / Free tax
  filing), restauré à l'identique depuis l'historique git d'avant reskin.
  Objectif affiché par l'utilisateur : y afficher le solde d'un **wallet
  réel à intégrer prochainement** (MonCash ou équivalent).
- **`/card` (2e onglet, "card")** — jusqu'ici une route morte — accueille
  désormais la liste des sòl (`GroupCard`, ex-contenu de `/home`).

⚠️ **Incohérence avec DESIGN.md non résolue** : `/home` réaffiche du texte
Cash App littéral ("Cash Balance", "Add Cash", "Cash Out", "Bitcoin",
"Stocks", "Free tax filing", montants en `$`) alors que DESIGN.md §2/§4
interdit explicitement ce vocabulaire et le symbole `$`, et que le point 4
du plan précédent avait justement purgé cet écran. Restauré tel quel à la
demande explicite de l'utilisateur ("laisse-le tel qu'il était"). **Signalé,
pas tranché** : à reconfirmer si ce texte doit être traduit en Kreyòl une
fois le wallet réel branché, ou s'il reste en l'état.

De même, l'icône `$` a été réintroduite au 3e onglet de la tab bar (à la
demande explicite), alors que le point 2 du plan précédent l'avait retirée
comme interdite par DESIGN.md §2. Signalé pour la même raison.

## 6. Refonte de la page `/card` (2026-07-18)

Nouveau design de `GroupCard` sur retour utilisateur (référence : app
tierce à onglets "Active"/"Finished" — structure reprise, couleurs et
illustrations ignorées conformément à la règle Phase 2 de CLAUDE.md ; bleu
remplacé par `--color-green`, illustration mascotte de l'app référence
remplacée par une icône maison dessinée à la main `CircleEmptyIcon`) :

- Onglets **Aktif / Fini** en haut de page.
- Section "Sik ou yo" : cercles rejoints, statut "Konfime".
- Section "Rekòmande pou ou" : cercles découvrables **sans invitation**,
  bouton "Mande antre" → passe en "An atant apwobasyon" (nouveau modèle à
  double entrée, voir DESIGN.md §1 mis à jour).
- Les petits traits de progression représentent désormais le **nombre de
  membres du cercle** (5 à 25, taille variable) et non plus une durée fixe
  de 12 mois ; le libellé central affiche "{N} Manm", les dates de
  début/fin restent aux extrémités.
- État vide illustré pour l'onglet Aktif sans cercle rejoint.

## 7. Remplacement du wonn cercle par une route (2026-07-18)

`WonnCircle` (cercle SVG à taille fixe) remplacé par `WonnPath`
(`src/components/ui/wonn-path.tsx`) — route serpentine à N nœuds (une main
= un nœud), accepte nativement N variable (5-25). Même API. **La dette
technique "taille fixe" signalée en §6 est résolue pour ce composant.**

⚠️ **Dette restante** (signalée, pas résolue) : les données mock de
`group-create-*` (flow Rejoindre/Créer) et `eligibility-screen.tsx`
("Pozisyon aksesib : 4–10") supposent encore un cercle à 10 membres fixes.

## 8. Refonte de `/group` : route d'avatars + détails complets du pot (2026-07-18)

Nouveau retour utilisateur, `group-detail-screen.tsx` entièrement
reconstruit :

- **`WonnPath` remplacé par `WonnAvatarRoute`** sur cet écran (nouveau
  composant, `wonn-avatar-route.tsx`) : route horizontale scrollable
  d'avatars reliés par des pointillés — seul le bénéficiaire du cycle
  en cours est en couleur, les autres en niveaux de gris (`grayscale`),
  jusqu'à ce que leur tour arrive. Défilement automatique vers le
  bénéficiaire au chargement. `WonnPath` reste utilisé sur
  `group-forming-screen.tsx` (pas de bénéficiaire avant le démarrage du
  cycle, moins pertinent d'y montrer des avatars colorés).
- **Section solde** : remplace l'ancien pattern "You have $0.00" par le
  montant à payer pour l'échéance en cours.
- **Carte "Detay"** (remplace "Set & Save") : tags de motif du sòl
  (Lekòl/Bòdwo/Telefòn — remplace les boutons Create goal/Transfer
  money), puis le détail complet du pot (nombre de membres, durée du
  cycle, fréquence de paiement, montant par versement), un minuteur
  temps réel (`payment-countdown.tsx`, nouveau) avant la prochaine
  échéance, et la date du prochain paiement.
- **Section "Kont konekte"** : wallet interne Sòlid + compte MonCash
  connecté (remplace le pattern "Connected account" / Bank of America).
- **Bouton "Peye kotizasyon"** en bas → `/stocks/cycle/buy`, désormais un
  écran plein écran clavier numérique (`cycle-payment-amount-screen.tsx`,
  remplace l'ancien sheet à montants prédéfinis) fond vert, montant
  géant, sélecteur HTG, clavier — même structure que l'écran de paiement
  P2P d'origine, réutilisée ici pour la kotizasyon.

⚠️ Non traité dans cette passe : le transfert wallet → MonCash depuis la
section "Kont konekte" est affiché mais pas encore relié à un flow de
transfert réel (aucune route dédiée construite).

## 9. Flow manman sòl — création/configuration d'un sòl (2026-07-18)

Le flow `/group/create/*` (membre rejoignant) est étendu en flow de la
**manman sòl** (organisatrice), passé de 4 à 5 étapes. Détail complet dans
`DESIGN.md` §9. Résumé des fichiers :

| Étape | Route | Composant | Statut |
|---|---|---|---|
| 1. Montant | `/group/create/amount` | `group-create-amount-screen.tsx` | ✅ Curseur (`AmountSlider`, nouveau) |
| 2. Durée + fréquence | `/group/create/duration` | `group-create-duration-screen.tsx` (renommé depuis `contribution`) | ✅ Neuf |
| 3. Position | `/group/create/position` | `group-create-position-screen.tsx` | ✅ Restylé (créneaux verrouillés/disponible, score gardé) |
| 4. Membres | `/group/create/members` | `group-create-members-screen.tsx` | ✅ Nouveau |
| 5. Récap | `/group/create/review` | `group-create-review-screen.tsx` | ✅ Étendu (frais dérivés de `calculateCollectionFee`) |

Nouveaux composants : `amount-slider.tsx` (aucun slider n'existait avant
dans le repo), `step-progress-bar.tsx` (barre segmentée, remplace le texte
brut "Etap X sou Y" utilisé partout ailleurs jusqu'ici).

`group-forming-screen.tsx` (déjà construit) reste la conclusion du flow —
la confirmation de l'étape 5 y route directement. Sa liste `INVITEES`
alignée sur le même jeu de contacts que `group-create-members-screen.tsx`
(pas de state partagé entre routes — cohérent avec le reste de l'app, qui
n'a jamais fait de threading d'état inter-écrans, seulement des données
mock alignées).

⚠️ **Contrainte moncash-flow respectée explicitement** : l'étape position
ne montre aucun frais différencié par créneau (contrairement à la capture
de référence) car ce mécanisme n'existe pas dans le barème réel du skill
— l'inventer aurait violé sa Règle 6. Les frais du récapitulatif sont une
somme dérivée de la vraie formule, jamais une estimation locale.

⚠️ **Pas de framework de test automatisé dans ce repo** — vérification
faite par capture Playwright (méthode constante du projet), pas de suite
de tests unitaires/E2E branchée à `npm test`. Suggestions de tests futurs
documentées dans le plan de cette tâche si un framework est introduit plus
tard.

## 10. Backend réel — du mockup au produit branché (2026-07-18)

L'app tournait entièrement sur des tableaux mockés en dur. Elle est
maintenant branchée sur un projet Supabase existant, "Solid"
(`mlcjrjopbaddxwpxlyrf`), qui implémente le skill `moncash-flow` au
niveau base de données (triggers de transition d'état, RLS, calcul de
frais serveur) — travail découvert déjà fait, pas construit dans cette
tâche. Le travail de cette tâche a été le câblage frontend↔backend et
quelques ajouts de schéma ciblés.

### Ajouts de schéma (migrations, projet `mlcjrjopbaddxwpxlyrf`)

| Ajout | Rôle |
|---|---|
| `wallets` + `wallet_transactions` + `apply_wallet_transaction()` | Wallet interne. Écriture admin-only (service_role), même rigueur que `contributions`/`payouts`. Wallet créé automatiquement à l'inscription (trigger). |
| `membership_requests` | Support DB des deux sens d'entrée dans un sòl : "Mande antre" (membre s'auto-propose, organisatrice décide) et "Envite manm" (organisatrice invite, l'invité décide). Sur approbation, `assign_position()` + insert `memberships` automatiques (trigger). |
| `score_history` | Historique du `trust_score` dans le temps, alimenté au passage de cycle (trigger sur `groups.current_cycle`). |
| `assign_position()` + `position_assignment_policy` | Implémente enfin numériquement la règle "skò élevé → position précoce" (DESIGN.md §1), jusque-là seulement qualitative. Seuils en table de config, ajustables sans redéploiement. |
| `users.referral_code` | Code de parrainage fixe par utilisateur (généré à l'inscription), remplace un premier essai (`referrals.code` unique par ligne) qui empêchait plusieurs filleuls d'utiliser le même code. |
| `users.consent_signed_at` | Signé à l'étape `onboarding-verify-identity-screen.tsx`, qui contenait déjà le texte de consentement. |
| `protect_user_privileged_columns_on_insert` | Corrige une faille trouvée pendant le câblage : la RLS `users_insert_self` n'empêchait pas un nouvel utilisateur de s'auto-attribuer `role=admin`/`trust_score=100` dès l'inscription (le trigger existant ne protégeait que les `UPDATE`, pas les `INSERT`). |

### Écrans câblés sur données réelles (remplacement des mocks)

`/card`, les 5 `/group/create/*`, `/group/forming`, `/group/invite`,
`/group`, `/payment-hub` (+ wallet, history, eligibility, method),
`/stocks/cycle` (+ buy, review), `/payment-status`, `/account`,
`/stocks/score`, `/refer`, `/account/documents`, plus l'onboarding
email/code/name/zip/verify-identity (vraie auth + création du profil).
Écrans **non touchés** (hors périmètre du plan validé) :
`notifications-screen.tsx` et `security-privacy-screen.tsx` restent des
toggles locaux non persistés — aucune table de préférences n'a été
créée.

### Limites connues, explicitement signalées

- **MonCash simulé** — `/api/moncash/simulate-payment` reproduit le
  séquencement Règle 0 (webhook brut → idempotency_key → transitions
  d'état) mais ne parle à aucune vraie API MonCash (pas de credentials
  marchand disponibles ici).
- **Auth email OTP, pas SMS** — aucun fournisseur télécom configuré.
- **`SUPABASE_SERVICE_ROLE_KEY` non fournie** — les outils MCP
  n'exposent jamais cette clé secrète par conception. `.env.local` a un
  champ vide à remplir manuellement (Supabase Dashboard > Project
  Settings > API) avant que les routes `/api/wallet/transfer-to-moncash`
  et `/api/moncash/simulate-payment` puissent écrire en local.
- **Pas de routing par id partout** — l'app n'avait jamais de routes
  dynamiques (`/group/[id]`). Plutôt que refondre toute la navigation,
  `/group` et `/group/forming` acceptent un `?id=` en paramètre de
  requête (léger, cohérent avec le reste de l'app qui utilise déjà des
  query params pour l'état, ex. `/payment-status?state=`).
- **Parrainage à sens unique** — `/refer` affiche et partage un vrai
  code, mais rien ne consomme un code entré par un nouvel utilisateur
  (aucun champ de saisie de code n'existe dans l'onboarding). La table
  `referrals` reste vide tant que cette étape n'est pas ajoutée.
- **`notifications-screen.tsx`/`security-privacy-screen.tsx`** restent
  mockés (hors périmètre du plan validé pour cette tâche).

### Ajouts — verrouillage wallet par PIN + refonte OTP/wallet

- **`users.wallet_pin_hash`** + RPC `set_wallet_pin`/`verify_wallet_pin`/
  `has_wallet_pin` (hash `pgcrypto`/`crypt`, jamais le PIN en clair).
  `/pin/setup` crée/écrase le PIN (création + confirmation à deux
  étapes) ; `/pin` (`confirm-pin-screen.tsx`) vérifie le PIN existant et
  redirige vers `?redirect=`. `useWalletLockGuard` (dans
  `src/lib/use-wallet-lock-guard.ts`) protège `/payment-hub/wallet`,
  `/payment-hub/wallet/deposit` et `/payment-hub/wallet/transfer` :
  si l'utilisateur a un PIN configuré et n'a pas déverrouillé le wallet
  cette session (`sessionStorage`, `src/lib/wallet-lock.ts`), il est
  redirigé vers `/pin`. Si aucun PIN n'existe encore, l'accès reste
  libre (pas de blocage forcé à la création de compte).
- **`wallet-detail-screen.tsx`** refondu selon la référence utilisateur
  (carte solde + 3 actions rapides Ajoute/Voye/Kòd PIN + liste
  "Paramèt Wallet" : Info, Sekirite/PIN, Istorik).
- **`home-screen.tsx`** : la carte solde reste la carte "Cash Balance"
  d'origine (titre + montant + deux boutons), simplement alimentée par
  le vrai solde du wallet — le remplacement par `ConnectedAccountsCard`
  fait dans une itération précédente a été annulé sur demande explicite.
- **`onboarding-code-screen.tsx`** refondu : 6 cases de saisie
  individuelles (longueur réelle d'un OTP email Supabase, pas 4 comme
  dans la référence visuelle fournie — Supabase ne permet pas de
  raccourcir ce code), clavier numérique à l'écran (plus de clavier
  natif), minuteur de renvoi en compte à rebours. La case à cocher
  « Remember Me » de la référence n'a pas été portée : l'app n'a pas de
  concept de session « dont on se souvient » distinct (Supabase persiste
  déjà la session via cookies), donc l'ajouter aurait été un contrôle
  décoratif sans effet réel.
