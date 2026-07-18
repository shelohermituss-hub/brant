# ASSETS-A-REMPLACER.md — Suivi des visuels générés/placeholder

Ce fichier liste tout visuel qui n'est pas l'original (recadré depuis un
screenshot en basse résolution, généré par IA, ou approximé) et qui devra
être remplacé par un fichier officiel fourni par l'utilisateur.

## Logo

| Écran d'origine | Fichier généré | Statut | Note |
|---|---|---|---|
| Bandeau d'attribution Mobbin (`design-refs/Cash_App_iOS_17.png`) | `public/logos/cash-app-logo.png` (62×62) + `cash-app-logo@2x.png` (256×256, upscale) | ⬜ À remplacer | Recadré/détouré depuis le seul endroit où le logo apparaît dans les captures. Basse résolution source (icône très petite dans le bandeau) → prévoir le fichier vectoriel officiel dès que possible. |

## Illustrations (MCP Higgsfield, modèle nano_banana_2 — validées et générées)

| # | Écran | Emplacement | Fichier | Statut |
|---|---|---|---|---|
| 1 | Home (vide/peuplé) | Card "Buy bitcoin" | `public/images/illustration-bitcoin.png` | ✅ Généré (approximation IA fidèle au style) |
| 2 | Home (vide/peuplé) | Card "Invest in stocks" | `public/images/illustration-stocks.png` | ✅ Généré |
| 3 | Home (vide/peuplé) | Card "Free tax filing" | `public/images/illustration-tax-filing.png` | ✅ Généré |
| 4 | Add Cash — Success | Bloc upsell "Get paid up to 2 days faster" | `public/images/illustration-success-deposit.png` | ✅ Généré |

Ces 4 visuels sont des approximations IA (jamais l'original) — à remplacer
si l'utilisateur fournit les assets officiels Cash App un jour.

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
