import { DataManager } from '@/utils/dataManager';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentDetails {
  numberOfApplicants: number;
  governmentFee: number;
  adminFee: number;
  vat: number;
  total: number;
  currency: string;
}

// Mock API endpoints - In production, these would be actual backend endpoints
const API_BASE = '/api';

export class PaymentService {
  
  static calculatePayment(numberOfApplicants: number): PaymentDetails {
    const governmentFeePerApplicant = 16.00; // £16.00 per applicant (government fee)
    const mainAdminFee = 36.00; // £36.00 main admin fee for first applicant
    const additionalAdminFeePerApplicant = 26.00; // £26.00 per additional applicant
    
    const totalGovernmentFee = governmentFeePerApplicant * numberOfApplicants;
    const totalAdminFee = mainAdminFee + (additionalAdminFeePerApplicant * Math.max(0, numberOfApplicants - 1));
    const subtotal = totalGovernmentFee + totalAdminFee;
    const vat = subtotal * 0.2; // 20% VAT
    const total = subtotal + vat;

    return {
      numberOfApplicants,
      governmentFee: totalGovernmentFee,
      adminFee: totalAdminFee,
      vat,
      total,
      currency: 'gbp'
    };
  }

  static async createPaymentIntent(paymentDetails: PaymentDetails): Promise<PaymentIntent> {
    // In production, this would make an actual API call to your backend
    // which would then create a Stripe PaymentIntent
    
    // Mock implementation for development
    const mockPaymentIntent: PaymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 24)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 24)}_secret_${Math.random().toString(36).substr(2, 10)}`,
      amount: Math.round(paymentDetails.total * 100), // Convert to pence
      currency: paymentDetails.currency,
      status: 'requires_payment_method'
    };

    // Store payment details for tracking
    DataManager.savePaymentIntent(mockPaymentIntent.id, {
      ...paymentDetails,
      paymentIntentId: mockPaymentIntent.id,
      status: 'created',
      createdAt: new Date().toISOString()
    });

    return new Promise(resolve => {
      setTimeout(() => resolve(mockPaymentIntent), 500);
    });
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    // In production, this would confirm the payment with Stripe
    
    // Mock successful payment confirmation
    const confirmedPayment: PaymentIntent = {
      id: paymentIntentId,
      client_secret: '',
      amount: 0,
      currency: 'gbp',
      status: 'succeeded'
    };

    // Update payment status
    DataManager.updatePaymentStatus(paymentIntentId, 'succeeded');
    
    // Generate reference number
    const referenceNumber = `ETA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    DataManager.saveApplicationReference(referenceNumber, {
      paymentIntentId,
      submissionDate: new Date().toISOString(),
      status: 'submitted',
      applicants: DataManager.getApplicants()
    });

    return new Promise(resolve => {
      setTimeout(() => resolve(confirmedPayment), 1000);
    });
  }

  static async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent | null> {
    // In production, retrieve payment status from Stripe
    const paymentData = DataManager.getPaymentIntent(paymentIntentId);
    if (!paymentData) return null;

    return {
      id: paymentIntentId,
      client_secret: '',
      amount: Math.round(paymentData.total * 100),
      currency: paymentData.currency,
      status: paymentData.status === 'succeeded' ? 'succeeded' : 'requires_payment_method'
    };
  }
}