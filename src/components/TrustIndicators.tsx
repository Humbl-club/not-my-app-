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
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            {t('trustIndicators.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {indicators.map(({ key, icon: Icon }) => (
            <div key={key} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {t(`trustIndicators.${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`trustIndicators.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};