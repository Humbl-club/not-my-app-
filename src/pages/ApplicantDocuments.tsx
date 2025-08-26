import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnhancedPhotoCapture } from "@/components/EnhancedPhotoCapture";
import { SimpleSaveButton } from "@/components/SimpleSaveButton";
import { toast } from "sonner";
import { DataManager } from "@/utils/dataManager";

const ApplicantDocuments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Check if applicant data exists
  const [applicant, setApplicant] = useState<any | null>(null);
  const [photoAnalysisScores, setPhotoAnalysisScores] = useState<{
    passport?: number;
    personal?: number;
  }>({});

  useEffect(() => {
    if (!id) return;
    
    const applicantData = DataManager.getApplicant(id);
    if (applicantData) {
      setApplicant(applicantData);
    } else {
      // Redirect back if no applicant data
      navigate(`/application/applicant/${id}`);
    }
  }, [navigate, id]);

  const documentsSchema = z.object({
    passportPhoto: z.string().min(1, 'Passport photo is required'),
    personalPhoto: z.string().min(1, 'Personal photo is required'),
  });

  type DocumentsValues = z.infer<typeof documentsSchema>;

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      passportPhoto: '',
      personalPhoto: '',
    },
  });

  // Load existing document data
  const [existingDocuments, setExistingDocuments] = useState<DocumentsValues | null>(null);
  useEffect(() => {
    if (applicant && applicant.passportPhoto && applicant.personalPhoto) {
      setExistingDocuments({
        passportPhoto: applicant.passportPhoto,
        personalPhoto: applicant.personalPhoto,
      });
    }
  }, [applicant]);

  // Set form values when existing documents are loaded
  useEffect(() => {
    if (existingDocuments) {
      form.setValue('passportPhoto', existingDocuments.passportPhoto);
      form.setValue('personalPhoto', existingDocuments.personalPhoto);
    }
  }, [existingDocuments, form]);

  const handlePhotoCapture = (photoData: string, analysisScore: number, fieldName: 'passportPhoto' | 'personalPhoto') => {
    // Store the photo data
    form.setValue(fieldName, photoData, { shouldValidate: true });
    
    // Store the analysis score
    setPhotoAnalysisScores(prev => ({
      ...prev,
      [fieldName === 'passportPhoto' ? 'passport' : 'personal']: analysisScore
    }));
    
    // Show feedback based on analysis score
    if (analysisScore >= 75) {
      toast.success('Photo quality is excellent! ✓', {
        description: 'This photo meets all government requirements.'
      });
    } else if (analysisScore >= 50) {
      toast.warning('Photo quality is acceptable', {
        description: 'The photo may work but consider retaking for best results.'
      });
    } else {
      toast.error('Photo quality needs improvement', {
        description: 'Please retake the photo following the guidelines.'
      });
    }
  };

  const handleSubmit = async (values: DocumentsValues) => {
    if (!id) return;
    
    // Check photo quality scores
    const passportScore = photoAnalysisScores.passport || 0;
    const personalScore = photoAnalysisScores.personal || 0;
    
    if (passportScore < 50 || personalScore < 50) {
      const confirm = window.confirm(
        'One or more photos have low quality scores. This may result in application delays. Do you want to continue anyway?'
      );
      if (!confirm) return;
    }
    
    // Save document data using DataManager
    DataManager.updateApplicant(id, values);
    
    // Check if all applicants are now complete
    if (DataManager.areAllApplicantsComplete()) {
      // All applicants complete - go to review
      navigate('/application/review');
    } else {
      // Still need more completion - go back to manager
      navigate('/application/manage');
    }
  };

  const getApplicantDisplayInfo = () => {
    if (id === '1') {
      return { title: t('application.mainApplicant'), subtitle: t('application.mainApplicantDocuments') };
    } else {
      // Parse applicant number with validation
      const applicantNumber = parseInt(id || '2');
      const safeNumber = isNaN(applicantNumber) ? 2 : applicantNumber;
      
      return { 
        title: `${t('application.applicant')} ${safeNumber}`, 
        subtitle: `${t('application.documentsFor')} ${t('application.applicant').toLowerCase()} ${safeNumber}` 
      };
    }
  };

  if (!applicant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {t('application.progress.step', { current: 3, total: 4 })}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('application.progress.complete', { percent: 75 })}
              </span>
            </div>
            <Progress value={75} className="h-3 bg-muted/50 [&>[data-state=complete]]:bg-gradient-travel" />
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
              {getApplicantDisplayInfo().title} - {t('application.documents.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {getApplicantDisplayInfo().subtitle}
            </p>
          </div>

          {/* Save & Continue Later Button */}
          <div className="flex justify-end mb-8">
            <SimpleSaveButton currentStep={`documents-${id}`} />
          </div>

          {/* Document Upload */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" noValidate>
              {/* Passport Photo */}
              <FormField
                control={form.control}
                name="passportPhoto"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <EnhancedPhotoCapture
                        onPhotoCapture={(data, score, metadata) => handlePhotoCapture(data, score, 'passportPhoto')}
                        fieldName="passportPhoto"
                        title={t('application.documents.passport.uploadTitle')}
                        documentType="passport"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                    {field.value && photoAnalysisScores.passport && (
                      <div className={`mt-2 text-sm ${
                        photoAnalysisScores.passport >= 75 ? 'text-green-600' :
                        photoAnalysisScores.passport >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Quality Score: {photoAnalysisScores.passport}%
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Personal Photo */}
              <FormField
                control={form.control}
                name="personalPhoto"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <EnhancedPhotoCapture
                        onPhotoCapture={(data, score, metadata) => handlePhotoCapture(data, score, 'personalPhoto')}
                        fieldName="personalPhoto"
                        title={t('application.documents.photo.upload.title')}
                        documentType="personal"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                    {field.value && photoAnalysisScores.personal && (
                      <div className={`mt-2 text-sm ${
                        photoAnalysisScores.personal >= 75 ? 'text-green-600' :
                        photoAnalysisScores.personal >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Quality Score: {photoAnalysisScores.personal}%
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/application/applicant/${id}`)}
                  className="min-w-[150px]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.back')}
                </Button>
                <Button
                  type="submit"
                  className="min-w-[150px] bg-gradient-to-r from-primary to-turquoise hover:opacity-90 transition-opacity"
                  disabled={!form.formState.isValid}
                >
                  {t('common.continue')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDocuments;