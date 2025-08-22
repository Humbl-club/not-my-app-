import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, Users, Globe, Plane } from 'lucide-react';

export const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <section className="relative bg-gradient-to-br from-primary to-turquoise text-white min-h-[85vh] flex items-center">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Main headline */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.05]">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <Button 
              size="xl" 
              className="bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-3xl transition-all duration-500 font-semibold text-xl px-16 py-6 rounded-full hover:scale-105"
              onClick={() => navigate('/application')}
            >
              {t('hero.startApplication')}
              <ArrowRight className="ml-4 h-6 w-6" />
            </Button>
          </div>

          {/* Subtle value props */}
          <div className="pt-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light opacity-90">
              {t('hero.valueProposition')}
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-base opacity-85">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{t('hero.processingTime')}</span>
              </div>
              <span className="hidden md:block text-white/40">•</span>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t('hero.security')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};