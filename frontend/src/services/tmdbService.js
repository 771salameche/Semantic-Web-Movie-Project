// Service pour récupérer les posters de films via TMDB API
const TMDB_API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb'; // Clé API publique pour démo
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Cache pour éviter les requêtes répétées
const posterCache = new Map();

// Rechercher un film et récupérer son poster
export const getMoviePoster = async (title, year) => {
  const cacheKey = `${title}-${year}`;

  if (posterCache.has(cacheKey)) {
    return posterCache.get(cacheKey);
  }

  try {
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}&language=fr-FR`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      const posterData = {
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}` : null,
        overview: movie.overview,
        voteAverage: movie.vote_average,
        tmdbId: movie.id
      };

      posterCache.set(cacheKey, posterData);
      return posterData;
    }

    return null;
  } catch (error) {
    console.error('Erreur TMDB:', error);
    return null;
  }
};

// Récupérer les posters pour une liste de films
export const getMoviePosters = async (films) => {
  const promises = films.map(film =>
    getMoviePoster(film.titre?.value, film.annee?.value)
  );

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => ({
    ...films[index],
    tmdb: result.status === 'fulfilled' ? result.value : null
  }));
};

// Obtenir l'URL du poster avec fallback
export const getPosterUrl = (tmdbData, size = 'w500') => {
  if (tmdbData?.poster) {
    return tmdbData.poster.replace('/w500/', `/${size}/`);
  }
  return null;
};

// Obtenir l'URL du backdrop
export const getBackdropUrl = (tmdbData, size = 'w1280') => {
  if (tmdbData?.backdrop) {
    return tmdbData.backdrop.replace('/w1280/', `/${size}/`);
  }
  return null;
};
