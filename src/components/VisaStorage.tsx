import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  QrCode, 
  Shield, 
  Calendar,
  Globe,
  FileCheck,
  Eye,
  Share2,
  Lock
} from 'lucide-react';

interface StoredVisa {
  id: string;
  type: string;
  country: string;
  applicant: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring-soon';
  qrCode: string;
  documentUrl: string;
}

interface VisaStorageProps {
  visas?: StoredVisa[];
}

export const VisaStorage = ({ visas = mockVisas }: VisaStorageProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'expired':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'expiring-soon':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCountryFlag = (country: string) => {
    const flags = {
      'GB': '🇬🇧',
      'EU': '🇪🇺',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'AU': '🇦🇺'
    };
    return flags[country as keyof typeof flags] || '🌍';
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Storage Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('visaStorage.title', 'Digital Visa Wallet')}
          </h2>
          <p className="text-muted-foreground">
            {t('visaStorage.subtitle', 'Securely store and access your electronic visas')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-success" />
          <span>{t('visaStorage.secured', 'End-to-end encrypted')}</span>
        </div>
      </div>

      {/* Visa Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visas.map((visa) => {
          const daysUntilExpiry = getDaysUntilExpiry(visa.expiryDate);
          
          return (
            <Card key={visa.id} className="hover-lift animate-fade-in relative overflow-hidden">
              {/* Status indicator stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                visa.status === 'active' ? 'bg-success' : 
                visa.status === 'expired' ? 'bg-destructive' : 
                'bg-warning'
              }`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getCountryFlag(visa.country)}</div>
                    <div>
                      <CardTitle className="text-lg">{visa.type}</CardTitle>
                      <p className="text-sm text-muted-foreground">{visa.id}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(visa.status)} border`}>
                    {t(`visaStorage.status.${visa.status}`, visa.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Visa Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('visaStorage.applicant', 'Applicant')}
                    </label>
                    <p className="font-medium">{visa.applicant}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('visaStorage.issueDate', 'Issue Date')}
                    </label>
                    <p className="font-medium">{new Date(visa.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('visaStorage.expiryDate', 'Expires')}
                    </label>
                    <p className="font-medium">{new Date(visa.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('visaStorage.validity', 'Validity')}
                    </label>
                    <p className={`font-medium ${
                      daysUntilExpiry < 0 ? 'text-destructive' :
                      daysUntilExpiry < 30 ? 'text-warning' :
                      'text-success'
                    }`}>
                      {daysUntilExpiry < 0 
                        ? t('visaStorage.expired', 'Expired') 
                        : daysUntilExpiry < 30 
                        ? t('visaStorage.expiringSoon', `${daysUntilExpiry} days left`)
                        : t('visaStorage.valid', 'Valid')
                      }
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-3 w-3 mr-2" />
                    {t('visaStorage.download', 'Download')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <QrCode className="h-3 w-3 mr-2" />
                    {t('visaStorage.qrCode', 'QR Code')}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Lock className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-primary">
                    {t('visaStorage.securityNotice', 'This document is digitally signed and encrypted for your security')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {visas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="h-16 w-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('visaStorage.empty.title', 'No visas stored yet')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('visaStorage.empty.description', 'Your approved visas will appear here for secure storage and easy access')}
            </p>
            <Button>
              {t('visaStorage.empty.action', 'Apply for Your First Visa')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mock data for demonstration
const mockVisas: StoredVisa[] = [
  {
    id: 'ETA-2024-001234',
    type: 'UK ETA',
    country: 'GB',
    applicant: 'John Smith',
    issueDate: '2024-03-15',
    expiryDate: '2026-03-15',
    status: 'active',
    qrCode: 'QR-CODE-DATA',
    documentUrl: '/documents/eta-2024-001234.pdf'
  },
  {
    id: 'ETA-2023-009876',
    type: 'UK ETA',
    country: 'GB',
    applicant: 'Sarah Johnson',
    issueDate: '2023-06-10',
    expiryDate: '2024-12-31',
    status: 'expiring-soon',
    qrCode: 'QR-CODE-DATA-2',
    documentUrl: '/documents/eta-2023-009876.pdf'
  }
];