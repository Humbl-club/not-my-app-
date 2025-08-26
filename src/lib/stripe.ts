import { loadStripe } from '@stripe/stripe-js';

// This is the public key - safe to expose in frontend
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const STRIPE_CONFIG = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  apiVersion: '2024-12-18.acacia' as const,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '12px',
    },
  },
};