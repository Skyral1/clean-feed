# CleanFeed

[![Build and Push CleanFeed](https://github.com/votre-compte/cleanfeed/actions/workflows/deploy.yml/badge.svg)](https://github.com/votre-compte/cleanfeed/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Simulateur dystopique de modération de contenu sous cadence industrielle pour navigateur web.

## Contrôles clavier

- **Q** : Rejeter le ticket
- **E** : Valider la publication
- **ESPACE** : Activer l'analyse éthique

## Développement en local

```bash
npm install
npm run dev
```

## Déploiement Homelab

Assurez-vous que le réseau bridge externe de Traefik existe :

```bash
docker network create web
```

Puis lancez la pile de conteneurs :

```bash
docker compose up -d --build
```
