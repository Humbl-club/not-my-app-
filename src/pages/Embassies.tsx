import React from 'react';
import { SEOHead } from '@/components/SEOHead';

const Embassies: React.FC = () => {
  const offices = [
    { name: 'Find UK Embassies and Consulates', url: 'https://www.gov.uk/world/embassies' },
    { name: 'Find Foreign Embassies in the UK', url: 'https://www.gov.uk/government/publications/foreign-embassies-in-the-uk' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Embassy Contacts | UK Embassies & Consulates Worldwide"
        description="Find official contact details for UK embassies, high commissions, and consulates worldwide with links to GOV.UK directories."
        keywords="UK embassy contacts, UK consulate contact, British embassy worldwide, contact embassy UK"
        type="article"
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Embassy Contacts</h1>
        <p className="text-gray-600 mb-6">Use the official GOV.UK directories below to locate the correct UK embassy, high commission, or consulate for your country.</p>

        <ul className="list-disc pl-6 space-y-3">
          {offices.map(o => (
            <li key={o.url}>
              <a className="text-blue-700 hover:underline" href={o.url} target="_blank" rel="noopener noreferrer">{o.name}</a>
            </li>
          ))}
        </ul>

        <p className="text-gray-600 mt-8">Tip: Have your passport and application reference handy when contacting an office.</p>
      </div>
    </div>
  );
};

export default Embassies;

