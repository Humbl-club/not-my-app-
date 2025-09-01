import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resources } from '@/content/resources';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const ResourceArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = useMemo(() => resources.find((r) => r.slug === slug), [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-2xl font-bold">Resource Not Found</h1>
          <p className="text-gray-600 mt-2">The guide you’re looking for doesn’t exist. Go back to <Link className="text-blue-600 underline" to="/resources">resources</Link>.</p>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.heroImage,
    author: { '@type': 'Organization', name: article.author },
    publisher: { '@type': 'Organization', name: 'UK ETA Gateway' },
    datePublished: article.datePublished,
    dateModified: article.lastModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://etagateway.uk/resources/${article.slug}`,
    },
  };

  const related = resources.filter((r) => article.related.includes(r.slug));

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${article.title} | UK ETA Gateway`}
        description={article.description}
        keywords={article.keywords}
        image={article.heroImage}
        type="article"
        jsonLd={jsonLd}
        canonical={`https://etagateway.uk/resources/${article.slug}`}
      />

      <article className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <img src={article.heroImage} alt={article.heroAlt} className="w-full h-64 object-cover rounded mb-6" loading="lazy" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
          <p className="text-gray-600 mb-6">{article.description}</p>
          <div className="text-sm text-gray-500 mb-8">
            <span>{article.author}</span>
            <span className="mx-2">·</span>
            <time dateTime={article.datePublished}>Published {new Date(article.datePublished).toLocaleDateString('en-GB')}</time>
            <span className="mx-2">·</span>
            <span>Updated {new Date(article.lastModified).toLocaleDateString('en-GB')}</span>
            <span className="mx-2">·</span>
            <span>{article.readingTime}</span>
          </div>

          {article.sections.map((s) => (
            <section key={s.heading} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{s.heading}</h2>
              {s.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-700 mb-4 leading-7">{p}</p>
              ))}
            </section>
          ))}

          {article.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {article.faq.map((f) => (
                  <Card key={f.question}>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900">{f.question}</h3>
                      <p className="text-gray-700 mt-2">{f.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* FAQ Schema JSON-LD */}
              <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  'mainEntity': article.faq.map((f) => ({
                    '@type': 'Question',
                    'name': f.question,
                    'acceptedAnswer': { '@type': 'Answer', text: f.answer }
                  }))
                })
              }} />
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Guides</h2>
              <ul className="list-disc pl-6 text-blue-700">
                {related.map((r) => (
                  <li key={r.slug} className="mb-2">
                    <Link className="hover:underline" to={`/resources/${r.slug}`}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12">
            <Link className="text-blue-700 hover:underline" to="/resources">← Back to all resources</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ResourceArticle;

