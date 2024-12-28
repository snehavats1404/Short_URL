// src/components/URL/UrlForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';

const UrlForm = ({}) => {
  const [longUrl, setLongUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setShortUrl('');

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Add http:// if no protocol is specified
    let urlToShorten = longUrl;
    if (!/^https?:\/\//i.test(longUrl)) {
      urlToShorten = 'http://' + longUrl;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/url', { 
        url: urlToShorten 
      });
      
      const generatedShortUrl = `http://localhost:8006/url/${response.data.shortid}`;
      setShortUrl(generatedShortUrl);
      setLongUrl('');
      
    } catch (err) {
      console.error('Error shortening URL:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to shorten URL. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter your URL here (e.g., google.com)"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors duration-200 disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
      </form>

      {shortUrl && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-green-400 mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-4">
            <a 
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                alert('URL copied to clipboard!');
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;