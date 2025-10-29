import { useNavigate } from 'react-router-dom';
import Button from './Button';
import React from 'react';

const MovieCard = ({ id, title, posterUrl, rating, isPremium }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
  navigate(`/movies/${id}`); // ✅ same as App.jsx route
};


  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-64 object-cover"
        />
        {isPremium && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
            Premium
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {title}
        </h3>
        
        <div className="flex items-center mb-3">
          <span className="text-sm mr-2">{renderStars(rating)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {rating.toFixed(1)}
          </span>
        </div>
        
        <Button
          text="View Details"
          onClick={handleViewDetails}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default MovieCard;