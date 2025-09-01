import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  RefreshCw,
  Inbox,
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { EmailNotificationService, EmailNotification } from '@/services/emailNotificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EmailNotificationsProps {
  recipientEmail?: string;
  referenceNumber?: string;
  applicantName?: string;
  showPreview?: boolean;
  autoSend?: boolean;
}

export const EmailNotifications: React.FC<EmailNotificationsProps> = ({
  recipientEmail,
  referenceNumber,
  applicantName,
  showPreview = true,
  autoSend = false
}) => {
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [emailQueue, setEmailQueue] = useState<EmailNotification[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load stored emails
    const stored = EmailNotificationService.getStoredEmails();
    setSentEmails(stored);
    
    // Auto-send confirmation if specified
    if (autoSend && recipientEmail && referenceNumber && applicantName) {
      sendConfirmationEmail();
    }
  }, [autoSend, recipientEmail, referenceNumber, applicantName]);

  const sendConfirmationEmail = async () => {
    if (!recipientEmail || !referenceNumber || !applicantName) return;
    
    setSending(true);
    
    try {
      const success = await EmailNotificationService.sendApplicationConfirmation(
        recipientEmail,
        applicantName,
        referenceNumber
      );
      
      if (success) {
        // Reload sent emails
        const stored = EmailNotificationService.getStoredEmails();
        setSentEmails(stored);
        
        toast.success('Confirmation email sent', {
          description: `Email sent to ${recipientEmail}`
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const sendTestEmail = async (type: 'approval' | 'rejection' | 'reminder' | 'update') => {
    if (!recipientEmail) {
      toast.error('No recipient email provided');
      return;
    }
    
    setSending(true);
    
    try {
      let success = false;
      
      switch (type) {
        case 'approval':
          success = await EmailNotificationService.sendETAApproval(
            recipientEmail,
            applicantName || 'Test User',
            referenceNumber || 'TEST123',
            `ETA${Date.now().toString().slice(-6)}`
          );
          break;
        case 'rejection':
          success = await EmailNotificationService.sendETARejection(
            recipientEmail,
            applicantName || 'Test User',
            referenceNumber || 'TEST123',
            'Documentation incomplete'
          );
          break;
        case 'reminder':
          success = await EmailNotificationService.sendDocumentReminder(
            recipientEmail,
            applicantName || 'Test User',
            referenceNumber || 'TEST123',
            ['Passport photo', 'Proof of accommodation']
          );
          break;
        case 'update':
          success = await EmailNotificationService.sendStatusUpdate(
            recipientEmail,
            applicantName || 'Test User',
            referenceNumber || 'TEST123',
            'Under Review',
            'Your application is being reviewed by an officer'
          );
          break;
      }
      
      if (success) {
        const stored = EmailNotificationService.getStoredEmails();
        setSentEmails(stored);
      }
    } finally {
      setSending(false);
    }
  };

  const retryFailed = async () => {
    setSending(true);
    const count = await EmailNotificationService.retryFailedEmails();
    toast.success(`Retried ${count} failed emails`);
    setSending(false);
  };

  const filteredEmails = sentEmails.filter(email => {
    const matchesFilter = filter === 'all' || email.status === filter;
    const matchesSearch = searchTerm === '' || 
      email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEmailIcon = (type: string) => {
    switch (type) {
      case 'confirmation': return <Mail className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      case 'rejection': return <AlertCircle className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'update': return <RefreshCw className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getEmailColor = (type: string) => {
    switch (type) {
      case 'confirmation': return 'blue';
      case 'approval': return 'green';
      case 'rejection': return 'red';
      case 'reminder': return 'yellow';
      case 'update': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Actions */}
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Notifications
            </span>
            <div className="flex items-center gap-2">
              {sentEmails.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Inbox className="w-3 h-3" />
                  {sentEmails.length} sent
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">Send Emails</TabsTrigger>
              <TabsTrigger value="history">Email History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="send" className="space-y-4">
              {/* Current Application Email */}
              {recipientEmail && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Application Emails</h3>
                  <div className="grid gap-2">
                    <Button
                      onClick={sendConfirmationEmail}
                      disabled={sending}
                      className="justify-start"
                      variant="outline"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Confirmation Email to {recipientEmail}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Test Emails */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Test Email Templates</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => sendTestEmail('approval')}
                    disabled={sending || !recipientEmail}
                    className="justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Test Approval Email
                  </Button>
                  <Button
                    onClick={() => sendTestEmail('rejection')}
                    disabled={sending || !recipientEmail}
                    className="justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                    Test Rejection Email
                  </Button>
                  <Button
                    onClick={() => sendTestEmail('reminder')}
                    disabled={sending || !recipientEmail}
                    className="justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                    Test Reminder Email
                  </Button>
                  <Button
                    onClick={() => sendTestEmail('update')}
                    disabled={sending || !recipientEmail}
                    className="justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 text-purple-600" />
                    Test Update Email
                  </Button>
                </div>
              </div>
              
              {!recipientEmail && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    No recipient email provided. Test emails cannot be sent.
                  </AlertDescription>
                </Alert>
              )}
              
              {sending && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    Sending email...
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              {/* Filter and Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Email List */}
              <ScrollArea className="h-[400px] rounded-lg border">
                <AnimatePresence>
                  {filteredEmails.length > 0 ? (
                    <div className="divide-y">
                      {filteredEmails.map((email, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedEmail(email as any)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                `bg-${getEmailColor(email.type)}-100`
                              )}>
                                {getEmailIcon(email.type)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{email.subject}</p>
                                <p className="text-xs text-gray-600">To: {email.to}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(email.sentAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={email.status === 'sent' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {email.status || 'sent'}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Inbox className="w-12 h-12 mb-3 text-gray-300" />
                      <p>No emails found</p>
                      <p className="text-xs mt-1">Send a test email to get started</p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
              
              {/* Actions */}
              {filteredEmails.length > 0 && (
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      EmailNotificationService.clearEmailHistory();
                      setSentEmails([]);
                      toast.success('Email history cleared');
                    }}
                  >
                    Clear History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryFailed}
                    disabled={sending}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Failed
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Email Preview Modal */}
      <AnimatePresence>
        {selectedEmail && showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmail(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Email Preview</h3>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <ScrollArea className="h-[60vh] p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">From:</p>
                    <p className="font-medium">noreply@uketa.gov.uk</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To:</p>
                    <p className="font-medium">{selectedEmail.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subject:</p>
                    <p className="font-medium">{selectedEmail.subject}</p>
                  </div>
                  <div className="border-t pt-4">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {selectedEmail.body || 'Email content preview not available'}
                    </pre>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEmail(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};