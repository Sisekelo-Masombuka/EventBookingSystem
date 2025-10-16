import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-800">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              These Terms govern your use of Mzansi Moments Hub. By accessing or using our platform
              you agree to these Terms. If you do not agree, please do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login details and for all activities under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Tickets and Payments</h2>
            <p>
              All ticket purchases are subject to availability and the event organizer's rules. Refunds, if any, follow the organizer's policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Prohibited Activities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fraudulent activity or reselling tickets without authorization</li>
              <li>Attempting to breach security or access other users' data</li>
              <li>Posting unlawful or harmful content</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
            <p>
              The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law,
              we are not liable for indirect or consequential damages.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Changes</h2>
            <p>We may modify these Terms. Continued use constitutes acceptance of the updated Terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
