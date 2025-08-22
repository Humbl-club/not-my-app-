import React from 'react';
import { Shield, Lock, Clock, Globe, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustIndicators = () => {
  const { t } = useTranslation();
  
  const indicators = [
    { key: 'convenience', icon: Star },
    { key: 'security', icon: Shield },
    { key: 'tracking', icon: Clock },
    { key: 'storage', icon: Globe },
    { key: 'reminders', icon: Lock }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
            {t('trustIndicators.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Five reasons why thousands trust us with their travel documentation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {indicators.map(({ key, icon: Icon }, index) => (
            <div key={key} className="group">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                {/* Gradient background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-turquoise/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-turquoise rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative space-y-4">
                  <h3 className="text-xl font-semibold text-foreground leading-tight">
                    {t(`trustIndicators.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {t(`trustIndicators.${key}.description`)}
                  </p>
                </div>
                
                {/* Subtle number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-turquoise/20 to-success/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};