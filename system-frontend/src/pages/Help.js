import React from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600 mt-2">Find answers to common questions and guides.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">Booking & Tickets</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>How to browse events and view details</li>
                <li>How to add tickets to your basket</li>
                <li>Payment options (Card, Money Market QR)</li>
                <li>Downloading your ticket PDF with QR code</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">Account</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Resetting your password</li>
                <li>Updating your profile details</li>
                <li>Managing your favorites and wishlist</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-gray-700">
            Still need help? <Link to="/contact" className="text-red-600 hover:text-red-700 font-semibold">Contact us</Link> and we’ll get back to you.
          </div>
        </div>
      </section>
    </div>
  );
}
