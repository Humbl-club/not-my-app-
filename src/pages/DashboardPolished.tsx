/**
 * Polished Client Dashboard
 * Clean, modern interface for viewing and downloading ETAs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye,
  Shield,
  AlertCircle,
  ChevronRight,
  ArrowDown,
  MoreVertical,
  Copy,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ETADocument {
  id: string;
  etaNumber: string;
  status: 'ready' | 'downloaded' | 'expired';
  validFrom: string;
  validUntil: string;
  applicantName: string;
  downloadCount: number;
}

interface Application {
  id: string;
  referenceNumber: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  submittedDate: string;
  etaDocuments: ETADocument[];
  applicantCount: number;
  totalFee: number;
}

export const DashboardPolished: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Use real data from navigation state or mock data
  useEffect(() => {
    const stateData = location.state as any;
    
    if (stateData?.application) {
      // Use real data from tracking
      const app = stateData.application;
      const applicants = stateData.applicants || [];
      
      const mappedApplication: Application = {
        id: app.id || 'app-1',
        referenceNumber: app.reference_number || 'UK-2024-XXXX-XXXX-XX',
        status: app.status || 'submitted',
        submittedDate: app.submitted_at || new Date().toISOString(),
        applicantCount: applicants.length || 1,
        totalFee: app.payment_amount ? app.payment_amount / 100 : 39.00,
        etaDocuments: applicants.map((applicant: any, index: number) => ({
          id: `eta-${index}`,
          etaNumber: `ETA2024${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: app.status === 'approved' ? 'ready' : 'pending',
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          applicantName: `${applicant.first_name || 'Unknown'} ${applicant.last_name || 'User'}`,
          downloadCount: 0
        }))
      };
      
      setApplications([mappedApplication]);
      setLoading(false);
    } else {
      // Fallback to mock data
      setTimeout(() => {
        setApplications([
        {
          id: '1',
          referenceNumber: 'UK-2024-X7B2-9KL4-73',
          status: 'approved',
          submittedDate: '2024-08-25T10:30:00Z',
          applicantCount: 2,
          totalFee: 25.00,
          etaDocuments: [
            {
              id: 'eta1',
              etaNumber: 'ETA2024A7K9BM3X',
              status: 'ready',
              validFrom: '2024-08-27T00:00:00Z',
              validUntil: '2026-08-27T00:00:00Z',
              applicantName: 'John Doe',
              downloadCount: 0
            },
            {
              id: 'eta2',
              etaNumber: 'ETA2024B9L2KM4Y',
              status: 'downloaded',
              validFrom: '2024-08-27T00:00:00Z',
              validUntil: '2026-08-27T00:00:00Z',
              applicantName: 'Jane Doe',
              downloadCount: 2
            }
          ]
        },
        {
          id: '2',
          referenceNumber: 'UK-2024-M3K7-2PQ9-82',
          status: 'processing',
          submittedDate: '2024-08-26T14:15:00Z',
          applicantCount: 1,
          totalFee: 12.50,
          etaDocuments: []
        }
      ]);
      setLoading(false);
      }, 1000);
    }
  }, [location.state]);

  const handleDownload = async (etaId: string, etaNumber: string) => {
    setDownloadingId(etaId);
    
    // Simulate download
    setTimeout(() => {
      toast.success(`Downloaded ${etaNumber}`);
      // Update download count
      setApplications(prev => prev.map(app => ({
        ...app,
        etaDocuments: app.etaDocuments.map(doc => 
          doc.id === etaId 
            ? { ...doc, status: 'downloaded' as const, downloadCount: doc.downloadCount + 1 }
            : doc
        )
      })));
      setDownloadingId(null);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.etaDocuments.some(doc => doc.etaNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'approved') return matchesSearch && app.status === 'approved';
    if (selectedFilter === 'pending') return matchesSearch && app.status !== 'approved';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Your Dashboard</h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {applications.length} Applications
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{applications.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Applications</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'approved').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'processing').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Processing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border"
          >
            <div className="flex items-center justify-between mb-2">
              <Download className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">
                {applications.reduce((sum, app) => 
                  sum + app.etaDocuments.filter(d => d.status === 'ready').length, 0
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600">Ready to Download</p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by reference or ETA number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'approved', 'pending'] as const).map(filter => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border overflow-hidden"
              >
                {/* Application Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {app.referenceNumber}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(app.referenceNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(app.submittedDate), 'dd MMM yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {app.applicantCount} {app.applicantCount === 1 ? 'Applicant' : 'Applicants'}
                        </span>
                        <span className="flex items-center gap-1">
                          £{app.totalFee.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Badge className={cn("border", getStatusColor(app.status))}>
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* ETA Documents */}
                  {app.etaDocuments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {app.etaDocuments.length} ETA Document{app.etaDocuments.length > 1 ? 's' : ''} Available
                      </div>
                      
                      {app.etaDocuments.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-medium">
                                  {doc.etaNumber}
                                </span>
                                {doc.status === 'downloaded' && (
                                  <Badge variant="outline" className="text-xs">
                                    Downloaded {doc.downloadCount}x
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {doc.applicantName} • Valid until {format(new Date(doc.validUntil), 'dd MMM yyyy')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info('Preview opens in new window')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(doc.id, doc.etaNumber)}
                              disabled={downloadingId === doc.id}
                              className="gap-2"
                            >
                              {downloadingId === doc.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : app.status === 'processing' ? (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Application is being processed
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          ETAs will be available here once approved
                        </p>
                      </div>
                    </div>
                  ) : app.status === 'submitted' ? (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">
                          Awaiting review
                        </p>
                        <p className="text-xs text-yellow-700 mt-0.5">
                          Your application is in the queue for processing
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Actions Bar */}
                <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Email Documents
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Contact Support</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border p-12 text-center"
            >
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">No applications found</p>
              <Button onClick={() => navigate('/application')}>
                Start New Application
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPolished;