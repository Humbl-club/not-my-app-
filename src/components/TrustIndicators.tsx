import React from 'react';
import { Shield, Lock, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustIndicators = () => {
  const { t } = useTranslation();
  
  const indicators = [
    { key: 'convenience', icon: Shield },
    { key: 'security', icon: Globe },
    { key: 'tracking', icon: Clock },
    { key: 'storage', icon: Shield },
    { key: 'reminders', icon: Lock }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            {t('trustIndicators.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {indicators.map(({ key, icon: Icon }) => (
            <div key={key} className="text-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">
                {t(`trustIndicators.${key}.title`)}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(`trustIndicators.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};