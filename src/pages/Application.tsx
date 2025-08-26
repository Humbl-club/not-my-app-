import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApplicationSteps } from "@/components/ApplicationSteps";

const Application = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ApplicationSteps />
        
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Start Your Application</CardTitle>
              <CardDescription>
                Complete your electronic travel authorization application in a few simple steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Single Applicant</CardTitle>
                    <CardDescription>
                      Apply for one person
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/application/applicant/1')}
                    >
                      Start Single Application
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Group Application</CardTitle>
                    <CardDescription>
                      Apply for multiple people at once
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/application/manage')}
                    >
                      Start Group Application
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Application;