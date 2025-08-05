import React from 'react';
import { Shield, Lock, Clock, CheckCircle } from 'lucide-react';

export const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: 'Secure & Encrypted',
      description: 'SSL encrypted data protection'
    },
    {
      icon: CheckCircle,
      title: 'GDPR Compliant',
      description: 'Full data protection compliance'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance'
    },
    {
      icon: Lock,
      title: 'Trusted Service',
      description: '10,000+ successful applications'
    }
  ];

  return (
    <div className="bg-secondary/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <indicator.icon className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{indicator.title}</h3>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};