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
          {/* Main headline */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl opacity-90 font-light max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg px-12 py-4 rounded-full"
              onClick={() => navigate('/application')}
            >
              {t('hero.startApplication')}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center max-w-3xl mx-auto pt-8">
            <p className="text-sm opacity-80 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              {t('hero.disclaimer')}
            </p>
          </div>

          {/* Value proposition and key info */}
          <div className="text-center space-y-4 pt-8">
            <h2 className="text-xl md:text-2xl font-light opacity-95">
              {t('hero.valueProposition')}
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm opacity-80">
              <span>{t('hero.processingTime')}</span>
              <span className="hidden md:block">•</span>
              <span>{t('hero.security')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};