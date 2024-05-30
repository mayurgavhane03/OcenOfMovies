import React, { useState } from 'react';
import axios from 'axios';

const MovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    screenshots: [],
    type: [],
    imdbRating: '',
    directors: [],
    stars: [],
    languages: [],
    quality: {
      '480p': '',
      '720p': '',
      '1080p': ''
    },
    genres: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle quality field changes separately
    if (['480p', '720p', '1080p'].includes(name)) {
      setFormData({
        ...formData,
        quality: {
          ...formData.quality,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(',').map(item => item.trim())
    });
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mern_product'); // Replace 'mern_product' with your Cloudinary upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/doi13tpyz/image/upload', {
      method: 'POST',
      body: data
    });

    return response.json();
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await uploadImage(file);
      setFormData({
        ...formData,
        imageUrl: response.secure_url
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScreenshotsUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    try {
      setIsLoading(true);
      const uploadedFiles = Array.from(files);
      const urls = [];

      for (const file of uploadedFiles) {
        const response = await uploadImage(file);
        urls.push(response.secure_url);
      }

      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, ...urls]
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Set imdbRating to '-' if it is an empty string
      const dataToSend = {
        ...formData,
        imdbRating: formData.imdbRating === '' ? '-' : formData.imdbRating
      };

      // Send data to backend API
      const response = await axios.post('http://localhost:5000/api/movies', dataToSend);
      console.log('Movie created:', response.data);

      // Show success alert
      alert('Movie created successfully!');

      // Reset form data
      setFormData({
        title: '',
        imageUrl: '',
        screenshots: [],
        type: [],
        imdbRating: '',
        directors: [],
        stars: [],
        languages: [],
        quality: {
          '480p': '',
          '720p': '',
          '1080p': ''
        },
        genres: []
      });
    } catch (error) {
      console.error('Error creating movie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-4">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block mb-1">
            Main Image
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageUrl"
            onChange={handleMainImageUpload}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
          {formData.imageUrl && (
            <div className="relative">
              <img
                src={formData.imageUrl}
                alt="Main"
                className="mt-2 w-32 h-auto"
              />
              <button
                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                className="absolute top-2 right-2 text-white focus:outline-none"
              >
                ❌
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="screenshots" className="block mb-1">
            Screenshots
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            id="screenshots"
            onChange={handleScreenshotsUpload}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
          {formData.screenshots.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {formData.screenshots.map((imageUrl, index) => (
                <div key={index} className="relative mr-2 mb-2">
                  <img
                    src={imageUrl}
                    alt={`Screenshot ${index + 1}`}
                    className="w-24 h-auto"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, screenshots: formData.screenshots.filter((_, i) => i !== index) })}
                    className="absolute top-2 right-2 text-white focus:outline-none"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block mb-1">
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type.join(", ")}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imdbRating" className="block mb-1">
            IMDb Rating
          </label>
          <input
            type="number"
            id="imdbRating"
            name="imdbRating"
            value={formData.imdbRating}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="directors" className="block mb-1">
            Directors
          </label>
          <input
            type="text"
            id="directors"
            name="directors"
            value={formData.directors.join(", ")}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stars" className="block mb-1">
            Stars
          </label>
          <input
            type="text"
            id="stars"
            name="stars"
            value={formData.stars.join(", ")}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="languages" className="block mb-1">
            Languages
          </label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={formData.languages.join(", ")}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="quality" className="block mb-1">
            Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(formData.quality).map((quality, index) => (
              <input
                key={index}
                type="text"
                id={quality}
                name={quality}
                value={formData.quality[quality]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="genres" className="block mb-1">
            Genres
          </label>
          <input
            type="text"
            id="genres"
            name="genres"
            value={formData.genres.join(", ")}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Movie'}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
