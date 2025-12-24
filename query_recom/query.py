from SPARQLWrapper import SPARQLWrapper, JSON

# Fonction pour convertir les noms en URI valides pour SPARQL
def format_sparql_name(name):
    return name.strip().replace(" ", "_")

# Fonction pour construire la requête SPARQL dynamique
def build_sparql_query(director=None, actors=None, genres=None, year=None):
    query = "PREFIX films: <http://www.example.org/films#>\nSELECT DISTINCT ?film WHERE {\n"
    query += "  ?film a films:Film .\n"

    # Réalisateur
    if director:
        query += f"  ?film films:directedBy films:{director} .\n"
    # Année
    if year:
        query += f"  ?film films:releaseYear {year} .\n"

    # Acteurs avec VALUES
    if actors:
        actors_values = " ".join([f"films:{a}" for a in actors])
        query += f"  VALUES ?actor {{ {actors_values} }}\n"
        query += f"  ?film films:hasActor ?actor .\n"

    # Genres avec VALUES
    if genres:
        genres_values = " ".join([f"films:{g}" for g in genres])
        query += f"  VALUES ?genre {{ {genres_values} }}\n"
        query += f"  ?film films:hasGenre ?genre .\n"

    query += "}"
    return query

# Fonction pour exécuter la requête SPARQL sur Fuseki
def run_sparql_query(endpoint_url, director=None, actors=None, genres=None, year=None):
    sparql = SPARQLWrapper(endpoint_url)
    query = build_sparql_query(director, actors, genres, year)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    films = []
    for result in results["results"]["bindings"]:
        uri = result['film']['value']
        title = uri.split('#')[-1].replace('_', ' ')
        films.append((title, uri))
    return films

# -------------------------------
# Entrée dynamique de l'utilisateur
# -------------------------------
endpoint = "http://localhost:3030/films/sparql"

# Réalisateur
director_input = input("Réalisateur (ex: Tim Burton) ou laissez vide: ").strip()
director = format_sparql_name(director_input) if director_input else None

# Acteurs (séparés par ; ou ,)
actors_input = input("Acteurs (ex: Johnny Depp; Helena Bonham Carter) ou laissez vide: ").strip()
actors = [format_sparql_name(a) for a in actors_input.replace(',', ';').split(';')] if actors_input else None

# Genres (séparés par ; ou ,)
genres_input = input("Genres (ex: Action; Adventure) ou laissez vide: ").strip()
genres = [format_sparql_name(g) for g in genres_input.replace(',', ';').split(';')] if genres_input else None

# Année
year_input = input("Année (ex: 2017) ou laissez vide: ").strip()
year = int(year_input) if year_input else None

# -------------------------------
# Exécution de la requête et affichage
# -------------------------------
recommended = run_sparql_query(endpoint, director, actors, genres, year)

print("\nFilms recommandés :")
if recommended:
    for title, uri in recommended:
        print(f"{title} ({uri})")
else:
    print("Aucun film ne correspond aux critères fournis.")