import React from 'react';
import { 
  Shield, 
  Clock, 
  Globe, 
  CreditCard, 
  FileCheck, 
  HeadphonesIcon,
  Smartphone,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, highlight, badge }) => {
  return (
    <div className={cn(
      "relative group p-8 rounded-2xl transition-all duration-300",
      "border-2 hover:shadow-2xl transform hover:-translate-y-1",
      highlight 
        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300" 
        : "bg-white border-gray-100 hover:border-gray-200"
    )}>
      {badge && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
          {badge}
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-transform group-hover:scale-110",
          highlight 
            ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg" 
            : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-indigo-100"
        )}>
          <div className={highlight ? "text-white" : "text-gray-700 group-hover:text-blue-600"}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const FeaturesGrid: React.FC = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Processing",
      description: "Get your UK ETA approved in as little as 48 hours with our streamlined application process.",
      highlight: true,
      badge: "FASTEST"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Grade Security",
      description: "Your data is protected with 256-bit SSL encryption and complies with UK data protection laws.",
      highlight: false
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Support Network",
      description: "Apply from anywhere in the world with support in 9 languages and local payment methods.",
      highlight: false
    }
  ];

  const additionalFeatures = [
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: "Document Verification",
      description: "AI-powered instant verification"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Secure Payments",
      description: "Multiple payment options available"
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: "24/7 Support",
      description: "Expert help whenever you need"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Mobile Optimized",
      description: "Apply from any device seamlessly"
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Data Protection",
      description: "GDPR and UK compliant"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Save Progress",
      description: "Resume application anytime"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Why Choose Us</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Seamless Travel Authorization
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with the same standards used by Fortune 500 companies. 
            Every feature designed for security, speed, and reliability.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust us with their UK travel authorization.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/application')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Your Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};