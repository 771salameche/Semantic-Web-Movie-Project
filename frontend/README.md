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
│   └── useRecommendations.js # Hook pour les recommandations
├── services/
│   └── sparqlService.js    # Requetes SPARQL vers Fuseki
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

Le endpoint SPARQL est configure dans `src/services/sparqlService.js` :

```javascript
const FUSEKI_ENDPOINT = 'http://localhost:3030/films/sparql';
```

## Prerequis

- Node.js 16+
- Apache Jena Fuseki sur `http://localhost:3030`
- Dataset `films` avec l'ontologie chargee

## Services SPARQL

| Fonction | Description |
|----------|-------------|
| `getAllFilms()` | Recupere tous les films |
| `searchFilms(term)` | Recherche par titre |
| `getFilmDetails(uri)` | Details d'un film |
| `getRecommendationsByActor(uri)` | Films avec memes acteurs |
| `getRecommendationsByGenre(uri)` | Films du meme genre |
| `getRecommendationsByDirector(uri)` | Films du meme realisateur |
| `getAllGenres()` | Liste des genres |
| `getFilmsByGenre(uri)` | Films par genre |

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Demarre en mode developpement |
| `npm build` | Build de production |
| `npm test` | Execute les tests |

## Auteur

Zakaria - Frontend Development
