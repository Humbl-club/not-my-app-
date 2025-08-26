import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Save, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ApplicationSaveService } from '@/services/applicationSaveService';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface SaveApplicationDialogProps {
  children: React.ReactNode;
  currentStep: string;
}

export const SaveApplicationDialog: React.FC<SaveApplicationDialogProps> = ({
  children,
  currentStep
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSave = async (values: EmailFormValues) => {
    setIsSaving(true);
    
    try {
      const applicants = DataManager.getApplicants();
      
      const result = await ApplicationSaveService.saveAndEmailResumeLink(
        applicants,
        values.email,
        currentStep
      );
      
      if (result.success) {
        setSaved(true);
        toast.success('Application saved successfully!', {
          description: `Resume link sent to ${values.email}`,
          duration: 4000
        });
        
        // Close dialog after delay
        setTimeout(() => {
          setIsOpen(false);
          setSaved(false);
          form.reset();
        }, 3000);
      } else {
        toast.error('Failed to save application', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error) {
      console.error('Error saving application:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save & Continue Later
          </DialogTitle>
          <DialogDescription>
            We'll send you a secure link to continue your application from any device.
          </DialogDescription>
        </DialogHeader>
        
        {!saved ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="your.email@example.com"
                          className="pl-10"
                          disabled={isSaving}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Your progress will be saved for 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Resume from any device with the email link</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Application Saved!</h3>
            <p className="text-muted-foreground mb-4">
              Check your email for the resume link. You can continue your application from any device.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-primary">Important:</p>
                  <p className="text-muted-foreground">
                    The resume link expires in 30 days. Make sure to complete your application before then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};