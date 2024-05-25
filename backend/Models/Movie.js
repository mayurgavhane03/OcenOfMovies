const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  screenshots: { type: [String], default: [] }, // Array of image URLs for screenshots
  type: { type: [String], required: true },
  imdbRating: { type: Number, min: 0, max: 10 },
  directors: { type: [String], required: true },
  stars: { type: [String], required: true },
  languages: { type: [String], required: true },
  quality: {
    '480p': { type: String },
    '720p': { type: String },
    '1080p': { type: String }
  },
  genres: { type: [String], required: true }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
