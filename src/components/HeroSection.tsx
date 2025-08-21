import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, Users, Globe, Plane } from 'lucide-react';

export const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-turquoise text-primary-foreground py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 rotate-12">
          <Plane className="h-16 w-16" />
        </div>
        <div className="absolute top-40 right-20 -rotate-12">
          <Globe className="h-12 w-12" />
        </div>
        <div className="absolute bottom-20 left-1/4 rotate-45">
          <Globe className="h-8 w-8" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-accent" />
                <span>Global Travel Authorization Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                {t('hero.title')}
                <span className="block text-3xl md:text-4xl text-accent font-normal mt-2">
                  {t('hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { text: t('hero.feature1'), icon: Globe },
                { text: t('hero.feature2'), icon: CheckCircle },
                { text: t('hero.feature3'), icon: Users },
                { text: t('hero.feature4'), icon: Clock }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3">
                  <feature.icon className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
                onClick={() => navigate('/application')}
              >
                {t('hero.startApplication')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  const steps = document.getElementById('application-steps');
                  steps?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.learnMore')}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 shadow-travel border border-white/20">
              <h3 className="text-2xl font-heading font-bold text-center mb-6 text-accent">
                {t('hero.stats.title')}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-white">{t('hero.stats.processingTime')}</div>
                  <div className="text-sm opacity-80 leading-relaxed">{t('hero.stats.processingLabel')}</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-white">{t('hero.stats.applicationsCount')}</div>
                  <div className="text-sm opacity-80 leading-relaxed">{t('hero.stats.applicationsLabel')}</div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/20 backdrop-blur-sm border border-secondary/40 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-secondary/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold mb-2 text-secondary">{t('hero.notice.title')}</p>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {t('hero.notice.text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};