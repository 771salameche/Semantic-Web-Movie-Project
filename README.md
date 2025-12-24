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
├── 📄 requirements.txt              # Dépendances Python
├── clean_data.py                    # Script de nettoyage des données
├── data/
│   ├── raw/                         # Datasets bruts (movies_metadata.csv, credits.csv)
│   └── processed/
│       └── films_clean.csv          # Données nettoyées (500 films)
├── Modélisation ET peuplement de l'ontologie/
│   ├── create_ontology.py           # Script de peuplement de l'ontologie
│   └── films_ontology.ttl           # Ontologie peuplée (format Turtle)
├── frontend/                        # Application React
│   ├── src/
│   │   ├── components/              # Composants UI
│   │   ├── services/sparqlService.js
│   │   └── App.jsx
│   └── package.json
├── tests/
│   └── test_sparql.sh               # Tests automatisés
└── queries/
    └── examples.sparql              # Exemples de requêtes SPARQL
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

### 1. Installation des dépendances
```bash
pip install -r requirements.txt
cd frontend && npm install
```

### 2. Préparation des données
Le script `clean_data.py` charge les datasets bruts, les nettoie et génère un fichier `films_clean.csv` compatible avec notre ontologie.

Pour l'exécuter, assurez-vous d'avoir placé les fichiers `movies_metadata.csv` et `credits.csv` dans le dossier `data/raw/`, puis lancez la commande suivante à la racine du projet :
```bash
python clean_data.py
```
Le fichier de sortie sera généré dans `data/processed/`.

### 3. Peuplement de l'ontologie
```bash
python "Modélisation ET peuplement de l'ontologie/create_ontology.py"
```
Cela génère le fichier `films_ontology.ttl` avec 500 films, 933 acteurs, 330 réalisateurs et 18 genres.

### 4. Lancer Apache Jena Fuseki
```bash
cd chemin/vers/fuseki
.\fuseki-server.bat
```
Puis dans l'interface web (http://localhost:3030) :
1. Créer un dataset nommé `films`
2. Uploader le fichier `films_ontology.ttl`

### 5. Lancer le frontend
```bash
cd frontend
npm start
```
L'application sera accessible sur http://localhost:3000

### 6. Exécuter les tests
```bash
cd tests
bash test_sparql.sh
```

## 🧑‍🎓 Auteurs

Ce projet a été réalisé par :
- **BROUKI Aya**
- **KHAILA Imane**
- **YAHYA Zakariae**
- **EL OUMNI Nora**
- **KAYOUH Salaheddine**

*Étudiants en 3ème année de la filière Big Data & Intelligence Artificielle (BDIA3).*