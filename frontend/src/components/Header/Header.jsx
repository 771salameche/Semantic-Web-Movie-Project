import React from 'react';
import { useFilmContext } from '../../context/FilmContext';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';

const Header = () => {
  const { films } = useFilmContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-bg"></div>
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18V19.82C2 21.03 2.97 22 4.18 22H19.82C21.03 22 22 21.03 22 19.82V4.18C22 2.97 21.03 2 19.82 2Z" fill="url(#gradient1)"/>
                <path d="M7 7H9V17H7V7Z" fill="white"/>
                <path d="M11 7H13V17H11V7Z" fill="white"/>
                <path d="M15 7H17V17H15V7Z" fill="white"/>
                <defs>
                  <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22">
                    <stop stopColor="#e50914"/>
                    <stop offset="1" stopColor="#b81d24"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <h1>SmartCine</h1>
              <span className="logo-tagline">Semantic Film Recommender</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{films.length || 0}</span>
              <span className="stat-label">Films</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">SPARQL</span>
              <span className="stat-label">Powered</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">RDF</span>
              <span className="stat-label">Ontology</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <div className="tech-badges">
            <span className="badge">Web Sémantique</span>
            <span className="badge badge-accent">Fuseki</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
