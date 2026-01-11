import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Cards({ data, similarity }) {
  const poster =
    data.Poster && data.Poster !== "N/A"
      ? data.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <Link to={`/detail/${data.imdbID}`} className="movie-card">
      <div className="movie-card-inner">
        <div className="poster-wrapper">
          <img src={poster} alt={data.Title} />

          {similarity && (
            <div className="similarity-badge">{similarity}% Match</div>
          )}
        </div>

        <div className="movie-info">
          <h4 className="movie-title">{data.Title}</h4>
          <p className="movie-year">{data.Year}</p>
        </div>
      </div>
    </Link>
  );
}
