# DESIGN.md — Sòlid (base visuelle : langage Cash App)

> **CE FICHIER EST LA LOI.** Toute décision visuelle ou métier du projet
> dérive d'ici. En cas de conflit avec un template externe, une référence
> dans references/, ou une habitude de génération : DESIGN.md gagne.

---

## 1. Contexte produit (obligatoire à chaque session)

Sòlid digitalise le **sòl** haïtien : tontine de **5 à 25 personnes**
(taille variable par groupe, plus fixée à 10), cotisation mensuelle fixe,
pot versé chaque mois à un membre différent selon un ordre de position
fixé au lancement du groupe et immuable ensuite. Durée du cycle = nombre
de membres (un versement par membre par mois). Modèle à **double entrée** :
un membre peut être invité directement, OU découvrir et demander à
rejoindre un cercle existant sans invitation — mais dans les deux cas,
l'entrée n'est jamais automatique : elle attend toujours l'**approbation
du propriétaire** du cercle. Jamais un marketplace où l'on rejoint
instantanément sans validation humaine. *(Mis à jour le 2026-07-18 —
règle précédente : taille fixe de 10, fermé sur invitation uniquement.)*

Utilisatrice de référence : Fabiola, 47 ans, commerçante à Port-au-Prince,
Android d'entrée de gamme, connexion 3G instable, créole comme langue
principale. **Si Fabiola hésite plus de 3 secondes devant un écran,
l'écran a échoué.**

## 2. Base stylistique : langage visuel inspiré de Cash App

Ce qu'on retient de Cash App et pourquoi (structure, jamais la marque) :
- **Montant géant, hiérarchie brutale** : un chiffre domine chaque écran
  transactionnel, tout le reste est secondaire.
- **Peu de boutons, peu de choix par écran** : une action principale claire.
- **Cartes de fonctionnalité en grille** sur l'accueil (adapté : cartes de
  groupe sòl, pas de trading/Bitcoin).
- **Densité faible, respiration généreuse** entre les blocs.

Ce qu'on NE reprend PAS : le vert de marque, le symbole `$`, le
vocabulaire ("Cash Balance", "Add Cash", "Cash Out"), toute fonctionnalité
sans rapport (Bitcoin, actions, déclaration fiscale).

## 3. Tokens (source réelle : `src/app/globals.css`, bloc `@theme inline`)

Le repo contenait déjà, avant ce document, un design system complet et
cohérent issu de la reconstruction pixel-perfect Cash App (23 écrans
construits et validés). Conformément à la clause de repli de ce fichier
("documenter les tokens déjà en place plutôt que d'en imposer d'autres"),
**ce sont ces tokens qui font foi** — le bloc bleu/Bricolage-Grotesque
initialement envisagé pour ce document est abandonné.

```css
/* Gris (échelle 100 → 700) */
--color-gray-100: #f5f5f5;
--color-gray-200: #e5e5e5;
--color-gray-300: #dadada;
--color-gray-400: #c0c0c0;
--color-gray-500: #9d9d9d;
--color-gray-600: #686868;
--color-gray-700: #343434;

/* Neutres sémantiques */
--color-ink: var(--color-gray-700);
--color-ink-secondary: var(--color-gray-500);
--color-surface: #ffffff;
--color-surface-muted: var(--color-gray-100);
--color-border: var(--color-gray-200);
--color-border-strong: var(--color-gray-300);
--color-placeholder: var(--color-gray-400);

/* Marque */
--color-green: #01c248;
--color-green-bright: #01d651;
--color-green-deep: #00b743;
--color-blue: #2d65db;
--color-purple: #8420f4;
--color-orange: #ee9d44;
--color-cyan: #05d7f7;
--color-red: #e5504f;

/* Statuts (nouveaux, dérivés de la palette existante — pas de teinte inventée) */
--color-paid: var(--color-green);
--color-wait: var(--color-orange);
--color-late: var(--color-red);

/* Soley — halo du bénéficiaire du mois sur le wonn (§5). Seule couleur
   réellement nouvelle : aucune teinte existante ne porte ce sens (distinct
   des couleurs de statut, qui décrivent un paiement, pas une célébration). */
--color-soley: #f5b840;

/* Rayons (échelle 4/8px) */
--radius-sm: 0.5rem;
--radius-md: 1rem;
--radius-lg: 1.5rem;
--radius-xl: 2rem;
--radius-full: 9999px;

/* Typographie — nomenclature Apple HIG (kit Figma de référence) */
--text-large-title: 2.125rem; /* 34px */
--text-title-1: 1.75rem;      /* 28px */
--text-title-2: 1.375rem;     /* 22px */
--text-title-3: 1.25rem;      /* 20px */
--text-headline: 1.0625rem;   /* 17px */
--text-body: 1.0625rem;       /* 17px */
--text-callout: 1rem;         /* 16px */
--text-subhead: 0.9375rem;    /* 15px */
--text-footnote: 0.8125rem;   /* 13px */
--text-caption: 0.75rem;      /* 12px */
```

Police : DM Sans (`next/font/google`), pas de Bricolage Grotesque ni
Public Sans — la police du repo existant est conservée telle quelle.

### 3.1 Cartographie sémantique (audit du code existant, 23 écrans)

