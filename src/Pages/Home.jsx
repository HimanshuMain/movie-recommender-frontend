import React, { useState, useEffect, useRef } from "react";
import Cards from "../Components/Cards";
import SkeletonCard from "../Components/SkeletonCard";
import "../App.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [infoText, setInfoText] = useState("");

  // In-memory OMDB cache
  const omdbCache = useRef({});

  // Apply theme + load cache
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";

    const savedCache = localStorage.getItem("omdbCache");
    if (savedCache) {
      omdbCache.current = JSON.parse(savedCache);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 🔍 Search movies from OMDB
  async function searchMovies() {
    if (!search.trim()) return;

    setLoading(true);
    setInfoText("Searching movies…");
    setMovies([]);
    setRecommended([]);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${search}&apikey=d85b58ea`
      );
      const data = await res.json();

      if (data.Search) {
        setMovies(data.Search);
        setInfoText(`Because you searched "${data.Search[0].Title}"`);
        fetchMLRecommendations(data.Search[0].Title);
      } else {
        setInfoText("No results found");
      }
    } catch (err) {
      console.error(err);
      setInfoText("Something went wrong");
    }

    setLoading(false);
  }

  // 🤖 Fetch ML recommendations + enrich with OMDB (cached)
  async function fetchMLRecommendations(title) {
    try {
      const res = await fetch(
        `https://movie-recommender-ml-backend.onrender.com/recommend?title=${title}`
      );
      const data = await res.json();

      const enriched = await Promise.all(
        data.recommendations.map(async (rec) => {
          // Check cache first
          if (omdbCache.current[rec.title]) {
            return {
              ...omdbCache.current[rec.title],
              similarity: rec.similarity,
            };
          }

          // Fetch from OMDB
          const omdbRes = await fetch(
            `https://www.omdbapi.com/?t=${rec.title}&apikey=d85b58ea`
          );
          const omdbData = await omdbRes.json();

          // Save to cache
          omdbCache.current[rec.title] = omdbData;
          localStorage.setItem("omdbCache", JSON.stringify(omdbCache.current));

          return {
            ...omdbData,
            similarity: rec.similarity,
          };
        })
      );

      setRecommended(enriched);
    } catch (err) {
      console.error("ML backend not responding yet");
    }
  }

  // ⌨️ Enter key search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchMovies();
  };

  return (
    <div className="home-wrapper">
      {/* ===== HEADER ===== */}
      <header className="top-bar">
        <h1 className="app-title">MovieLens AI</h1>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* ===== SEARCH ===== */}
      <section className="search-section">
        <input
          className="search-input"
          type="text"
          placeholder="Search a movie and press Enter…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </section>

      {/* ===== IDLE STATE ===== */}
      {!loading && movies.length === 0 && !infoText && (
        <div className="idle-state">
          <h2>🎬 Welcome to MovieLens AI</h2>
          <p>
            Discover movies intelligently using Machine Learning–based
            recommendations.
          </p>
          <p className="muted">
            Try searching for: Inception, Interstellar, Avatar, Titanic
          </p>
        </div>
      )}

      {/* ===== INFO TEXT ===== */}
      {infoText && <p className="info-text">{infoText}</p>}

      {/* ===== LOADING SKELETON ===== */}
      {loading && (
        <div className="movie-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ===== SEARCH RESULTS ===== */}
      {movies.length > 0 && !loading && (
        <section className="section">
          <h3 className="section-title">Search Results</h3>
          <div className="movie-grid">
            {movies.map((movie, i) => (
              <Cards key={i} data={movie} />
            ))}
          </div>
        </section>
      )}

      {/* ===== AI RECOMMENDATIONS ===== */}
      {recommended.length > 0 && (
        <section className="section">
          <h3 className="section-title">Recommended for You (AI)</h3>
          <div className="movie-grid">
            {recommended.map((movie, i) => (
              <Cards key={i} data={movie} similarity={movie.similarity} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
