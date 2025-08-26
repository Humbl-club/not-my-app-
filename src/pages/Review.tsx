import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Download, Send, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOperation, setLoadingOperation] = useState<string | null>(null);

  // SEO: title, description, canonical
  useEffect(() => {
    document.title = t('review.pageTitle') + ' | UK ETA';
    const ensureTag = (selector: string, el: HTMLElement) => {
      const existing = document.head.querySelector(selector);
      if (existing) existing.replaceWith(el);
      else document.head.appendChild(el);
    };
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = t('review.metaDescription');
    ensureTag('meta[name="description"]', metaDesc);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href;
    ensureTag('link[rel="canonical"]', canonical);
  }, [t]);

  const applicants = useMemo(() => {
    try { 
      const stored = sessionStorage.getItem('application.applicants');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      }
      // Fallback to legacy structure for migration
      const primary = JSON.parse(sessionStorage.getItem('application.primaryApplicant') || 'null');
      const second = JSON.parse(sessionStorage.getItem('application.secondApplicant') || 'null');
      return [primary, second].filter(Boolean);
    } catch (error) { 
      console.error('Error parsing applicant data:', error);
      return []; 
    }
  }, []);

  const hasValidData = useMemo(() => {
    return applicants.length > 0 && applicants.some(applicant => 
      applicant && 
      applicant.firstName && 
      applicant.lastName && 
      applicant.email
    );
  }, [applicants]);

  const data = useMemo(() => {
    return {
      applicants,
      generatedAt: new Date().toISOString(),
      source: window.location.origin,
    };
  }, [applicants]);

  const toCSV = (items: any[]) => {
    if (!items.length) return '';
    const headers = [
      'firstName','lastName','dateOfBirth','nationality','additionalNationalities','email','passportNumber','job','hasCriminalConvictions','hasWarCrimesConvictions','address.line1','address.line2','address.city','address.state','address.postalCode','address.country'
    ];
    const escape = (v: any) => {
      if (v === undefined || v === null) return '';
      const s = typeof v === 'string' ? v : JSON.stringify(v);
      const needsQuote = s.includes(',') || s.includes('"') || s.includes('\n');
      const esc = s.replace(/"/g, '""');
      return needsQuote ? `"${esc}"` : esc;
    };
    const rows = items.map((it) => {
      const addNats = Array.isArray(it?.additionalNationalities) ? it.additionalNationalities.join('|') : '';
      return [
        it?.firstName,
        it?.lastName,
        it?.dateOfBirth,
        it?.nationality,
        addNats,
        it?.email,
        it?.passportNumber,
        it?.job,
        it?.hasCriminalConvictions,
        it?.hasWarCrimesConvictions,
        it?.address?.line1,
        it?.address?.line2,
        it?.address?.city,
        it?.address?.state,
        it?.address?.postalCode,
        it?.address?.country,
      ].map(escape).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const download = (filename: string, text: string, type = 'application/json') => {
    const blob = new Blob([text], { type: type + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    if (!hasValidData) {
      toast({ 
        title: t('review.messages.invalidData'), 
        description: t('review.validation.emptyData'), 
        variant: 'destructive' 
      });
      return;
    }
    
    setLoadingOperation('copying');
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({ 
        title: t('review.messages.copied'), 
        description: t('review.messages.copied')
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({ 
        title: t('review.messages.copyError'), 
        description: t('review.messages.copyError'), 
        variant: 'destructive' 
      });
    } finally {
      setLoadingOperation(null);
    }
  };

  const handleDownloadJSON = () => {
    if (!hasValidData) {
      toast({ 
        title: t('review.messages.invalidData'), 
        description: t('review.validation.emptyData'), 
        variant: 'destructive' 
      });
      return;
    }

    setLoadingOperation('downloadingJSON');
    try {
      download('uk-eta-data.json', JSON.stringify(data, null, 2));
      toast({ 
        title: t('review.dataPreview.downloadJson'), 
        description: t('review.dataPreview.downloadJson')
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({ 
        title: t('review.messages.copyError'), 
        description: t('review.messages.copyError'), 
        variant: 'destructive' 
      });
    } finally {
      setLoadingOperation(null);
    }
  };

  const handleDownloadCSV = () => {
    if (!hasValidData) {
      toast({ 
        title: t('review.messages.invalidData'), 
        description: t('review.validation.emptyData'), 
        variant: 'destructive' 
      });
      return;
    }

    setLoadingOperation('downloadingCSV');
    try {
      const csv = toCSV(data.applicants || []);
      if (!csv) {
        toast({ 
          title: t('review.messages.noApplicants'), 
          description: t('review.messages.noApplicants'), 
          variant: 'destructive' 
        });
        return;
      }
      download('uk-eta-applicants.csv', csv, 'text/csv');
      toast({ 
        title: t('review.dataPreview.downloadCsv'), 
        description: t('review.dataPreview.downloadCsv')
      });
    } catch (error) {
      console.error('CSV export failed:', error);
      toast({ 
        title: t('review.messages.copyError'), 
        description: t('review.messages.copyError'), 
        variant: 'destructive' 
      });
    } finally {
      setLoadingOperation(null);
    }
  };

  const validateWebhookUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname.includes('zapier.com');
    } catch {
      return false;
    }
  };

  const handleSendZapier = async () => {
    if (!webhookUrl.trim()) {
      toast({ 
        title: t('review.messages.webhookRequired'), 
        description: t('review.messages.webhookRequired'), 
        variant: 'destructive' 
      });
      return;
    }

    if (!validateWebhookUrl(webhookUrl)) {
      toast({ 
        title: t('review.validation.invalidWebhook'), 
        description: t('review.validation.invalidWebhook'), 
        variant: 'destructive' 
      });
      return;
    }

    if (!hasValidData) {
      toast({ 
        title: t('review.messages.invalidData'), 
        description: t('review.validation.emptyData'), 
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);
    setLoadingOperation('zapier');
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(), 
          triggered_from: window.location.origin, 
          payload: data 
        }),
      });
      toast({ 
        title: t('review.messages.zapierSuccess'), 
        description: t('review.messages.zapierSuccess')
      });
    } catch (error) {
      console.error('Zapier error', error);
      toast({ 
        title: t('review.messages.zapierError'), 
        description: t('review.messages.zapierError'), 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('review.header.title')}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/application/payment')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('review.header.backButton')}
            </Button>
            <Button 
              onClick={() => navigate('/application/confirmation')}
              disabled={!hasValidData}
            >
              {t('review.header.continueButton')}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!hasValidData && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('review.validation.emptyData')}
            </AlertDescription>
          </Alert>
        )}
        
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t('review.dataPreview.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handleCopyJSON}
                  disabled={!hasValidData || loadingOperation === 'copying'}
                >
                  <Copy className="h-4 w-4" /> 
                  {loadingOperation === 'copying' ? t('review.messages.processing') : t('review.dataPreview.copyJson')}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handleDownloadJSON}
                  disabled={!hasValidData || loadingOperation === 'downloadingJSON'}
                >
                  <Download className="h-4 w-4" /> 
                  {loadingOperation === 'downloadingJSON' ? t('review.messages.processing') : t('review.dataPreview.downloadJson')}
                </Button>
                <Button 
                  className="flex items-center gap-2" 
                  onClick={handleDownloadCSV}
                  disabled={!hasValidData || loadingOperation === 'downloadingCSV'}
                >
                  <Download className="h-4 w-4" /> 
                  {loadingOperation === 'downloadingCSV' ? t('review.messages.processing') : t('review.dataPreview.downloadCsv')}
                </Button>
              </div>
              {hasValidData ? (
                <div className="rounded-md border bg-muted/30 p-4 overflow-auto">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap"><code>{JSON.stringify(data, null, 2)}</code></pre>
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 p-4 text-center text-muted-foreground">
                  <p>{t('review.dataPreview.noData')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t('review.zapier.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Input
                    placeholder={t('review.zapier.placeholder')}
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.currentTarget.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex md:justify-end">
                  <Button 
                    onClick={handleSendZapier} 
                    className="w-full md:w-auto flex items-center gap-2"
                    disabled={!hasValidData || isLoading || !webhookUrl.trim()}
                  >
                    <Send className="h-4 w-4" /> 
                    {loadingOperation === 'zapier' ? t('review.messages.processing') : t('review.zapier.sendButton')}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t('review.zapier.tip')}</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Review;
