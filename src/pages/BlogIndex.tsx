import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { resources } from '@/content/resources';
import { Link } from 'react-router-dom';

const BlogIndex: React.FC = () => {
  const articles = resources; // reuse guides as blog content for now
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="UK ETA Blog & Guides"
        description="Latest guidance on UK ETA requirements, application steps, photo rules, processing times, and more."
        keywords="UK ETA blog, UK ETA guides, UK visa authorization articles"
        type="collection"
      />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">UK ETA Blog</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map(a => (
            <Link key={a.slug} to={`/resources/${a.slug}`} className="block border rounded hover:shadow-md transition">
              <img src={a.heroImage} alt={a.heroAlt} className="w-full h-48 object-cover rounded-t" loading="lazy" />
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-1">{a.title}</h2>
                <p className="text-sm text-gray-600">{a.description}</p>
                <div className="text-xs text-gray-500 mt-2">{new Date(a.datePublished).toLocaleDateString('en-GB')}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;

