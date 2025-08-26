import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ApplicationSteps } from '@/components/ApplicationSteps';
import { TrustIndicators } from '@/components/TrustIndicators';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Footer } from '@/components/Footer';
import { SavedApplicationBanner } from '@/components/SavedApplicationBanner';
import { CachedApplicationBanner } from '@/components/CachedApplicationBanner';
import { DataManager } from '@/utils/dataManager';
import { SimpleSaveService } from '@/services/simpleSaveService';

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
    <div className="min-h-screen bg-background">
      <Header />
      {/* Priority: Show cached application first (shorter expiry) */}
      {hasCachedApplication && <CachedApplicationBanner />}
      {!hasCachedApplication && hasSavedApplication && (
        <SavedApplicationBanner onClearApplication={handleClearApplication} />
      )}
      <HeroSection />
      <ApplicationSteps />
      <TrustIndicators />
      <LegalDisclaimer />
      <Footer />
    </div>
  );
};

export default Index;
