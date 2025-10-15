import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCreditCard, FaQrcode, FaDownload, FaStar, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: <FaTicketAlt className="w-8 h-8 text-red-600" />,
      title: 'Easy Booking',
      description: 'Browse and book tickets for events across South Africa with just a few clicks.'
    },
    {
      icon: <FaMapMarkerAlt className="w-8 h-8 text-red-600" />,
      title: 'Find Local Events',
      description: 'Discover events happening in your city or use our location feature to find nearby events.'
    },
    {
      icon: <FaCreditCard className="w-8 h-8 text-red-600" />,
      title: 'Secure Payments',
      description: 'Pay safely with card or use our Money Market QR payment system.'
    },
    {
      icon: <FaDownload className="w-8 h-8 text-red-600" />,
      title: 'Digital Tickets',
      description: 'Get instant PDF tickets with QR codes sent to your email or download from your dashboard.'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Cape Town Jazz Festival 2025',
      date: '2025-11-14',
      location: 'Cape Town',
      price: 750,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Tech Conference SA 2025',
      date: '2025-11-29',
      location: 'Johannesburg',
      price: 1200,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Springbok Rugby Match',
      date: '2025-12-07',
      location: 'Durban',
      price: 450,
      image: '/api/placeholder/300/200'
    }
  ];

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="text-yellow-400">Mzansi Moments Hub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover, book, and enjoy amazing events happening across South Africa. 
              From music festivals to tech conferences, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-yellow-400 text-red-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center"
              >
                Browse Events
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-200"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mzansi Moments Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make event booking simple, secure, and enjoyable for everyone across South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss out on these amazing events happening across South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <FaTicketAlt className="w-16 h-16 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-red-600">
                      From {formatPrice(event.price)}
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

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-lg font-semibold inline-flex items-center"
            >
              View All Events
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-red-200">Events Booked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-red-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-red-200">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-red-200">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Event Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of South Africans who trust Mzansi Moments Hub for their event booking needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/events"
              className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;