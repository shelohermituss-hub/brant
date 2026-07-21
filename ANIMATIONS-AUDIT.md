# ANIMATIONS-AUDIT.md — Audit motion/fluidité de Sòlid

Audit read-only (aucun code applicatif modifié) mené via le skill
`improve-animations`, sur toute la surface interactive de l'app :
1 passe de reconnaissance + 3 passes d'audit en parallèle (feedback
tactile/physicalité/performance, transitions de page/listes/cohésion,
loading states/toasts/accessibilité), puis vétting par relecture directe
du code cité pour chaque finding à sévérité HIGH.

## Statut d'implémentation : ✅ tout traité

Les 4 fondations (F1-F4) et les 21 findings (7 HIGH, 9 MEDIUM, 5 LOW)
ont tous été implémentés, sur `claude/install-ce-skills-jiyxal` :

- `34a269d` — F1-F4 : tokens de durée, transition de page, skeletons,
  nettoyage transition-all
- `c37f6f9` — HIGH-4/5/6/7, MEDIUM-6 : feedback tactile keypad/tab bar,
  célébration animée, crossfade d'onglet
- `527866a` — MEDIUM-3 : stagger sur les listes restantes
- `8457740` — MEDIUM-4/5/8 : sheet (durée, easing, vrai slide, reduced-motion)
- `d404080` — MEDIUM-7/9 : feedback tactile card-screen, tick countdown
- `16c45a9` — LOW-1/2/5 : échelles de press-feedback, icône cashtag

LOW-4 (gating `@media (hover: hover)`) ne demandait aucune action
immédiate (voir la ligne correspondante ci-dessous) — à surveiller si un
futur `hover:scale`/`hover:translate` est introduit.

Build et lint vérifiés verts après chaque commit ; le sheet et le
carrousel d'onboarding ont en plus été vérifiés visuellement (Playwright).

## Résumé

L'infrastructure de base existe et fonctionne bien là où elle est
utilisée : les tokens d'easing `--ease-out`/`--ease-in-out`
(`src/app/globals.css`), le keyframe `.stagger-item` (fade+translateY
étagé), et le composant `PillButton` (`active:scale-[0.97]`, 150ms)
respectent exactement les règles cibles. Le problème n'est pas la
qualité de ce qui existe, c'est sa **couverture** : ces patterns ne
sont appliqués qu'à une minorité des écrans et composants. Le plus gros
écart avec un "feel" natif est **l'absence totale de transition entre
les pages** — chaque navigation Next.js (tap sur un onglet, une carte,
un bouton "Kontinye") est un hard swap instantané, du splash jusqu'au
dernier écran de paiement. Aucune librairie d'animation n'est installée
(`framer-motion`/`motion`/`react-spring` absents) — rien dans cet audit
ne justifie d'en ajouter une, tous les correctifs proposés restent dans
le pattern CSS/Tailwind + Base UI déjà en place.

## Fondations transverses à poser en premier

Plusieurs findings individuels ci-dessous en dépendent — les traiter
avant le reste évite de corriger la même chose deux fois.

| # | Fondation | Pourquoi en premier |
|---|---|---|
| F1 | **Tokens de durée nommés** dans `globals.css` (ex. `--duration-tap: 150ms`, `--duration-ui: 200ms`, `--duration-modal: 300ms`) | Aujourd'hui seuls `--ease-out`/`--ease-in-out` sont des tokens ; les durées sont hardcodées (`duration-150`, `duration-200`) de façon incohérente — le sheet utilise 150ms sur l'overlay et 200ms sur le panneau pour un seul et même geste (voir MEDIUM-4). |
| F2 | **Wrapper de transition de page** (route change) | Aucun `template.tsx`, aucune transition nulle part dans `src/app`. Changement à plus fort effet de levier pour le "feel natif" : touche chaque navigation de l'app en une seule fois (voir HIGH-1). |
| F3 | **Composant skeleton/loading partagé** | 14 fichiers utilisent le texte brut `"Chajman..."` sans aucune animation. Un seul composant réutilisable règle les 14 en une fois plutôt que 14 correctifs isolés (voir HIGH-2). |
| F4 | **Nettoyage systématique des `transition-all`** | 3 sites confirmés, tous corrigibles par le même geste (lister les propriétés explicites) : `button.tsx:7`, `switch.tsx:19`, `onboarding-splash-screen.tsx:78` (voir HIGH-3). |

## Findings vérifiés

