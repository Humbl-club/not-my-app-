import React, { useState, useEffect } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit,
  CheckCircle,
  User,
  Users,
  FileText,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
  Shield,
  AlertCircle,
  Info,
  FileImage,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataManager } from '@/utils/dataManager';
import { cn } from '@/lib/utils';

const ReviewPro = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [expandedApplicant, setExpandedApplicant] = useState<number | null>(0);
  
  // Load applicants data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const applicantsData = DataManager.getApplicants();
      setApplicants(applicantsData);
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleEdit = (applicantId: string, section: 'personal' | 'documents') => {
    if (section === 'personal') {
      navigate(`/application/applicant/${applicantId}`);
    } else {
      navigate(`/application/applicant/${applicantId}/documents`);
    }
  };

  const handleSubmit = () => {
    // Navigate to payment
    navigate('/application/payment');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCountryName = (code: string) => {
    // This would normally come from a countries list
    return code || 'Not provided';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderPro />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application data...</p>
          </div>
        </div>
        <FooterPro />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Review Application
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Review Your Application
            </h1>
            <p className="text-lg text-gray-600">
              Please review all information carefully before submitting
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  <strong>{applicants.length}</strong> {applicants.length === 1 ? 'Applicant' : 'Applicants'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  All Information Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50 mb-8">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Please ensure all information is accurate and matches your passport exactly. 
              False or incorrect information may result in denial of your ETA application.
            </AlertDescription>
          </Alert>

          {/* Applicants List */}
          <div className="space-y-6">
            {applicants.map((applicant, index) => {
              const isExpanded = expandedApplicant === index;
              const isMainApplicant = index === 0;
              
              return (
                <Card 
                  key={index}
                  className={cn(
                    "shadow-xl border-2 transition-all",
                    isExpanded && "ring-2 ring-blue-500 ring-offset-2"
                  )}
                >
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedApplicant(isExpanded ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          isMainApplicant 
                            ? "bg-gradient-to-br from-blue-100 to-indigo-100"
                            : "bg-gradient-to-br from-purple-100 to-pink-100"
                        )}>
                          <User className={cn(
                            "w-6 h-6",
                            isMainApplicant ? "text-blue-600" : "text-purple-600"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {applicant.firstName} {applicant.lastName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {isMainApplicant ? 'Primary Applicant' : `Additional Applicant ${index + 1}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500"
                        >
                          {isExpanded ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-6">
                      <Separator />
                      
                      {/* Personal Information */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Personal Information
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit((index + 1).toString(), 'personal')}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Full Name</p>
                            <p className="font-medium">
                              {applicant.firstName} {applicant.secondNames} {applicant.lastName}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500 mb-1">Date of Birth</p>
                            <p className="font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(applicant.dateOfBirth)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500 mb-1">Nationality</p>
                            <p className="font-medium flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {getCountryName(applicant.nationality)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500 mb-1">Passport Number</p>
                            <p className="font-medium font-mono">
                              {applicant.passportNumber}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500 mb-1">Email</p>
                            <p className="font-medium flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {applicant.email}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500 mb-1">Employment</p>
                            <p className="font-medium flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {applicant.hasJob === 'yes' ? applicant.jobTitle || 'Employed' : 'Not employed'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Address */}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                          <MapPin className="w-4 h-4 text-green-600" />
                          Home Address
                        </h3>
                        
                        <div className="text-sm bg-gray-50 p-4 rounded-lg">
                          {applicant.useSameAddressAsPrimary && !isMainApplicant ? (
                            <p className="text-gray-600 italic">Same as primary applicant</p>
                          ) : applicant.address ? (
                            <div>
                              <p>{applicant.address.line1}</p>
                              {applicant.address.line2 && <p>{applicant.address.line2}</p>}
                              <p>
                                {applicant.address.city}, {applicant.address.postalCode}
                              </p>
                              <p>{getCountryName(applicant.address.country)}</p>
                            </div>
                          ) : (
                            <p className="text-gray-500">No address provided</p>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Documents */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Camera className="w-4 h-4 text-purple-600" />
                            Documents
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit((index + 1).toString(), 'documents')}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {applicant.passportPhoto && (
                            <div className="text-sm">
                              <p className="text-gray-500 mb-2">Passport Photo Page</p>
                              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                                <img 
                                  src={applicant.passportPhoto} 
                                  alt="Passport" 
                                  className="w-full h-32 object-cover bg-gray-50"
                                />
                                <Badge className="absolute top-2 right-2 bg-green-100 text-green-700">
                                  <FileImage className="w-3 h-3 mr-1" />
                                  Uploaded
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {applicant.personalPhoto && (
                            <div className="text-sm">
                              <p className="text-gray-500 mb-2">Personal Photo</p>
                              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                                <img 
                                  src={applicant.personalPhoto} 
                                  alt="Personal" 
                                  className="w-full h-32 object-cover bg-gray-50"
                                />
                                <Badge className="absolute top-2 right-2 bg-green-100 text-green-700">
                                  <Camera className="w-3 h-3 mr-1" />
                                  Uploaded
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Security Questions */}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                          <Shield className="w-4 h-4 text-red-600" />
                          Security Declarations
                        </h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Criminal Convictions</span>
                            <Badge className={cn(
                              "border",
                              applicant.hasCriminalConvictions === 'no'
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            )}>
                              {applicant.hasCriminalConvictions === 'no' ? 'No' : 'Yes'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">War Crimes Convictions</span>
                            <Badge className={cn(
                              "border",
                              applicant.hasWarCrimesConvictions === 'no'
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            )}>
                              {applicant.hasWarCrimesConvictions === 'no' ? 'No' : 'Yes'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Payment Summary */}
          <Card className="shadow-xl border-2 mt-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Applicants</span>
                  <span className="font-medium">{applicants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee per Applicant</span>
                  <span className="font-medium">£16.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">£{(applicants.length * 16).toFixed(2)}</span>
                </div>
              </div>
              
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Payment will be processed on the next page using secure encryption
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Declaration */}
          <Card className="shadow-xl border-2 mt-8 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Declaration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-800 leading-relaxed">
                By proceeding to payment, I declare that all information provided in this application is true, 
                complete, and accurate to the best of my knowledge. I understand that providing false information 
                may result in the refusal of my ETA application and may affect future travel to the UK.
              </p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              variant="outline"
              onClick={() => navigate('/application/manage')}
              className="px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Manage
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Proceed to Payment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Before You Submit</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Ensure all names match passport exactly</li>
                  <li>• Verify email addresses are correct for each applicant</li>
                  <li>• Check that all photos are clear and meet requirements</li>
                  <li>• Confirm passport numbers are accurate</li>
                  <li>• Review security declarations carefully</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default ReviewPro;