import React from 'react';
import { SEOHead } from '@/components/SEOHead';

const Insurance: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Travel Insurance Guidance for UK Visitors"
        description="Understand typical cover types (medical, trip cancellation, baggage) and why insurance is recommended when visiting the UK."
        keywords="UK travel insurance, travel insurance guidance, medical cover UK travel"
        type="article"
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Travel Insurance Guidance</h1>
        <p className="text-gray-600 mb-6">We do not sell insurance, but here’s general guidance to consider before your trip:</p>

        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>Medical coverage for emergencies during your stay</li>
          <li>Trip cancellation/interruption benefits</li>
          <li>Baggage loss and delay coverage</li>
          <li>24/7 assistance services</li>
        </ul>

        <p className="text-gray-600 mt-6">Compare policies from reputable providers and ensure your coverage dates match your travel dates. Always read the policy wording carefully.</p>
      </div>
    </div>
  );
};

export default Insurance;

