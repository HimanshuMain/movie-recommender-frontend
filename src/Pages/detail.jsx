import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useWatchlist from "../hooks/useWatchlist";
import "../App.css";

export default function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleWatchlist, isSaved } = useWatchlist();

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=d85b58ea`
      );
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    }
    fetchMovie();
  }, [id]);

  if (loading) {
    return <p className="loading-text">Loading movie details…</p>;
  }

  return (
    <div className="detail-container">
      <div className="detail-card">
        <img src={movie.Poster} alt={movie.Title} className="detail-poster" />

        <div className="detail-info">
          <h1>{movie.Title}</h1>
          <p className="muted">
            {movie.Year} • {movie.Genre} • IMDb {movie.imdbRating}
          </p>

          <p className="plot">{movie.Plot}</p>

          <button
            className="watchlist-btn"
            onClick={() => toggleWatchlist(movie)}
          >
            {isSaved(movie.imdbID) ? "✓ In Watchlist" : "+ Add to Watchlist"}
          </button>

          <div className="explain-box">
            <h4>Why this movie?</h4>
            <p>
              This movie is recommended because it shares similar themes,
              genres, and storytelling patterns with movies you searched for.
              Our AI compares plot semantics, genres, cast, and directors to
              find the closest match.
            </p>
          </div>

          <Link to="/" className="back-link">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
