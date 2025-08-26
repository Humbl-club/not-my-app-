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
import { SecureDocumentUpload } from "@/components/SecureDocumentUpload";
import { toast } from "sonner";

const ApplicantDocuments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Check if applicant data exists
  const [applicant, setApplicant] = useState<any | null>(null);
  useEffect(() => {
    if (!id) return;
    
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const applicants = JSON.parse(applicantsData);
        const foundApplicant = applicants.find((app: any) => app.id === id);
        if (foundApplicant) {
          setApplicant(foundApplicant);
        } else {
          // Redirect back if no applicant data
          navigate(`/application/applicant/${id}`);
        }
      } else {
        navigate(`/application/applicant/${id}`);
      }
    } catch {
      navigate(`/application/applicant/${id}`);
    }
  }, [navigate, id]);

  const documentsSchema = z.object({
    passportPhoto: z.string().min(1, 'Passport photo is required'),
    personalPhoto: z.string().min(1, 'Personal photo is required'),
  });

  type DocumentsValues = z.infer<typeof documentsSchema>;

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

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    mode: 'onChange',
    defaultValues: existingDocuments || {
      passportPhoto: '',
      personalPhoto: '',
    },
  });

  // Update form when existing documents load
  useEffect(() => {
    if (existingDocuments) {
      form.setValue('passportPhoto', existingDocuments.passportPhoto);
      form.setValue('personalPhoto', existingDocuments.personalPhoto);
    }
  }, [existingDocuments, form]);

  const handleFileUpload = (fieldName: 'passportPhoto' | 'personalPhoto', file: File) => {
    // In a real application, you would upload the file to a server
    // For now, we'll just create a mock file URL
    const mockUrl = `${fieldName}_${Date.now()}.jpg`;
    form.setValue(fieldName, mockUrl, { shouldValidate: true });
  };

  const openCamera = (fieldName: 'passportPhoto' | 'personalPhoto') => {
    // In a real application, you would open the camera
    // For now, we'll just create a mock camera URL
    const mockUrl = `camera_${fieldName}_${Date.now()}.jpg`;
    form.setValue(fieldName, mockUrl, { shouldValidate: true });
  };

  const handleSubmit = async (values: DocumentsValues) => {
    if (!id) return;
    
    try {
      // Get existing applicants
      const existingApplicants = JSON.parse(sessionStorage.getItem('application.applicants') || '[]');
      
      // Find and update the specific applicant
      const applicantIndex = existingApplicants.findIndex((app: any) => app.id === id);
      if (applicantIndex >= 0) {
        existingApplicants[applicantIndex] = {
          ...existingApplicants[applicantIndex],
          ...values,
        };
        sessionStorage.setItem('application.applicants', JSON.stringify(existingApplicants));
      }
    } catch {}
    
    navigate('/application/manage');
  };

  const getApplicantDisplayInfo = () => {
    if (id === 'main') {
      return { title: t('application.mainApplicant'), subtitle: t('application.mainApplicantDocuments') };
    } else {
      // Parse applicant number with validation
      const match = id?.match(/^applicant-(\d+)$/);
      const applicantNumber = match ? parseInt(match[1]) : 2;
      const safeNumber = isNaN(applicantNumber) ? 2 : applicantNumber;
      
      return { 
        title: `${t('application.applicant')} ${safeNumber}`, 
        subtitle: `${t('application.documentsFor')} ${t('application.applicant').toLowerCase()} ${safeNumber}` 
      };
    }
  };

  if (!applicant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 3, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 75 })}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{getApplicantDisplayInfo().title} {t('application.documents.title')}</h1>
            <p className="text-muted-foreground">{getApplicantDisplayInfo().subtitle}</p>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                {/* Passport Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('application.documents.passportPhoto.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <FormField
                      control={form.control}
                      name="passportPhoto"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <SecureDocumentUpload
                              type="passport"
                              value={field.value}
                              onChange={field.onChange}
                              error={fieldState.error?.message}
                              required={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4 text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">{t('application.documents.passport.requirements.title')}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The photo must be unaltered by effects or filters</li>
                        <li>Original, not a screenshot or photocopy</li>
                        <li>Of a physical passport, not a digital passport</li>
                        <li>In colour</li>
                        <li>Horizontal (landscape)</li>
                        <li>A jpg or jpeg file</li>
                        <li>Clear, readable image of passport personal details page</li>
                        <li>All text must be visible and legible</li>
                        <li>No glare or shadows</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Photo Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('application.documents.personalPhoto.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <FormField
                      control={form.control}
                      name="personalPhoto"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <SecureDocumentUpload
                              type="personal"
                              value={field.value}
                              onChange={field.onChange}
                              error={fieldState.error?.message}
                              required={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">{t('application.documents.personal.requirements.title')}</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-foreground mb-1">The photo must be:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>different to the one in your passport</li>
                            <li>recently taken (no more than 3 months old)</li>
                            <li>vertical (portrait)</li>
                            <li>a jpg or jpeg file</li>
                            <li>Plain, light background</li>
                            <li>No people or objects in background</li>
                            <li>Full head, shoulders, and upper body visible</li>
                            <li>Even lighting with no shadows or glare</li>
                            <li>Clear visibility of facial features</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">You must not:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>upload a photo of another photo</li>
                            <li>use any effects or filters</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => navigate(`/application/applicant/${id}`)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('application.back')}
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    {t('application.continue')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDocuments;