import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationSteps = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      icon: FileText,
      number: '01',
      title: t('applicationSteps.step1.title'),
      description: t('applicationSteps.step1.description'),
      time: t('applicationSteps.step1.time')
    },
    {
      icon: Upload,
      number: '02', 
      title: t('applicationSteps.step2.title'),
      description: t('applicationSteps.step2.description'),
      time: t('applicationSteps.step2.time')
    },
    {
      icon: CreditCard,
      number: '03',
      title: t('applicationSteps.step3.title'),
      description: t('applicationSteps.step3.description'),
      time: t('applicationSteps.step3.time')
    },
    {
      icon: CheckCircle,
      number: '04',
      title: t('applicationSteps.step4.title'),
      description: t('applicationSteps.step4.description'),
      time: t('applicationSteps.step4.time')
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('applicationSteps.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('applicationSteps.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative shadow-card hover:shadow-form transition-all duration-300 animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center">
                  {step.number}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {step.description}
                </p>
                <div className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-3 py-1 rounded-full">
                  <span>⏱️</span>
                  <span>{step.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};