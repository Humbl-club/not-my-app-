import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationSteps = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      icon: FileText,
      number: '1',
      title: t('applicationSteps.step1.title'),
      time: t('applicationSteps.step1.time')
    },
    {
      icon: Upload,
      number: '2', 
      title: t('applicationSteps.step2.title'),
      time: t('applicationSteps.step2.time')
    },
    {
      icon: CreditCard,
      number: '3',
      title: t('applicationSteps.step3.title'),
      time: t('applicationSteps.step3.time')
    },
    {
      icon: CheckCircle,
      number: '4',
      title: t('applicationSteps.step4.title'),
      time: t('applicationSteps.step4.time')
    }
  ];

  return (
    <section id="application-steps" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-foreground tracking-tight">
            {t('applicationSteps.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-card group-hover:shadow-form transition-all duration-300">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-turquoise text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2 text-foreground">{step.title}</h3>
              <div className="text-sm text-turquoise font-medium">
                {step.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};