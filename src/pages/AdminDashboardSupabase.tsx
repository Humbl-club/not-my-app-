import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info, 
  Search,
  LogOut,
  Eye,
  RefreshCw,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  Download,
  Mail,
  Shield
} from 'lucide-react';
import { supabase, admin } from '@/lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AdminFileManager } from '@/components/AdminFileManager';
import { AdminApplicationExport } from '@/components/AdminApplicationExport';

interface ApplicationWithApplicants {
  id: string;
  reference_number: string;
  status: string;
  payment_status: string;
  payment_amount: number;
  created_at: string;
  submitted_at: string;
  updated_at: string;
  user_email: string;
  applicants?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    passport_number: string;
    status?: string;
  }>;
}

interface DashboardStats {
  total: number;
  draft: number;
  submitted: number;
  processing: number;
  approved: number;
  rejected: number;
  revenue: number;
  todayApplications: number;
  pendingReview: number;
}

const AdminDashboardSupabase = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    draft: 0,
    submitted: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
    revenue: 0,
    todayApplications: 0,
    pendingReview: 0
  });
  const [applications, setApplications] = useState<ApplicationWithApplicants[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithApplicants | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const itemsPerPage = 10;

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user is admin (you can implement role checking here)
      setIsAuthenticated(true);
      loadData();
    } else {
      // Check session storage for development admin login
      const adminToken = sessionStorage.getItem('adminToken');
      if (adminToken === 'dev-admin-token') {
        setIsAuthenticated(true);
        loadData();
      } else {
        navigate('/admin');
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadApplications(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      // Get paginated applications with applicants
      const { data, error, count } = await admin.getAllApplications(currentPage, itemsPerPage);
      
      if (error) throw error;
      
      setApplications(data || []);
      setFilteredApplications(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading applications:', error);
      // Fallback to direct query
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          applicants (
            id,
            first_name,
            last_name,
            passport_number,
            status
          )
        `)
        .order('created_at', { ascending: false })
        .limit(itemsPerPage);
      
      setApplications(data || []);
      setFilteredApplications(data || []);
    }
  };

  const loadStatistics = async () => {
    try {
      const { data: statsData, error } = await admin.getStatistics();
      
      if (error) throw error;
      
      // Get today's applications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      
      const { count: pendingCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'processing']);
      
      setStats({
        ...statsData,
        todayApplications: todayCount || 0,
        pendingReview: pendingCount || 0
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await admin.updateApplicationStatus(applicationId, newStatus as any);
      
      if (error) throw error;
      
      toast.success(`Application status updated to ${newStatus}`);
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const sendEmail = async (applicationId: string, type: string) => {
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          to: application.user_email,
          type: type,
          data: {
            applicantName: application.applicants?.[0]?.first_name + ' ' + application.applicants?.[0]?.last_name,
            reference: application.reference_number,
            status: application.status
          }
        })
      });

      if (response.ok) {
        toast.success('Email sent successfully');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const exportData = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, applicants(*)')
        .csv();
      
      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicants?.some(applicant => 
          applicant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.passport_number.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate('/admin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">UK ETA Gateway Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadData()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.total}</span>
                <FileText className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <span className="text-green-600 font-medium">+{stats.todayApplications}</span> today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.pendingReview}</span>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </span>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {stats.approved} approved / {stats.rejected} rejected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">£{stats.revenue.toFixed(2)}</span>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
              <p className="text-sm text-gray-600 mt-2">All time earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by reference, email, name, or passport..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-700">Reference</th>
                      <th className="text-left p-3 font-medium text-gray-700">Applicant</th>
                      <th className="text-left p-3 font-medium text-gray-700">Email</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 font-medium text-gray-700">Payment</th>
                      <th className="text-left p-3 font-medium text-gray-700">Submitted</th>
                      <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-mono text-sm">{application.reference_number}</span>
                        </td>
                        <td className="p-3">
                          {application.applicants?.[0] ? (
                            <div>
                              <p className="font-medium">
                                {application.applicants[0].first_name} {application.applicants[0].last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {application.applicants.length > 1 && `+${application.applicants.length - 1} more`}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">No applicant data</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{application.user_email}</span>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getPaymentStatusColor(application.payment_status)}>
                            {application.payment_status || 'N/A'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">
                            {application.submitted_at 
                              ? format(new Date(application.submitted_at), 'MMM dd, yyyy')
                              : 'Not submitted'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedApplication(application)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <AdminApplicationExport 
                              application={application} 
                              onExport={(format) => console.log(`Exported ${application.reference_number} as ${format}`)}
                            />
                            <Select
                              value={application.status}
                              onValueChange={(value) => updateApplicationStatus(application.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sendEmail(application.id, 'status_update')}
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {totalCount > itemsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} applications
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * itemsPerPage >= totalCount}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Application Details</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedApplication(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Reference Number</p>
                    <p className="font-mono font-semibold">{selectedApplication.reference_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-3">Applicants</p>
                  <div className="space-y-4">
                    {selectedApplication.applicants?.map((applicant) => (
                      <div key={applicant.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-lg">{applicant.first_name} {applicant.last_name}</p>
                            <p className="text-sm text-gray-600">Passport: {applicant.passport_number}</p>
                            <p className="text-sm text-gray-600">Email: {applicant.email || 'Not provided'}</p>
                          </div>
                          <AdminApplicationExport 
                            application={selectedApplication} 
                            onExport={(format) => console.log(`Exported ${selectedApplication.reference_number} as ${format}`)}
                          />
                        </div>
                        
                        <AdminFileManager 
                          applicant={applicant} 
                          applicationRef={selectedApplication.reference_number}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-semibold">£{(selectedApplication.payment_amount || 0) / 100}</p>
                    <Badge className={getPaymentStatusColor(selectedApplication.payment_status)}>
                      {selectedApplication.payment_status || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Type</p>
                    <p className="capitalize">{selectedApplication.application_type || 'individual'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p>{format(new Date(selectedApplication.created_at), 'PPp')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p>{format(new Date(selectedApplication.updated_at), 'PPp')}</p>
                  </div>
                  {selectedApplication.submitted_at && (
                    <>
                      <div>
                        <p className="text-gray-600">Submitted</p>
                        <p>{format(new Date(selectedApplication.submitted_at), 'PPp')}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardSupabase;