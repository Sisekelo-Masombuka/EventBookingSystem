import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, checkout } from '../redux/slices/cartSlice';
import { FaCreditCard, FaQrcode, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, checkoutLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'cvv') {
      // Limit CVV to 3 digits
      const formatted = value.replace(/\D/g, '').slice(0, 3);
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.bookingId) {
      toast.error('No items in cart');
      return;
    }

    if (paymentMethod === 'card') {
      // Validate card details
      if (!cardDetails.cardholderName || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      await dispatch(checkout({
        bookingId: cart.bookingId,
        paymentMethod: paymentMethod
      })).unwrap();
      
      toast.success('Payment processed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading checkout..." />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-4">Add some tickets to your cart before checking out.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={`${user?.firstName} ${user?.lastName}`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                      paymentMethod === 'card'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <FaCreditCard className="w-5 h-5 mr-2" />
                      <span className="font-medium">Card Payment</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('money')}
                    className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                      paymentMethod === 'money'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <FaQrcode className="w-5 h-5 mr-2" />
                      <span className="font-medium">Money Market</span>
                    </div>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleCardInputChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Money Market Info */}
                {paymentMethod === 'money' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <FaQrcode className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-2">Money Market Payment</h3>
                        <p className="text-sm text-blue-800">
                          After placing your order, you'll receive a reference number and QR code. 
                          Take these to any participating Money Market outlet to complete your payment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.eventTitle}</h3>
                      <p className="text-sm text-gray-600">{item.ticketTypeName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatPrice(item.totalPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (15%)</span>
                  <span>{formatPrice(vat)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaLock className="w-5 h-5 text-green-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900 mb-1">Secure Payment</h3>
                  <p className="text-sm text-green-800">
                    Your payment information is encrypted and secure. We use industry-standard 
                    security measures to protect your data.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || checkoutLoading}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isProcessing || checkoutLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-5 h-5 mr-2" />
                  Place Order - {formatPrice(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;