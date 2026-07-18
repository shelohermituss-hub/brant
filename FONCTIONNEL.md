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
| 3 | Détail de groupe — le wonn | ✅ Neuf | `WonnCircle` (composant signature DESIGN.md §5, neuf), `group-detail-screen.tsx` — route `/group` |
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
| Groupe en formation | ✅ | `group-forming-screen.tsx` — `WonnCircle` sans bénéficiaire + liste `SettingsListRow` des invités (confirmé/en attente) |
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

⚠️ **Dette non traitée dans cette passe** (signalée, pas résolue) :
`WonnCircle` (détail de groupe, groupe en formation) reste codé pour une
taille fixe et n'a pas encore été généralisé à N variable — voir
DESIGN.md §5. Les données mock de `group-create-*` (flow Rejoindre/Créer)
et `eligibility-screen.tsx` ("Pozisyon aksesib : 4–10") supposent aussi
encore un cercle à 10 membres fixes.
