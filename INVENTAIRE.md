# INVENTAIRE.md — Analyse visuelle (Phase 1 : app 1 / référence Cash App)

Source : `design-refs/` (27 captures dézippées depuis les 3 archives +
1 PNG fournis : `Cash_App_UI_2023_Community/`, `Cash_App_UI_Clone_FREE_Fintech/`,
`Cash_App_UI_Clone_FREE_Fintech_1/`, `Cash_App_iOS_17.png`).

Chaque capture a été regardée individuellement. Certaines captures sont des
**états différents du même écran** (vide/rempli, scrollé/non scrollé) plutôt
que des écrans distincts — c'est précisé dans chaque fiche.

⚠️ Note : la capture `Cash_App_UI_2023_Community/Home.png` porte un bandeau
d'attribution "Cash App · curated by Mobbin" en bas — ce bandeau ne fait
PAS partie de l'app et ne doit jamais être reproduit.

## 0. Source complémentaire — kit de composants réel (prioritaire sur le sampling pixel)

Deux archives supplémentaires ajoutées en cours de construction :
`design-refs/Cash_App_UI_2023_Community_extra1/` (doublons des captures déjà
inventoriées ci-dessus, rien de nouveau) et surtout
`design-refs/Cash_App_UI_2023_Community_extra2/` — un export Figma isolé des
composants, icônes, couleurs et typo réels de l'app. **Ces fichiers priment
sur toute couleur échantillonnée au pixel dans les captures d'écran** (JPEG/
compression pouvaient légèrement fausser le sampling).

Contenu exploité (voir `src/app/globals.css` pour les valeurs intégrées) :
- `Frame 56.png` : rampe de gris exacte (7 paliers, `#F5F5F5` → `#343434`).
- `Frame 59.png` : rampe de verts exacte — **3 verts distincts** :
  `#01D651` (chips/accents), `#01C248` (boutons CTA pleins), `#00B743`
  (fond plein écran, ex. Pay) — plus violet `#8420F4` et cyan `#05D7F7`
  confirmés exacts.
- `Button.png` : bouton pill primaire (vert `#01C248`, texte blanc bold) et
  secondaire (fond gris-100 `#F5F5F5`, texte ink).
- `Chip.png` : pastilles primaire/secondaire/outline avec/sans chevron —
  utilisées par ex. dans le sélecteur "Cash / Gift Card / Stock" de l'écran
  Pay (E2) et "Change Order Type" des sheets d'achat.
- `Checkbox.png` : coché (vert) / non coché (bordure gris-300 `#DADADA`).
- `container.png` : spécimen typographique — confirme l'échelle Apple HIG
  (Large Title/Title 1/2/3/Headline/Body/Callout/Subhead/Footnote/Caption)
  et confirme visuellement le choix de police (grotesk géométrique à
  g simple-étage, cohérent avec DM Sans).
- `Nav bar.png` : la 1ʳᵉ icône de la tab bar n'est PAS une maison mais une
  icône banque/temple (lucide `Landmark`) — corrigé dans `BottomTabBar`.
- `Icon/*.png` : formes exactes de Card, Chevron, Cross, FAQ, Gift, History,
  Notifications, Pay ($), Save (même icône Landmark), Scan, Search, User,
  arrow — à utiliser pour vérifier/affiner le mapping lucide-react écran
  par écran plutôt que d'improviser.
- `Keyboard.png` : confirme le clavier numérique custom "plain" (pas de
  boîtes, chiffres gris, chevron-left pour effacer) déjà implémenté dans
  `NumericKeypad`.
- `Sheet/Amount.png` : structure exacte du bottom sheet d'achat/dépôt
  (poignée, titre, sous-titre, chip "Change Order Type", grille de 6
  montants gris-100 arrondis, CTA pill pleine largeur) — référence directe
  pour C1/F3.
- `News card.png`, `Search input.png`, `List item/User.png`,
  `Profile pic.png` : références directes pour les écrans Stocks (F1) et
  Pay — destinataire (E2) à venir.

---

## 1. Liste des écrans identifiés (23 écrans logiques, 27 captures)

