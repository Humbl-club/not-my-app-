import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, Users, Globe, Plane } from 'lucide-react';

export const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative bg-gradient-to-br from-primary to-turquoise text-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Ultra-minimal tagline */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1]">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Single CTA */}
          <div className="pt-8">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg px-12 py-4 rounded-full"
              onClick={() => navigate('/application')}
            >
              {t('hero.startApplication')}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>

          {/* Minimal stats */}
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-16">
            <div className="text-center">
              <div className="text-3xl font-light text-white/90">{t('hero.stats.processingTime')}</div>
              <div className="text-sm opacity-70 mt-1">{t('hero.stats.processingLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-white/90">{t('hero.stats.applicationsCount')}</div>
              <div className="text-sm opacity-70 mt-1">{t('hero.stats.applicationsLabel')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};