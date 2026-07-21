# QUALITE-AUDIT.md — Audit bugs de robustesse + accessibilité de Sòlid

Audit mené via 3 agents de reconnaissance en lecture seule sur
l'ensemble du repo (inventaire routes/docs, cohérence design/tokens,
bugs fonctionnels), suivi d'une vérification manuelle du code source
pour chaque finding retenu comme HIGH avant correctif. Complémentaire à
`ANIMATIONS-AUDIT.md` (motion) et au round de corrections précédent
(routes/boutons cassés) — ce document couvre ce qui restait : erreurs
réseau/RPC avalées et couverture `focus-visible`/`disabled`.

## Statut d'implémentation : ✅ HIGH traité, MEDIUM/LOW en backlog documenté

Les 3 findings HIGH et les fondations B/C sont corrigés sur
`claude/install-ce-skills-jiyxal` (voir historique git pour les hashs).
Le reste (MEDIUM/LOW ci-dessous) est volontairement laissé en backlog
— voir "Hors scope de cette passe" en fin de document pour la
justification, findings par findings.

## Résumé

`npm run build`, `npm run lint` et `tsc --noEmit` passent tous sans
erreur ; zéro `console.log`/`TODO`/`FIXME` dans `src/` ; aucune fuite
mémoire ou race condition (le pattern `cancelled` dans les `useEffect`
async est appliqué de façon cohérente partout). Les vrais problèmes ne
sont pas des crashs ou des erreurs de build, mais des **échecs
silencieux** : sur ~42 appels Supabase (`.from()`/`.rpc()`) dans les
écrans, une trentaine ignorent l'`error` retourné et affichent un état
vide/par défaut au lieu d'un message — dont trois avec un vrai impact
utilisateur (sécurité du wallet, appartenance à un groupe, montant
affiché avant paiement). Côté accessibilité, l'infrastructure de focus
existe déjà et fonctionne bien sur `button.tsx`/`pill-button.tsx`
(`focus-visible:ring-3 focus-visible:ring-ring/50`), mais n'était
appliquée que là — 4 primitives réutilisées dans presque tous les
écrans (`chip.tsx`, `checkbox-row.tsx`, `settings-list-row.tsx`,
`numeric-keypad.tsx`) n'avaient aucun style de focus clavier.

## Findings HIGH — corrigés

| # | Fichier | Constat | Correctif appliqué |
|---|---|---|---|
| H1 | `src/lib/use-wallet-lock-guard.ts` | Le RPC `has_wallet_pin` ne vérifiait que `data` ; sur erreur réseau/RPC, `data` est `undefined` et le hook **déverrouillait le wallet** (`setNoPinConfirmed(true)`) au lieu de bloquer l'accès — fail-open sur un contrôle de sécurité. | `error` capturé ; sur `error \|\| data` truthy, redirection vers `/pin` (verrouillé), jamais de déverrouillage silencieux. |
| H2 | `src/components/sections/group-create-review-screen.tsx` | L'insert `memberships` après création du groupe n'était pas vérifié : en cas d'échec, le groupe existait mais l'organisateur n'était jamais réellement ajouté comme membre, sans aucun message. | Erreur vérifiée : navigation bloquée + message d'erreur si l'insert `memberships` échoue. L'insert `membership_requests` (invitations) reste non bloquant mais son erreur est désormais surfacée via un avertissement sur l'écran suivant (`group-forming-screen.tsx`, param `inviteWarning`). |
| H3 | `src/components/sections/cycle-payment-review-screen.tsx` | Le RPC `calculate_collection_fee` ignorait son `error` ; en cas d'échec, `collectionFee` retombait silencieusement à `0` et l'utilisateur voyait "Frè kolèkt : 0 HTG" juste avant un vrai paiement MonCash. | Erreur capturée dans un état `feeError` ; message d'erreur affiché et bouton "Konfime" désactivé si le calcul de frais échoue, plutôt que d'afficher un montant faux. |

## Fondations transverses — corrigées (cascade sur tout l'app)

