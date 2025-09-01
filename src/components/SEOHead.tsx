import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'collection';
  jsonLd?: any;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'UK ETA Application | Official Electronic Travel Authorization Gateway',
  description = 'Apply for your UK Electronic Travel Authorization (ETA) in minutes. Fast processing, secure payment, and 99.8% approval rate. Official visa service for UK travel.',
  keywords = 'UK ETA, UK visa, electronic travel authorization, UK travel permit, British visa application, ETA UK, visa to UK, UK immigration, travel authorization UK',
  image = 'https://etagateway.uk/og-image.png',
  canonical,
  type = 'website',
  jsonLd
}) => {
  const location = useLocation();
  const currentUrl = `https://etagateway.uk${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'UK ETA Gateway', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@uketagateway');

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('author', 'UK ETA Gateway');
    updateMetaTag('publisher', 'UK ETA Gateway');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical || currentUrl;

    // JSON-LD Structured Data (override if jsonLd provided)
    const structuredData = jsonLd || {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : type === 'collection' ? 'CollectionPage' : 'WebApplication',
      'name': 'UK ETA Gateway',
      'description': description,
      'url': canonical || currentUrl,
      ...(type === 'website' && {
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '42', priceCurrency: 'GBP' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '250000' },
      })
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, canonical, currentUrl, type, jsonLd]);

  return null;
};

// Page-specific SEO configurations
export const pageSEOConfig = {
  home: {
    title: 'UK ETA Application | Official Electronic Travel Authorization Gateway',
    description: 'Apply for your UK Electronic Travel Authorization (ETA) in minutes. Fast 48-hour processing, secure payment, and 99.8% approval rate. Official visa service for UK travel.',
    keywords: 'UK ETA, UK visa, electronic travel authorization, UK travel permit, British visa application, ETA UK, visa to UK, UK immigration, travel authorization UK, UK entry requirements'
  },
  application: {
    title: 'Start UK ETA Application | Quick & Secure Visa Process',
    description: 'Begin your UK ETA application now. Simple 5-step process, save and resume anytime, multi-language support. Apply for individual or group travel authorization.',
    keywords: 'UK ETA application, apply for UK visa, UK travel authorization form, UK visa application online, ETA application UK'
  },
  track: {
    title: 'Track UK ETA Application Status | Real-Time Updates',
    description: 'Track your UK ETA application status in real-time. Enter your reference number to check processing progress and estimated completion time.',
    keywords: 'track UK ETA, UK visa status, ETA application tracking, check visa status UK'
  },
  payment: {
    title: 'Secure Payment | UK ETA Application Fee',
    description: 'Complete your UK ETA payment securely. Multiple payment methods accepted including Visa, Mastercard, PayPal. SSL encrypted transaction.',
    keywords: 'UK ETA payment, visa fee UK, ETA cost, UK visa payment'
  },
  requirements: {
    title: 'UK ETA Requirements | Documents & Eligibility',
    description: 'Check UK ETA requirements and eligibility criteria. Learn about required documents, photo specifications, and application guidelines.',
    keywords: 'UK ETA requirements, UK visa documents, ETA eligibility, UK travel requirements'
  },
  help: {
    title: 'UK ETA Help Center | FAQs & Support',
    description: 'Get help with your UK ETA application. Find answers to frequently asked questions, contact support, and access application guides.',
    keywords: 'UK ETA help, visa support UK, ETA FAQ, UK visa assistance'
  }
};
