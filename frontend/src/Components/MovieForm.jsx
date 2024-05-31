import React, { useState } from 'react';
import axios from 'axios';

const MovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    screenshots: [],
    type: '',
    imdbRating: '',
    directors: [],
    stars: [],
    languages: [],
    genres: [],
    allInOne: {
      '480p': { url: '', size: '' },
      '720p': { url: '', size: '' },
      '1080p': { url: '', size: '' },
    },
    episodes: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [newEpisode, setNewEpisode] = useState({ title: '', qualities: { '480p': '', '720p': '', '1080p': '' } });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield, subsubfield] = name.split('.');

    if (subsubfield) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [subfield]: {
            ...prevData[field][subfield],
            [subsubfield]: value,
          },
        },
      }));
    } else if (subfield) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [subfield]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(',').map((item) => item.trim()),
    });
  };

  const handleEpisodeChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

    if (field === 'qualities' && subfield) {
      setNewEpisode((prevData) => ({
        ...prevData,
        qualities: {
          ...prevData.qualities,
          [subfield]: value,
        },
      }));
    } else {
      setNewEpisode({
        ...newEpisode,
        [name]: value,
      });
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mern_product');

    const response = await fetch('https://api.cloudinary.com/v1_1/doi13tpyz/image/upload', {
      method: 'POST',
      body: data,
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
        imageUrl: response.secure_url,
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
        screenshots: [...formData.screenshots, ...urls],
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEpisode = () => {
    setFormData((prevData) => ({
      ...prevData,
      episodes: [...prevData.episodes, newEpisode],
    }));
    setNewEpisode({ title: '', qualities: { '480p': '', '720p': '', '1080p': '' } });
  };

  const handleRemoveEpisode = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      episodes: prevData.episodes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure allInOne is an empty object if not provided
      const allInOne = formData.allInOne || {
        '480p': { url: '', size: '' },
        '720p': { url: '', size: '' },
        '1080p': { url: '', size: '' },
      };

      // Ensure episodes is an empty array if not provided
      const episodes = formData.episodes || [];

      const dataToSend = {
        ...formData,
        allInOne,
        episodes,
        imdbRating: formData.imdbRating === '' ? '-' : formData.imdbRating,
      };

      const response = await axios.post('http://localhost:5000/api/movies', dataToSend);
      console.log('Movie created:', response.data);

      alert('Movie created successfully!');

      setFormData({
        title: '',
        imageUrl: '',
        screenshots: [],
        type: '',
        imdbRating: '',
        directors: [],
        stars: [],
        languages: [],
        genres: [],
        allInOne: {
          '480p': { url: '', size: '' },
          '720p': { url: '', size: '' },
          '1080p': { url: '', size: '' },
        },
        episodes: [],
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
          <label htmlFor="title" className="block mb-1">Title</label>
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
          <label htmlFor="imageUrl" className="block mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            id="imageUrl"
            onChange={handleMainImageUpload}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
          {formData.imageUrl && (
            <div className="relative">
              <img src={formData.imageUrl} alt="Main" className="mt-2 w-32 h-auto" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                className="absolute top-2 right-2 text-white focus:outline-none"
              >
                ❌
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="screenshots" className="block mb-1">Screenshots</label>
          <input
            type="file"
            accept="image/*"
            id="screenshots"
            multiple
            onChange={handleScreenshotsUpload}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
          {formData.screenshots.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {formData.screenshots.map((imageUrl, index) => (
                <div key={index} className="relative mr-2 mb-2">
                  <img src={imageUrl} alt={`Screenshot ${index + 1}`} className="w-24 h-auto" />
                  <button
                    type="button"
                    onClick={() => setFormData((prevData) => ({
                      ...prevData,
                      screenshots: prevData.screenshots.filter((_, i) => i !== index),
                    }))}
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
          <label htmlFor="type" className="block mb-1">Type</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imdbRating" className="block mb-1">IMDb Rating</label>
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
          <label htmlFor="directors" className="block mb-1">Directors</label>
          <input
            type="text"
            id="directors"
            name="directors"
            value={formData.directors.join(', ')}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stars" className="block mb-1">Stars</label>
          <input
            type="text"
            id="stars"
            name="stars"
            value={formData.stars.join(', ')}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="languages" className="block mb-1">Languages</label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={formData.languages.join(', ')}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="allInOne" className="block mb-1">Quality</label>
          {['480p', '720p', '1080p'].map((quality) => (
            <div key={quality} className="mb-2">
              <label className="block mb-1 capitalize">{quality}</label>
              <input
                type="text"
                placeholder="URL"
                name={`allInOne.${quality}.url`}
                value={formData.allInOne[quality].url}
                onChange={handleChange}
                className="w-full px-3 py-2 mb-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Size"
                name={`allInOne.${quality}.size`}
                value={formData.allInOne[quality].size}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label htmlFor="genres" className="block mb-1">Genres</label>
          <input
            type="text"
            id="genres"
            name="genres"
            value={formData.genres.join(', ')}
            onChange={handleArrayChange}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
          />
        </div>

        {formData.type.toLowerCase() === 'series' && (
          <div className="mb-4">
            <h3 className="text-lg mb-2">Episodes</h3>
            {formData.episodes.map((episode, index) => (
              <div key={index} className="mb-4 p-2 bg-gray-900 rounded">
                <h4 className="mb-2">{`Episode ${index + 1}: ${episode.title}`}</h4>
                {['480p', '720p', '1080p'].map((quality) => (
                  <p key={quality}>
                    <strong>{quality}:</strong> {episode.qualities[quality]}
                  </p>
                ))}
                <button
                  type="button"
                  onClick={() => handleRemoveEpisode(index)}
                  className="mt-2 py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove Episode
                </button>
              </div>
            ))}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Episode Title"
                name="title"
                value={newEpisode.title}
                onChange={handleEpisodeChange}
                className="w-full px-3 py-2 mb-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
              />
              {['480p', '720p', '1080p'].map((quality) => (
                <div key={quality} className="mb-2">
                  <label className="block mb-1 capitalize">{quality}</label>
                  <input
                    type="text"
                    placeholder="URL"
                    name={`qualities.${quality}`}
                    value={newEpisode.qualities[quality]}
                    onChange={handleEpisodeChange}
                    className="w-full px-3 py-2 mb-2 bg-gray-800 rounded text-white outline-none focus:bg-gray-700"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEpisode}
                className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none"
              >
                Add Episode
              </button>
            </div>
          </div>
        )}

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
