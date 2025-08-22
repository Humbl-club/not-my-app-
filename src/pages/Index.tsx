import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ApplicationSteps } from '@/components/ApplicationSteps';
import { TrustIndicators } from '@/components/TrustIndicators';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ApplicationSteps />
      <TrustIndicators />
      <LegalDisclaimer />
      <Footer />
    </div>
  );
};

export default Index;
