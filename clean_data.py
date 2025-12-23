import pandas as pd
# import json # json is not directly used, eval is
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Fonctions d'extraction et de nettoyage ---

def extract_json_data(df, column_name):
    """
    Évalue littéralement une colonne de chaîne de caractères contenant du JSON ou des listes/dictionnaires Python.
    """
    try:
        # Use a more robust way to evaluate potential JSON-like strings
        # ast.literal_eval is safer than eval for untrusted strings, but still expects valid Python literal structures
        # If the strings are strictly JSON, json.loads is better. Given the context, they might be Python literals.
        df[column_name] = df[column_name].apply(lambda x: eval(x) if isinstance(x, str) else x)
    except (TypeError, SyntaxError) as e:
        logging.error(f"Could not evaluate column {column_name}. Error: {e}")
    return df

def get_actors(cast_list):
    """
    Extrait les 3 premiers noms d'acteurs.
    """
    if isinstance(cast_list, list):
        actors = [actor['name'] for actor in cast_list[:3]]
        return '; '.join(actors)
    return None

def get_director(crew_list):
    """
    Extrait le nom du réalisateur (Director).
    """
    if isinstance(crew_list, list):
        for member in crew_list:
            if member.get('job') == 'Director':
                return member['name']
    return None

def get_genres(genre_list):
    """
    Extrait tous les noms de genres.
    """
    if isinstance(genre_list, list):
        genres = [genre['name'] for genre in genre_list]
        return '; '.join(genres)
    return None

def get_year(date_str):
    """
    Extrait l'année d'une date.
    """
    if isinstance(date_str, str) and '-' in date_str:
        return date_str.split('-')[0]
    return None

# --- Script principal ---

def main():
    # Définir les chemins
    raw_path = 'data/raw'
    processed_path = 'data/processed'
    movies_file = os.path.join(raw_path, 'movies_metadata.csv')
    credits_file = os.path.join(raw_path, 'credits.csv')
    output_file = os.path.join(processed_path, 'films_clean.csv')

    # Créer le dossier de sortie s'il n'existe pas
    if not os.path.exists(processed_path):
        os.makedirs(processed_path)
        logging.info(f"Dossier créé : {processed_path}")

    # 1. Chargement et Fusion
    logging.info(f"Chargement des fichiers : {movies_file} et {credits_file}")
    try:
        movies_df = pd.read_csv(movies_file, low_memory=False)
        credits_df = pd.read_csv(credits_file)
        logging.info("Fichiers chargés avec succès.")
    except FileNotFoundError as e:
        logging.error(f"Erreur : Fichier non trouvé. Assurez-vous que les fichiers sont dans {raw_path}.")
        logging.error(e)
        return

    # Convertir les IDs pour la fusion
    movies_df['id'] = pd.to_numeric(movies_df['id'], errors='coerce')
    credits_df['id'] = pd.to_numeric(credits_df['id'], errors='coerce')
    
    merged_df = pd.merge(movies_df, credits_df, on='id')
    logging.info(f"Fichiers fusionnés. Taille initiale : {len(merged_df)} lignes.")
    
    # 2. Filtrage
    merged_df['popularity'] = pd.to_numeric(merged_df['popularity'], errors='coerce')
    merged_df = merged_df.sort_values('popularity', ascending=False).head(500)
    logging.info(f"Filtré pour garder les 500 films les plus populaires. Taille : {len(merged_df)} lignes.")

    # 3. Extraction JSON
    json_columns = ['cast', 'crew', 'genres']
    logging.info(f"Extraction des données JSON des colonnes : {', '.join(json_columns)}")
    for col in json_columns:
        merged_df = extract_json_data(merged_df, col)

    merged_df['Actors'] = merged_df['cast'].apply(get_actors)
    merged_df['Director'] = merged_df['crew'].apply(get_director)
    merged_df['Genre'] = merged_df['genres'].apply(get_genres)
    logging.info("Données 'Actors', 'Director', 'Genre' extraites.")

    # 4. Nettoyage
    initial_rows = len(merged_df)
    merged_df.dropna(subset=['Director', 'Actors'], inplace=True)
    logging.info(f"Supprimé {initial_rows - len(merged_df)} lignes avec réalisateur ou acteurs manquants. Taille : {len(merged_df)} lignes.")

    merged_df['Year'] = merged_df['release_date'].apply(get_year)
    
    # Conversion explicite en types numériques pour la validation
    merged_df['Year'] = pd.to_numeric(merged_df['Year'], errors='coerce')
    merged_df['runtime'] = pd.to_numeric(merged_df['runtime'], errors='coerce')
    
    initial_rows = len(merged_df)
    merged_df.dropna(subset=['Year', 'runtime'], inplace=True) # Supprimer les films sans année ou durée
    logging.info(f"Supprimé {initial_rows - len(merged_df)} lignes avec année ou durée manquante. Taille : {len(merged_df)} lignes.")

    merged_df['Year'] = merged_df['Year'].astype(int)
    merged_df['runtime'] = merged_df['runtime'].astype(int)
    logging.info("Colonnes 'Year' et 'Runtime' converties en entiers.")

    # 5. Export
    final_df = merged_df[['title', 'Actors', 'Director', 'Genre', 'Year', 'runtime']]
    final_df = final_df.rename(columns={'title': 'Title', 'runtime': 'Runtime'})
    
    final_df.to_csv(output_file, index=False)
    
    logging.info(f"Le fichier nettoyé a été sauvegardé dans : {output_file}")
    logging.info(f"Nombre total de films dans le fichier final : {len(final_df)}")

if __name__ == '__main__':
    main()