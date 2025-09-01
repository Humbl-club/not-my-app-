import React from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  FileText, 
  Camera, 
  CreditCard,
  Globe,
  Clock,
  Shield,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Requirements = () => {
  const navigate = useNavigate();

  // UK ETA eligible countries - FULLY ROLLED OUT BY APRIL 2025
  // After April 2025, ALL visa-waiver nationals need ETA (except British/Irish citizens)
  
  // Group 1: Already required (since 2023/2024)
  // Note: Jordan was removed from ETA eligibility in September 2024 - now needs visa
  const gccCountries = [
    'Qatar', 'Kuwait', 'United Arab Emirates', 'Oman', 'Bahrain', 'Saudi Arabia'
  ];
  
  // Group 2: Required from January 8, 2025 - All non-visa nationals outside Europe
  const januaryCountries = [
    'United States', 'Canada', 'Australia', 'New Zealand', 'Japan', 'Singapore',
    'South Korea', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Uruguay',
    'Malaysia', 'Brunei', 'Hong Kong', 'Taiwan', 'Israel', 'Macao',
    'Paraguay', 'Costa Rica', 'Guatemala', 'Nicaragua', 'Panama', 'El Salvador',
    'Honduras', 'Antigua and Barbuda', 'Bahamas', 'Barbados', 'St Kitts and Nevis',
    'Trinidad and Tobago', 'Samoa', 'Tonga', 'Kiribati', 'Fiji', 'Papua New Guinea'
    // This includes ALL visa-waiver countries outside Europe
  ];
  
  // Group 3: Required from April 2, 2025 (can apply from March 5, 2025)
  const europeanCountries = [
    'All EU Countries (except Ireland)',
    'Iceland', 'Liechtenstein', 'Norway', 'Switzerland',
    'Andorra', 'Monaco', 'San Marino', 'Vatican City'
  ];

  const requirements = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Valid Passport',
      items: [
        'Passport valid for entire stay in UK',
        'Machine-readable passport required',
        'Passport from an eligible country'
      ]
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Digital Photo',
      items: [
        'Recent photo (within 6 months)',
        'Clear face visibility',
        'Plain light background',
        'No glasses or headwear (except religious)'
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Payment Method',
      items: [
        'Visa, Mastercard, or American Express',
        'PayPal accepted',
        'Fee: £16 per person (as of April 9, 2025)',
        'Non-refundable'
      ]
    },
    {
      icon: <Info className="w-6 h-6" />,
      title: 'Personal Information',
      items: [
        'Full name as on passport',
        'Date and place of birth',
        'Contact information',
        'UK accommodation address (if available)'
      ]
    }
  ];

  const whoNeeds = [
    'Visitors for tourism or business (up to 6 months)',
    'Transit passengers',
    'Short-term study (up to 6 months)',
    'Medical treatment visitors',
    'Academic visitors'
  ];

  const whoDoesntNeed = [
    'British and Irish citizens',
    'Those with UK visa or residence permit',
    'Diplomats with valid credentials',
    'Military personnel on duty',
    'Children under 2 years (on parent\'s ETA)'
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              UK ETA Requirements
            </h1>
            <p className="text-xl text-gray-600">
              Check if you need an Electronic Travel Authorization for the UK
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Who Needs ETA */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  Who Needs an ETA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whoNeeds.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-6 h-6" />
                  Who Doesn't Need an ETA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whoDoesntNeed.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Grid */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What You'll Need to Apply
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {requirements.map((req, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mb-3">
                    <div className="text-blue-600">{req.icon}</div>
                  </div>
                  <CardTitle className="text-lg">{req.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {req.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Eligible Countries */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600" />
                Eligible Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>As of September 2025:</strong> The UK ETA system is FULLY ROLLED OUT. 
                    All visa-waiver nationals now need an ETA. The fee increased to £16 on April 9, 2025.
                    Valid for 2 years, allows multiple entries up to 6 months each.
                  </span>
                </p>
              </div>

              {/* Already Required */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Already Required (Since 2023/2024):</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gccCountries.map((country, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required from January 8, 2025 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Required from January 8, 2025:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {januaryCountries.map((country, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Plus other non-visa nationals</p>
              </div>

              {/* Required from April 2, 2025 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Required from April 2, 2025 (Can apply from March 5, 2025):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {europeanCountries.map((country, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-red-800 flex items-start gap-2">
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Not eligible for ETA (visa required):</strong> China, India, Russia, Jordan (removed Sept 2024), 
                    Colombia (removed), and all other countries that normally require a visa for UK entry cannot use the ETA system.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-yellow-200 bg-yellow-50 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-6 h-6" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>ETA is valid for 2 years or until passport expires</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Multiple entries allowed during validity period</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Maximum stay of 6 months per visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Processing time: Usually within 3 working days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Apply at least 3 days before travel</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Application Process
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fill Application</h3>
              <p className="text-gray-600">Complete the online form with your personal and travel information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Documents</h3>
              <p className="text-gray-600">Provide passport details and upload a digital photo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pay & Submit</h3>
              <p className="text-gray-600">Pay the fee and receive your ETA via email</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Apply for Your UK ETA?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              The application process takes approximately 10 minutes to complete.
              Make sure you have all required documents ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/application')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Application
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/track')}
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2"
              >
                Track Existing Application
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Save & Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span>Multi-language</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default Requirements;