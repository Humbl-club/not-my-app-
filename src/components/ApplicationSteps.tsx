import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, CreditCard, CheckCircle } from 'lucide-react';

export const ApplicationSteps = () => {
  const steps = [
    {
      icon: FileText,
      number: '01',
      title: 'Complete Application',
      description: 'Fill out the secure online form with your personal details and travel information.',
      time: '5-10 minutes'
    },
    {
      icon: Upload,
      number: '02', 
      title: 'Upload Documents',
      description: 'Submit your passport copy and photo. Our system validates all requirements automatically.',
      time: '2-3 minutes'
    },
    {
      icon: CreditCard,
      number: '03',
      title: 'Secure Payment',
      description: 'Pay securely with credit card, debit card, or PayPal. All transactions are encrypted.',
      time: '1-2 minutes'
    },
    {
      icon: CheckCircle,
      number: '04',
      title: 'Receive Authorization',
      description: 'Get your UK ETA via email within 72 hours. Track your application status online.',
      time: 'Up to 72 hours'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined application process makes getting your UK ETA quick and easy
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