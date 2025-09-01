import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { resources } from '@/content/resources';
import { Link } from 'react-router-dom';

const ImmigrationLanding: React.FC = () => {
  const picks = resources.filter(r => [
    'uk-eta-vs-standard-visa-differences',
    'uk-eta-requirements-documents-eligibility',
    'how-to-apply-uk-eta-step-by-step',
  ].includes(r.slug));

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="UK Immigration Information: ETA vs Visa, Eligibility, How to Apply"
        description="Understand UK ETA vs standard visas, who needs an ETA, and how to apply—plus official resources and best practices."
        keywords="UK immigration info, ETA vs visa UK, UK ETA eligibility, apply UK ETA"
        type="article"
      />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">UK Immigration Information</h1>
        <p className="text-gray-600 mb-8">High‑level guidance on the UK ETA and how it compares to traditional visas. For definitive policy, visit GOV.UK.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {picks.map((r) => (
            <Link key={r.slug} to={`/resources/${r.slug}`} className="block border rounded hover:shadow-md transition">
              <img src={r.heroImage} alt={r.heroAlt} className="w-full h-40 object-cover rounded-t" loading="lazy" />
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-1">{r.title}</h2>
                <p className="text-sm text-gray-600">{r.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <a className="text-blue-700 hover:underline" href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer">
            Visit GOV.UK: Visas and Immigration →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImmigrationLanding;

