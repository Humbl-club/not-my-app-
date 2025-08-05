import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustIndicators } from '@/components/TrustIndicators';
import { ApplicationSteps } from '@/components/ApplicationSteps';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TrustIndicators />
      <ApplicationSteps />
      <Footer />
    </div>
  );
};

export default Index;