### HIGH — casse le "feel", à traiter en priorité

| # | Fichier(s) | Constat | Recommandation |
|---|---|---|---|
| HIGH-1 | `src/app/layout.tsx`, aucun `template.tsx`/`loading.tsx`/`error.tsx` sous `src/app` | Zéro transition de page/route dans toute l'app — confirmé en lisant `layout.tsx` et plusieurs `page.tsx` (home, card, group). Chaque navigation est un DOM swap instantané. | Ajouter un wrapper de transition (fade+translateY léger, `--ease-out`, ~200ms) autour de `{children}` dans `layout.tsx`, ou un `template.tsx` par groupe de routes. Fondation F2. |
| HIGH-2 | 12+ fichiers : `card-screen.tsx:208`, `history-screen.tsx:161,178`, `wallet-detail-screen.tsx:150`, `group-invite-screen.tsx:89`, `group-create-members-screen.tsx:91`, `refer-screen.tsx:100`, `group-forming-screen.tsx:96`, `cycle-payment-review-screen.tsx:88`, `group-detail-screen.tsx:130`, `score-detail-screen.tsx:130`, `cycle-detail-screen.tsx:83` | Pattern systémique : `"Chajman..."` texte brut remplacé par le vrai contenu via une ternaire nue, sans aucune transition — un hard-cut répété sur presque tout écran qui charge des données. | Construire un composant skeleton partagé (silhouettes grises pulsantes, `animate-pulse` ou variante custom) + envelopper le switch loading→contenu d'un fade `opacity` (`--ease-out`, 150-200ms) au lieu de la ternaire nue. Fondation F3. |
| HIGH-3 | `src/components/ui/button.tsx:7`, `src/components/ui/switch.tsx:19`, `src/components/sections/onboarding-splash-screen.tsx:78` | `transition-all` sur les 3 sites (toujours un finding : anime des propriétés non désirées hors GPU). Le 3ème est une double violation : `onboarding-splash-screen.tsx:78` anime aussi `width` (`w-6`↔`w-2`, propriété de layout) via `transition-all duration-200`. | Remplacer par des listes de propriétés explicites (`transition-[background-color,transform]` etc.). Pour les dots du carrousel, remplacer le changement de `width` par un `scale-x` sur un élément à largeur fixe, ou driver via `transform: scaleX()` — jamais `width`. Fondation F4. |
| HIGH-4 | `src/components/ui/numeric-keypad.tsx:45-59` | Le bouton chiffre/décimal/backspace n'a **aucune** classe `active:` — zéro feedback tactile sur le contrôle de saisie de paiement le plus utilisé de l'app. | Ajouter `active:scale-[0.95] transition-transform duration-100 ease-[var(--ease-out)]` sur chaque touche (garder <300ms — c'est une action à haute fréquence, rester sobre). |
| HIGH-5 | `src/components/layout/bottom-tab-bar.tsx:31` | `<Link key={href} href={href} className="p-2">` — la navigation principale de l'app n'a aucun feedback tactile (seul un toggle d'opacité distingue l'onglet actif, pas de retour au tap). | Ajouter `active:scale-[0.9] transition-transform duration-150 ease-[var(--ease-out)]` sur chaque `Link`. |
| HIGH-6 | `src/components/sections/add-cash-success-screen.tsx:21-23,35,41-42`, `src/components/ui/soley-burst.tsx:1-28` | L'écran de célébration "Felisitasyon! Ou fini yon sik konplè" (le moment le plus rare/émotionnel de l'app — finir un cycle complet de sòl) est rendu aussi statiquement qu'un dépôt de routine. `SoleyBurst` (12 rayons, nommé pour du mouvement) est un SVG 100% statique — aucune classe d'animation, alors que le pattern `.stagger-item`/`--stagger-index` existe déjà dans le codebase et s'y prêterait directement (12 rayons = 12 items à étager). | Étager l'apparition des 12 `<line>` en reveal radial (scale+opacity, delay `i*30ms` type `--stagger-index`) + scale-in sur le badge check (voir MEDIUM-6). Réservé aux moments rares — budget de délice explicitement autorisé par la règle "Purpose & frequency". |
| HIGH-7 | `src/components/sections/card-screen.tsx:148-150,199-241` | Le switch d'onglet Aktif/Fini re-filtre la liste et re-rend via ternaire : les items sortants sont démontés instantanément (React unmount, pas de sortie animée) pendant que seuls les items entrants ont l'entrée `.stagger-item` — téléportation asymétrique, surtout visible car les deux onglets ont des ensembles disjoints. | Envelopper le switch dans une transition de groupe cohérente (ex. `AnimatePresence`-like en CSS via un court fade global sur le conteneur pendant le switch, ou conserver les deux listes montées et crossfader). Dépend de F1/F2 pour la cohérence des durées. |

