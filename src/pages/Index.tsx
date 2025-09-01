import { useState, useEffect } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { HeroSectionPro } from '@/components/HeroSectionPro';
import { StatisticsSection } from '@/components/StatisticsSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FooterPro } from '@/components/FooterPro';
import { SavedApplicationBanner } from '@/components/SavedApplicationBanner';
import { CachedApplicationBanner } from '@/components/CachedApplicationBanner';
import { DataManager } from '@/utils/dataManager';
import { SimpleSaveService } from '@/services/simpleSaveService';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { SEOHead, pageSEOConfig } from '@/components/SEOHead';

const Index = () => {
  const [hasSavedApplication, setHasSavedApplication] = useState(false);
  const [hasCachedApplication, setHasCachedApplication] = useState(false);
  
  useEffect(() => {
    setHasSavedApplication(DataManager.hasSavedApplication());
    setHasCachedApplication(SimpleSaveService.hasCachedApplication());
  }, []);
  
  const handleClearApplication = () => {
    setHasSavedApplication(false);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <SEOHead {...pageSEOConfig.home} />
      <HeaderPro />
      {/* Priority: Show cached application first (shorter expiry) */}
      {hasCachedApplication && <CachedApplicationBanner />}
      {!hasCachedApplication && hasSavedApplication && (
        <SavedApplicationBanner onClearApplication={handleClearApplication} />
      )}
      <HeroSectionPro />
      <StatisticsSection />
      <FeaturesGrid />
      <ProcessTimeline />
      <TestimonialsSection />
      <LegalDisclaimer />
      <FooterPro />
    </div>
  );
};

export default Index;
