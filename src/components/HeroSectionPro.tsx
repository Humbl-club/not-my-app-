import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, CheckCircle, Globe, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const HeroSectionPro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">UK ETA Application Service</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Travel to the UK
                <span className="block text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Apply for your UK Electronic Travel Authorization online. 
                Secure SSL encryption and multi-language support.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">3 Minutes</div>
                  <div className="text-sm text-gray-600">Quick Apply</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Secure</div>
                  <div className="text-sm text-gray-600">256-bit SSL</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Multi-Step</div>
                  <div className="text-sm text-gray-600">Form Process</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/application')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Your Application
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/track')}
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-6 text-lg font-semibold rounded-xl"
              >
                Track Application
              </Button>
            </div>

          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-12">
            {/* Main Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 opacity-20 blur-xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">UK ETA</div>
                      <div className="text-sm text-gray-600">Electronic Travel Authorization</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Active
                  </div>
                </div>

                {/* Sample Visa Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-xs opacity-80 mb-1">Reference Number</div>
                      <div className="font-mono text-lg">ETA-2024-XXXX</div>
                    </div>
                    <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-xs opacity-80 mb-1">Valid From</div>
                      <div className="font-medium">01 Jan 2024</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80 mb-1">Valid Until</div>
                      <div className="font-medium">01 Jan 2026</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full" />
                      <div className="w-8 h-8 bg-white/20 rounded-full" />
                    </div>
                    <div className="text-xs opacity-80">Multiple Entry</div>
                  </div>
                </div>

                {/* Stats Below Card */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">48h</div>
                    <div className="text-xs text-gray-600">Processing</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">2yr</div>
                    <div className="text-xs text-gray-600">Validity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">£42</div>
                    <div className="text-xs text-gray-600">Per Person</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-white" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C360,0 720,100 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
};