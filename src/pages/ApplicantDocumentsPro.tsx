import React, { useState, useEffect } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera,
  Upload,
  Check,
  X,
  Info,
  AlertCircle,
  Shield,
  FileImage,
  Smartphone,
  Monitor,
  RefreshCw,
  ZoomIn
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataManager } from '@/utils/dataManager';
import { EnhancedPhotoCapture } from '@/components/EnhancedPhotoCapture';
import { SimpleSaveButton } from '@/components/SimpleSaveButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ApplicantDocumentsPro = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applicant, setApplicant] = useState<any | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [personalPhoto, setPersonalPhoto] = useState<string | null>(null);
  const [passportScore, setPassportScore] = useState<number>(0);
  const [personalScore, setPersonalScore] = useState<number>(0);
  const [activePhoto, setActivePhoto] = useState<'passport' | 'personal'>('passport');
  
  const applicantNumber = parseInt(id || '1');
  const isMainApplicant = applicantNumber === 1;

  // Check if this is a group application
  const [isGroupApplication, setIsGroupApplication] = useState(false);
  const [totalApplicants, setTotalApplicants] = useState(1);

  useEffect(() => {
    const applicants = DataManager.getApplicants();
    setTotalApplicants(applicants.length || 1);
    setIsGroupApplication(applicants.length > 1 || sessionStorage.getItem('applicationType') === 'group');
  }, []);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      let applicantData = DataManager.getApplicant(id || '1');
      if (!applicantData) {
        // Seed empty applicant so docs can be uploaded first
        DataManager.updateApplicant(id || '1', {});
        applicantData = DataManager.getApplicant(id || '1');
      }

      if (applicantData) {
        setApplicant(applicantData);
        if (applicantData.passportPhoto) setPassportPhoto(applicantData.passportPhoto);
        if (applicantData.personalPhoto) setPersonalPhoto(applicantData.personalPhoto);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [id, navigate]);

  const handlePassportPhotoCapture = (photo: string, score: number) => {
    setPassportPhoto(photo);
    setPassportScore(score);
    
    // Auto-save photo
    const applicantData = DataManager.getApplicant(id || '1');
    if (applicantData) {
      DataManager.updateApplicant(id || '1', {
        ...applicantData,
        passportPhoto: photo
      });
    }
    
    toast.success('Passport photo captured successfully!');
  };

  const handlePersonalPhotoCapture = (photo: string, score: number) => {
    setPersonalPhoto(photo);
    setPersonalScore(score);
    
    // Auto-save photo
    const applicantData = DataManager.getApplicant(id || '1');
    if (applicantData) {
      DataManager.updateApplicant(id || '1', {
        ...applicantData,
        personalPhoto: photo
      });
    }
    
    toast.success('Personal photo captured successfully!');
  };

  const handleContinue = async () => {
    if (!passportPhoto || !personalPhoto) {
      toast.error('Please upload both photos before continuing');
      return;
    }
    
    if (passportScore < 50 || personalScore < 50) {
      toast.warning('Photo quality is low. Your application may be delayed.');
    }
    
    setSaving(true);
    
    try {
      // Save documents
      const applicantData = DataManager.getApplicant(id || '1');
      if (applicantData) {
        DataManager.updateApplicant(id || '1', {
          ...applicantData,
          passportPhoto,
          personalPhoto
        });
      }
      
      toast.success('Documents saved successfully!');
      
      // Proceed to personal details for this applicant (docs-first flow)
      navigate(`/application/applicant/${id}`);
    } catch (error) {
      console.error('Error saving documents:', error);
      toast.error('Failed to save documents. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (passportPhoto) completed += 50;
    if (personalPhoto) completed += 50;
    return completed;
  };

  const completionPercentage = calculateCompletion();

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'green';
    if (score >= 50) return 'amber';
    return 'red';
  };

  const getScoreBadge = (score: number) => {
    const color = getScoreColor(score);
    const variants: Record<string, string> = {
      'green': 'bg-green-100 text-green-800 border-green-200',
      'amber': 'bg-amber-100 text-amber-800 border-amber-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
    };
    
    const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Acceptable' : 'Poor Quality';
    
    return (
      <Badge className={cn("border", variants[color])}>
        {label} ({score}%)
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderPro />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading document requirements...</p>
          </div>
        </div>
        <FooterPro />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Progress Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Step 2 of 5: Documents & Photos
                  </span>
                </div>
                {isGroupApplication && (
                  <Badge variant="outline" className="bg-white">
                    Applicant {applicantNumber} of {totalApplicants}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {completionPercentage}% Complete
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Camera className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Document Upload
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Your Documents
            </h1>
            <p className="text-lg text-gray-600">
              {applicant ? `Documents for ${applicant.firstName} ${applicant.lastName}` : 'Please provide required documents'}
            </p>
          </div>

          {/* Photo Requirements Card */}
          <Card className="shadow-xl border-2 mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Photo Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    What We Need
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Clear, recent passport-style photo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Taken within the last 6 months
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Plain light-colored background
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Face clearly visible, eyes open
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      No sunglasses or hats
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600" />
                    What to Avoid
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Blurry or low-quality images
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Photos with filters or effects
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Dark or busy backgrounds
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Group photos or selfies
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Photos taken from too far away
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activePhoto === 'passport' ? 'default' : 'outline'}
              onClick={() => setActivePhoto('passport')}
              className="flex-1"
            >
              <FileImage className="w-4 h-4 mr-2" />
              Passport Photo Page
              {passportPhoto && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  <Check className="w-3 h-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </Button>
            <Button
              variant={activePhoto === 'personal' ? 'default' : 'outline'}
              onClick={() => setActivePhoto('personal')}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Personal Photo
              {personalPhoto && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  <Check className="w-3 h-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </Button>
          </div>

          {/* Photo Upload Section */}
          <Card className="shadow-xl border-2 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {activePhoto === 'passport' ? 'Passport Photo Page' : 'Personal Photo'}
                </CardTitle>
                {activePhoto === 'passport' && passportPhoto && (
                  <div className="flex items-center gap-2">
                    {getScoreBadge(passportScore)}
                  </div>
                )}
                {activePhoto === 'personal' && personalPhoto && (
                  <div className="flex items-center gap-2">
                    {getScoreBadge(personalScore)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {activePhoto === 'passport' ? (
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Upload a clear photo of your passport's information page showing your photo and details
                    </AlertDescription>
                  </Alert>
                  
                  {passportPhoto ? (
                    <div className="space-y-4">
                      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                        <img 
                          src={passportPhoto} 
                          alt="Passport" 
                          className="w-full h-64 object-contain bg-gray-50"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPassportPhoto(null)}
                            className="bg-white/90 backdrop-blur"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Replace
                          </Button>
                        </div>
                      </div>
                      
                      {passportScore < 50 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Photo quality is poor. Please upload a clearer image to avoid delays.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <EnhancedPhotoCapture
                      onPhotoCapture={handlePassportPhotoCapture}
                      photoType="passport"
                      applicantName={applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Applicant'}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-purple-200 bg-purple-50">
                    <Info className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      Upload a recent passport-style photo of yourself against a plain background
                    </AlertDescription>
                  </Alert>
                  
                  {personalPhoto ? (
                    <div className="space-y-4">
                      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                        <img 
                          src={personalPhoto} 
                          alt="Personal" 
                          className="w-full h-64 object-contain bg-gray-50"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPersonalPhoto(null)}
                            className="bg-white/90 backdrop-blur"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Replace
                          </Button>
                        </div>
                      </div>
                      
                      {personalScore < 50 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Photo quality is poor. Please upload a clearer image to avoid delays.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <EnhancedPhotoCapture
                      onPhotoCapture={handlePersonalPhotoCapture}
                      photoType="personal"
                      applicantName={applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Applicant'}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Methods Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Upload from Computer</h3>
                <p className="text-sm text-gray-600">
                  Drag and drop or browse files from your device
                </p>
              </CardContent>
            </Card>
            
            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Use Webcam</h3>
                <p className="text-sm text-gray-600">
                  Take a photo using your computer's camera
                </p>
              </CardContent>
            </Card>
            
            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Mobile Camera</h3>
                <p className="text-sm text-gray-600">
                  Use your phone's camera for better quality
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Completion Status */}
          {passportPhoto && personalPhoto && (
            <Alert className="border-green-200 bg-green-50 mb-8">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                All required documents uploaded successfully! You can now continue to the next step.
              </AlertDescription>
            </Alert>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate(`/application/applicant/${id}`)}
              className="px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-3">
              <SimpleSaveButton currentStep={`applicant-${id}-documents`} />
              
              <Button
                onClick={handleContinue}
                disabled={!passportPhoto || !personalPhoto || saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isGroupApplication && applicantNumber < totalApplicants ? 'Next Applicant' : 'Continue to Payment'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Your Documents Are Secure</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• All uploads are encrypted with 256-bit SSL encryption</li>
                  <li>• Photos are automatically analyzed for quality and compliance</li>
                  <li>• Your documents are stored securely and deleted after processing</li>
                  <li>• We never share your information with third parties</li>
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

export default ApplicantDocumentsPro;
