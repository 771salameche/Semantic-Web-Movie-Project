import pandas as pd
from rdflib import Graph, Literal, Namespace, RDF, XSD, URIRef
import re

# Fonction pour nettoyer les URIs
def clean_uri(text):
    """Nettoie une chaîne pour créer une URI valide"""
    if pd.isnull(text):
        return ""
    # Convertir en string et supprimer les espaces aux extrémités
    text = str(text).strip()
    # Remplacer les caractères spéciaux par des underscores
    text = re.sub(r'[^\w\s-]', '', text)
    # Remplacer les espaces par des underscores
    text = text.replace(' ', '_')
    # Supprimer les underscores multiples
    text = re.sub(r'_+', '_', text)
    # Supprimer les underscores au début et à la fin
    text = text.strip('_')
    return text if text else "Unknown"

# Charger le CSV
try:
    df = pd.read_csv(r"Semantic-Web-Movie-Project\data\processed\films_clean.csv")
    print(f"CSV chargé avec succès : {len(df)} films trouvés")
except FileNotFoundError:
    print("Erreur : Le fichier 'films_clean.csv' n'existe pas dans le répertoire actuel")
    exit(1)
except Exception as e:
    print(f"Erreur lors du chargement du CSV : {e}")
    exit(1)

# Namespace
BASE = Namespace("http://www.example.org/films#")

g = Graph()
g.bind("films", BASE)

# Classes
Film = BASE.Film
Actor = BASE.Acteur
Director = BASE.Realisateur
Genre = BASE.Genre

# Propriétés
hasActor = BASE.hasActor
directedBy = BASE.directedBy
hasGenre = BASE.hasGenre
releaseYear = BASE.releaseYear
duration = BASE.duration

# Compteurs pour statistiques
films_processed = 0
errors = 0

for idx, row in df.iterrows():
    try:
        # Créer l'URI du film
        film_title = clean_uri(row["Title"])
        if not film_title:
            print(f"Ligne {idx}: Titre vide, film ignoré")
            errors += 1
            continue

        film_uri = BASE[film_title]
        g.add((film_uri, RDF.type, Film))

        # Année
        try:
            if pd.notnull(row["Year"]):
                year_value = int(float(row["Year"]))
                g.add((film_uri, releaseYear, Literal(year_value, datatype=XSD.integer)))
        except (ValueError, TypeError) as e:
            print(f"Ligne {idx}: Année invalide pour '{row['Title']}': {row.get('Year')}")

        # Durée
        try:
            if pd.notnull(row["Runtime"]):
                runtime_value = int(float(row["Runtime"]))
                g.add((film_uri, duration, Literal(runtime_value, datatype=XSD.integer)))
        except (ValueError, TypeError) as e:
            print(f"Ligne {idx}: Durée invalide pour '{row['Title']}': {row.get('Runtime')}")

        # Réalisateur
        if pd.notnull(row["Director"]):
            director_name = clean_uri(row["Director"])
            if director_name:
                director_uri = BASE[director_name]
                g.add((director_uri, RDF.type, Director))
                g.add((film_uri, directedBy, director_uri))

        # Acteurs
        if pd.notnull(row["Actors"]):
            actors = [a.strip() for a in str(row["Actors"]).split(";") if a.strip()]
            for actor in actors:
                actor_name = clean_uri(actor)
                if actor_name:
                    actor_uri = BASE[actor_name]
                    g.add((actor_uri, RDF.type, Actor))
                    g.add((film_uri, hasActor, actor_uri))

        # Genres - CORRECTION: renommer la variable de boucle
        if pd.notnull(row["Genre"]):
            genres = [genre_item.strip() for genre_item in str(row["Genre"]).split(";") if genre_item.strip()]
            for genre_item in genres:
                genre_name = clean_uri(genre_item)
                if genre_name:
                    genre_uri = BASE[genre_name]
                    g.add((genre_uri, RDF.type, Genre))
                    g.add((film_uri, hasGenre, genre_uri))

        films_processed += 1

    except Exception as e:
        print(f"Erreur à la ligne {idx} pour le film '{row.get('Title', 'Unknown')}': {e}")
        errors += 1

# Export
try:
    g.serialize(r"Semantic-Web-Movie-Project\Modélisation ET peuplement de l’ontologie\films.ttl", format="turtle")
    print(
    r"\n✓ Ontologie générée : C:\Users\Dell\Desktop\projet web\Semantic-Web-Movie-Project\Modélisation ET peuplement de l’ontologie\films.ttl"
)
    print(f"✓ Films traités : {films_processed}/{len(df)}")
    if errors > 0:
        print(f"⚠ Erreurs rencontrées : {errors}")
except Exception as e:
    print(f"Erreur lors de l'export : {e}")
    exit(1)
