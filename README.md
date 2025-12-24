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

## 🚀 Démarrage Rapide

### Prérequis
- **Python 3.8+** avec pip
- **Node.js 16+** avec npm
- **Apache Jena Fuseki** ([Télécharger ici](https://jena.apache.org/download/))
- **Git Bash** (Windows) pour exécuter les tests

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/film-recommendation.git
cd film-recommendation

# 2. Installer les dépendances Python
pip install -r requirements.txt

# 3. Installer les dépendances Node.js
cd frontend
npm install
cd ..
```

### Lancement du Projet

#### Étape 1 : Démarrer Apache Jena Fuseki
```bash
# Dans le dossier Fuseki
cd chemin/vers/apache-jena-fuseki
.\fuseki-server.bat          # Windows
# ou
./fuseki-server              # Linux/Mac
```
➡️ Fuseki sera accessible sur **http://localhost:3030**

#### Étape 2 : Créer le dataset et charger l'ontologie
1. Ouvrir **http://localhost:3030** dans le navigateur
2. Cliquer sur **"Manage datasets"** → **"Add new dataset"**
3. Nom du dataset : `films` | Type : **Persistent (TDB2)**
4. Cliquer sur **"Create dataset"**
5. Aller dans **"/films"** → **"Upload data"**
6. Sélectionner le fichier `Modélisation ET peuplement de l'ontologie/films_ontology.ttl`
7. Cliquer sur **"Upload"**

#### Étape 3 : Démarrer le frontend React
```bash
cd frontend
npm start
```
➡️ L'application sera accessible sur **http://localhost:3000**

### Vérification

```bash
# Exécuter les tests automatisés
cd tests
bash test_sparql.sh
```

Résultat attendu : **10/10 tests passés**

---

## 📖 Guide Détaillé

### Préparation des données (optionnel)

Si vous souhaitez régénérer les données à partir des fichiers bruts :

```bash
# 1. Placer movies_metadata.csv et credits.csv dans data/raw/

# 2. Nettoyer les données
python clean_data.py

# 3. Générer l'ontologie
python "Modélisation ET peuplement de l'ontologie/create_ontology.py"
```

Cela génère `films_ontology.ttl` avec :
- 500 films
- 933 acteurs
- 330 réalisateurs
- 18 genres
- **7976 triplets RDF**

### Utilisation de l'Application

| Action | Description |
|--------|-------------|
| **Parcourir** | Voir la liste des 500 films |
| **Rechercher** | Taper un titre dans la barre de recherche |
| **Recommandations** | Cliquer sur un film pour voir les films similaires |

### Critères de Recommandation

- 🎬 **Même réalisateur** : Films dirigés par le même Director
- 🎭 **Même genre** : Films partageant au moins un Genre
- ⭐ **Mêmes acteurs** : Films avec des Actors en commun

## 🧑‍🎓 Auteurs

Ce projet a été réalisé par :
- **BROUKI Aya**
- **KHAILA Imane**
- **YAHYA Zakariae**
- **EL OUMNI Nora**
- **KAYOUH Salaheddine**

*Étudiants en 3ème année de la filière Big Data & Intelligence Artificielle (BDIA3).*