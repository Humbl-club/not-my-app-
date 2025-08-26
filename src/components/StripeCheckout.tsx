import React, { useState, useEffect } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements,
  AddressElement 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaymentService, PaymentDetails } from '@/services/paymentService';
import { toast } from 'sonner';

interface StripeCheckoutProps {
  paymentDetails: PaymentDetails;
  onSuccess?: (referenceNumber: string) => void;
  onError?: (error: string) => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  paymentDetails,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const paymentIntent = await PaymentService.createPaymentIntent(paymentDetails);
        setPaymentClientSecret(paymentIntent.client_secret);
        setPaymentIntentId(paymentIntent.id);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage('Failed to initialize payment. Please try again.');
        onError?.('Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [paymentDetails, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/application/confirmation`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
        toast.error('Payment failed', { 
          description: error.message || 'Please try again or contact support' 
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        toast.success('Payment successful!', {
          description: 'Processing your application...'
        });
        
        // Confirm payment in our system
        const confirmedPayment = await PaymentService.confirmPayment(
          paymentIntentId, 
          paymentIntent.payment_method as string
        );

        // Generate reference number (this would be done on the backend in production)
        const referenceNumber = `ETA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        onSuccess?.(referenceNumber);
        navigate('/application/confirmation');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setErrorMessage('Payment processing failed. Please try again.');
      onError?.('Payment processing failed');
      toast.error('Payment processing failed', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isReady = stripe && elements && paymentClientSecret;

  return (
    <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card hover:shadow-form transition-all duration-500">
      <CardHeader className="pb-8">
        <CardTitle className="flex items-center gap-3 text-2xl font-light text-foreground">
          <CreditCard className="h-6 w-6 text-primary" />
          {t('application.payment.details.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {!isReady ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading payment form...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Payment Element */}
            <div className="space-y-4">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  defaultValues: {
                    billingDetails: {
                      name: '',
                      email: '',
                    }
                  }
                }}
              />
            </div>

            {/* Address Element */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Billing Address</h3>
              <AddressElement 
                options={{ 
                  mode: 'billing',
                  allowedCountries: ['GB', 'US', 'CA', 'AU', 'IE'],
                  blockPoBox: true,
                  fields: {
                    phone: 'always',
                  },
                  validation: {
                    phone: {
                      required: 'never',
                    }
                  }
                }} 
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-muted/30 rounded-2xl p-6 border border-muted/50">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Secure Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('application.payment.details.security')}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">PCI Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={!stripe || !elements || isProcessing}
              className="w-full bg-gradient-to-r from-primary to-turquoise text-white rounded-full py-4 text-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Lock className="h-5 w-5" />
                  Complete Payment - £{paymentDetails.total.toFixed(2)}
                </div>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};