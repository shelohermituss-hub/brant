# PROMPT MAÎTRE — Workflow complet en 2 phases
# (colle chaque phase dans Claude Code au bon moment ; CLAUDE.md doit
#  être à la racine du projet)

═══════════════════════════════════════════════════════════════════
PHASE 1 — REPRODUIRE L'APP 1 DEPUIS SCREENSHOTS (référence visuelle)
═══════════════════════════════════════════════════════════════════

Le ZIP ./template.zip contient UNIQUEMENT des screenshots de l'application
à reproduire. Reproduis-la EXACTEMENT en Next.js : mêmes composants, mêmes
couleurs, mêmes espacements, visuels au plus proche. Zéro interprétation
créative, zéro approximation. Lis CLAUDE.md avant de commencer.

## ÉTAPE 1 — ANALYSE VISUELLE (obligatoire avant tout code)
1. Dézippe template.zip dans ./design-refs/ et regarde CHAQUE screenshot
   attentivement, un par un.
2. Produis INVENTAIRE.md : liste des écrans, composants récurrents
   (navbar, boutons, cards, inputs, modals...), états visibles, et
   liste de TOUS les visuels (photos, illustrations, logo, icônes).
3. Attends ma validation.

## ÉTAPE 2 — EXTRACTION VISUELLE DU DESIGN SYSTEM
1. Analyse les screenshots : couleurs exactes (échantillonne les zones
   unies), famille de police probable (compare Inter, Poppins, DM Sans,
   Roboto, Montserrat... et propose ton diagnostic), échelle
   d'espacements, border-radius, ombres, breakpoints.
2. Configure tout en tokens (variables CSS + Tailwind) AVANT de coder.
3. Valeur incertaine → valeur standard la plus proche (échelle 4/8px).

## ÉTAPE 3 — STRATÉGIE PAR TYPE D'ASSET
### Icônes
- Identifie le pack d'origine probable (Feather/Heroicons/Material...)
  et utilise l'équivalent lucide-react. Sinon recrée le SVG à la main.
- INTERDIT de générer des icônes avec l'IA.
### Logo
- NE PAS le générer. Recadre-le depuis le screenshot le plus net,
  sauvegarde dans /public/logos/, note dans ASSETS-A-REMPLACER.md
  qu'il devra être remplacé par l'original.
### Images / Photos / Illustrations — MCP Higgsfield
1. Pour chaque visuel : analyse sujet, style, ambiance, couleurs,
   ratio exact ; rédige un prompt de génération détaillé.
2. VALIDATION GROUPÉE : liste-moi TOUS les visuels avec leur prompt
   prévu et attends ma validation AVANT de générer (contrôle crédits).
3. Après validation : generate_image → /public/images/ → next/image.
4. Résultat trop éloigné → UNE seule regénération, puis note dans
   ASSETS-A-REMPLACER.md et continue.
- Outils : remove_background (détourage), upscale_image (grands formats).
### Polices
- next/font/google si disponible, sinon demande-moi les fichiers
  (next/font/local).

## ÉTAPE 4 — COMPOSANTS (stratégie shadcn/ui)
1. npx shadcn@latest init, puis configure IMMÉDIATEMENT les variables
   CSS du thème avec les valeurs de l'étape 2. Le thème par défaut de
   shadcn ne doit JAMAIS apparaître.
2. shadcn pour les composants à comportement : Dialog, Dropdown, Select,
   Tabs, Toast, Tooltip, Sheet, Form, Popover (add un par un).
3. Modifie chaque fichier shadcn dans src/components/ui/ pour coller
   EXACTEMENT au screenshot. Le code t'appartient.
4. Composants visuels spécifiques (hero, cards custom, navbar,
   sections) : de zéro en Tailwind.
5. Composant shadcn trop éloigné du design → recrée-le de zéro.
6. Chaque composant couvre tous ses états : hover, actif, disabled,
   focus, vide, erreur.

## ÉTAPE 5 — PAGES (une par une, JAMAIS tout d'un coup)
1. Composants de base partagés d'abord, validés.
2. Pages UNE PAR UNE dans src/app/, dans l'ordre d'INVENTAIRE.md.
3. Après CHAQUE page : dev server, capture, comparaison côte à côte
   avec le screenshot, liste de TOUS les écarts (couleurs, espacements,
   tailles, alignements, typo), correction complète AVANT la suivante.
4. INVENTAIRE.md à jour : ⬜ à faire / 🟡 en cours / ✅ validé.
5. Responsive : formats manquants déduits des conventions du design,
   validation demandée sur les choix ambigus. Vérifie 375/768/1440px.

## RÈGLES GLOBALES
- Next.js App Router + TypeScript strict + Tailwind + shadcn/ui,
  rien d'autre. Composants serveur par défaut.
- Aucune valeur en dur : tout passe par les tokens.
- npm run build doit passer avant tout commit. Commit après chaque
  page validée.
- Info manquante → POSE-MOI LA QUESTION, n'invente pas.
- Critère : côte à côte avec les screenshots, AUCUNE différence
  (hors visuels générés, listés dans ASSETS-A-REMPLACER.md).

Commence par l'étape 1 et montre-moi INVENTAIRE.md.

