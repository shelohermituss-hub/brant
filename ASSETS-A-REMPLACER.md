# ASSETS-A-REMPLACER.md — Suivi des visuels générés/placeholder

Ce fichier liste tout visuel qui n'est pas l'original (recadré depuis un
screenshot en basse résolution, généré par IA, ou approximé) et qui devra
être remplacé par un fichier officiel fourni par l'utilisateur.

## Logo

| Écran d'origine | Fichier généré | Statut | Note |
|---|---|---|---|
| Bandeau d'attribution Mobbin (`design-refs/Cash_App_iOS_17.png`) | `public/logos/cash-app-logo.png` (62×62) + `cash-app-logo@2x.png` (256×256, upscale) | ⬜ Obsolète (Phase 1 uniquement) | Reste comme référence de reproduction pixel-perfect Phase 1, mais **retiré de l'écran splash Sòlid** (`onboarding-splash-screen.tsx`) — DESIGN.md interdit toute reproduction de la marque Cash App dans le produit reskiné. |
| Écran splash Sòlid (`onboarding-splash-screen.tsx`) | Wordmark texte "Sòlid" (DM Sans, aucune image) | 🟡 Placeholder texte | Aucun logo Sòlid fourni à ce jour. Conformément à la règle du projet ("le logo n'est jamais généré par IA"), un simple wordmark texte est utilisé en attendant un fichier logo fourni par l'utilisateur ou recadré depuis une référence réelle. |

## Illustrations (MCP Higgsfield, modèle nano_banana_2 — validées et générées)

| # | Écran | Emplacement | Fichier | Statut |
|---|---|---|---|---|
| 1 | Home (vide/peuplé) | Card "Buy bitcoin" | `public/images/illustration-bitcoin.png` | ✅ Généré (approximation IA fidèle au style) |
| 2 | Home (vide/peuplé) | Card "Invest in stocks" | `public/images/illustration-stocks.png` | ✅ Généré |
| 3 | Home (vide/peuplé) | Card "Free tax filing" | `public/images/illustration-tax-filing.png` | ✅ Généré |
| 4 | Add Cash — Success | Bloc upsell "Get paid up to 2 days faster" | `public/images/illustration-success-deposit.png` | ✅ Généré |
| 5 | Splash/onboarding — slide 1 | Carrousel "Rejwenn yon Sòl Fasilman" | `public/images/illustration-onboarding-group.png` | ✅ Généré (modèle `nano_banana_2`/`nano_banana_flash`, style 3D glossy demandé explicitement par l'utilisateur suite à des captures de référence) |
| 6 | Splash/onboarding — slide 2 | Carrousel "Swiv Peman ou yo" | `public/images/illustration-onboarding-wallet.png` | ✅ Généré |
| 7 | Splash/onboarding — slide 3 | Carrousel "Lajan ou an Sekirite" | `public/images/illustration-onboarding-shield.png` | ✅ Généré |

Les visuels #5-7 rompent délibérément avec le style trait-fin/étincelles vert
des visuels #1-4 : l'utilisateur a fourni des captures de référence (kit
"Registration UI templates") montrant des illustrations 3D glossy et a
explicitement demandé cette esthétique pour le carrousel d'onboarding.
Palette recolorée aux tokens Sòlid (vert/cyan, vert/violet, vert/bleu) au
lieu des couleurs orange/violet/noir de la référence.

Ces 7 visuels sont des approximations/générations IA (jamais l'original) — à remplacer
si l'utilisateur fournit les assets officiels Cash App un jour.

## Icônes UI (chevrons, card, search, history, notifications, gift, user, cross, arrow, scan)

Initialement extraites en PNG basse résolution (16-32px natif) depuis le
kit Figma — pixelisaient à l'affichage, notamment sur écrans haute
densité. **Remplacées par des icônes vectorielles `lucide-react`** en
trait épais (`strokeWidth={2.5}`) via `AssetIcon` (même API, implémentation
interne changée). Les PNG d'origine ont été supprimés de `public/icons/`.
Statut : ✅ résolu, plus de dépendance à des rasters basse résolution pour
ces icônes.

## Icône Savings (Home)

Icône ronde verte/noire type "coffre-fort" sur la card "Savings" : recréée
à la main en SVG inline (forme géométrique simple), pas générée par IA,
au moment de la construction de l'écran Home.

## Logos de marques tierces (Stocks)

Nike, GE, Coca-Cola, Walmart, Meta, MarketWatch, média façon CNBC/NBC —
reproduits approximativement à partir des captures (formes/couleurs simples
en SVG maison), par décision explicite de l'utilisateur. Pas de fichiers
de marque officiels utilisés. À faire au moment de la construction des
écrans Stocks.
