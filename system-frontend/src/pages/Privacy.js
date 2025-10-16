import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-800">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
            <p>
              We collect information you provide (like name, email, phone) and usage data for analytics and security.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and improve the booking experience</li>
              <li>To process payments and deliver tickets</li>
              <li>To communicate updates and support</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Sharing</h2>
            <p>We do not sell personal data. We may share with service providers to operate the platform.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Security</h2>
            <p>We use industry-standard measures to protect your data. No method is 100% secure, but we strive for best practices.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p>You may access, update, or delete your information from your account settings or by contacting us.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