### MEDIUM — perceptible, incohérent avec le reste de l'app

| # | Fichier(s) | Constat | Recommandation |
|---|---|---|---|
| MEDIUM-1 | `src/components/sections/wallet-detail-screen.tsx:156` | Liste de transactions financières (le contenu le plus consulté — historique d'argent) rendue sans `.stagger-item`, contrairement aux écrans soeurs (card-screen, history-screen). | Ajouter `className="stagger-item" style={{ "--stagger-index": index }}` sur chaque ligne, comme dans `history-screen.tsx:45`. |
| MEDIUM-2 | `src/components/sections/group-create-members-screen.tsx:97` | Liste de contacts à inviter (milieu du flow de création de sòl) sans stagger — rupture de cohérence en pleine séquence d'onboarding. | Même correctif que MEDIUM-1. |
| MEDIUM-3 | 9 sites : `refer-screen.tsx:106`, `group-forming-screen.tsx:135`, `group-invite-screen.tsx:154`, `group-create-review-screen.tsx:146`, `score-detail-screen.tsx:138,145,155`, `cycle-payment-review-screen.tsx:125,134`, `src/components/ui/wonn-avatar-route.tsx:35` | Listes/rangées supplémentaires sans aucune classe d'animation. | Même correctif que MEDIUM-1, en priorisant les écrans les plus visités (score, review) sur les rares (refer). |
| MEDIUM-4 | `src/components/ui/sheet.tsx:31` (`duration-150`) vs `:63` (`duration-200`) | L'overlay et le panneau du sheet sont perçus comme un seul geste d'ouverture/fermeture mais utilisent deux durées différentes hardcodées. En plus, la ligne 63 utilise `ease-in-out` Tailwind brut (cubic-bezier(0.4,0,0.2,1)) plutôt que le token `--ease-in-out` du projet, alors que la règle demande `ease-out` pour une entrée/sortie (pas `ease-in-out`, réservé au mouvement sur écran). | Unifier les deux sur une seule durée (token F1) et passer à `ease-[var(--ease-out)]` pour l'entrée/sortie du panneau. |
| MEDIUM-5 | Couverture `prefers-reduced-motion` : 1 seule règle dans tout `src/` (`globals.css:203-209`, ne couvre que `.stagger-item`) sur ~19 déclarations animées répertoriées à travers 13 fichiers | Le sheet (translate jusqu'à 2.5rem sur chaque ouverture de modal) et le switch (translate du thumb) ignorent entièrement la préférence utilisateur ; la règle demande "moins et plus doux", pas "zéro ailleurs". | Ajouter un override `prefers-reduced-motion` sur `sheet.tsx` (garder l'opacité, retirer le translate) et sur `switch.tsx`, une fois F1 en place pour factoriser. |
| MEDIUM-6 | `src/components/sections/add-cash-success-screen.tsx:21-23`, `src/components/sections/wallet-transfer-success-screen.tsx:36-38` | Badges de succès (checkmark vert) sur les confirmations de mouvement d'argent réel (dépôt, transfert) rendus 100% statiques — aucun scale-in malgré le budget de délice autorisé pour les moments occasionnels/émotionnels. | `scale-in` (from `scale(0.9)` + `opacity:0`, jamais `scale(0)`) + `ease-[var(--ease-out)]` ~200ms au montage. |
| MEDIUM-7 | `src/components/sections/card-screen.tsx:157-163` (bouton créer sòl), `:164-172` (avatar compte), `:212-217` (carte de groupe entière) | Plusieurs cibles tapables sans aucun feedback tactile — seule la carte de groupe a une animation (entrée `.stagger-item`), pas de `active:`. | Ajouter `active:scale-[0.97] transition-transform duration-150 ease-[var(--ease-out)]` sur les trois. |
| MEDIUM-8 | `src/components/ui/sheet.tsx:63` (`translate-y-[2.5rem]` etc., décalage fixe) | Le sheet slide avec un décalage fixe de 2.5rem (40px) + fade, pas un vrai slide en pourcentage (`translateY(100%)`) — se lit comme "fade + petit décalage" plutôt qu'un vrai panneau qui glisse depuis hors-écran. | Remplacer par `translate-y-full`/pourcentage réel pour que le panneau parte vraiment de hors-champ. |
| MEDIUM-9 | `src/components/ui/payment-countdown.tsx:59-61` | Les chiffres du compte à rebours (jours/heures/min/sec) sont remplacés par du texte brut à chaque tick de seconde, sans transition. | Optionnel/discret : un `transition-opacity` très court (80-100ms) sur le changement de valeur suffit — rester sobre, c'est une action à très haute fréquence (chaque seconde), ne jamais sur-animer ici. |

### LOW — polish

| # | Fichier(s) | Constat | Recommandation |
|---|---|---|---|
| LOW-1 | `src/components/ui/checkbox-row.tsx:31` | `active:scale-[0.9]` — plus fort que la fourchette recommandée (0.95-0.98). | Remonter à `scale-[0.95]`. |
| LOW-2 | `src/components/ui/settings-list-row.tsx:45`, `src/components/sections/history-screen.tsx:45` | `active:scale-[0.99]` — probablement imperceptible. | Descendre à `scale-[0.97]` pour un feedback réellement perçu. |
| LOW-3 | `src/components/ui/switch.tsx:26` | `transition-transform` sans classe de durée explicite — retombe sur la valeur par défaut de Tailwind, rompt la convention du reste de l'app (toujours une durée explicite). | Ajouter `duration-150` (ou le token F1 équivalent). |
| LOW-4 | Aucun hit `@media (hover: hover)` dans tout `src/` | Absence de gating hover — risque faible aujourd'hui (seuls 6 usages `hover:`, tous couleur, confinés à `button.tsx` qui n'est consommé que par le bouton de fermeture du sheet) mais deviendrait un problème dès qu'un `hover:scale`/`hover:translate` serait ajouté. | Pas d'action immédiate requise ; à surveiller si de nouveaux `hover:` transform sont introduits. |
| LOW-5 | `src/components/sections/onboarding-cashtag-screen.tsx:94` | L'icône de résultat (Check/X) de disponibilité du username apparaît sans transition, juste après le seul spinner (`Loader2`, ligne 92) de toute l'app — un moment de premier contact (onboarding) qui rate le payoff. | `scale-in` léger + fade, ~150ms. |

