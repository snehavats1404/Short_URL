// src/components/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UrlForm from './URL/UrlForm';
import UrlList from './URL/UrlList';

const Dashboard = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          URL Shortener Dashboard
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <UrlForm />
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Shortened URLs</h2>
            <UrlList  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;