### A. Onboarding (7 écrans)
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| A1 | Saisie email | `Fintech/Frame 39.png` | vide, avec bouton "Use Phone" |
| A2 | Code de confirmation email | `Fintech/Frame 37.png`, `Frame 36.png` | vide / rempli (554-115) |
| A3 | Nom (prénom/nom) | `Fintech/Frame 44.png` | vide |
| A4 | Code postal (ZIP) | `Fintech/Frame 41.png` | vide, CTA désactivé |
| A5 | Choix du $Cashtag | `Fintech/Frame 43.png`, `Frame 42.png` | vide / suggestion pré-remplie ($JudySmith) |
| A6 | Intro vérification Bitcoin | `Fintech/Frame 38.png` | statique (gate avant achat/envoi crypto) |
| A7 | Vérification d'identité (ID + selfie) | `Fintech/Frame 35.png` | statique |

### B. Accueil / Argent (2 états d'un même écran)
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| B1 | Home — Money | `Cash_App_iOS_17.png` (vide) et `2023_Community/Home.png` (peuplé) | $0.00 nouveau compte / $88.44 avec Savings, Bitcoin, Stocks, Free tax filing |

### C. Ajouter de l'argent (Add Cash) — 3 écrans
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| C1 | Add Cash — sheet montants rapides | `2023_Community/Add cash.png` | statique, fond Home assombri derrière |
| C2 | Add Cash — clavier numérique plein écran | `2023_Community/Deposit amount.png` | $0, CTA "Add" désactivé |
| C3 | Add Cash — confirmation succès | `2023_Community/Success.png` | "+$50" + upsell "Get Started" direct deposit |

### D. Sécurité PIN — 1 écran
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| D1 | Confirmer le Cash PIN | `2023_Community/Enter PIN.png` | 4 points vides, clavier numérique neutre |

### E. Envoyer / Payer (Pay) — 2 écrans
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| E1 | Pay — saisie montant (clavier vert plein écran) | `2023_Community/Pay amount.png` | $10, sélecteur USD, boutons Request/Pay |
| E2 | Pay — détails destinataire | `2023_Community/Payment details.png` | champ To/For, Send as (Cash/Gift Card/Stock), liste "Suggested" avec contact sélectionné |

### F. Stocks / Investir — 4 écrans
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| F1 | Stocks — accueil | `2023_Community/Stocks 1/2.png`, `Stocks 2/2.png` | haut de page (hero + recherche + cards) / bas scrollé (news, catégories, most traded) |
| F2 | Détail d'une action (Meta) | `2023_Community/Stock details.png` | graphique 1D + sélecteur de plage, actions Buy/Follow/Gift, news |
| F3 | Buy Stock — sheet montants rapides | `2023_Community/Buy stock.png` | "Buy Meta", Change Order Type, fond détail assombri |
| F4 | Buy Stock — récapitulatif commande programmée | `Fintech/Frame 45.png` | "Buy $10 of Amazon", détail ordre, CTA "Schedule" |

### G. Compte / Réglages (Your Account) — 5 écrans
| # | Écran | Fichier(s) source | État(s) capturé(s) |
|---|---|---|---|
| G1 | Your Account — profil + menu (haut) | `Fintech_1/Frame 31.png` | avatar, Edit Profile, Invite friends, début liste réglages |
| G2 | Your Account — menu (scrollé) | `Fintech_1/Frame 30.png` | Favorites, Family, Limits, Notifications, Documents, Support, Sign Out, footer réseaux sociaux |
| G3 | Account & Settings — articles d'aide | `Fintech_1/Frame 27.png` | liste de liens (Security & Privacy, Cashtags, FDIC...) |
| G4 | Security & Privacy | `Fintech_1/Frame 29.png` | toggle Security Lock, checkboxes Move money/Unlock app, liste devices |
| G5 | Notifications | `Fintech_1/Frame 28.png` | checkboxes push/SMS/email, sections Cash Team/Square Offers/Stock/Bitcoin |

**Total : 23 écrans logiques uniques, couverts par 27 captures.**

---

## 2. Composants récurrents identifiés

### Navigation / structure
- **Status bar iOS** (9:41, réseau, wifi, batterie) — chrome système, non reproduit comme composant applicatif.
- **Bottom tab bar** (5 icônes) : Home, Card/Cash Card, $ Pay, Search, Historique (horloge). Fond blanc, icônes outline grises, indicateur home iOS en bas.
- **Header de page** : soit `Titre + avatar rond` (Money/Stocks), soit `< retour + titre centré + X fermer` (flows secondaires), soit `X fermer` seul (bottom sheets pleine page).
- **Bottom sheet modal** : coins arrondis en haut, petite poignée ("drag handle") centrée, fond de l'écran parent assombri/flouté derrière.

