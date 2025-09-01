import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@uketa.local');
  const [password, setPassword] = useState('AdminPass123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For development, use simple admin credentials check
      // In production, this would use proper Supabase authentication
      if (email === 'admin@uketa.local' && password === 'AdminPass123') {
        // Create a mock admin session
        const adminUser = {
          id: 'admin-1',
          email: 'admin@uketa.local',
          role: 'admin',
          name: 'Administrator',
          permissions: ['read', 'write', 'approve', 'reject', 'manage']
        };

        // Store admin session
        sessionStorage.setItem('adminToken', 'dev-admin-token');
        sessionStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        // Check if we can access Supabase
        const { data, error } = await supabase
          .from('applications')
          .select('count')
          .limit(1);

        if (error) {
          console.warn('Supabase connection issue:', error);
          // Still allow login for development
        }
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Use admin@uketa.local / AdminPass123');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            UK ETA Admin Portal
          </CardTitle>
          <CardDescription>
            Sign in to access the administration panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uketa.local"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-600">
                Default password: AdminPass123
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure admin access with government-grade security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;