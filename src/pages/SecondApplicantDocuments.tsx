import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const SecondApplicantDocuments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Check if second applicant data exists
  const [secondApplicant, setSecondApplicant] = useState<any | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('application.secondApplicant');
      if (raw) {
        setSecondApplicant(JSON.parse(raw));
      } else {
        // Redirect back if no second applicant data
        navigate('/application/second-applicant');
      }
    } catch {
      navigate('/application/second-applicant');
    }
  }, [navigate]);

  const documentsSchema = z.object({
    passportPhoto: z.string().min(1, 'Passport photo is required'),
    personalPhoto: z.string().min(1, 'Personal photo is required'),
  });

  type DocumentsValues = z.infer<typeof documentsSchema>;

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    mode: 'onChange',
    defaultValues: {
      passportPhoto: '',
      personalPhoto: '',
    },
  });

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
    try {
      // Merge documents with existing second applicant data
      const updatedSecondApplicant = {
        ...secondApplicant,
        ...values,
      };
      sessionStorage.setItem('application.secondApplicant', JSON.stringify(updatedSecondApplicant));
    } catch {}
    navigate('/application/payment');
  };

  if (!secondApplicant) {
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
            <h1 className="text-3xl font-bold mb-2">Second Applicant Documents</h1>
            <p className="text-muted-foreground">Please upload documents for the second applicant</p>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                {/* Passport Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('application.documents.passportPhoto.title', { defaultValue: 'Passport Photo' })}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="passportPhoto"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-lg font-medium mb-2">{t('application.documents.passportPhoto.upload', { defaultValue: 'Upload passport photo' })}</p>
                              <p className="text-muted-foreground mb-4">JPG or JPEG format only</p>
                              <div className="flex gap-2 justify-center">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.jpg,.jpeg';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) handleFileUpload('passportPhoto', file);
                                    };
                                    input.click();
                                  }}
                                >
                                  Choose File
                                </Button>
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={() => openCamera('passportPhoto')}
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Camera
                                </Button>
                              </div>
                              {field.value && (
                                <p className="mt-2 text-sm text-green-600">✓ File uploaded successfully</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4 text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">{t('application.documents.passportPhoto.requirements', { defaultValue: 'Requirements:' })}</h4>
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
                    <CardTitle>{t('application.documents.personalPhoto.title', { defaultValue: 'Personal Photo' })}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="personalPhoto"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="font-medium mb-1">{t('application.documents.personalPhoto.upload', { defaultValue: 'Upload Photo' })}</p>
                                <p className="text-sm text-muted-foreground mb-3">JPG or JPEG</p>
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.jpg,.jpeg';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) handleFileUpload('personalPhoto', file);
                                    };
                                    input.click();
                                  }}
                                >
                                  Choose File
                                </Button>
                              </div>
                              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="font-medium mb-1">{t('application.documents.personalPhoto.camera', { defaultValue: 'Take Photo' })}</p>
                                <p className="text-sm text-muted-foreground mb-3">Use camera</p>
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openCamera('personalPhoto')}
                                >
                                  Open Camera
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          {field.value && (
                            <p className="text-sm text-green-600">✓ Photo uploaded successfully</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">{t('application.documents.personalPhoto.requirements', { defaultValue: 'Photo Requirements:' })}</h4>
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
                    onClick={() => navigate('/application/second-applicant')}
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

export default SecondApplicantDocuments;