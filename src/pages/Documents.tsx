import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step 2 of 4</span>
              <span className="text-sm text-muted-foreground">50% Complete</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
            <p className="text-muted-foreground">Please upload your passport and photo</p>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            {/* Passport Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Passport Information Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Upload Passport Photo</p>
                  <p className="text-muted-foreground mb-4">JPG or JPEG format only</p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Clear, readable image of passport personal details page</li>
                    <li>All text must be visible and legible</li>
                    <li>No glare or shadows</li>
                    <li>JPG or JPEG format only</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">Upload Photo</p>
                    <p className="text-sm text-muted-foreground mb-3">JPG or JPEG</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">Take Photo</p>
                    <p className="text-sm text-muted-foreground mb-3">Use camera</p>
                    <Button variant="outline" size="sm">
                      Open Camera
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Photo Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Plain, light background</li>
                    <li>No people or objects in background</li>
                    <li>Full head, shoulders, and upper body visible</li>
                    <li>Even lighting with no shadows or glare</li>
                    <li>Clear visibility of facial features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={() => navigate('/application/payment')}
              className="flex items-center gap-2"
            >
              {t('application.continue')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;