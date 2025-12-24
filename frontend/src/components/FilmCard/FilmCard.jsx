import React, { useState, useEffect } from 'react';
import { getMoviePoster } from '../../services/tmdbService';
import './FilmCard.css';

const FilmCard = ({ film, onSelect, isSelected, isRecommendation, index = 0 }) => {
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoster = async () => {
      setLoading(true);
      const data = await getMoviePoster(
        film.titre?.value,
        film.annee?.value
      );
      setPoster(data);
      setLoading(false);
    };
    fetchPoster();
  }, [film.titre?.value, film.annee?.value]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(film);
    }
  };

  const title = film.titre?.value || 'Sans titre';
  const year = film.annee?.value;
  const duration = film.duree?.value;
  const genres = film.genre?.value?.split(', ').slice(0, 2) || [];
  const director = film.realisateur?.value;
  const rating = poster?.voteAverage?.toFixed(1) || null;

  return (
    <div
      className={`film-card ${isSelected ? 'selected' : ''} ${isRecommendation ? 'recommendation' : ''}`}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="film-poster">
        {loading ? (
          <div className="film-poster-placeholder skeleton"></div>
        ) : poster?.poster ? (
          <>
            <img src={poster.poster} alt={title} loading="lazy" />
            <div className="film-poster-overlay"></div>
          </>
        ) : (
          <div className="film-poster-placeholder">
            {title[0].toUpperCase()}
          </div>
        )}

        {rating && (
          <div className="film-rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>{rating}</span>
          </div>
        )}

        {isSelected && (
          <div className="film-selected-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

      <div className="film-info">
        <h3 className="film-title">{title}</h3>

        <div className="film-meta">
          {year && <span className="film-year">{year}</span>}
          {duration && (
            <span className="film-duration">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {duration} min
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="film-genres">
            {genres.map((genre, i) => (
              <span key={i} className="genre-chip">{genre}</span>
            ))}
          </div>
        )}

        {director && !isRecommendation && (
          <p className="film-director">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 8-6 4 6 4V8Z"></path>
              <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
            </svg>
            {director}
          </p>
        )}
      </div>
    </div>
  );
};

export default FilmCard;
