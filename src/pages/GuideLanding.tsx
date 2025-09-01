import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { resources } from '@/content/resources';
import { Link } from 'react-router-dom';

const GuideLanding: React.FC = () => {
  const featured = resources.filter(r => [
    'how-to-apply-uk-eta-step-by-step',
    'uk-eta-requirements-documents-eligibility',
    'uk-eta-photo-requirements-checklist',
  ].includes(r.slug));

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="UK Travel Guide for ETA | Step‑by‑Step, Requirements, Photos"
        description="Your complete UK ETA travel guide: application steps, requirements, and photo checklist—plus tips to avoid delays."
        keywords="UK travel guide ETA, apply UK ETA, UK ETA requirements, ETA photo checklist"
        type="article"
      />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">UK ETA Travel Guide</h1>
        <p className="text-gray-600 mb-8">Start here for a smooth application. Follow our guides below and apply with confidence.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((r) => (
            <Link key={r.slug} to={`/resources/${r.slug}`} className="block border rounded hover:shadow-md transition">
              <img src={r.heroImage} alt={r.heroAlt} className="w-full h-40 object-cover rounded-t" loading="lazy" />
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-1">{r.title}</h2>
                <p className="text-sm text-gray-600">{r.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-blue-700">
          <Link to="/resources" className="hover:underline">Browse all resources →</Link>
        </div>
      </div>
    </div>
  );
};

export default GuideLanding;

