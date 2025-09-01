import React, { useState, useEffect } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  CreditCard,
  Users,
  User,
  Shield,
  Lock,
  CheckCircle,
  Info,
  Calculator,
  Receipt,
  Banknote,
  AlertCircle,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FormToSupabaseService } from '@/services/formToSupabaseService';
import { PaymentForm, PaymentData } from '@/components/PaymentForm';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentDetails {
  numberOfApplicants: number;
  governmentFee: number;
  perPersonFee: number;
  subtotal: number;
  processingFee: number;
  total: number;
  currency: string;
}

const PaymentPro = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'complete'>('select');
  
  // Load applicants and calculate fees
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const applicantsData = DataManager.getApplicants();
      setApplicants(applicantsData);
      
      // Calculate payment details
      const numberOfApplicants = Math.max(1, applicantsData.length);
      const perPersonFee = 16; // £16 per person as of 2025
      const subtotal = numberOfApplicants * perPersonFee;
      const processingFee = 0; // No additional processing fee
      
      setPaymentDetails({
        numberOfApplicants,
        governmentFee: perPersonFee,
        perPersonFee,
        subtotal,
        processingFee,
        total: subtotal + processingFee,
        currency: 'GBP'
      });
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Check if all applicants have complete data
  const validateApplicants = () => {
    for (const applicant of applicants) {
      if (!applicant.firstName || !applicant.lastName || !applicant.email) {
        return false;
      }
      if (!applicant.passportPhoto || !applicant.personalPhoto) {
        return false;
      }
    }
    return true;
  };

  const handleProcessPayment = async (paymentData: PaymentData) => {
    setPaymentStep('processing');
    setProcessing(true);
    
    try {
      // Simulate card validation and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show card charged successfully
      toast.success('Payment authorized!', {
        description: `Card ending in ${paymentData.cardNumber.slice(-4)} charged £${paymentDetails?.total.toFixed(2)}`
      });
      
      // Simulate submitting to payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Payment processed successfully!', {
        description: 'Submitting your application to the UK ETA system...'
      });
      
      // Submit form data to Supabase database
      const submissionResult = await FormToSupabaseService.submitFormToDatabase();
      
      if (submissionResult.success) {
        setPaymentStep('complete');
        
        // Save payment and reference info
        sessionStorage.setItem('paymentStatus', 'completed');
        sessionStorage.setItem('referenceNumber', submissionResult.referenceNumber || 'Unknown');
        
        toast.success('Application submitted successfully!', {
          description: `Your reference number is ${submissionResult.referenceNumber}`
        });
        
        // Short delay to show success state
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to confirmation
        navigate('/application/confirmation', {
          state: { referenceNumber: submissionResult.referenceNumber }
        });
      } else {
        throw new Error(submissionResult.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Payment/submission error:', error);
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support'
      });
      setPaymentStep('select');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    if (!validateApplicants()) {
      toast.error('Some applicants have incomplete information. Please go back and complete all fields.');
      return;
    }
    
    // Move to payment details step
    setShowPaymentForm(true);
    setPaymentStep('details');
  };

  const handleAddApplicant = () => {
    navigate('/application/manage');
  };

  const handleRemoveApplicant = (index: number) => {
    if (applicants.length <= 1) {
      toast.error('Cannot remove the last applicant');
      return;
    }
    
    const updatedApplicants = applicants.filter((_, i) => i !== index);
    DataManager.saveApplicants(updatedApplicants);
    setApplicants(updatedApplicants);
    
    // Recalculate payment
    const numberOfApplicants = updatedApplicants.length;
    const perPersonFee = 16;
    const subtotal = numberOfApplicants * perPersonFee;
    
    setPaymentDetails(prev => prev ? {
      ...prev,
      numberOfApplicants,
      subtotal,
      total: subtotal
    } : null);
    
    toast.success('Applicant removed successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderPro />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Calculating fees...</p>
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Step 5 of 5: Payment
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Final Step
              </span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Secure Payment
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Your Payment
            </h1>
            <p className="text-lg text-gray-600">
              Review your application and complete the payment to submit
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Applicants & Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applicants List */}
              <Card className="shadow-xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Applicants ({applicants.length})
                    </span>
                    {applicants.length < 50 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddApplicant}
                        className="text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Applicant
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applicants.map((applicant, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            index === 0 ? "bg-blue-100" : "bg-purple-100"
                          )}>
                            <User className={cn(
                              "w-5 h-5",
                              index === 0 ? "text-blue-600" : "text-purple-600"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {applicant.firstName} {applicant.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {applicant.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                          {applicants.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveApplicant(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods or Form */}
              <AnimatePresence mode="wait">
                {!showPaymentForm ? (
                  <motion.div
                    key="payment-select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-xl border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-green-600" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        selectedPaymentMethod === 'card'
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CreditCard className="w-6 h-6 text-gray-700" />
                        {selectedPaymentMethod === 'card' && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="font-semibold text-left">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600 text-left">
                        Visa, Mastercard, American Express
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setSelectedPaymentMethod('paypal')}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        selectedPaymentMethod === 'paypal'
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Banknote className="w-6 h-6 text-gray-700" />
                        {selectedPaymentMethod === 'paypal' && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="font-semibold text-left">PayPal</p>
                      <p className="text-sm text-gray-600 text-left">
                        Pay with your PayPal account
                      </p>
                    </button>
                  </div>

                        <Alert className="border-blue-200 bg-blue-50">
                          <Lock className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Your payment information is secured with 256-bit SSL encryption
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {paymentStep === 'complete' ? (
                      <Card className="shadow-xl border-2">
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                              <Check className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                            <p className="text-gray-600">Your application is being processed...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <PaymentForm
                        amount={paymentDetails?.total || 0}
                        currency="GBP"
                        onSubmit={handleProcessPayment}
                        processing={processing}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms & Conditions */}
              <Card className="shadow-xl border-2">
                <CardContent className="pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-700">
                        I agree to the terms and conditions and confirm that all information provided is accurate.
                        I understand that providing false information may result in denial of my ETA application.
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-xl border-2 sticky top-6">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {paymentDetails && (
                    <div className="space-y-4">
                      {/* Applicants Breakdown */}
                      <div className="space-y-2">
                        {applicants.map((applicant, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {applicant.firstName} {applicant.lastName}
                            </span>
                            <span className="font-medium">
                              £{paymentDetails.perPersonFee.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {/* Subtotal */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          £{paymentDetails.subtotal.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Processing Fee */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-medium">
                          £{paymentDetails.processingFee.toFixed(2)}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      {/* Total */}
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-green-600">
                          £{paymentDetails.total.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Info */}
                      <Alert className="border-green-200 bg-green-50">
                        <Info className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 text-sm">
                          Official UK Government ETA fee: £16 per person
                        </AlertDescription>
                      </Alert>
                      
                      {/* Submit Button */}
                      <Button
                        onClick={showPaymentForm ? undefined : handlePayment}
                        disabled={!agreedToTerms || processing || showPaymentForm}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                        type={showPaymentForm ? "submit" : "button"}
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Processing Payment...
                          </>
                        ) : showPaymentForm ? (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Enter Card Details
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Continue to Payment
                          </>
                        )}
                      </Button>
                      
                      {/* Security Badges */}
                      <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Shield className="w-4 h-4 text-green-600" />
                          SSL Secured
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Lock className="w-4 h-4 text-blue-600" />
                          PCI Compliant
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Payment Help
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Payment is processed securely
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      You'll receive confirmation via email
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Processing takes 48-72 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                      Non-refundable once submitted
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              variant="outline"
              onClick={() => {
                if (showPaymentForm) {
                  setShowPaymentForm(false);
                  setPaymentStep('select');
                } else {
                  navigate('/application/review');
                }
              }}
              className="px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {showPaymentForm ? 'Back to Payment Method' : 'Back to Review'}
            </Button>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default PaymentPro;