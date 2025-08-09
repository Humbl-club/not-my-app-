import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Regex patterns
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const passportRegex = /^[A-Z0-9]{6,9}$/i;
const nationalityRegex = /^(US|CA|AU|JP|KR)$/;

const schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(nameRegex, 'Please enter a valid first name (letters, spaces, - and \' allowed)')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(nameRegex, 'Please enter a valid last name (letters, spaces, - and \' allowed)')
    .max(50, 'Last name is too long'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .regex(dateRegex, 'Use format YYYY-MM-DD'),
  nationality: z
    .string()
    .regex(nationalityRegex, 'Please select a nationality'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  passportNumber: z
    .string()
    .min(1, 'Passport number is required')
    .regex(passportRegex, 'Use 6-9 characters (letters and numbers)')
});

type FormValues = z.infer<typeof schema>;

const Application = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      email: '',
      passportNumber: ''
    }
  });

  const onSubmit = () => {
    navigate('/application/documents');
  };

  const { control, handleSubmit, formState } = form;
  const { isValid, isSubmitting } = formState;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 1, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 25 })}</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('application.title')}</h1>
            <p className="text-muted-foreground">{t('application.subtitle')}</p>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('application.personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="firstName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            {t('application.personalInfo.firstName.label')} <span aria-hidden="true" className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              inputMode="text"
                              placeholder={t('application.personalInfo.firstName.placeholder')}
                              aria-required="true"
                              aria-invalid={!!fieldState.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="lastName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            {t('application.personalInfo.lastName.label')} <span aria-hidden="true" className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              inputMode="text"
                              placeholder={t('application.personalInfo.lastName.placeholder')}
                              aria-required="true"
                              aria-invalid={!!fieldState.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="dateOfBirth"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            {t('application.personalInfo.dateOfBirth.label')} <span aria-hidden="true" className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              placeholder="YYYY-MM-DD"
                              aria-required="true"
                              aria-invalid={!!fieldState.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="nationality"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            {t('application.personalInfo.nationality.label')} <span aria-hidden="true" className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              aria-required="true"
                              aria-invalid={!!fieldState.error}
                            >
                              <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="AU">Australia</option>
                              <option value="JP">Japan</option>
                              <option value="KR">South Korea</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          {t('application.personalInfo.email.label')} <span aria-hidden="true" className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            inputMode="email"
                            placeholder={t('application.personalInfo.email.placeholder')}
                            aria-required="true"
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="passportNumber"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          {t('application.personalInfo.passportNumber.label')} <span aria-hidden="true" className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            inputMode="text"
                            placeholder={t('application.personalInfo.passportNumber.placeholder')}
                            aria-required="true"
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Navigation */}
                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('application.back')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={!isValid || isSubmitting}
                      aria-disabled={!isValid || isSubmitting}
                    >
                      {t('application.continue')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Application;
