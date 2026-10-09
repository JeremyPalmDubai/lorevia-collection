# Lorévia Collection

Site immobilier éditorial pour Lorévia Collection by DECA, Al Zorah, Ajman.

## Inclus

- 30 pages statiques en anglais, français, espagnol, néerlandais, allemand et portugais.
- Accueil, studios, appartements 1 et 2 chambres et plan de paiement dans chaque langue.
- Tailwind CSS 4, mise en page responsive, images AVIF/WebP, animations et respect du mouvement réduit.
- Prix AED/USD, calculateur de paiement et formulaire Tally intégré `VLRjdJ`.
- Aucun lien sortant dans la navigation du site. Tally reste un service externe intégré ; sa propre interface peut afficher ses liens.
- Code source et dossier `dist/` complet, visuels optimisés et brochure inclus.

## Démarrer

Node.js 22 ou supérieur et pnpm sont nécessaires.

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run check
pnpm run preview
```

Aperçu sur `http://127.0.0.1:4173`. Les visuels fournis dans `dist/assets/` sont nécessaires au build : conserver ce dossier.

## Mise en ligne et référencement

Le domaine sera choisi ultérieurement. Par défaut, le build est un aperçu avec `noindex,follow` et un fichier robots bloquant l’indexation.

Pour une publication, remplacer la valeur suivante par le vrai domaine :

```sh
SITE_URL=https://votre-domaine.fr pnpm run build
```

Cette option active l’indexation et génère les URL canoniques, les variantes linguistiques et les sitemaps. Publier ensuite le contenu de `dist/` à la racine du domaine. Configurer les réponses 404 et redirections sur l’hébergeur. Le serveur fourni gère ces réponses ; un hébergeur statique peut nécessiter sa propre configuration.

Le dépôt GitHub public ne constitue pas une mise en ligne du site. Aucun domaine de production n’est configuré dans cet export.

## Audit du 9 octobre 2026

Lighthouse 13.5.0, simulation mobile sur un serveur local avec configuration de publication :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Accueil anglais | 98 | 100 | 100 | 100 |
| Studios français | 100 | 100 | 100 | 100 |
| Plan de paiement espagnol | 100 | 100 | 100 | 100 |

Contrôles complémentaires : 30 pages à quatre largeurs (320, 390, 768 et 1440 px), aucun débordement horizontal détecté, navigation interne, métadonnées, variantes de langue, montants et échéances. Les résultats synthétiques sont dans `audit/`.

Ces scores sont des mesures de laboratoire sur les pages indiquées, pas un score UX universel ni une garantie de classement Google. Ils devront être mesurés sur le domaine publié. Le formulaire a été vérifié visuellement ; aucun faux prospect n’a été envoyé. Sa réception finale et son paramétrage restent gérés dans Tally.

## Contenu

Modifier les traductions dans `src/content.mjs` et `src/seo-content.mjs`, le rendu dans `build.mjs` et `src/seo-build.mjs`, les styles dans `src/style.css` et les interactions dans `src/app.js`, puis reconstruire.

Les prix, dates, disponibilités et conditions commerciales doivent être reconfirmés avant toute réservation. Les visas sont soumis aux critères et à l’approbation des autorités. Les images et la brochure conservent les droits de leurs propriétaires ; aucune licence de redistribution supplémentaire n’est accordée ici.
