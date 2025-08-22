import React from 'react';
import { Shield, Lock, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustIndicators = () => {
  const { t } = useTranslation();
  
  const indicators = [
    {
      icon: Shield,
      title: t('trustIndicators.secure.title')
    },
    {
      icon: Globe,
      title: t('trustIndicators.gdpr.title')
    },
    {
      icon: Clock,
      title: t('trustIndicators.support.title')
    },
    {
      icon: Lock,
      title: t('trustIndicators.trusted.title')
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <indicator.icon className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-medium text-sm text-foreground">{indicator.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};