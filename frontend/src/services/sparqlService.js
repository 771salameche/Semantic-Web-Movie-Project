import axios from 'axios';

// Configuration - Modifier selon votre installation Fuseki
const FUSEKI_ENDPOINT = 'http://localhost:3030/films/sparql';

// Client axios pour SPARQL
const sparqlClient = axios.create({
  baseURL: FUSEKI_ENDPOINT,
  headers: {
    'Content-Type': 'application/sparql-query',
    'Accept': 'application/json'
  }
});

// Exécuter une requête SPARQL
export const executeSparql = async (query) => {
  try {
    const response = await sparqlClient.post('', query);
    return response.data.results.bindings;
  } catch (error) {
    console.error('Erreur SPARQL:', error);
    throw error;
  }
};

// Récupérer tous les films (dédupliqués côté JS)
export const getAllFilms = async () => {
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?uri ?titre ?annee ?duree ?genre ?realisateur WHERE {
      ?uri rdf:type ns:Film .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL { ?uri ns:duration ?duree }
      OPTIONAL {
        ?uri ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
    }
    ORDER BY ?titre
  `;
  const results = await executeSparql(query);

  // Dédupliquer et agréger les genres côté JavaScript
  const filmsMap = new Map();
  results.forEach(r => {
    const uri = r.uri?.value;
    if (!uri) return;

    if (!filmsMap.has(uri)) {
      filmsMap.set(uri, {
        uri: r.uri,
        titre: r.titre,
        annee: r.annee,
        duree: r.duree,
        realisateur: r.realisateur,
        genres: new Set()
      });
    }
    if (r.genre?.value) {
      filmsMap.get(uri).genres.add(r.genre.value);
    }
  });

  // Convertir en tableau avec genres joints
  return Array.from(filmsMap.values()).map(film => ({
    ...film,
    genre: { value: Array.from(film.genres).join(', ') }
  }));
};

// Récupérer les détails d'un film
export const getFilmDetails = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT ?titre ?annee ?duree ?genre ?realisateur ?acteur WHERE {
      <${filmUri}> ns:titre ?titre .
      OPTIONAL { <${filmUri}> ns:releaseYear ?annee }
      OPTIONAL { <${filmUri}> ns:duration ?duree }
      OPTIONAL {
        <${filmUri}> ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        <${filmUri}> ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
      OPTIONAL {
        <${filmUri}> ns:hasActor ?actorUri .
        ?actorUri ns:nom ?acteur .
      }
    }
  `;
  return await executeSparql(query);
};

// Recommandations par même acteur (dédupliqués côté JS)
export const getRecommendationsByActor = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee WHERE {
      <${filmUri}> ns:hasActor ?actor .
      ?uri ns:hasActor ?actor .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  const results = await executeSparql(query);
  // Dédupliquer par URI
  const seen = new Set();
  return results.filter(r => {
    const uri = r.uri?.value;
    if (seen.has(uri)) return false;
    seen.add(uri);
    return true;
  });
};

// Recommandations par même genre
export const getRecommendationsByGenre = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee WHERE {
      <${filmUri}> ns:hasGenre ?genre .
      ?uri ns:hasGenre ?genre .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  return await executeSparql(query);
};

// Recommandations par même réalisateur
export const getRecommendationsByDirector = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee WHERE {
      <${filmUri}> ns:directedBy ?director .
      ?uri ns:directedBy ?director .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  return await executeSparql(query);
};

// Rechercher des films par titre, acteur, réalisateur ou genre (dédupliqués côté JS)
export const searchFilms = async (searchTerm) => {
  const searchLower = searchTerm.toLowerCase();
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?uri ?titre ?annee ?genre ?realisateur ?acteur WHERE {
      ?uri rdf:type ns:Film .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL {
        ?uri ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
      OPTIONAL {
        ?uri ns:hasActor ?actorUri .
        ?actorUri ns:nom ?acteur .
      }
      FILTER(
        CONTAINS(LCASE(?titre), "${searchLower}") ||
        CONTAINS(LCASE(COALESCE(?realisateur, "")), "${searchLower}") ||
        CONTAINS(LCASE(COALESCE(?acteur, "")), "${searchLower}") ||
        CONTAINS(LCASE(COALESCE(?genre, "")), "${searchLower}")
      )
    }
    ORDER BY ?titre
  `;
  const results = await executeSparql(query);

  // Dédupliquer et agréger les genres côté JavaScript
  const filmsMap = new Map();
  results.forEach(r => {
    const uri = r.uri?.value;
    if (!uri) return;

    if (!filmsMap.has(uri)) {
      filmsMap.set(uri, {
        uri: r.uri,
        titre: r.titre,
        annee: r.annee,
        realisateur: r.realisateur,
        genres: new Set()
      });
    }
    if (r.genre?.value) {
      filmsMap.get(uri).genres.add(r.genre.value);
    }
  });

  return Array.from(filmsMap.values()).map(film => ({
    ...film,
    genre: { value: Array.from(film.genres).join(', ') }
  }));
};

// Récupérer tous les genres
export const getAllGenres = async () => {
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT DISTINCT ?uri ?nom WHERE {
      ?uri rdf:type ns:Genre .
      ?uri ns:nom ?nom .
    }
    ORDER BY ?nom
  `;
  return await executeSparql(query);
};

// Récupérer les films par genre (dédupliqués côté JS)
export const getFilmsByGenre = async (genreUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT ?uri ?titre ?annee ?realisateur WHERE {
      ?uri ns:hasGenre <${genreUri}> .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
    }
    ORDER BY ?titre
  `;
  const results = await executeSparql(query);
  // Dédupliquer par URI
  const seen = new Set();
  return results.filter(r => {
    const uri = r.uri?.value;
    if (seen.has(uri)) return false;
    seen.add(uri);
    return true;
  });
};
