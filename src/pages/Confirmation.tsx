import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Phone, ArrowLeft, Eye, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataManager } from '@/utils/dataManager';
import { PaymentService } from '@/services/paymentService';
import { PDFService, ReceiptData } from '@/services/pdfService';
import { EmailNotificationService } from '@/services/emailNotificationService';
import { EmailNotifications } from '@/components/EmailNotifications';
import { toast } from 'sonner';

const Confirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const loadConfirmationData = async () => {
      try {
        // Get reference number from navigation state or storage
        const referenceNumber = location.state?.referenceNumber || DataManager.getLastApplicationReference();
        
        if (!referenceNumber) {
          // No reference number found, redirect to home
          navigate('/', { replace: true });
          return;
        }

        // Get application data
        const applicationData = DataManager.getApplicationByReference(referenceNumber);
        const applicants = DataManager.getApplicants();
        
        if (!applicationData || !applicants.length) {
          toast.error('Application data not found', {
            description: 'Please contact support if you need assistance.'
          });
          navigate('/', { replace: true });
          return;
        }

        // Calculate payment details
        const paymentDetails = PaymentService.calculatePayment(applicants.length);

        const receipt: ReceiptData = {
          referenceNumber,
          paymentDetails,
          applicants,
          submissionDate: applicationData.submissionDate,
          paymentStatus: 'succeeded'
        };

        setReceiptData(receipt);
        
        // Automatically send confirmation email
        if (applicants[0]?.email) {
          try {
            await EmailNotificationService.sendApplicationConfirmation(
              applicants[0].email,
              `${applicants[0].firstName} ${applicants[0].lastName}`,
              referenceNumber
            );
            setEmailSent(true);
          } catch (error) {
            console.error('Failed to send confirmation email:', error);
          }
        }
      } catch (error) {
        console.error('Error loading confirmation data:', error);
        toast.error('Error loading application data', {
          description: 'Please try refreshing the page or contact support.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfirmationData();
  }, [location.state, navigate]);

  const handleDownloadReceipt = async () => {
    if (!receiptData) return;
    
    try {
      toast.loading('Generating receipt...', { id: 'pdf-generation' });
      
      const pdf = await PDFService.generateReceipt(receiptData);
      PDFService.downloadPDF(pdf, `ETA-Receipt-${receiptData.referenceNumber}.pdf`);
      
      toast.success('Receipt downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt', { 
        id: 'pdf-generation',
        description: 'Please try again or contact support'
      });
    }
  };

  const handleDownloadConfirmation = async () => {
    if (!receiptData) return;
    
    try {
      toast.loading('Generating confirmation...', { id: 'pdf-confirmation' });
      
      const pdf = await PDFService.generateApplicationConfirmation(receiptData);
      PDFService.downloadPDF(pdf, `ETA-Confirmation-${receiptData.referenceNumber}.pdf`);
      
      toast.success('Confirmation downloaded successfully!', { id: 'pdf-confirmation' });
    } catch (error) {
      console.error('Error generating confirmation:', error);
      toast.error('Failed to generate confirmation', { 
        id: 'pdf-confirmation',
        description: 'Please try again or contact support'
      });
    }
  };

  const handleTrackApplication = () => {
    navigate('/track', { 
      state: { referenceNumber: receiptData?.referenceNumber } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No application data found.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary to-turquoise rounded-full mb-8">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
              {t('confirmation.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {t('confirmation.subtitle')}
            </p>
          </div>

          {/* Application Details */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('confirmation.applicationDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.referenceNumber')}</label>
                  <p className="font-mono text-lg font-bold text-primary">{receiptData.referenceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.submissionDate')}</label>
                  <p>{new Date(receiptData.submissionDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.processingTime')}</label>
                  <p>24-72 hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.amountPaid')}</label>
                  <p className="font-bold text-lg">£{receiptData.paymentDetails.total.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Applicant summary */}
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground">Applicants ({receiptData.applicants.length})</label>
                <div className="mt-2 space-y-1">
                  {receiptData.applicants.map((applicant, index) => (
                    <p key={index} className="text-sm">
                      {index === 0 ? 'Main Applicant' : `Applicant ${index + 1}`}: {applicant.firstName} {applicant.lastName}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('confirmation.nextSteps.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step1.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step1.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step2.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step2.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step3.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step3.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Button 
              onClick={handleDownloadReceipt}
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3"
            >
              <Download className="h-4 w-4" />
              {t('confirmation.actions.downloadReceipt')}
            </Button>
            
            <Button 
              onClick={handleDownloadConfirmation}
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3"
            >
              <FileText className="h-4 w-4" />
              Download Confirmation
            </Button>

            <Button 
              onClick={handleTrackApplication}
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3"
            >
              <Eye className="h-4 w-4" />
              {t('confirmation.actions.trackApplication')}
            </Button>

            <Button 
              onClick={() => setShowEmailModal(true)}
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3"
            >
              <Mail className="h-4 w-4" />
              {emailSent ? 'Email Sent ✓' : t('confirmation.actions.emailReceipt')}
            </Button>
          </div>

          {/* Support Information */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-light text-foreground">{t('confirmation.support.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@uketaservice.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+44 20 7946 0958</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Available 24/7 for assistance with your application</p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-8 py-3 hover:shadow-lg transition-all duration-300"
            >
              {t('confirmation.returnHome')}
            </Button>
          </div>
          
          {/* Email Notification Modal */}
          {showEmailModal && receiptData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Email Notifications</h3>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <EmailNotifications
                    recipientEmail={receiptData.applicants[0]?.email}
                    referenceNumber={receiptData.referenceNumber}
                    applicantName={`${receiptData.applicants[0]?.firstName} ${receiptData.applicants[0]?.lastName}`}
                    showPreview={true}
                    autoSend={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;