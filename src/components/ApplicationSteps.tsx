import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationSteps = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            {t('steps.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple process that takes less than 15 minutes
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="text-center group">
              <div className="bg-white rounded-3xl p-10 border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-turquoise rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-semibold text-lg">{step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {t(`steps.step${step}.title`)}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {t(`steps.step${step}.description`)}
                </p>
                <span className="inline-block bg-turquoise/10 text-turquoise font-medium px-4 py-2 rounded-full text-sm">
                  {t(`steps.step${step}.time`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};