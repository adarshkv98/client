import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import axios from '../api/axiosConfig';

function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('/movies');
        setMovies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Now Showing</h2>
      <div className="row g-4">
        {movies.map(movie => (
          <div key={movie._id} className="col-md-3">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
