import React, { useState } from 'react';
import { 
  UserPlus, 
  FileText, 
  Camera, 
  CreditCard, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  details: string[];
}

const TimelineCard: React.FC<TimelineStep & { isActive: boolean; onClick: () => void }> = ({
  number,
  title,
  description,
  icon,
  duration,
  details,
  isActive,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-300",
        isActive ? "scale-105" : "scale-100 opacity-80 hover:opacity-100"
      )}
    >
      {/* Card */}
      <div className={cn(
        "relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300",
        isActive 
          ? "border-blue-500 shadow-2xl" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
      )}>
        {/* Step Number Badge */}
        <div className={cn(
          "absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg",
          isActive 
            ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white" 
            : "bg-white text-gray-700 border-2 border-gray-200"
        )}>
          {number}
        </div>

        {/* Icon */}
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all",
          isActive 
            ? "bg-gradient-to-br from-blue-100 to-indigo-100" 
            : "bg-gray-100"
        )}>
          <div className={isActive ? "text-blue-600" : "text-gray-600"}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Duration Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
          <Clock className="w-3 h-3" />
          {duration}
        </div>

        {/* Details (shown when active) */}
        {isActive && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connection Line (except for last item) */}
      {number !== '5' && (
        <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
      )}
    </div>
  );
};

export const ProcessTimeline: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps: TimelineStep[] = [
    {
      number: '1',
      title: 'Start Application',
      description: 'Begin your journey with basic information',
      icon: <UserPlus className="w-6 h-6" />,
      duration: '2 minutes',
      details: [
        'Choose individual or group application',
        'Enter primary contact information',
        'Select your nationality',
        'Save progress automatically'
      ]
    },
    {
      number: '2',
      title: 'Personal Details',
      description: 'Provide passport and travel information',
      icon: <FileText className="w-6 h-6" />,
      duration: '5 minutes',
      details: [
        'Enter passport information',
        'Provide travel dates and purpose',
        'Add accommodation details',
        'Include emergency contacts'
      ]
    },
    {
      number: '3',
      title: 'Document Upload',
      description: 'Submit required documents and photo',
      icon: <Camera className="w-6 h-6" />,
      duration: '3 minutes',
      details: [
        'Upload passport photo (AI verified)',
        'Take photo via webcam or mobile',
        'Instant quality checking',
        'Automatic format compliance'
      ]
    },
    {
      number: '4',
      title: 'Payment',
      description: 'Secure payment processing',
      icon: <CreditCard className="w-6 h-6" />,
      duration: '1 minute',
      details: [
        'Multiple payment methods accepted',
        'Secure Stripe processing',
        'Instant payment confirmation',
        'Full invoice provided'
      ]
    },
    {
      number: '5',
      title: 'Confirmation',
      description: 'Receive your application reference',
      icon: <CheckCircle className="w-6 h-6" />,
      duration: 'Instant',
      details: [
        'Unique reference number issued',
        'Email confirmation sent',
        'Track application status online',
        '48-hour processing begins'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Info className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Simple 5-Step Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your UK Journey Starts
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              In Just 11 Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures you complete your application quickly and accurately, 
            with professional guidance at every step.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {steps.map((step, index) => (
            <TimelineCard
              key={index}
              {...step}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Begin Your Application?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our intelligent form system guides you through each step, ensuring nothing is missed.
                Plus, you can save your progress and return anytime.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Secure Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Save & Resume</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/application')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Application Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl transform rotate-3 opacity-10" />
              <div className="relative bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Completion Time</span>
                    <span className="font-bold text-2xl text-gray-900">11 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documents Required</span>
                    <span className="font-bold text-2xl text-gray-900">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-bold text-2xl text-gray-900">48h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-2xl text-green-600">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};