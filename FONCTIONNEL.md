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
| Suppression `pay.png` ($) | ✅ | Remplacé par l'icône lucide `ArrowLeftRight` dans la tab bar. |
| Purge vocabulaire Cash App | ✅ | Voir §1-10 ci-dessous pour le détail écran par écran. Étape bitcoin/cashtag de l'onboarding : bitcoin retiré (zéro transposition), cashtag → "non itilizatè". |
| `DESIGN.md` déposé (racine) | ✅ | §3 remplacé par les tokens réels du repo + cartographie sémantique. |
| `.claude/skills/moncash-flow/SKILL.md` déposé | ✅ | Verbatim, non modifié. |

## 1. Correspondance écran par écran (`TONTINE_FLOW_REFERENCE.md` §1-10)

| § | Écran sòl | Traitement | Composants réutilisés |
|---|---|---|---|
| 1 | Accueil — carte de groupe | ✅ Neuf, composé | `GroupCard` (neuf, `SurfaceCard`+`Chip`), `home-screen.tsx` reconstruit |
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
