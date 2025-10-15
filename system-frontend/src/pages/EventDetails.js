import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById, clearCurrentEvent } from '../redux/slices/eventsSlice';
import { addToCart, fetchCart } from '../redux/slices/cartSlice';
import { fetchFavorites, addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { fetchEventReviews, upsertReview } from '../redux/slices/reviewsSlice';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaTicketAlt, FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEvent, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const { byEvent: reviewsByEvent } = useSelector((state) => state.reviews);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchEventReviews(id));
      if (isAuthenticated) dispatch(fetchFavorites());
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, id, isAuthenticated]);

  // Favorites helpers
  const isFavorited = (eventId) => {
    return Array.isArray(favoriteItems) && favoriteItems.some((f) => f.eventId === eventId);
  };

  const toggleFavorite = async (eventId) => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    try {
      if (isFavorited(eventId)) {
        await dispatch(removeFavorite(eventId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addFavorite(eventId)).unwrap();
        toast.success('Added to wishlist');
      }
      await dispatch(fetchFavorites());
    } catch (e) {
      toast.error('Failed to update wishlist');
    }
  };

  // Reviews submit handler
  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    if (!myRating || myRating < 1 || myRating > 5) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }
    try {
      await dispatch(upsertReview({ eventId: id, rating: myRating, comment: myComment || null })).unwrap();
      toast.success('Review submitted');
      setMyComment('');
      setMyRating(0);
      await dispatch(fetchEventReviews(id));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to submit review');
    }
  };

  const handleTicketQuantityChange = (ticketTypeId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    if (numQuantity < 0) return;
    
    setSelectedTickets(prev => ({
      ...prev,
      [ticketTypeId]: numQuantity
    }));
  };

  const handleAddToCart = async (ticketTypeId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to add tickets to cart');
      navigate('/login');
      return;
    }

    if (quantity <= 0) {
      toast.error('Please select at least 1 ticket');
      return;
    }

    try {
      await dispatch(addToCart({
        ticketTypeId,
        quantity
      })).unwrap();
      
      toast.success(`${quantity} ticket(s) added to cart!`);
      // Refresh cart in store (Navbar badge + Basket)
      await dispatch(fetchCart());
      
      // Clear the selected quantity for this ticket type
      setSelectedTickets(prev => ({
        ...prev,
        [ticketTypeId]: 0
      }));
    } catch (error) {
      toast.error(error || 'Failed to add tickets to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalSelectedTickets = () => {
    return Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    if (!currentEvent) return 0;
    
    return currentEvent.ticketTypes.reduce((total, ticketType) => {
      const quantity = selectedTickets[ticketType.id] || 0;
      return total + (ticketType.price * quantity);
    }, 0);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading event details..." />;
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Info */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="mb-8">
              <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                {currentEvent.posterUrl ? (
                  <img
                    src={currentEvent.posterUrl}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <FaTicketAlt className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {currentEvent.title}
                    </h1>
                    {reviewsByEvent?.[id]?.averageRating !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const avg = reviewsByEvent[id].averageRating || 0;
                            const filled = i + 1 <= Math.round(avg);
                            return <span key={i}>{filled ? '★' : '☆'}</span>;
                          })}
                        </div>
                        <span className="text-sm text-gray-600">{reviewsByEvent[id].averageRating.toFixed(1)} / 5</span>
                        <span className="text-xs text-gray-400">({reviewsByEvent[id].count || 0})</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2 text-red-600" />
                    <span className="text-lg">{currentEvent.locationCity} • {currentEvent.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="w-5 h-5 mr-2 text-red-600" />
                    <span className="text-lg">{formatDateTime(currentEvent.startDateTime)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentEvent.category}
                  </div>
                  <button
                    onClick={() => toggleFavorite(currentEvent.id)}
                    className={`p-2 rounded-full border ${isFavorited(currentEvent.id) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-200'} hover:opacity-90`}
                    aria-label="Toggle favorite"
                  >
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>
            </div>

            {/* Event Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Date & Time</div>
                    <div className="font-semibold text-gray-900">
                      {formatDateTime(currentEvent.startDateTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-semibold text-gray-900">{currentEvent.venue}</div>
                    <div className="text-sm text-gray-600">{currentEvent.locationCity}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <FaUsers className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Capacity</div>
                    <div className="font-semibold text-gray-900">
                      {currentEvent.capacity.toLocaleString()} people
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Tickets</h2>
              
              <div className="space-y-4 mb-6">
                {currentEvent.ticketTypes.map((ticketType) => {
                  const isSoldOut = ticketType.quantityAvailable <= ticketType.quantitySold;
                  const selectedQuantity = selectedTickets[ticketType.id] || 0;
                  
                  return (
                    <div key={ticketType.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{ticketType.name}</h3>
                          <p className="text-sm text-gray-600">
                            {ticketType.quantityAvailable - ticketType.quantitySold} available
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {formatPrice(ticketType.price)}
                          </div>
                        </div>
                      </div>
                      
                      {isSoldOut ? (
                        <div className="text-center py-2 text-red-600 font-semibold">
                          Sold Out
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTicketQuantityChange(ticketType.id, selectedQuantity - 1)}
                            disabled={selectedQuantity <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={ticketType.quantityAvailable - ticketType.quantitySold}
                            value={selectedQuantity}
                            onChange={(e) => handleTicketQuantityChange(ticketType.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border border-gray-300 rounded-md py-1"
                          />
                          <button
                            onClick={() => handleTicketQuantityChange(ticketType.id, selectedQuantity + 1)}
                            disabled={selectedQuantity >= (ticketType.quantityAvailable - ticketType.quantitySold)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleAddToCart(ticketType.id, selectedQuantity)}
                            disabled={selectedQuantity <= 0}
                            className="ml-2 bg-red-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            <FaShoppingCart className="w-3 h-3 mr-1" />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {getTotalSelectedTickets() > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Total Tickets:</span>
                    <span className="font-semibold text-gray-900">{getTotalSelectedTickets()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-red-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Please <button 
                      onClick={() => navigate('/login')}
                      className="text-yellow-600 hover:text-yellow-700 underline"
                    >
                      login
                    </button> to add tickets to your cart.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
            {reviewsByEvent?.[id]?.reviews?.length > 0 ? (
              <div className="space-y-4">
                {reviewsByEvent[id].reviews.map(r => (
                  <div key={r.id} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{r.user?.name}</div>
                      <div className="text-yellow-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    {r.comment && <div className="text-gray-700 mt-2">{r.comment}</div>}
                    <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString('en-ZA')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">No reviews yet.</div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Rating</label>
                <select value={myRating} onChange={(e) => setMyRating(parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value={0}>Select rating</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Comment (optional)</label>
                <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Share your experience..." />
              </div>
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;