## Opportunités manquées (additif, pas correctif)

- **Célébration de fin de cycle** (HIGH-6) — le moment de fidélité le plus fort de l'app, actuellement sans aucun budget de délice alors que le pattern pour le construire (stagger radial) existe déjà dans le codebase.
- **Continuité spatiale liste → détail** — taper une `GroupCard` (`card-screen.tsx:212-217`) mène à l'écran de groupe sans aucune transition qui explique "d'où vient" l'écran (dépend de F2, transition de page).
- **Badges de succès sur mouvement d'argent réel** (MEDIUM-6) — premier retour visuel après un dépôt/transfert MonCash, actuellement sans aucun pop d'entrée.

## Ce qui fonctionne déjà — à ne pas toucher

- `src/components/ui/pill-button.tsx:47` — `active:scale-[0.97]`, `duration-150`, `ease-[var(--ease-out)]` : exactement dans la fourchette cible (0.95-0.98, 100-160ms). Exemplaire à imiter pour tous les correctifs de feedback tactile ci-dessus.
- `src/components/sections/card-screen.tsx:181,191` (tab pills Aktif/Fini) — même pattern, propre.
- `src/app/globals.css:187-201` (`.stagger-item`/`@keyframes stagger-fade-in`) — le pattern de stagger lui-même est correct (30-80ms via `--stagger-index`, `prefers-reduced-motion` géré) ; le problème est uniquement sa faible couverture (voir MEDIUM-1/2/3).
- `src/components/sections/onboarding-splash-screen.tsx` (carrousel) — le swipe natif (`scroll-snap` + `scrollTo smooth`) reste le meilleur exemple de motion "natif" de l'app, malgré le finding HIGH-3 sur les dots.

## Suite

Ceci est un audit — aucun code n'a été modifié. Prochaine étape naturelle :
choisir les findings à traiter en premier (les 4 fondations F1-F4 sont
recommandées comme point de départ, puisque plusieurs HIGH/MEDIUM en
dépendent), puis les implémenter écran par écran en suivant le workflow
habituel du projet (un composant à la fois, build+lint avant chaque
commit).
