import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/movies/${id}`)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  if (!movie) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-6">
     
      
      <img src={movie.imageUrl} alt={movie.title} className="w-auto h-[500px] rounded-lg mb-4" />
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-2">Rating: {movie.imdbRating.$numberDouble}</p>
      <p className="mb-2">Directors: {movie.directors.join(', ')}</p>
      <p className="mb-2">Stars: {movie.stars.join(', ')}</p>
      <p className="mb-2">Languages: {movie.languages.join(', ')}</p>
      <p className="mb-2">Genres: {movie.genres.join(', ')}</p>
      <p className="mb-2">Quality: 
        <a href={movie.quality['480p']} className="text-blue-400" target="_blank" rel="noopener noreferrer"> 480p</a>, 
        <a href={movie.quality['720p']} className="text-blue-400" target="_blank" rel="noopener noreferrer"> 720p</a>, 
        <a href={movie.quality['1080p']} className="text-blue-400" target="_blank" rel="noopener noreferrer"> 1080p</a>
      </p>
    </div>
  );
}

export default MovieDetail;
