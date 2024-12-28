import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';

const UrlList = ({}) => {
  const { user, loading: authLoading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const fetchUrls = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fixed API endpoint
        const response = await api.get('/');
        setUrls(response.data.urls || []);
      } catch (err) {
        console.error('Error fetching URLs:', err);
        setError('Failed to load URLs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [user, authLoading]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your URLs.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (urls.length === 0) {
    return <div className="text-gray-400">No shortened URLs found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Short URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {urls.map((url) => (
            <tr key={url._id}>
              <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-xs">
                <a href={url.redirectURL} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  {url.redirectURL}
                </a>
              </td>
              <td className="px-6 py-4 text-sm text-green-400">
                <a href={`http://localhost:8006/url/${url.shortid}`} target="_blank" rel="noopener noreferrer">
                  {url.shortid}
                </a>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{url.visitHistory?.length || 0}</td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlList;