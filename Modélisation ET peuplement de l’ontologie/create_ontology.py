"""
Script pour creer et peupler l'ontologie de films a partir du CSV
"""
from rdflib import Graph, Namespace, Literal, URIRef
from rdflib.namespace import RDF, RDFS, XSD
import pandas as pd
import re

# Namespace de l'ontologie
NS = Namespace("http://example.org/film#")

def clean_uri(name):
    """Nettoie un nom pour en faire un URI valide"""
    if not name:
        return None
    # Remplace les caracteres speciaux
    clean = re.sub(r'[^a-zA-Z0-9]', '_', str(name))
    clean = re.sub(r'_+', '_', clean)  # Supprime les underscores multiples
    clean = clean.strip('_')
    return clean

def create_ontology():
    # Creer le graphe RDF
    g = Graph()
    g.bind("ns", NS)
    g.bind("rdf", RDF)
    g.bind("rdfs", RDFS)
    g.bind("xsd", XSD)

    # Definir les classes
    g.add((NS.Film, RDF.type, RDFS.Class))
    g.add((NS.Actor, RDF.type, RDFS.Class))
    g.add((NS.Director, RDF.type, RDFS.Class))
    g.add((NS.Genre, RDF.type, RDFS.Class))

    # Definir les proprietes
    g.add((NS.titre, RDF.type, RDF.Property))
    g.add((NS.releaseYear, RDF.type, RDF.Property))
    g.add((NS.duration, RDF.type, RDF.Property))
    g.add((NS.nom, RDF.type, RDF.Property))
    g.add((NS.hasActor, RDF.type, RDF.Property))
    g.add((NS.hasGenre, RDF.type, RDF.Property))
    g.add((NS.directedBy, RDF.type, RDF.Property))

    # Charger les donnees CSV
    csv_path = "data/processed/films_clean.csv"
    print(f"Chargement de {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"Nombre de films: {len(df)}")

    # Sets pour eviter les doublons
    actors_added = set()
    directors_added = set()
    genres_added = set()

    # Peupler l'ontologie
    for idx, row in df.iterrows():
        title = row['Title']
        film_uri = NS[f"film_{clean_uri(title)}"]

        # Ajouter le film
        g.add((film_uri, RDF.type, NS.Film))
        g.add((film_uri, NS.titre, Literal(title, datatype=XSD.string)))

        # Annee
        if pd.notna(row['Year']):
            g.add((film_uri, NS.releaseYear, Literal(int(row['Year']), datatype=XSD.integer)))

        # Duree
        if pd.notna(row['Runtime']):
            g.add((film_uri, NS.duration, Literal(int(row['Runtime']), datatype=XSD.integer)))

        # Realisateur
        if pd.notna(row['Director']):
            director_name = row['Director'].strip()
            director_uri = NS[f"director_{clean_uri(director_name)}"]

            if director_name not in directors_added:
                g.add((director_uri, RDF.type, NS.Director))
                g.add((director_uri, NS.nom, Literal(director_name, datatype=XSD.string)))
                directors_added.add(director_name)

            g.add((film_uri, NS.directedBy, director_uri))

        # Acteurs
        if pd.notna(row['Actors']):
            actors = [a.strip() for a in str(row['Actors']).split(';')]
            for actor_name in actors:
                if actor_name:
                    actor_uri = NS[f"actor_{clean_uri(actor_name)}"]

                    if actor_name not in actors_added:
                        g.add((actor_uri, RDF.type, NS.Actor))
                        g.add((actor_uri, NS.nom, Literal(actor_name, datatype=XSD.string)))
                        actors_added.add(actor_name)

                    g.add((film_uri, NS.hasActor, actor_uri))

        # Genres
        if pd.notna(row['Genre']):
            genres = [g_name.strip() for g_name in str(row['Genre']).split(';')]
            for genre_name in genres:
                if genre_name:
                    genre_uri = NS[f"genre_{clean_uri(genre_name)}"]

                    if genre_name not in genres_added:
                        g.add((genre_uri, RDF.type, NS.Genre))
                        g.add((genre_uri, NS.nom, Literal(genre_name, datatype=XSD.string)))
                        genres_added.add(genre_name)

                    g.add((film_uri, NS.hasGenre, genre_uri))

    # Sauvegarder en format Turtle (plus lisible et moins d'erreurs)
    output_path = "films_ontology.ttl"
    g.serialize(destination=output_path, format="turtle")
    print(f"\nOntologie sauvegardee dans: {output_path}")
    print(f"Films: {len(df)}")
    print(f"Acteurs: {len(actors_added)}")
    print(f"Realisateurs: {len(directors_added)}")
    print(f"Genres: {len(genres_added)}")
    print(f"\nTotal triplets: {len(g)}")

    return output_path

if __name__ == "__main__":
    create_ontology()
