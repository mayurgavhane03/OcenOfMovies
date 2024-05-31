import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { JoinTelegram } from "../constant";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Function to check if all URLs are available
  const areAllUrlsAvailable = () => {
    for (const quality in movie.allInOne) {
      if (!movie.allInOne[quality].url) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl text-white font-bold mb-10">{movie.title}</h1>
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-auto h-[500px] mx-auto rounded-lg mb-4"
        />
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={JoinTelegram} alt="Join Telegram" />
          </Link>
        </div>
        <div className="text-white">
          <p className="mb-2 font-bold text-blue-500 text-2xl ">
            IMDb Rating: {movie.imdbRating}
          </p>
          <p className="mb-2 font-bold">
            Directors: <span className="font-normal">{movie.directors.join(", ")}</span>
          </p>
          <p className="mb-2 font-bold">
            Stars: <span className="font-normal">{movie.stars.join(", ")}</span>
          </p>
          <p className="mb-2 font-bold">
            Languages: <span className="font-normal">{movie.languages.join(", ")}</span>
          </p>
          <p className="mb-2 font-bold">
            Genres: <span className="font-bold text-blue-500 text-l">{movie.genres.join(", ")}</span>
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2 text-[#ff9900]">Screenshots</h2>
          <div className="grid grid-cols-2 gap-4">
            {movie.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-red-500  font-semibold text-2xl">DOWNLOAD LINKS</h1>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-white  font-bold"> All Qualities</p>
          <div className="flex flex-col">
            {areAllUrlsAvailable() && (
              <div className="mb-2 flex justify-center items-center">
                <Link
                  to={{ pathname: movie.allInOne.url }}
                  className="text-blue-400 ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  All Qualities
                </Link>
              </div>
            )}
            {Object.entries(movie.allInOne).map(([quality, info]) => (
              <div key={quality} className="mb-2 text-2xl flex font-serif  justify-center items-center">
                {/* <h1 className="text-white">{quality.toUpperCase()}</h1> */}
                <Link
                  to={{ pathname: info.url }}
                  className="text-blue-400 ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                 {movie.type=== 'series' ?  "Pack":"Download Full MOvie"}   {quality.toUpperCase()} Links 
                </Link>
                <span className="text-white ml-2 ">[{info.size}]</span>
              </div>
            ))}
          </div>
        </div>
        {movie.type === "series" && (
          <div className="mt-8 ">
            <h2 className="text-red-500 font-semibold text-2xl">Episodes</h2>
            {movie.episodes.map((episode, index) => (
              <div key={index} className="mt-4">
               
                <div className="flex  justify-center items-center ">
                <h3 className="text-xl font-bold text-[#ff9900] ">{episode.title}: </h3>
                  {Object.entries(episode.qualities).map(([quality, url]) => (
                    <Link
                      key={quality}
                      to={{ pathname: url }}
                      className="text-blue-400 ml-3 font-bold "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {quality.toUpperCase()} <span className="text-red-500 ml-3 font-extrabold">||</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
