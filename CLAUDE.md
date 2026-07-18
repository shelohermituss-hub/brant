# CLAUDE.md — Règles du projet (reproduction pixel-perfect + reskin)

## Contexte du projet
Ce projet se construit en deux phases :
1. **Phase 1 (app 1 / référence visuelle)** : reproduction fidèle d'une
   application à partir de screenshots (`./design-refs/`). Elle définit
   LE design system : c'est le look de référence.
2. **Phase 2 (app 2 / reskin)** : reconstruction des écrans et
   fonctionnalités d'une deuxième application (`./app-cible/`) en
   utilisant EXCLUSIVEMENT le design system de la phase 1.

Ne jamais confondre les deux sources :
- `design-refs/` = comment ça doit RESSEMBLER (style, couleurs, composants)
- `app-cible/`  = ce que ça doit FAIRE (écrans, fonctionnalités, parcours)

## Stack imposée
- Next.js 15+ (App Router, `src/` directory), TypeScript strict
- Tailwind CSS avec tokens personnalisés (variables CSS dans globals.css)
- shadcn/ui pour les composants à comportement (Dialog, Select, Tabs,
  Toast, Form...) — TOUJOURS rethémés avec les tokens du projet.
  Le style par défaut de shadcn ne doit jamais apparaître.
- Composants visuels spécifiques : sur mesure en Tailwind.
- Icônes : lucide-react (ou SVG recréés à la main). Jamais générées par IA.
- Aucune autre librairie UI (pas de MUI, AntD, Chakra...).

## Structure du projet
```
src/
  app/                  # routes (App Router)
  components/
    ui/                 # composants de base réutilisables
    layout/             # header, tab bar, navbar, footer...
    sections/           # sections spécifiques aux pages
  lib/                  # utilitaires, données mock, contextes
  styles/
design-refs/            # screenshots app 1 — référence STYLE (ne pas modifier)
app-cible/              # screenshots app 2 — référence FONCTIONNEL (ne pas modifier)
INVENTAIRE.md           # phase 1 : écrans/composants + statuts ⬜🟡✅
FONCTIONNEL.md          # phase 2 : analyse app 2, mapping, statuts ⬜🟡✅
ASSETS-A-REMPLACER.md   # visuels générés/placeholder à remplacer par les originaux
```

## Workflow obligatoire
1. Extraire les valeurs exactes avant de coder — jamais d'approximation.
   Si une valeur est incertaine sur un screenshot, choisir la valeur
   standard la plus proche (échelle 4/8px).
2. Un composant / un écran à la fois. JAMAIS tous les écrans d'un coup.
3. Après chaque écran : comparer côte à côte avec le screenshot de
   référence, lister TOUS les écarts, les corriger avant de continuer.
4. Mettre à jour le fichier de suivi (INVENTAIRE.md ou FONCTIONNEL.md)
   après chaque étape.
5. `npm run build` doit passer avant tout commit. Commit git après
   chaque écran validé, message clair en français.
6. Travailler sur des branches dédiées (ex : app2-reskin). Ne jamais
   merger sans validation explicite de l'utilisateur.

## Règles visuelles
- Aucune couleur, taille ou espacement en dur dans les composants :
  tout passe par les tokens.
- Polices chargées via next/font (google ou local).
- next/image pour toutes les images.
- Responsive mobile-first : vérifier 375 / 768 / 1440px.
- Chaque composant couvre tous ses états visibles : hover, actif,
  disabled, focus, vide, erreur.

## Règles phase 2 (reskin)
- De l'app 2 : prendre structure, fonctionnalités, parcours, textes.
- De l'app 2 : IGNORER couleurs, polices, styles, ombres, icônes.
- Test : chaque nouvel écran doit sembler être un écran de plus de
  l'app 1, pas un écran de l'app 2 recoloré.
- Ne pas modifier les tokens ni les composants validés de la phase 1 ;
  ajout de variantes autorisé UNIQUEMENT après accord de l'utilisateur.
  Après toute extension d'un composant partagé, vérifier que les écrans
  existants qui l'utilisent sont visuellement inchangés.

## Visuels générés (MCP Higgsfield)
- Photos/illustrations : générées via generate_image dans le style et
  la palette du design system.
- OBLIGATOIRE : validation groupée — lister tous les visuels nécessaires
  avec leur prompt, ratio exact et écran concerné, et attendre la
  validation de l'utilisateur AVANT toute génération (contrôle crédits).
- Maximum une regénération par visuel si le résultat est trop éloigné ;
  sinon noter dans ASSETS-A-REMPLACER.md et continuer.
- Le logo n'est JAMAIS généré : recadré depuis screenshot ou fourni
  par l'utilisateur.
- Outils utiles : remove_background, upscale_image.

## SKILLS INSTALLÉS — PÉRIMÈTRE D'UTILISATION
Deux skills sont disponibles : ui-ux-pro-max et emil-design-eng.

### ui-ux-pro-max — mode AUDIT uniquement
- INTERDIT d'utiliser ses suggestions de palettes, styles ou typographies :
  le design system de ce projet vient des screenshots (design-refs/)
  et il est FIGÉ. Aucune recommandation de style ne doit le modifier.
- AUTORISÉ et encouragé pour : audits d'accessibilité (contrastes,
  focus, ARIA, tailles de zones tactiles), détection d'états manquants
  (loading, vide, erreur), vérification des breakpoints responsive,
  et guidelines UX de structure (ordre des éléments, navigation).
- Usage type : après chaque écran validé visuellement, lancer un audit
  UX/accessibilité et corriger ce qui ne contredit pas le design.

### emil-design-eng — animations et micro-interactions
- Les screenshots ne montrent pas le mouvement : ce skill définit
  comment le projet doit bouger. Applique ses règles à toutes les
  transitions : modals, dropdowns, toasts, hover, changements de page.
- Respecter ses principes : animations < 300ms, easing personnalisé,
  ne pas animer les actions à haute fréquence.
- Les animations ne doivent JAMAIS modifier l'apparence statique
  des écrans (couleurs, tailles, positions au repos).

### Règle de conflit
En cas de contradiction entre un skill et les screenshots de référence :
les screenshots gagnent TOUJOURS. Les skills servent la qualité
d'exécution, pas la direction artistique.

## En cas de doute
- Info manquante dans les screenshots → POSER LA QUESTION à
  l'utilisateur, ne pas inventer.
- Rendre compte honnêtement : distinguer ce qui a été réellement testé
  (build, lint, tests au clic) de ce qui a seulement été écrit.
