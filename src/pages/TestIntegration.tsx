/**
 * Test Integration Page
 * Verify Phase 1 Frontend-Backend Integration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Database,
  Cloud,
  Mail,
  CreditCard,
  FileImage,
  Zap
} from 'lucide-react';
import { applicationIntegration } from '@/services/applicationIntegrationService';
import { supabase } from '@/lib/supabase';
import supabaseService from '@/services/supabaseService';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pending' | 'testing' | 'success' | 'failed';
  message?: string;
  icon: React.ReactNode;
}

export const TestIntegration: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', icon: <Database className="h-4 w-4" /> },
    { name: 'Storage Service', status: 'pending', icon: <Cloud className="h-4 w-4" /> },
    { name: 'Authentication', status: 'pending', icon: <CheckCircle className="h-4 w-4" /> },
    { name: 'Application Creation', status: 'pending', icon: <FileImage className="h-4 w-4" /> },
    { name: 'Document Upload', status: 'pending', icon: <Cloud className="h-4 w-4" /> },
    { name: 'Payment Intent', status: 'pending', icon: <CreditCard className="h-4 w-4" /> },
    { name: 'Email Service', status: 'pending', icon: <Mail className="h-4 w-4" /> },
    { name: 'Real-time Updates', status: 'pending', icon: <Zap className="h-4 w-4" /> }
  ]);
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [testApplication, setTestApplication] = useState<any>(null);

  useEffect(() => {
    // Monitor connection status
    const unsubscribe = supabaseService.onConnectionChange((status) => {
      setConnectionStatus(status);
    });

    return unsubscribe;
  }, []);

  const updateTest = (name: string, status: TestResult['status'], message?: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  const runTests = async () => {
    setTestingInProgress(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: undefined })));

    try {
      // Test 1: Database Connection
      updateTest('Database Connection', 'testing');
      const dbConnected = await supabaseService.checkConnection();
      if (dbConnected) {
        updateTest('Database Connection', 'success', 'Connected to Supabase');
      } else {
        updateTest('Database Connection', 'failed', 'Cannot connect to database');
      }

      // Test 2: Storage Service
      updateTest('Storage Service', 'testing');
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (buckets && buckets.length > 0) {
          updateTest('Storage Service', 'success', `${buckets.length} buckets available`);
        } else {
          updateTest('Storage Service', 'failed', 'No storage buckets found');
        }
      } catch (error: any) {
        updateTest('Storage Service', 'failed', error.message);
      }

      // Test 3: Authentication
      updateTest('Authentication', 'testing');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        updateTest('Authentication', 'success', session ? 'Authenticated' : 'Anonymous mode');
      } catch (error: any) {
        updateTest('Authentication', 'failed', error.message);
      }

      // Test 4: Application Creation
      updateTest('Application Creation', 'testing');
      try {
        const app = await applicationIntegration.initializeApplication('single', 1);
        setTestApplication(app);
        updateTest('Application Creation', 'success', `Created: ${app.id}`);
      } catch (error: any) {
        updateTest('Application Creation', 'failed', error.message);
      }

      // Test 5: Document Upload (mock)
      updateTest('Document Upload', 'testing');
      if (testApplication) {
        try {
          // Create a mock file
          const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
          const result = await applicationIntegration.uploadDocument(
            testApplication.applicants[0].id,
            mockFile,
            'photo'
          );
          
          if (result.success) {
            updateTest('Document Upload', 'success', 'Upload endpoint working');
          } else {
            updateTest('Document Upload', 'failed', result.error);
          }
        } catch (error: any) {
          updateTest('Document Upload', 'failed', error.message);
        }
      } else {
        updateTest('Document Upload', 'failed', 'No test application');
      }

      // Test 6: Payment Intent
      updateTest('Payment Intent', 'testing');
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            applicationId: 'test-app',
            applicantCount: 1,
            email: 'test@example.com'
          })
        });
        
        if (response.ok || response.status === 400) { // 400 is expected for test data
          updateTest('Payment Intent', 'success', 'Payment service responding');
        } else {
          updateTest('Payment Intent', 'failed', `Status: ${response.status}`);
        }
      } catch (error: any) {
        updateTest('Payment Intent', 'failed', error.message);
      }

      // Test 7: Email Service
      updateTest('Email Service', 'testing');
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            to: 'test@example.com',
            type: 'test',
            data: { test: true }
          })
        });
        
        if (response.ok || response.status === 400) { // 400 is expected for test data
          updateTest('Email Service', 'success', 'Email service responding');
        } else {
          updateTest('Email Service', 'failed', `Status: ${response.status}`);
        }
      } catch (error: any) {
        updateTest('Email Service', 'failed', error.message);
      }

      // Test 8: Real-time Updates
      updateTest('Real-time Updates', 'testing');
      if (testApplication?.supabaseId) {
        try {
          let received = false;
          const unsubscribe = supabaseService.realtimeService.subscribeToApplication(
            testApplication.supabaseId,
            () => { received = true; }
          );
          
          // Trigger an update
          await supabaseService.applicationService.update(testApplication.supabaseId, {
            application_data: { test: Date.now() }
          } as any);
          
          // Wait for realtime update
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          unsubscribe();
          updateTest('Real-time Updates', received ? 'success' : 'failed', 
                    received ? 'Subscriptions working' : 'No updates received');
        } catch (error: any) {
          updateTest('Real-time Updates', 'failed', error.message);
        }
      } else {
        updateTest('Real-time Updates', 'failed', 'No test application');
      }

      // Show summary
      const successCount = tests.filter(t => t.status === 'success').length;
      const failedCount = tests.filter(t => t.status === 'failed').length;
      
      if (failedCount === 0) {
        toast.success(`All ${successCount} tests passed! Integration complete.`);
      } else {
        toast.warning(`${successCount} passed, ${failedCount} failed. Check details.`);
      }

    } catch (error) {
      console.error('Test suite error:', error);
      toast.error('Test suite failed to complete');
    } finally {
      setTestingInProgress(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Phase 1: Frontend-Backend Integration Test</span>
            <Badge variant={connectionStatus === 'online' ? 'default' : 'destructive'}>
              {connectionStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <Alert className={connectionStatus === 'online' ? 'border-green-200' : 'border-red-200'}>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Supabase Connection: {connectionStatus === 'online' ? 'Connected' : 'Disconnected'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => supabaseService.checkConnection()}
                  disabled={testingInProgress}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Check
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Test Results */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex items-center gap-2">
                    {test.icon}
                    <span className="font-medium">{test.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {test.message && (
                    <span className="text-sm text-gray-600">{test.message}</span>
                  )}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Test Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={runTests}
              disabled={testingInProgress}
              className="gap-2"
            >
              {testingInProgress ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Run Integration Tests
                </>
              )}
            </Button>
          </div>

          {/* Test Application Info */}
          {testApplication && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <div className="text-sm space-y-1">
                  <div><strong>Test Application ID:</strong> {testApplication.id}</div>
                  {testApplication.supabaseId && (
                    <div><strong>Supabase ID:</strong> {testApplication.supabaseId}</div>
                  )}
                  <div><strong>Type:</strong> {testApplication.applicationType}</div>
                  <div><strong>Status:</strong> {testApplication.status}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestIntegration;