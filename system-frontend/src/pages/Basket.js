import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, clearCart } from '../redux/slices/cartSlice';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaTicketAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Basket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClearCart = async () => {
    if (cart?.bookingId) {
      try {
        await dispatch(clearCart(cart.bookingId)).unwrap();
        toast.success('Cart cleared successfully');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (cart?.items?.length > 0) {
      navigate('/checkout');
    } else {
      toast.error('Your cart is empty');
    }
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

  if (loading) {
    return <LoadingSpinner size="large" text="Loading your cart..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Basket</h1>
          <p className="text-gray-600">Review your selected tickets</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-2">Error loading cart</div>
            <div className="text-gray-600">{error}</div>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your basket is empty</h2>
            <p className="text-gray-600 mb-6">Add some tickets to get started!</p>
            <button
              onClick={() => navigate('/events')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({cart.items.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <FaTrash className="w-4 h-4 mr-1" />
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.eventTitle}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaTicketAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">{item.ticketTypeName}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <span className="text-sm">
                              {formatDate(item.eventDate)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Unit Price: {formatPrice(item.unitPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600 mb-2">
                            {formatPrice(item.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} ticket(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">R0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="font-medium">{formatPrice(cart.totalAmount * 0.15)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600">{formatPrice(cart.totalAmount * 1.15)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate('/events')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Cart Expiry Warning */}
                {cart.expiresAt && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="text-sm text-yellow-800">
                      <strong>Important:</strong> Your cart will expire in{' '}
                      {Math.ceil((new Date(cart.expiresAt) - new Date()) / (1000 * 60))} minutes.
                      Complete your purchase soon to secure your tickets.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Basket;