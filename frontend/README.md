# Film Recommendation Frontend

Interface web pour le systeme de recommandation de films base sur le Web Semantique.

## Description

Cette application React permet aux utilisateurs de :
- Parcourir une liste de 500 films
- Rechercher des films par titre
- Selectionner un film pour obtenir des recommandations
- Afficher les films recommandes bases sur des criteres semantiques

## Technologies

| Technologie | Version | Description |
|-------------|---------|-------------|
| React       | 18.x    | Framework frontend |
| Axios       | 1.x     | Client HTTP pour requetes SPARQL |
| CSS3        | -       | Styles personnalises |

## Structure du projet

```
src/
├── components/
│   ├── FilmCard/           # Carte d'affichage d'un film
│   ├── FilmList/           # Liste des films
│   ├── Header/             # En-tete de l'application
│   ├── Footer/             # Pied de page
│   ├── Loader/             # Indicateur de chargement
│   ├── Recommendations/    # Section des recommandations
│   └── SearchBar/          # Barre de recherche
├── context/
│   └── FilmContext.jsx     # Context API (etat global)
├── hooks/
│   ├── useFilms.js         # Hook pour charger les films
│   ├── useRecommendations.js # Hook pour les recommandations
│   └── useTheme.js         # Hook pour le theme sombre/clair
├── services/
│   ├── sparqlService.js    # Requetes SPARQL vers Fuseki
│   └── tmdbService.js      # API TMDB pour les posters
├── App.jsx                 # Composant principal
├── App.css                 # Styles globaux
└── index.js                # Point d'entree
```

## Installation

```bash
cd frontend
npm install
```

## Demarrage

```bash
npm start
```

L'application sera accessible sur **http://localhost:3000**

## Configuration

### 1. Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```bash
cp .env.example .env
```

```env
# API TMDB pour les posters de films
REACT_APP_TMDB_API_KEY=votre_cle_api_ici
```

Obtenir une cle API TMDB : https://www.themoviedb.org/settings/api

### 2. Endpoint SPARQL

Configure dans `src/services/sparqlService.js` :

```javascript
const FUSEKI_ENDPOINT = 'http://localhost:3030/films/sparql';
```

## Prerequis

- Node.js 16+
- Apache Jena Fuseki sur `http://localhost:3030`
- Dataset `films` avec l'ontologie chargee
- Cle API TMDB (optionnel, pour les posters)

## Services SPARQL

| Fonction | Description |
|----------|-------------|
| `getAllFilms()` | Recupere tous les films |
| `searchFilms(term)` | Recherche par titre, acteur, realisateur ou genre |
| `getFilmDetails(uri)` | Details d'un film |
| `getRecommendationsByActor(uri)` | Films avec memes acteurs |
| `getRecommendationsByGenre(uri)` | Films du meme genre |
| `getRecommendationsByDirector(uri)` | Films du meme realisateur |
| `getAllGenres()` | Liste des genres |
| `getFilmsByGenre(uri)` | Films par genre |

## Services TMDB

| Fonction | Description |
|----------|-------------|
| `getMoviePoster(title, year)` | Recupere le poster d'un film |
| `getMoviePosters(films)` | Recupere les posters pour une liste |
| `getPosterUrl(data, size)` | URL du poster avec taille |
| `getBackdropUrl(data, size)` | URL du backdrop |

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Demarre en mode developpement |
| `npm build` | Build de production |
| `npm test` | Execute les tests |

## Auteur

Zakaria - Frontend Development
