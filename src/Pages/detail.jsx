import React, { useEffect, useState } from "react";
import { Badge, Stack } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=d85b58ea`
      );
      const data = await res.json();
      setMovie(data);
      if (data.Genre) {
        setGenres(data.Genre.split(","));
      }
    }
    fetchMovie();
  }, [id]);

  if (!movie) {
    return <p className="text-center mt-5">Loading movie details...</p>;
  }

  return (
    <div className="outer-main">
      <div className="container-detail">
        <h1 className="detailHeading1">Movie Details</h1>

        <div className="main">
          <div className="sub-con-1">
            <img src={movie.Poster} alt={movie.Title} className="posterClass" />

            <div className="mt-3">
              {genres.map((g, i) => (
                <Stack key={i} direction="horizontal" className="my-stack">
                  <Badge bg="primary">{g}</Badge>
                </Stack>
              ))}
            </div>
          </div>

          <div className="sub-con-2">
            <h2 className="detailHeading2">{movie.Title}</h2>
            <p>
              <b>Year:</b> {movie.Year}
            </p>
            <p>
              <b>IMDB Rating:</b> ⭐ {movie.imdbRating}
            </p>
            <p>
              <b>Actors:</b> {movie.Actors}
            </p>
            <p>
              <b>Director:</b> {movie.Director}
            </p>
            <p>
              <b>Genre:</b> {movie.Genre}
            </p>
            <p className="mt-3">{movie.Plot}</p>

            <hr />

            <p className="text-muted">
              Recommendations for this movie are generated using
              <b> content-based machine learning</b> by comparing movie
              features.
            </p>
          </div>
        </div>

        <div className="btn-container mt-4">
          <Link to="/" className="btn btn-primary">
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
