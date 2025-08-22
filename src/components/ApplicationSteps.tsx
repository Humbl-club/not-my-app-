import React from 'react';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationSteps = () => {
  const { t } = useTranslation();
  
  const stepIcons = [FileText, Upload, CreditCard, CheckCircle];
  
  return (
    <section className="py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
            {t('steps.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {t('steps.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {[1, 2, 3, 4].map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={step} className="group">
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-border/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:bg-white">
                  {/* Step connector line - hidden on mobile */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-16 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  
                  {/* Icon container */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-turquoise rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-9 w-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-turquoise to-success rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {step}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-semibold text-foreground leading-tight">
                      {t(`steps.step${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {t(`steps.step${step}.description`)}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center bg-gradient-to-r from-turquoise/10 to-success/10 text-turquoise font-medium px-4 py-2 rounded-full text-xs border border-turquoise/20">
                        {t(`steps.step${step}.time`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};