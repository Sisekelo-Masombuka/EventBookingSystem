import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../redux/slices/favoritesSlice';
import { FaHeart, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-ZA');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-gray-600">Events you have saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading favorites...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center">
            <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-600">No favorites yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((f) => (
              <div key={f.id || f.eventId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200">
                  {f.posterUrl ? (
                    <img src={f.posterUrl} alt={f.eventTitle} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{f.eventTitle || f.title}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm">{f.city}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm">{formatDate(f.startDateTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to={`/events/${f.eventId}`} className="text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">View</Link>
                    <button onClick={() => dispatch(removeFavorite(f.eventId)).then(() => dispatch(fetchFavorites()))} className="text-sm text-red-600 hover:text-red-700 flex items-center">
                      <FaHeart className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
