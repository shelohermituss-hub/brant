# TONTINE_FLOW_REFERENCE.md
## Structure fonctionnelle des écrans sòl — à styler en langage Cash App

> Ce document décrit UNIQUEMENT la structure, les champs et les flows.
> Aucune terminologie, couleur ou typo d'aucune marque n'est reprise ici.
> Toute logique métier (montants, devise, position) suit DESIGN.md et
> .claude/skills/moncash-flow/SKILL.md de ce projet — pas les valeurs
> d'un template externe.

---

## 1. Accueil — carte de groupe

Une carte par sòl auquel l'utilisateur appartient ou qu'il organise.
Champs affichés :
- Montant du pot (HTG)
- Cotisation mensuelle (HTG)
- Position de l'utilisateur dans le cycle (ex. "pozisyon 7 sou 10")
- Statut du groupe : en formation / actif / complet
- Si c'est le mois de l'utilisateur : mise en avant visuelle forte
- État vide illustré si aucun groupe : invite à en créer un ou attendre une invitation

## 2. Rejoindre / Créer un sòl — flow en étapes

Étape 1 — Montant du pot souhaité (curseur ou choix de palier, bornes en HTG).
Étape 2 — Cotisation mensuelle dérivée selon la durée du cycle choisie.
Étape 3 — Position dans le cycle : **déterminée par le score de fiabilité de
l'utilisateur, pas par un choix libre.** Nouveaux membres → positions
tardives. Score élevé → accès aux positions précoces. L'écran explique
cette règle, il ne propose pas d'options à choisir librement.
Étape 4 — Récapitulatif : montant, cotisation, position, engagement de
prélèvement récurrent, bouton de confirmation qui déclenche l'entrée
réelle dans le groupe (pas juste visuelle).

## 3. Détail de groupe — le wonn

Déjà spécifié en détail ailleurs dans ce projet (composant signature,
cercle des 10 positions, bénéficiaire du mois mis en évidence, statuts
colorés par membre). À styler avec les codes visuels Cash App (typographie
du montant, épaisseur des cartes) mais la structure du composant reste
celle déjà définie — ne pas la réinventer.

## 4. Moyen de versement / cotisation

Liste de méthodes de paiement disponibles, MonCash comme option
principale et par défaut. Pas de méthodes hors du contexte haïtien
(pas de cartes bancaires, pas de réseaux cash non pertinents).

## 5. Hub paiement

Écran central : état "rien dû ce mois-ci" quand applicable, accès à :
Éligibilité, Historique, Paramètres de paiement, Aide. Grille ou liste
d'entrées, chacune menant à un sous-écran dédié.

## 6. Éligibilité

Checklist de ce qui est requis avant de pouvoir recevoir un pot :
identité vérifiée (CIN), moyen de versement confirmé, consentement signé.
Tout élément à connotation réglementaire (assurance, clause spécifique)
est marqué `[A VALIDER - BRH]`, jamais inventé.

## 7. Historique

Deux catégories distinctes : cotisations versées / pots reçus. Chaque
ligne a un statut visuel (payé / en attente / échoué) et une référence
de transaction affichée. Pas de fusion des deux catégories dans une seule
liste indifférenciée.

## 8. Profil

Identité de l'utilisateur, palier/catégorie de compte (aligné sur les
catégories marchand Bronze/Silver/Gold du skill moncash-flow si pertinent
à afficher), langue (Kreyòl par défaut/Français), sécurité, parrainage.

## 9. Documents

CIN, preuve de revenu si applicable au flow d'éligibilité. Pas de types
de documents sans rapport avec le contexte haïtien.

## 10. Parrainage

Flow en 3 étapes courtes, code personnel copiable, montant de récompense
en HTG, suivi simple des invitations envoyées/converties.

---

## Écrans sans équivalent dans aucun template — à concevoir neuf

Ces écrans n'existent dans aucune référence externe (Dart, Cash App ou
autre) parce qu'ils découlent spécifiquement du modèle fermé sur
invitation de Sòlid :

- **Accepter/refuser une invitation reçue** — distinct de "rejoindre un
  flow financier" : d'abord voir l'invitation et le groupe, puis décider,
  puis seulement si accepté entrer dans le flow de l'étape 2.
- **Groupe en formation** — état d'attente avant que le cycle ne démarre,
  tant que tous les membres invités n'ont pas confirmé.
- **États de paiement distincts** — échoué et en attente doivent être
  visuellement et fonctionnellement différents d'un paiement réussi,
  avec un chemin de résolution clair pour chacun.
- **Fin de cycle** — moment de célébration quand les 10 mois sont
  complétés, lié au score de fiabilité.

Ces quatre écrans doivent être dessinés en étendant le langage visuel du
reste de l'app (Cash App comme base stylistique), pas empruntés d'un
template, puisqu'aucun n'en a de version transposable.
