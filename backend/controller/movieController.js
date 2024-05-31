const Movie = require('../Models/Movie');

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by type
const getMoviesByType = async (req, res) => {
  try {
    const movies = await Movie.find({ type: req.params.type });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by rating
const getMoviesByRating = async (req, res) => {
  try {
    const movies = await Movie.find({ imdbRating: { $gte: Number(req.params.rating) } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by title
const getMoviesByTitle = async (req, res) => {
  try {
    const movies = await Movie.find({ title: { $regex: req.params.title, $options: 'i' } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by language
const getMoviesByLanguage = async (req, res) => {
  try {
    const movies = await Movie.find({ languages: req.params.language });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by quality
const getMoviesByQuality = async (req, res) => {
  try {
    const qualityField = `allInOne.${req.params.quality}`;
    const movies = await Movie.find({ [qualityField]: { $exists: true } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by genre
const getMoviesByGenre = async (req, res) => {
  try {
    const movies = await Movie.find({ genres: req.params.genre });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMoviesByType,
  getMoviesByRating,
  getMoviesByTitle,
  getMoviesByLanguage,
  getMoviesByQuality,
  getMoviesByGenre,
  getMovieById,
  updateMovie,
  deleteMovie
};