### Boutons & CTA
- **Bouton pill plein largeur** (Add, Cash Out, Continue, Next, Schedule, Verify identity, Pay/Request en duo) — coins totalement arrondis, état désactivé = texte clair/pâle sur fond de couleur, état activé = texte blanc plein contraste.
- **Boutons pill groupés horizontalement** (Buy/Follow/Gift ; Cash/Gift Card/Stock) — largeur auto, fond coloré plein.
- **Bouton texte simple** (Change Cash PIN, Change Order Type, View all, Sign Out en rouge).

### Cards & listes
- **Card blanche arrondie sur fond gris clair (#F5F5F5 environ)** — pattern répété pour Cash Balance, Savings, Bitcoin, Stocks, Free tax filing.
- **Grille 2 colonnes de cards** (Savings/Bitcoin/Stocks/Tax filing) avec titre + chevron ou valeur + illustration.
- **Liste de réglages style iOS** : icône dans pastille + label + chevron `>`, séparateurs fins gris clair, groupée par section avec en-tête gris (SECURITY, ACCOUNT & SETTINGS...).
- **Card résultat stock** : logo carré arrondi (fond marque) + mini sparkline en superposition.
- **Card actualité (news)** : avatar rond de la source + titre en 2 lignes.
- **Card catégorie colorée** : fond dégradé/plein coloré + icône blanche + label — Banking & Finance, Business Services.
- **Ligne contact suggéré** : avatar rond coloré (photo ou initiale) + nom + $cashtag + icône silhouette à droite, checkbox ronde à gauche.

### Formulaires & saisie
- **Champ texte simple** : label au-dessus (gris), valeur/placeholder en dessous, pas de bordure visible, soulignement implicite par le curseur.
- **Clavier numérique neutre** (PIN, ZIP, montants Add Cash/Buy) : fond gris clair, touches blanches arrondies.
- **Clavier montant plein écran vert** (écran Pay) : chiffres géants blancs sur fond vert, clavier numérique transparent superposé.
- **Clavier alphabétique iOS natif** (email, nom, cashtag) — clavier système, non un composant custom.
- **Checkbox ronde** : vide (bordure grise) / cochée (fond vert plein + check blanc).
- **Toggle pill "On/Off"** (Security Lock).
- **Barre de recherche arrondie** fond gris clair, icône loupe + placeholder (écran Stocks).

### Graphiques
- **Mini sparkline** (ligne fine colorée) sur les cards Bitcoin/Stocks du Home et sur les cards résultats de stock.
- **Grand graphique interactif** (Stock Detail) : courbe épaisse, sélecteur de plage temporelle (1D/1W/1M/1Y/ALL) en pills.

---

## 3. États visibles par écran

- **Home** : état vide (compte neuf, $0.00) vs état peuplé (soldes réels, mini-graphes) — les deux doivent être supportés par le composant.
- **Champs de formulaire (email, ZIP, cashtag, code)** : vide avec placeholder grisé vs rempli avec valeur.
- **CTA pill (Next/Continue/Add)** : désactivé (texte pâle, non cliquable) vs activé (texte blanc, cliquable) selon le remplissage du formulaire.
- **Checkbox** (Security & Privacy, Notifications) : cochée / non cochée.
- **Cashtag** : champ vide vs suggestion pré-remplie automatique.
- **Bottom sheet ouvert** : écran parent visible en arrière-plan assombri (Add Cash, Buy stock) — implique un état "derrière modal" à prévoir pour Home et Stock Detail.
- **Pas d'état d'erreur, de chargement ni de liste vide visible dans les captures fournies** → à signaler comme information manquante (voir section 5).

---

## 4. Visuels identifiés (logo, icônes, illustrations, photos)

### Logo
- **Logo Cash App** ($ blanc dans carré vert arrondi) : visible UNIQUEMENT dans le bandeau d'attribution Mobbin (hors app, à ignorer). **Aucune capture ne montre le logo dans l'app elle-même.** → à traiter en étape 3 (recadrage) seulement si un usage réel est requis ; sinon demander le fichier original.

### Illustrations flat/3D à régénérer (MCP Higgsfield, style à valider)
1. Pile de pièces Bitcoin bleues 3D (card "Buy bitcoin", Home vide) — carré, fond gris clair.
2. Vagues dégradées violettes (card "Invest in stocks", Home vide) — carré, fond gris clair.
3. Liasse de documents/billets jaunes (card "Free tax filing", Home vide + peuplé) — carré, fond gris clair.
4. Billet de banque animé avec étincelles vertes (écran Success — upsell direct deposit) — rectangulaire, fond blanc.

### Logos de marques tierces (contenu mocké, PAS générés par IA — à charger comme SVG de marque si disponibles, sinon placeholder neutre signalé)
- Nike (swoosh sur fond noir)
- General Electric (monogramme GE bleu)
- Coca-Cola (script rouge)
- Walmart (spark orange)
- Meta (logo infini bleu)
- MarketWatch ("MW" rond noir, avatar source news)
- Média façon CNBC/NBC (logo paon coloré, avatar source news)

### Icônes (mappage lucide-react à faire en étape 3, liste exhaustive)
Home (tab), carte (tab), $ (tab), recherche/loupe (tab), horloge/historique (tab), cloche (notifications), chevron `>`, flèche retour `<`, croix `X` (fermer), bouclier + cadenas (vérification identité), bouclier + check (vérification Bitcoin), roue/coffre stylisé vert (icône Savings), flèche haut/bas empilées (Limits), personne silhouette (Personal), groupe de silhouettes (Family), maillons de chaîne (Linked Banks), point d'interrogation cercle (Support), feuille/document (Documents, articles d'aide), étoile (Favorites), plus dans cercle vert (Invite friends), grille 2×2 (icône scan/QR "Your Account"), flèche d'export/upload (partage profil), Twitter/X bird, Instagram (carré appareil photo), coche verte (checkbox cochée), retour clavier `⌫`.

