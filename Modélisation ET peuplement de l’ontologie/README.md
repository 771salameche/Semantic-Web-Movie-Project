# Modelisation et Peuplement de l'Ontologie

Ce dossier contient les scripts et fichiers lies a l'ontologie RDF/OWL.

## Fichiers

| Fichier              | Description                                      |
|----------------------|--------------------------------------------------|
| create_ontology.py   | Script Python pour generer l'ontologie           |
| films_ontology.ttl   | Ontologie peuplee au format Turtle               |

## create_ontology.py

Script Python utilisant **RDFLib** pour convertir les donnees CSV en triplets RDF.

### Utilisation

```bash
python "Modelisation ET peuplement de l'ontologie/create_ontology.py"
```

### Fonctionnement

1. Charge `data/processed/films_clean.csv`
2. Cree les classes : `Film`, `Actor`, `Director`, `Genre`
3. Cree les proprietes : `hasActor`, `directedBy`, `hasGenre`, `titre`, `releaseYear`, `duration`, `nom`
4. Peuple l'ontologie avec les donnees
5. Exporte en format Turtle (.ttl)

### Statistiques generees

| Element      | Nombre |
|--------------|--------|
| Films        | 500    |
| Acteurs      | 933    |
| Realisateurs | 330    |
| Genres       | 18     |
| **Triplets** | 7976   |

## films_ontology.ttl

Fichier d'ontologie au format **Turtle** (Terse RDF Triple Language).

### Namespace

```
PREFIX ns: <http://example.org/film#>
```

### Classes

```turtle
ns:Film      rdf:type rdfs:Class .
ns:Actor     rdf:type rdfs:Class .
ns:Director  rdf:type rdfs:Class .
ns:Genre     rdf:type rdfs:Class .
```

### Proprietes

| Propriete      | Domaine | Range   | Description              |
|----------------|---------|---------|--------------------------|
| ns:titre       | Film    | string  | Titre du film            |
| ns:releaseYear | Film    | integer | Annee de sortie          |
| ns:duration    | Film    | integer | Duree en minutes         |
| ns:nom         | *       | string  | Nom (acteur/realisateur) |
| ns:hasActor    | Film    | Actor   | Acteur du film           |
| ns:directedBy  | Film    | Director| Realisateur              |
| ns:hasGenre    | Film    | Genre   | Genre du film            |

### Exemple de triplets

```turtle
ns:film_Inception rdf:type ns:Film ;
    ns:titre "Inception" ;
    ns:releaseYear 2010 ;
    ns:duration 148 ;
    ns:directedBy ns:director_Christopher_Nolan ;
    ns:hasGenre ns:genre_Action, ns:genre_Science_Fiction ;
    ns:hasActor ns:actor_Leonardo_DiCaprio .
```

## Chargement dans Fuseki

1. Demarrer Fuseki : `.\fuseki-server.bat`
2. Ouvrir http://localhost:3030
3. Creer dataset `films`
4. Upload `films_ontology.ttl`
