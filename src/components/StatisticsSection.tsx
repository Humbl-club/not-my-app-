import React, { useEffect, useState } from 'react';
import { Info, Users, Clock, Globe, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

const AnimatedStat: React.FC<StatProps> = ({ icon, value, label, prefix = '', suffix = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseInt(value.replace(/[^\d]/g, ''));
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepDuration = duration / steps;
    const increment = numericValue / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      
      // Format the number
      const formatted = Math.floor(current).toLocaleString();
      setDisplayValue(formatted);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div className={cn(
      "group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300",
      "transform hover:-translate-y-1 border border-gray-100",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {prefix}{displayValue}{suffix}
          </div>
          <div className="text-sm text-gray-600 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
};

export const StatisticsSection: React.FC = () => {
  const stats = [
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      value: '48',
      label: 'Processing Time',
      suffix: ' hours',
      delay: 100,
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      value: '256',
      label: 'Bit SSL Encryption',
      suffix: '-bit',
      delay: 200,
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      value: '24',
      label: 'Support Available',
      suffix: '/7',
      delay: 300,
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-600" />,
      value: '9',
      label: 'Languages Supported',
      suffix: '',
      delay: 400,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Service Information</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Key Service
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Important information about the UK ETA application process and our service.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} {...stat} />
          ))}
        </div>

      </div>
    </section>
  );
};