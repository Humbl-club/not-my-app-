import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  Calendar,
  Bell,
  Download,
  Shield,
  Plus,
  Eye,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();

  // Mock data for demonstration
  const applications = [
    {
      id: 'ETA-2024-001234',
      type: 'UK ETA',
      status: 'approved',
      applicant: 'John Smith',
      submissionDate: '2024-03-15',
      expiryDate: '2026-03-15',
      progress: 100,
      country: 'GB'
    },
    {
      id: 'ETA-2024-001235',
      type: 'UK ETA',
      status: 'processing',
      applicant: 'Sarah Johnson',
      submissionDate: '2024-03-20',
      expiryDate: null,
      progress: 65,
      country: 'GB'
    },
    {
      id: 'ETIAS-2024-001001',
      type: 'EU ETIAS',
      status: 'coming-soon',
      applicant: 'Michael Brown',
      submissionDate: null,
      expiryDate: null,
      progress: 0,
      country: 'EU'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-status-approved" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-turquoise" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-status-rejected" />;
      case 'coming-soon':
        return <Calendar className="h-4 w-4 text-status-pending" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-success/10 text-success border-success/20',
      processing: 'bg-turquoise/10 text-turquoise border-turquoise/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      'coming-soon': 'bg-warning/10 text-warning border-warning/20'
    };
    
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('dashboard.title', 'Visa Dashboard')}
              </h1>
              <p className="text-muted-foreground">
                {t('dashboard.subtitle', 'Manage all your electronic travel authorizations in one place')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t('dashboard.notifications', 'Notifications')}
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white">
                <Plus className="h-4 w-4" />
                {t('dashboard.newApplication', 'New Application')}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Visas</p>
                  <p className="text-2xl font-bold text-success">1</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-turquoise">1</p>
                </div>
                <div className="h-12 w-12 bg-turquoise/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-turquoise" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-warning">0</p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {applications.map((app) => (
            <Card key={app.id} className="hover-lift animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.type}</CardTitle>
                      <p className="text-sm text-muted-foreground">{app.id}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusBadge(app.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(app.status)}
                      {t(`dashboard.status.${app.status}`, app.status)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{app.applicant}</p>
                  {app.submissionDate && (
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(app.submissionDate).toLocaleDateString()}
                    </p>
                  )}
                  {app.expiryDate && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(app.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {app.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {app.status === 'approved' && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  {app.status === 'processing' && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-2" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  {app.status === 'coming-soon' && (
                    <Button size="sm" variant="outline" className="flex-1" disabled>
                      <Bell className="h-3 w-3 mr-2" />
                      Notify Me
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Expansion Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t('dashboard.services.title', 'Available Services')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-success/5 rounded-lg border border-success/20">
                <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold mb-2">UK ETA</h3>
                <p className="text-sm text-muted-foreground mb-4">Electronic Travel Authorization for the United Kingdom</p>
                <Badge className="bg-success/10 text-success border-success/20">Available Now</Badge>
              </div>

              <div className="text-center p-6 bg-warning/5 rounded-lg border border-warning/20">
                <div className="h-16 w-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">EU ETIAS</h3>
                <p className="text-sm text-muted-foreground mb-4">European Travel Information Authorization System</p>
                <Badge className="bg-warning/10 text-warning border-warning/20">Coming 2025</Badge>
              </div>

              <div className="text-center p-6 bg-turquoise/5 rounded-lg border border-turquoise/20">
                <div className="h-16 w-16 bg-turquoise/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-turquoise" />
                </div>
                <h3 className="font-semibold mb-2">More Services</h3>
                <p className="text-sm text-muted-foreground mb-4">Additional eVisa services coming soon</p>
                <Badge className="bg-turquoise/10 text-turquoise border-turquoise/20">In Development</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.activity.title', 'Recent Activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">UK ETA Approved</p>
                  <p className="text-sm text-muted-foreground">Application ETA-2024-001234 has been approved</p>
                </div>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-turquoise/5 rounded-lg border border-turquoise/20">
                <div className="h-8 w-8 bg-turquoise/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="h-4 w-4 text-turquoise" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-muted-foreground">Documents verified for application ETA-2024-001235</p>
                </div>
                <span className="text-sm text-muted-foreground">3 days ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">New UK ETA application submitted successfully</p>
                </div>
                <span className="text-sm text-muted-foreground">5 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;