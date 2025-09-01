import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Calendar,
  User,
  MapPin,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentFormProps {
  amount: number;
  currency: string;
  onSubmit: (paymentData: PaymentData) => Promise<void>;
  processing?: boolean;
}

export interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  onSubmit,
  processing = false
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: 'United Kingdom'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardType, setCardType] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Detect card type
  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    return '';
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number: string): boolean => {
    const cleanNumber = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setPaymentData({ ...paymentData, cardNumber: formatted });
      setCardType(detectCardType(formatted));
      
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: '' });
      }
    }
  };

  const handleExpiryChange = (field: 'expiryMonth' | 'expiryYear', value: string) => {
    const numValue = value.replace(/\D/g, '');
    
    if (field === 'expiryMonth' && numValue.length <= 2) {
      const month = parseInt(numValue, 10);
      if (month >= 0 && month <= 12) {
        setPaymentData({ ...paymentData, [field]: numValue });
      }
    } else if (field === 'expiryYear' && numValue.length <= 2) {
      setPaymentData({ ...paymentData, [field]: numValue });
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setPaymentData({ ...paymentData, cvv: value });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    if (!paymentData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(paymentData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Card holder validation
    if (!paymentData.cardHolder) {
      newErrors.cardHolder = 'Cardholder name is required';
    } else if (paymentData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Please enter a valid name';
    }

    // Expiry validation
    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      const expYear = parseInt(paymentData.expiryYear, 10);
      const expMonth = parseInt(paymentData.expiryMonth, 10);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    // CVV validation
    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Billing address validation
    if (!paymentData.billingAddress.address) {
      newErrors.address = 'Billing address is required';
    }
    if (!paymentData.billingAddress.city) {
      newErrors.city = 'City is required';
    }
    if (!paymentData.billingAddress.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show success animation briefly before processing
    setShowSuccess(true);
    setTimeout(() => {
      onSubmit(paymentData);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Information */}
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Card Information
            </span>
            {cardType && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {cardType}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="flex items-center gap-2">
              Card Number
              <Lock className="w-3 h-3 text-gray-400" />
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                className={cn(
                  "pl-10 font-mono",
                  errors.cardNumber && "border-red-500"
                )}
                disabled={processing}
                autoComplete="cc-number"
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cardNumber}
              </p>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <div className="relative">
              <Input
                id="cardHolder"
                type="text"
                placeholder="John Doe"
                value={paymentData.cardHolder}
                onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value.toUpperCase() })}
                className={cn(
                  "pl-10",
                  errors.cardHolder && "border-red-500"
                )}
                disabled={processing}
                autoComplete="cc-name"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardHolder && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cardHolder}
              </p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="flex items-center gap-2">
                Expiry Date
                <Calendar className="w-3 h-3 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="expiryMonth"
                  type="text"
                  placeholder="MM"
                  value={paymentData.expiryMonth}
                  onChange={(e) => handleExpiryChange('expiryMonth', e.target.value)}
                  className={cn(
                    "w-16 text-center",
                    errors.expiry && "border-red-500"
                  )}
                  maxLength={2}
                  disabled={processing}
                  autoComplete="cc-exp-month"
                />
                <span className="self-center text-gray-400">/</span>
                <Input
                  id="expiryYear"
                  type="text"
                  placeholder="YY"
                  value={paymentData.expiryYear}
                  onChange={(e) => handleExpiryChange('expiryYear', e.target.value)}
                  className={cn(
                    "w-16 text-center",
                    errors.expiry && "border-red-500"
                  )}
                  maxLength={2}
                  disabled={processing}
                  autoComplete="cc-exp-year"
                />
              </div>
              {errors.expiry && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.expiry}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="flex items-center gap-2">
                CVV
                <Shield className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleCVVChange}
                className={cn(
                  "text-center",
                  errors.cvv && "border-red-500"
                )}
                maxLength={4}
                disabled={processing}
                autoComplete="cc-csc"
              />
              {errors.cvv && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main Street"
              value={paymentData.billingAddress.address}
              onChange={(e) => setPaymentData({
                ...paymentData,
                billingAddress: { ...paymentData.billingAddress, address: e.target.value }
              })}
              className={errors.address ? "border-red-500" : ""}
              disabled={processing}
              autoComplete="street-address"
            />
            {errors.address && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="London"
                value={paymentData.billingAddress.city}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  billingAddress: { ...paymentData.billingAddress, city: e.target.value }
                })}
                className={errors.city ? "border-red-500" : ""}
                disabled={processing}
                autoComplete="address-level2"
              />
              {errors.city && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="SW1A 1AA"
                value={paymentData.billingAddress.postalCode}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  billingAddress: { ...paymentData.billingAddress, postalCode: e.target.value.toUpperCase() }
                })}
                className={errors.postalCode ? "border-red-500" : ""}
                disabled={processing}
                autoComplete="postal-code"
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={paymentData.billingAddress.country}
              onChange={(e) => setPaymentData({
                ...paymentData,
                billingAddress: { ...paymentData.billingAddress, country: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={processing}
              autoComplete="country"
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
              <option value="Italy">Italy</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Secure Payment</strong>
          <br />
          Your payment information is encrypted and processed securely. We never store your card details.
        </AlertDescription>
      </Alert>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center p-4 bg-green-50 rounded-lg"
          >
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Payment validated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

// Add missing Badge import
import { Badge } from '@/components/ui/badge';