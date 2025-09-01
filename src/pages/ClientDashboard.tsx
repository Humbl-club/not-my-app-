/**
 * Client Dashboard
 * Where clients can view and download their approved ETAs
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  Calendar,
  User,
  Filter,
  Search,
  RefreshCw,
  LogOut,
  FileDown,
  Eye,
  Shield,
  AlertCircle
} from 'lucide-react';
import { etaDeliveryService } from '@/services/etaDeliveryService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ETADocument {
  id: string;
  etaNumber: string;
  status: string;
  validFrom: string;
  validUntil: string;
  applicantName?: string;
  downloadUrl?: string;
  downloadedAt?: string;
}

interface Application {
  referenceNumber: string;
  status: string;
  submittedDate: string;
  etaDocuments: ETADocument[];
}

export const ClientDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending'>('all');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Please log in to view your dashboard');
        return;
      }

      setUserEmail(user.email);

      // Load dashboard data
      const result = await etaDeliveryService.getClientDashboard(user.email);
      
      if (result.success && result.dashboard) {
        setApplications(result.dashboard.applications);
      } else {
        toast.error(result.error || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const downloadETA = async (etaDocId: string, etaNumber: string) => {
    if (!userEmail) {
      toast.error('Please log in to download');
      return;
    }

    setDownloadingId(etaDocId);
    try {
      const result = await etaDeliveryService.getDownloadUrl(etaDocId, userEmail);
      
      if (result.success && result.url) {
        // Open download in new tab
        window.open(result.url, '_blank');
        toast.success(`Downloading ETA ${etaNumber}`);
        
        // Refresh to show download status
        setTimeout(loadDashboard, 2000);
      } else {
        toast.error(result.error || 'Failed to download');
      }
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterApplications = (apps: Application[]): Application[] => {
    switch (activeTab) {
      case 'approved':
        return apps.filter(app => 
          app.status === 'approved' && app.etaDocuments.length > 0
        );
      case 'pending':
        return apps.filter(app => 
          app.status !== 'approved' || app.etaDocuments.length === 0
        );
      default:
        return apps;
    }
  };

  const filteredApplications = filterApplications(applications);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Your ETA Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              View and download your approved travel authorizations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadDashboard}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* User Info */}
        {userEmail && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved ETAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documents Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {applications.reduce((sum, app) => sum + app.etaDocuments.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({applications.filter(a => a.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({applications.filter(a => a.status !== 'approved').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">
                  No applications found in this category
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => (
              <Card key={app.referenceNumber}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {app.referenceNumber}
                      </CardTitle>
                      <CardDescription>
                        Submitted: {format(new Date(app.submittedDate), 'dd MMM yyyy')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {app.etaDocuments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {app.etaDocuments.length} ETA(s) ready for download
                        </span>
                      </div>

                      {app.etaDocuments.map((eta) => (
                        <div
                          key={eta.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{eta.etaNumber}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Valid: {format(new Date(eta.validFrom), 'dd/MM/yyyy')} - 
                              {' '}{format(new Date(eta.validUntil), 'dd/MM/yyyy')}
                            </div>
                            {eta.downloadedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Downloaded: {format(new Date(eta.downloadedAt), 'dd MMM yyyy HH:mm')}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Preview functionality
                                toast.info('Preview will open in new window');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => downloadETA(eta.id, eta.etaNumber)}
                              disabled={downloadingId === eta.id}
                            >
                              {downloadingId === eta.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              <span className="ml-2">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Your ETA documents are valid for 2 years from the issue date. 
                          Please download and save them securely.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      {app.status === 'approved' ? (
                        <div className="space-y-2">
                          <Clock className="h-8 w-8 mx-auto text-blue-600" />
                          <p className="text-sm text-muted-foreground">
                            Your ETA documents are being generated
                          </p>
                          <p className="text-xs text-gray-500">
                            They will appear here automatically when ready
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <AlertCircle className="h-8 w-8 mx-auto text-yellow-600" />
                          <p className="text-sm text-muted-foreground">
                            Application is still being processed
                          </p>
                          <p className="text-xs text-gray-500">
                            ETAs will be available once approved
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;