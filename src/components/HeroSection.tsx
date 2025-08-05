import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, Users } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="gradient-hero text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Apply for Your UK ETA
                <span className="block text-3xl md:text-4xl text-primary-light">
                  Electronic Travel Authorization
                </span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                Fast, secure, and hassle-free UK ETA application service. Get your authorization in as little as 72 hours.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Simple 3-step application process',
                'Expert document review included',
                '24/7 multilingual support',
                'Money-back guarantee'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success-light" />
                  <span className="text-base">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Start Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-center">Processing Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-success-light" />
                  </div>
                  <div className="text-2xl font-bold">72hrs</div>
                  <div className="text-sm opacity-90">Average Processing</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-success-light" />
                  </div>
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-sm opacity-90">Applications Processed</div>
                </div>
              </div>
            </div>

            <div className="bg-warning/20 border border-warning/40 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">Important Notice:</p>
              <p className="opacity-90">
                This is an independent third-party service and is not affiliated with the UK Government or UKVI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};