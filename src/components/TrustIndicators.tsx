import React from 'react';
import { Shield, Lock, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustIndicators = () => {
  const { t } = useTranslation();
  
  const indicators = [
    {
      icon: Shield,
      title: t('trustIndicators.secure.title'),
      description: t('trustIndicators.secure.description')
    },
    {
      icon: Globe,
      title: t('trustIndicators.gdpr.title'),
      description: t('trustIndicators.gdpr.description')
    },
    {
      icon: Clock,
      title: t('trustIndicators.support.title'),
      description: t('trustIndicators.support.description')
    },
    {
      icon: Lock,
      title: t('trustIndicators.trusted.title'),
      description: t('trustIndicators.trusted.description')
    }
  ];

  return (
    <div className="bg-secondary/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <indicator.icon className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{indicator.title}</h3>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};