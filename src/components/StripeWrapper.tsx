import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, STRIPE_CONFIG } from '@/lib/stripe';

interface StripeWrapperProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export const StripeWrapper: React.FC<StripeWrapperProps> = ({ 
  children, 
  clientSecret 
}) => {
  const options = {
    clientSecret,
    appearance: STRIPE_CONFIG.appearance,
  };

  return (
    <Elements stripe={stripePromise} options={clientSecret ? options : { appearance: STRIPE_CONFIG.appearance }}>
      {children}
    </Elements>
  );
};