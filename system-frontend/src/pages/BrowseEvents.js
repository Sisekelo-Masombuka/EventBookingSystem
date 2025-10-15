import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents, fetchCities, fetchCategories, setFilters, clearFilters, setCurrentPage } from '../redux/slices/eventsSlice';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowseEvents = () => {
  const dispatch = useDispatch();
  const { events, cities, categories, filters, pagination, loading, error } = useSelector((state) => state.events);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    dispatch(fetchEvents(filters));
    dispatch(fetchCities());
    dispatch(fetchCategories());
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchEvents({ ...filters, page }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
              <p className="mt-2 text-gray-600">
                Discover amazing events happening across South Africa
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-4 lg:mt-0 lg:ml-8">
              <div className="flex">
                <div className="relative flex-1 min-w-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Search events..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FaFilter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={handleClearFilters}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" text="Loading events..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg font-semibold mb-2">Error loading events</div>
                <div className="text-gray-600">{error}</div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <FaTicketAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 text-lg font-semibold mb-2">No events found</div>
                <div className="text-gray-500">Try adjusting your filters or search terms</div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-600">
                    Showing {events.length} of {pagination.totalCount} events
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="h-48 bg-gray-200 relative">
                        {event.posterUrl ? (
                          <img
                            src={event.posterUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                            <FaTicketAlt className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {event.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-600" />
                          <span className="text-sm">{event.locationCity}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <FaCalendarAlt className="w-4 h-4 mr-2 text-red-600" />
                          <span className="text-sm">{formatDate(event.startDateTime)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-red-600">
                            From {formatPrice(event.minPrice)}
                          </div>
                          <Link
                            to={`/events/${event.id}`}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                    
                    <div className="flex space-x-2">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-red-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <FaChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;