- **`--color-green` = couleur d'action primaire, confirmée sans ambiguïté.**
  Tous les boutons d'action principale (`PillButton variant="primary"`),
  les états cochés/sélectionnés, les icônes de confirmation et les liens
  d'action textuels l'utilisent de façon cohérente sur l'ensemble des
  écrans. C'est le token pointé par `--color-primary` — plus aucune
  incertitude à son sujet.
- **`--color-green-bright`** : accent secondaire (pastilles `Chip`, montant
  mis en avant dans le clavier numérique). Jamais utilisé pour une action —
  distinct de `--color-green`. La variante de `Chip` qui l'utilisait
  s'appelait à tort `"primary"` (même nom que la variante primaire de
  `PillButton`, qui elle utilise `--color-green`) ; elle a été renommée
  `"accent"` pour lever cette ambiguïté de vocabulaire.
- **`--color-green-deep`** : couleur de **surface plein-bleed** uniquement
  (fonds d'écran pleine page). Jamais en texte ni en icône.
- **`--color-blue`, `--color-purple`, `--color-orange`, `--color-cyan`** :
  **couleurs libres/décoratives, pas des tokens sémantiques.** L'audit du
  code montre un usage non unifié — par exemple le violet sert tantôt
  d'accent d'écran (Stocks), tantôt de teinte d'avatar arbitraire, tantôt
  de couleur de sparkline — sans règle commune. Elles restent disponibles
  pour de la distinction visuelle libre (avatars, data-viz, accents
  ponctuels) mais ne doivent jamais porter de signification de statut.
- **`--color-red`** : usage destructif (ex. "Sign Out" / déconnexion).
  Cohérent avec son rôle mais peu éprouvé (usage rare dans l'existant) —
  à traiter comme une convention à confirmer en pratique, pas comme un
  fait établi.
- **`--color-paid` / `--color-wait` / `--color-late`** : tokens de statut
  de paiement, absents de l'app d'origine (Cash App n'a jamais eu besoin
  de distinguer payé/en attente/en retard). Introduits pour Sòlid en
  réutilisant les teintes déjà validées (`green`/`orange`/`red`) plutôt
  qu'en inventant une nouvelle palette.

## 4. Sémantique et interdits (inchangés dans leur principe)

- Une seule couleur d'action pleine par écran.
- Cartes : bordure + `shadow-card`, jamais l'un sans l'autre.
- Statuts vert/ambre/rouge = langage de statut uniquement (`--color-paid`/
  `--color-wait`/`--color-late`) — jamais réutilisés comme couleur d'accent
  libre, à l'inverse de bleu/violet/orange/cyan qui restent décoratifs.
- Créole par défaut, français en option. Vocabulaire stable : sòl,
  kotizasyon, pot, manm, manman sòl, wonn, sik.
- Aucun composant décoratif type Aceternity. Cibles tactiles ≥ 52px.
- Chaque écran a son état vide et son état d'erreur.
- Jamais de couleur/typo/marque copiée d'un template de référence
  (Cash App, Dart, ou autre) — structure uniquement.
- Le symbole `$` n'apparaît nulle part, y compris dans les icônes.

## 5. Le wonn — composant signature

**Depuis le 2026-07-18, ce n'est plus un cercle.** `WonnPath`
(`src/components/ui/wonn-path.tsx`) représente le wonn comme une
**route serpentine à N nœuds** (N = taille du cercle, 5 à 25 — voir §1) :
chaque nœud = une main (le tour d'un membre), disposés en grille
4 colonnes qui serpente ligne par ligne, reliés par un tracé — vert pour
le trajet déjà parcouru, gris pointillé pour ce qui reste. Nœuds colorés
par statut (`--color-paid/wait/late`, gris pour à venir), bénéficiaire du
mois en `soley` avec halo, plus grand que les autres. Montant du pot +
nom du bénéficiaire en légende au-dessus de la route (plus au centre —
il n'y a plus de centre). Repères "Kòmanse"/"Fini" au premier et dernier
nœud. Même API que l'ancien composant (`members`/`beneficiaryPosition`/
`potAmount`/`beneficiaryName`) — accepte nativement N variable, plus de
dette technique sur ce point. Ne jamais le remplacer par une liste ou un
composant de librairie.

## 6. Références structurelles

Voir `references/TONTINE_FLOW_REFERENCE.md` pour la structure fonctionnelle
des écrans sòl (issue de l'analyse Dart, réécrite sans marque).

## 7. Réglementaire

Toute mention légale/bancaire est marquée `[A VALIDER - BRH]`, jamais
inventée ni supprimée silencieusement.

## 8. Écrans dérivés du système Cash App reconstruit

Le repo réutilise le langage visuel des 23 écrans Cash App déjà construits
(voir `INVENTAIRE.md`) comme base stylistique de Sòlid, selon la table de
correspondance validée (voir `FONCTIONNEL.md` une fois produit). Les
cartes de la zone "Stocks" (accueil investissement) sont repurposées en
trois cartes tontine :
- **Pwochen sik** — prochain cycle disponible, barre de progression du
  cycle en cours (remplace le graphique boursier, sans équivalent).
- **Kredi/Skò** — aperçu du score de fiabilité, historique par sik
  complété (pas une continuité quotidienne façon cours de bourse).
- **Envite** — raccourci vers le parrainage.

Les logos de marques tierces (Nike, Coca-Cola, Walmart, GE), les news
financières et la liste "Most Traded" n'ont aucune transposition possible
et sont supprimés sans reformulation.