---

## 5. Informations manquantes / à valider avec l'utilisateur

1. **Logo Cash App** : aucune capture propre isolée dans l'app — uniquement visible dans le bandeau Mobbin. Faut-il le recadrer depuis ce bandeau, ou fournir le fichier original ?
2. **États manquants non couverts par les captures** : erreurs de formulaire, listes vides (ex. aucune transaction), écrans de chargement, mode sombre. Faut-il les concevoir par déduction (cohérence avec le reste) ou les laisser de côté pour l'instant ?
3. **Logos de marques tierces (Nike, GE, Coca-Cola, Walmart, Meta...)** utilisés dans les cards Stocks : sources SVG officielles à fournir, ou reproduction approximative acceptée à partir des captures ?
4. **Écran de démarrage / launch / login initial** (avant "Enter your email") non présent dans les captures — l'onboarding commence-t-il bien à l'écran email, ou un écran de bienvenue/splash est-il attendu ?
5. **Responsive tablette/desktop** : les captures sont toutes au format mobile (393×852 ou équivalent). Le reskin devra-t-il aussi couvrir des breakpoints desktop, ou rester mobile-first strict comme les références ?

---

## 6. Suivi de production (à mettre à jour à chaque écran)

| Écran | Statut |
|---|---|
| A1 Saisie email | ⬜ |
| A2 Code confirmation email | ⬜ |
| A3 Nom | ⬜ |
| A4 ZIP Code | ⬜ |
| A5 Choix $Cashtag | ⬜ |
| A6 Intro vérification Bitcoin | ⬜ |
| A7 Vérification identité | ⬜ |
| B1 Home (vide/peuplé) | ✅ |
| C1 Add Cash — sheet montants | ✅ |
| C2 Add Cash — clavier | ✅ |
| C3 Add Cash — succès | ✅ |
| D1 Confirmer Cash PIN | ✅ |
| E1 Pay — montant | ⬜ |
| E2 Pay — destinataire | ⬜ |
| F1 Stocks — accueil | ⬜ |
| F2 Détail action (Meta) | ⬜ |
| F3 Buy Stock — sheet montants | ⬜ |
| F4 Buy Stock — récapitulatif | ⬜ |
| G1 Your Account — profil | ⬜ |
| G2 Your Account — menu | ⬜ |
| G3 Account & Settings — aide | ⬜ |
| G4 Security & Privacy | ⬜ |
| G5 Notifications | ⬜ |

⬜ à faire · 🟡 en cours · ✅ validé

---

**En attente de validation avant de passer à l'étape 2 (extraction du design system : couleurs, typographie, espacements, tokens).**
