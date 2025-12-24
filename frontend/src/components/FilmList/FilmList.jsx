import React, { useState, useMemo } from 'react';
import { useFilms } from '../../hooks/useFilms';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useFilmContext } from '../../context/FilmContext';
import FilmCard from '../FilmCard/FilmCard';
import Loader from '../Loader/Loader';
import './FilmList.css';

const FILMS_PER_PAGE = 20;

const FilmList = () => {
  const { films } = useFilms();
  const { fetchRecommendations } = useRecommendations();
  const { loading, error, selectedFilm } = useFilmContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');

  // Extract unique genres
  const genres = useMemo(() => {
    const genreSet = new Set();
    films.forEach(film => {
      const filmGenres = film.genre?.value?.split(', ') || [];
      filmGenres.forEach(g => genreSet.add(g.trim()));
    });
    return Array.from(genreSet).sort();
  }, [films]);

  // Filter and sort films
  const filteredFilms = useMemo(() => {
    let result = [...films];

    // Filter by genre
    if (filterGenre !== 'all') {
      result = result.filter(film =>
        film.genre?.value?.includes(filterGenre)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.titre?.value || '').localeCompare(b.titre?.value || '');
        case 'year-desc':
          return (parseInt(b.annee?.value) || 0) - (parseInt(a.annee?.value) || 0);
        case 'year-asc':
          return (parseInt(a.annee?.value) || 0) - (parseInt(b.annee?.value) || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [films, filterGenre, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredFilms.length / FILMS_PER_PAGE);
  const paginatedFilms = filteredFilms.slice(
    (currentPage - 1) * FILMS_PER_PAGE,
    currentPage * FILMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (genre) => {
    setFilterGenre(genre);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  if (loading && films.length === 0) {
    return (
      <section className="film-list-section">
        <Loader message="Chargement des films..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="film-list-section">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="error-title">Connexion impossible</h3>
          <p className="error-text">{error}</p>
          <p className="error-hint">
            Vérifiez que Fuseki est démarré sur <code>localhost:3030</code>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="film-list-section">
      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-group">
          <label className="filter-label">Genre</label>
          <select
            className="filter-select"
            value={filterGenre}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">Tous les genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Trier par</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="title">Titre A-Z</option>
            <option value="year-desc">Année (récent)</option>
            <option value="year-asc">Année (ancien)</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="stats-count">{filteredFilms.length}</span>
          <span className="stats-label">films</span>
        </div>
      </div>

      {/* Films Grid */}
      {paginatedFilms.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
          </svg>
          <h3>Aucun film trouvé</h3>
          <p>Essayez un autre filtre</p>
        </div>
      ) : (
        <div className="films-grid">
          {paginatedFilms.map((film, index) => (
            <FilmCard
              key={film.uri?.value || index}
              film={film}
              index={index}
              onSelect={fetchRecommendations}
              isSelected={selectedFilm?.uri?.value === film.uri?.value}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default FilmList;
