import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationSteps = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            {t('steps.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((step) => (
            <Card key={step} className="text-center p-8 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-medium">{step}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t(`steps.step${step}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(`steps.step${step}.description`)}
                </p>
                <span className="text-xs text-turquoise font-medium">
                  {t(`steps.step${step}.time`)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};