import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      <div className="flex flex-wrap gap-6">
        {movies.map(movie => (
          <Link key={movie._id} to={`/movie/${movie._id}`} className="no-underline">
            <div className="border border-gray-300 p-4 rounded-lg w-48 shadow-md hover:shadow-lg transition-shadow duration-200">
              <img src={movie.imageUrl} alt={movie.title} className="w-full rounded-lg mb-4" />
              <h3 className="text-xl font-semibold">{movie.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
