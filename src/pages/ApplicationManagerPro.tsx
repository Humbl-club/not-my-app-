import React, { useEffect, useState } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  UserPlus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Users,
  User,
  FileText,
  Camera,
  Shield,
  Info,
  CheckCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataManager } from '@/utils/dataManager';
import { cn } from '@/lib/utils';

interface Applicant {
  id: string;
  role: 'main' | 'additional';
  firstName?: string;
  lastName?: string;
  personalInfoComplete: boolean;
  documentsComplete: boolean;
}

const ApplicationManagerPro = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationType = searchParams.get('type') || 'individual';
  
  const maxApplicants = applicationType === 'individual' ? 1 : 50;
  
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Load applicant data from sessionStorage
  useEffect(() => {
    const applicantsData = DataManager.getApplicants();
    
    // If no applicants exist, create default main applicant
    if (applicantsData.length === 0) {
      setApplicants([{
        id: '1',
        role: 'main',
        firstName: '',
        lastName: '',
        personalInfoComplete: false,
        documentsComplete: false
      }]);
      return;
    }
    
    // Map applicants data to UI format
    const mappedApplicants = applicantsData.map((applicant, index) => ({
      id: (index + 1).toString(),
      role: index === 0 ? 'main' as const : 'additional' as const,
      firstName: applicant.firstName || '',
      lastName: applicant.lastName || '',
      personalInfoComplete: DataManager.hasCompletePersonalInfo((index + 1).toString()),
      documentsComplete: DataManager.hasCompleteDocuments((index + 1).toString())
    }));
    
    setApplicants(mappedApplicants);
  }, []);

  const totalApplicants = applicants.length;
  const completedApplicants = applicants.filter(a => a.personalInfoComplete && a.documentsComplete).length;
  const allApplicantsComplete = applicants.length > 0 && applicants.every(a => a.personalInfoComplete && a.documentsComplete);
  const overallProgress = applicants.length > 0 ? Math.round((completedApplicants / applicants.length) * 100) : 0;

  const handleAddApplicant = () => {
    if (applicants.length < maxApplicants) {
      const newId = (applicants.length + 1).toString();
      navigate(`/application/applicant/${newId}/documents`);
    }
  };

  const handleEditApplicant = (applicantId: string) => {
    navigate(`/application/applicant/${applicantId}/documents`);
  };

  const handleRemoveApplicant = (applicantId: string) => {
    if (applicantId === '1') return; // Cannot remove main applicant
    
    const updatedApplicants = applicants.filter(a => a.id !== applicantId);
    
    // Re-index additional applicants to maintain proper numbering
    const reindexedApplicants = updatedApplicants.map((applicant, index) => {
      if (applicant.role === 'main') return applicant;
      return {
        ...applicant,
        id: (index + 1).toString()
      };
    });
    
    setApplicants(reindexedApplicants);
    
    // Update sessionStorage
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const allApplicants = JSON.parse(applicantsData);
        const applicantIndex = parseInt(applicantId) - 1;
        if (applicantIndex >= 0 && applicantIndex < allApplicants.length) {
          allApplicants.splice(applicantIndex, 1);
          sessionStorage.setItem('application.applicants', JSON.stringify(allApplicants));
        }
      }
    } catch (error) {
      console.error('Error updating sessionStorage:', error);
    }
  };

  const ApplicantCard = ({ applicant, index }: { applicant: Applicant; index: number }) => {
    const isMain = applicant.role === 'main';
    const displayName = applicant.firstName && applicant.lastName 
      ? `${applicant.firstName} ${applicant.lastName}` 
      : isMain ? 'Main Applicant' : `Applicant ${index + 1}`;
    
    const personalInfoStatus = applicant.personalInfoComplete;
    const documentsStatus = applicant.documentsComplete;
    const overallStatus = applicant.personalInfoComplete && applicant.documentsComplete;

    return (
      <Card className={cn(
        "hover:shadow-xl transition-all duration-300 border-2",
        overallStatus 
          ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" 
          : "hover:border-blue-200"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isMain 
                  ? "bg-gradient-to-br from-blue-100 to-indigo-100"
                  : "bg-gradient-to-br from-purple-100 to-pink-100"
              )}>
                <User className={cn(
                  "w-6 h-6",
                  isMain ? "text-blue-600" : "text-purple-600"
                )} />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isMain ? 'Primary Applicant' : `Additional Applicant ${index}`}
                </CardTitle>
                {displayName !== (isMain ? 'Main Applicant' : `Applicant ${index + 1}`) && (
                  <p className="text-sm text-gray-600 mt-1">{displayName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {overallStatus && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Badge>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditApplicant(applicant.id)}
                  className="rounded-lg hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {!isMain && applicationType === 'group' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveApplicant(applicant.id)}
                    className="rounded-lg hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              personalInfoStatus ? "bg-green-100" : "bg-gray-100"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                personalInfoStatus ? "bg-green-200" : "bg-gray-200"
              )}>
                {personalInfoStatus ? (
                  <Check className="w-5 h-5 text-green-700" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Personal Information</p>
                <p className={cn(
                  "text-xs",
                  personalInfoStatus ? "text-green-700" : "text-gray-500"
                )}>
                  {personalInfoStatus ? 'Completed' : 'Not Started'}
                </p>
              </div>
            </div>
            
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              documentsStatus ? "bg-green-100" : "bg-gray-100"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                documentsStatus ? "bg-green-200" : "bg-gray-200"
              )}>
                {documentsStatus ? (
                  <Check className="w-5 h-5 text-green-700" />
                ) : (
                  <Camera className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Documents & Photo</p>
                <p className={cn(
                  "text-xs",
                  documentsStatus ? "text-green-700" : "text-gray-500"
                )}>
                  {documentsStatus ? 'Uploaded' : 'Required'}
                </p>
              </div>
            </div>
          </div>

          {!overallStatus && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Click the edit button to complete this applicant's information</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Progress Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Step 2 of 5: Manage Applicants
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {overallProgress}% Complete
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {applicationType === 'individual' ? 'Individual Application' : 'Group Application'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Manage Your {applicationType === 'individual' ? 'Application' : 'Applicants'}
            </h1>
            <p className="text-lg text-gray-600">
              {applicationType === 'individual' 
                ? 'Complete your personal information and documents'
                : `Add and manage up to ${maxApplicants} applicants in one application`}
            </p>
            
            {/* Status Summary */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>{completedApplicants}</strong> Complete
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>{totalApplicants - completedApplicants}</strong> In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>{maxApplicants - totalApplicants}</strong> Available
                </span>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div className="space-y-6 mb-8">
            {applicants.map((applicant, index) => (
              <ApplicantCard key={applicant.id} applicant={applicant} index={index} />
            ))}
          </div>

          {/* Add More Applicants */}
          {applicationType === 'group' && applicants.length < maxApplicants && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Add Another Applicant</h3>
                  <p className="text-gray-600 mb-6">
                    You can add up to {maxApplicants - applicants.length} more {maxApplicants - applicants.length === 1 ? 'applicant' : 'applicants'}
                  </p>
                  <Button 
                    onClick={handleAddApplicant}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Applicant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Important Information</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Each applicant needs their own passport and photo</li>
                  <li>• All information must match passport details exactly</li>
                  <li>• You can save and resume your application at any time</li>
                  {applicationType === 'group' && (
                    <li>• Single payment covers all applicants (£16 per person)</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {allApplicantsComplete ? (
              <Button 
                onClick={() => navigate('/application/payment')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Continue to Payment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Complete all applicants to continue</p>
                <Button 
                  disabled
                  className="opacity-50 cursor-not-allowed"
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default ApplicationManagerPro;