═══════════════════════════════════════════════════════════════════
PHASE 2 — TRANSPOSER L'APP 2 DANS LE DESIGN DE L'APP 1 (reskin)
═══════════════════════════════════════════════════════════════════
(à lancer une fois la phase 1 terminée et validée)

NOUVELLE MISSION. Le projet contient le design system et tous les écrans
de l'app 1, construits et validés. C'est notre LOOK de référence, il ne
bouge pas. Je te donne une DEUXIÈME application dans ./app-cible/
(screenshots) : elle m'intéresse pour son IDÉE, ses écrans et ses
fonctionnalités — PAS pour son apparence.

## OBJECTIF
Reconstruire les écrans et parcours de l'app 2 en utilisant EXCLUSIVEMENT
le design system existant : composants, couleurs, typo, espacements,
icônes déjà en place.

## ÉTAPE 0 — PRÉPARATION
1. Dépôt git propre + branche dédiée : git checkout -b app2-reskin.
2. Screenshots app 2 dans ./app-cible/, SÉPARÉ de ./design-refs/.
   design-refs/ = comment ça doit RESSEMBLER (app 1)
   app-cible/  = ce que ça doit FAIRE (app 2)
3. Audit du design system : catalogue des composants de
   src/components/ui/ et des tokens (servira au mapping).

## RÈGLE D'OR
- De l'app 2 : structure des écrans, fonctionnalités, parcours,
  hiérarchie de l'info, textes.
- De l'app 2, IGNORE totalement : couleurs, polices, styles de boutons,
  ombres, radius, style d'icônes.
- Test : chaque nouvel écran doit sembler être un écran de plus de
  l'app 1, pas un écran de l'app 2 recoloré.

## ÉTAPE 1 — ANALYSE FONCTIONNELLE
1. FONCTIONNEL.md : écrans + rôle, fonctionnalités par écran, parcours
   principal (A → B → C), éléments d'interface nécessaires par écran.
2. Attends ma validation.

## ÉTAPE 2 — MAPPING DESIGN (l'étape la plus importante)
On voit ici, AVANT tout code, comment chaque écran de l'app 2 sera
traduit dans le style de l'app 1 — corrections à moindre coût.
1. Chaque élément d'interface app 2 → composant existant du projet
   ("liste produits app 2 → Card existant", "onglets → Tabs existant").
2. Composants MANQUANTS listés ; chacun sera créé dans le style du
   design system — jamais en copiant le style de l'app 2.
3. Indique quels écrans de l'app 1 servent de modèle de mise en page
   pour les écrans de l'app 2.
4. Attends ma validation complète du mapping.

## ÉTAPE 3 — CONSTRUCTION
1. Composants manquants d'abord, dans le style app 1.
2. Écrans UN PAR UN selon FONCTIONNEL.md. Après chaque écran :
   a) FIDÉLITÉ FONCTIONNELLE : toutes les fonctions/infos de l'écran
      app 2 sont présentes.
   b) COHÉRENCE VISUELLE : 100% design system, aucune valeur hors
      tokens ; compare avec les écrans app 1 pour vérifier qu'il
      semble appartenir à la même application.
3. FONCTIONNEL.md à jour (⬜/🟡/✅), commit après chaque écran validé.

## VISUELS
- Nouveaux visuels nécessaires → MCP Higgsfield, MÊME style et MÊME
  palette que l'app 1. Validation groupée des prompts (écran concerné,
  ratio exact de la zone, rappel style/palette) AVANT génération.
- Icônes : uniquement le pack déjà utilisé dans le projet.
- ASSETS-A-REMPLACER.md à jour.

## RÈGLES
- Aucune modification des tokens ni des composants validés de l'app 1 ;
  variantes ajoutées UNIQUEMENT après mon accord. Après toute extension
  d'un composant partagé, vérifie que les pages app 1 qui l'utilisent
  sont visuellement inchangées.
- npm run build doit passer. Ne merge rien sans mon accord explicite.
- Info manquante → POSE-MOI LA QUESTION.
- Critère : les nouveaux écrans semblent avoir toujours fait partie de
  l'app 1, avec toutes les fonctionnalités de l'app 2.

Commence par l'étape 0, puis montre-moi FONCTIONNEL.md.

═══════════════════════════════════════════════════════════════════
PROMPTS DE SUIVI UTILES
═══════════════════════════════════════════════════════════════════

| Situation | Prompt |
|---|---|
| Revue finale exhaustive | "Fais la revue exhaustive écran par écran contre les screenshots, pour toutes les pages. Liste les écarts, corrige, coche dans le fichier de suivi, rapport final des corrections." |
| Écart visuel sur une page | "Compare la page X avec [screenshot] et liste tous les écarts (espacement, taille, couleur) puis corrige-les un par un." |
| Reprendre après pause | "Lis CLAUDE.md et les fichiers de suivi, dis-moi où on en est et continue." |
| Après extension d'un composant partagé | "Vérifie que les pages app 1 utilisant [composant] sont visuellement inchangées après tes modifications." |
| Générer les visuels validés | "Les prompts d'illustrations sont validés : génère-les avec Higgsfield, intègre-les, et mets à jour ASSETS-A-REMPLACER.md." |
