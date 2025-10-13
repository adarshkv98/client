import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/bookings/my');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      <p>Email: {user.email}</p>

      <h3 className="mt-4">My Bookings</h3>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Seats</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.movie.title}</td>
              <td>{b.seats.join(', ')}</td>
              <td>{new Date(b.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfilePage;