| # | Fichier | Constat | Correctif |
|---|---|---|---|
| B1 | `src/components/ui/chip.tsx` | Aucun style `focus-visible` ; `disabled` accepté via `ButtonHTMLAttributes` mais jamais stylé (bouton grisé absent). | `focus-visible:ring-2 focus-visible:ring-ring/50` + `disabled:opacity-50 disabled:pointer-events-none`, même token que `button.tsx`. |
| B2 | `src/components/ui/checkbox-row.tsx` | Bouton de case à cocher sans anneau de focus clavier. | `focus-visible:ring-2 focus-visible:ring-ring/50` ajouté. |
| B3 | `src/components/ui/settings-list-row.tsx` | Ligne de réglages (utilisée dans `account-screen.tsx`, `group-forming-screen.tsx`, etc.) sans focus clavier visible. | `focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset` (inset pour rester dans les bords de la ligne pleine largeur). |
| B4 | `src/components/ui/numeric-keypad.tsx` | Clavier numérique (paiements, PIN) sans focus clavier visible sur les touches. | `focus-visible:ring-2 focus-visible:ring-ring/50` ajouté à chaque touche. |
| C1 | `src/app/globals.css` + `src/components/ui/sheet.tsx` | Le scrim modal du sheet utilisait `bg-black/40` en dur au lieu d'un token, alors que c'est le seul vrai pattern de scrim répété de l'app. | Nouveau token `--color-overlay-scrim` (même valeur, `rgb(0 0 0 / 40%)`), utilisé via `bg-overlay-scrim`. Aucun changement visuel. |

## Findings MEDIUM (backlog, non corrigés dans cette passe)

| # | Catégorie | Constat |
|---|---|---|
| M1 | Erreurs Supabase avalées | ~28 requêtes `.from()`/`.rpc()` restantes n'exposent jamais `error` à l'UI : `history-screen.tsx:73,84,90`, `card-screen.tsx:54,86,94,108` (dont le RPC `assign_position` dans une boucle), `search-screen.tsx:35,41,47`, `group-detail-screen.tsx:57,63,69,78`, `group-invite-screen.tsx:68-73`, `group-forming-screen.tsx`. Impact réel mais faible sévérité (état vide au lieu d'un message) — corriger les ~15 écrans concernés en une seule passe romprait la règle CLAUDE.md "un écran à la fois". |
| M2 | `use-current-app-user.ts` | Ne distingue pas "non connecté" (comportement voulu, chaque écran gère déjà son état vide) de "erreur réseau sur `auth.getUser()`" — les deux retombent sur le même état `profile: null`. Actuellement sans conséquence grave car chaque écran gère déjà gracieusement l'état non-connecté (voir commentaire dans le fichier), donc pas de correctif forcé ici. |
| M3 | `use-wallet-lock-guard.ts` (résiduel) | Suite à H1 : si l'utilisateur n'a réellement aucun PIN configuré ET que le RPC échoue en même temps (double échec, rare), il atterrit sur l'écran de vérification de PIN plutôt que sur la création — non bloquant (bouton "Fèmen" présent) mais pas idéal. |

## Findings LOW (backlog, non corrigés)

| # | Constat |
|---|---|
| L1 | `account-screen.tsx:131` utilise `bg-black/30` (overlay de chargement sur l'avatar) — opacité différente du scrim modal (`/40`), usage localisé distinct ; pas unifié sous `--color-overlay-scrim` pour ne pas changer son apparence actuelle. |
| L2 | Spacer `w-[22px]` répété dans `group-forming-screen.tsx`, `wallet-detail-screen.tsx`, `group-detail-screen.tsx` — cosmétique, candidat à un futur token d'espacement d'icône. |
| L3 | `src/components/ui/group-card.tsx` n'est jamais lui-même le focus target (toujours enveloppé par un `Link`/bouton appelant) — pas de correctif de focus direct nécessaire, mais dépend de chaque appelant pour son `aria-label`. |

## Ce qui fonctionne déjà et ne doit pas être touché

- `npm run build` / `npm run lint` / `tsc --noEmit` : verts.
- `button.tsx` / `pill-button.tsx` : focus, disabled, et durées déjà exemplaires — modèle réutilisé tel quel pour B1-B4.
- Pattern `cancelled` dans tous les `useEffect` async : aucune race condition trouvée.
- Zéro `console.log`/`TODO` résiduel dans `src/`.

## Hors scope de cette passe

- **M1** (erreurs read-only avalées sur ~15 écrans) : gap réel documenté ci-dessus, volume trop large pour une seule passe sans enfreindre la règle "un écran à la fois" de CLAUDE.md.
- **Plafond de montant** sur `wallet-deposit-amount-screen.tsx` : aucune limite MonCash réelle n'est documentée dans `DESIGN.md` ni le skill `moncash-flow` — en inventer une violerait la règle "ne pas inventer, poser la question". Question ouverte pour l'utilisateur, pas un bug.
- **`add-cash-amount-screen.tsx`** (validation de montant absente) : appartient au flow `/add-cash`, déjà identifié comme orphelin lors de l'audit routes/boutons précédent (superseded par le vrai flow wallet). Le sort de cet écran n'est pas encore tranché.
