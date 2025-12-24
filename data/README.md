# Data

Ce dossier contient les donnees du projet.

## Structure

```
data/
├── raw/                    # Donnees brutes (non versionnees)
│   ├── movies_metadata.csv # Metadonnees des films (TMDB)
│   └── credits.csv         # Acteurs et equipes techniques
└── processed/
    └── films_clean.csv     # Donnees nettoyees (500 films)
```

## raw/

Contient les datasets originaux du TMDB (The Movie Database). Ces fichiers ne sont pas inclus dans le depot Git (voir `.gitignore`).

**Source** : [Kaggle - The Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)

## processed/

### films_clean.csv

Fichier nettoye pret pour l'ontologie. Genere par `clean_data.py`.

| Colonne  | Type    | Description                     |
|----------|---------|---------------------------------|
| Title    | string  | Titre du film                   |
| Actors   | string  | 3 acteurs principaux (sep: `;`) |
| Director | string  | Realisateur                     |
| Genre    | string  | Genres (sep: `;`)               |
| Year     | integer | Annee de sortie                 |
| Runtime  | integer | Duree en minutes                |

**Statistiques** :
- 500 films (les plus populaires)
- Periode : 1939 - 2017
