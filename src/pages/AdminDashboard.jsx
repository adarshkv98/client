import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [poster, setPoster] = useState('');

  const fetchMovies = async () => {
    try {
      const res = await axios.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/movies', { title, genre, poster });
      setTitle('');
      setGenre('');
      setPoster('');
      fetchMovies();
    } catch (err) {
      console.error(err);
      alert('Failed to add movie!');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h4 className="mt-4">Add Movie</h4>
      <form onSubmit={handleAddMovie}>
        <div className="mb-3">
          <input className="form-control" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Poster URL" value={poster} onChange={e => setPoster(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Add Movie</button>
      </form>

      <h4 className="mt-4">All Movies</h4>
      <ul className="list-group mt-2">
        {movies.map(movie => (
          <li key={movie._id} className="list-group-item d-flex justify-content-between align-items-center">
            {movie.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
