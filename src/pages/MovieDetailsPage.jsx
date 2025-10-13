import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="row">
      <div className="col-md-4">
        <img src={movie.poster} alt={movie.title} className="img-fluid rounded" />
      </div>
      <div className="col-md-8">
        <h2>{movie.title}</h2>
        <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Duration:</strong> {movie.duration} mins</p>
        <p>{movie.description}</p>
        <Link to={`/booking/${movie._id}`} className="btn btn-primary">Book Now</Link>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
