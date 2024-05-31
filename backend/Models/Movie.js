const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['movie', 'series'], required: true },
  imdbRating: { type: Number, min: 0, max: 10 },
  directors: { type: [String], required: true },
  stars: { type: [String], required: true },
  languages: { type: [String], required: true },
  screenshots: { type: [String], default: [] },
  genres: { type: [String], required: true },
  allInOne: {
    '480p': { url: String, size: String },
    '720p': { url: String, size: String },
    '1080p': { url: String, size: String }
  },
  episodes: [{
    title: { type: String },
    qualities: {
      '480p': { type: String },
      '720p': { type: String },
      '1080p': { type: String }
    }
  }],
  createdAt: { type: Date, default: Date.now },
});

// Set default values for fields
movieSchema.pre('save', function (next) {
  if (!this.allInOne) {
    this.allInOne = {};
  }
  if (!this.episodes) {
    this.episodes = [];
  }
  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
