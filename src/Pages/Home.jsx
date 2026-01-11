import React, { useState } from "react";
import Cards from "../Components/Cards";
import { BiMoviePlay } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState("");
  const [loadingRec, setLoadingRec] = useState(false);

  //  Search movies from OMDB
  async function searchMovies() {
    try {
      setError("");
      const res = await fetch(
        `https://www.omdbapi.com/?s=${search}&apikey=d85b58ea`
      );
      const data = await res.json();

      setDatas(data.Search || []);
      setError(data.Error || "");

      // Call ML backend using first search result
      if (data.Search && data.Search.length > 0) {
        fetchMLRecommendations(data.Search[0].Title);
      } else {
        setRecommended([]);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong while searching");
    }
  }

  // Fetch recommendations from Python ML backend
  async function fetchMLRecommendations(movieTitle) {
    try {
      setLoadingRec(true);
      const res = await fetch(
        `https://movie-recommender-ml-backend.onrender.com/recommend?title=${movieTitle}`
      );
      const data = await res.json();
      setRecommended(data.recommendations || []);
    } catch (error) {
      console.log("ML backend error", error);
    } finally {
      setLoadingRec(false);
    }
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="container text-center my-4">
        <h2 className="fw-bold text-primary">
          AI-Based Movie Recommendation System <BiMoviePlay />
        </h2>
        <p className="text-muted">
          Content-Based Filtering using Machine Learning (TF-IDF + Cosine
          Similarity)
        </p>

        <div className="d-flex justify-content-center my-3">
          <input
            className="form-control w-50 me-2"
            type="search"
            placeholder="Search a movie (e.g. Inception)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={searchMovies}>
            Search
          </button>
        </div>

        {error && <p className="text-danger fw-bold">{error}</p>}
      </div>

      {/* ================= SEARCH RESULTS ================= */}
      {datas.length > 0 && (
        <>
          <h3 className="section-title">🔍 Search Results</h3>
          <div className="my-col">
            {datas.map((movie, index) => (
              <Cards key={index} data={movie} />
            ))}
          </div>
        </>
      )}

      {/* ================= ML RECOMMENDATIONS ================= */}
      <h3 className="section-title">🤖 ML Recommended Movies</h3>

      {loadingRec && (
        <p style={{ marginLeft: "20px" }}>
          Generating recommendations using Machine Learning...
        </p>
      )}

      <div className="my-col">
        {recommended.map((title, index) => (
          <div key={index} className="container-card">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted">
                  Recommended based on content similarity
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="container my-5">
        <h4 className="fw-bold">🧠 How the Recommendation Works</h4>
        <p>
          This system uses a <b>content-based recommendation algorithm</b>.
          Movie metadata such as <b>genre</b> and <b>plot</b> is converted into
          numerical vectors using <b>TF-IDF vectorization</b>.
          <b> Cosine similarity</b> is then used to find movies that are most
          similar to the user’s searched movie, and the top results are
          recommended.
        </p>
      </div>
    </>
  );
}
