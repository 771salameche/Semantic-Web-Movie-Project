# 🎓 Système Sémantique de Recommandation de Films

![Statut du Projet](https://img.shields.io/badge/statut-en_cours-yellowgreen)

Projet réalisé dans le cadre du module **Ingénierie des connaissances et Web sémantique** (BDIA3-S5) à l'École Nationale des Sciences Appliquées de Tétouan.

## 📝 Description

L'objectif de ce projet est de concevoir et d'implémenter un système sémantique pour la recommandation de films. Pour ce faire, nous développons une base de connaissances sous la forme d'une ontologie. Cette ontologie modélise les entités clés de l'industrie cinématographique — films, acteurs, réalisateurs et genres — ainsi que les relations sémantiques qui les unissent. L'objectif final est d'exploiter cette structure pour proposer des recommandations intelligentes et pertinentes, basées sur des critères logiques plutôt que sur de simples statistiques.

## 📂 Architecture du Dépôt

Le projet est structuré de manière modulaire pour séparer les différentes composantes :

```
.
├── 📄 README.md
├──  ontology/
│   └── films.owl           # Fichier de l'ontologie (Protégé)
├── data/
│   ├── raw/                # Datasets bruts (ex: movies_metadata.csv)
│   └── processed/          # Données nettoyées prêtes pour l'ontologie (films_clean.csv)
├── queries/
│   └── examples.sparql     # Exemples de requêtes SPARQL
├── report/
│   └── rapport_projet.pdf  # Rapport final du projet
└── clean_data.py           # Script Python pour le nettoyage des données
```

## 🧠 Modélisation de l'Ontologie

Notre ontologie est construite autour de quatre classes fondamentales et de propriétés qui définissent leurs interactions :

### Classes principales
- `Film`: Représente une œuvre cinématographique.
- `Actor`: Représente un acteur ou une actrice.
- `Director`: Représente le réalisateur d'un film.
- `Genre`: Représente une catégorie de film (ex: Action, Comédie).

### Propriétés (prédicats)
- `hasActor` (Object Property): Lie un `Film` à un `Actor`.
- `directedBy` (Object Property): Lie un `Film` à un `Director`.
- `hasGenre` (Object Property): Lie un `Film` à un `Genre`.
- `title`, `year`, `runtime` (Data Properties): Attributs littéraux d'un `Film`.

## 💡 Logique de Recommandation

Le système de recommandation s'appuie sur des inférences logiques permises par l'ontologie. Les critères de recommandation incluent, sans s'y limiter :
- **Films partageant le même réalisateur** : Si un utilisateur apprécie un film de Christopher Nolan, le système peut recommander d'autres films `directedBy` le même `Director`.
- **Films partageant le même genre** : Recommander des films qui appartiennent au même `Genre` (ex: Science-Fiction).
- **Films avec des acteurs en commun** : Proposer des films où figure un `Actor` apprécié par l'utilisateur.

## 🛠️ Technologies Utilisées

- **Python (Pandas)**: Pour le prétraitement, le nettoyage et la préparation des données brutes avant leur intégration dans l'ontologie.
- **Protégé**: Outil de modélisation de référence pour la création et la gestion de notre ontologie au format OWL.
- **SPARQL**: Langage de requête utilisé pour interroger la base de connaissances et formuler les logiques de recommandation.

## 🚀 Instructions d'Utilisation

### 1. Préparation des données
Le script `clean_data.py` charge les datasets bruts, les nettoie et génère un fichier `films_clean.csv` compatible avec notre ontologie.

Pour l'exécuter, assurez-vous d'avoir placé les fichiers `movies_metadata.csv` et `credits.csv` dans le dossier `data/raw/`, puis lancez la commande suivante à la racine du projet :
```bash
python clean_data.py
```
Le fichier de sortie sera généré dans `data/processed/`.

### 2. Chargement de l'ontologie
1.  Ouvrez le logiciel **Protégé Desktop**.
2.  Allez dans `File > Open...`.
3.  Naviguez jusqu'au dossier `ontology/` et sélectionnez le fichier `films.owl`.
4.  L'ontologie est maintenant chargée. Vous pouvez la visualiser, la modifier et l'interroger via l'onglet `SPARQL Query`.

## 🧑‍🎓 Auteurs

Ce projet a été réalisé par :
- **BROUKI Aya**
- **KHAILA Imane**
- **YAHYA Zakariae**
- **EL OUMNI Nora**
- **KAYOUH Salaheddine**

*Étudiants en 3ème année de la filière Big Data & Intelligence Artificielle (BDIA3).*