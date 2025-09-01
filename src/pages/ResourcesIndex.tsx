import React from 'react';
import { resources } from '@/content/resources';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ResourcesIndex: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'UK ETA Resources & Guides',
    'description': 'Authoritative resources about UK ETA requirements, how to apply, photo specs, processing times, and more.',
    'hasPart': resources.map((r) => ({
      '@type': 'Article',
      'headline': r.title,
      'url': `https://etagateway.uk/resources/${r.slug}`,
      'datePublished': r.datePublished,
      'dateModified': r.lastModified,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="UK ETA Resources & Guides | Requirements, Photos, Processing"
        description="Explore expert guides on UK ETA requirements, photo checklist, how to apply, group applications, processing times, tracking, privacy, and more."
        keywords="UK ETA resources, UK ETA guides, apply UK ETA, UK ETA photo requirements, track UK ETA, UK visa authorization"
        image="https://etagateway.uk/og-image.png"
        type="collection"
        jsonLd={jsonLd}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">UK ETA Resources & Guides</h1>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Clear, trustworthy information to help you apply correctly the first time. Browse essential topics below.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((r) => (
              <Card key={r.slug} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <img src={r.heroImage} alt={r.heroAlt} className="w-full h-40 object-cover rounded" loading="lazy" />
                  <CardTitle className="mt-4 text-xl">{r.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{r.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{r.readingTime}</span>
                    <span>{new Date(r.lastModified).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => navigate(`/resources/${r.slug}`)}>Read guide</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesIndex;

