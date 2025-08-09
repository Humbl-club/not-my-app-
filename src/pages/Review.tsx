import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Download, Send } from 'lucide-react';

const Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');

  // SEO: title, description, canonical
  useEffect(() => {
    document.title = 'Review & Export | UK ETA Data';
    const ensureTag = (selector: string, el: HTMLElement) => {
      const existing = document.head.querySelector(selector);
      if (existing) existing.replaceWith(el);
      else document.head.appendChild(el);
    };
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = 'Review and export your UK ETA application data as JSON or CSV, or send to Zapier.';
    ensureTag('meta[name="description"]', metaDesc);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href;
    ensureTag('link[rel="canonical"]', canonical);
  }, []);

  const primary = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('application.primaryApplicant') || 'null'); } catch { return null; }
  }, []);
  const second = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('application.secondApplicant') || 'null'); } catch { return null; }
  }, []);

  const data = useMemo(() => {
    const applicants = [primary, second].filter(Boolean);
    return {
      applicants,
      generatedAt: new Date().toISOString(),
      source: window.location.origin,
    };
  }, [primary, second]);

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
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({ title: 'Copied', description: 'Data copied to clipboard' });
    } catch {
      toast({ title: 'Error', description: 'Failed to copy', variant: 'destructive' });
    }
  };

  const handleDownloadJSON = () => {
    download('uk-eta-data.json', JSON.stringify(data, null, 2));
  };

  const handleDownloadCSV = () => {
    const csv = toCSV(data.applicants || []);
    if (!csv) {
      toast({ title: 'No data', description: 'No applicants to export', variant: 'destructive' });
      return;
    }
    download('uk-eta-applicants.csv', csv, 'text/csv');
  };

  const handleSendZapier = async () => {
    if (!webhookUrl) {
      toast({ title: 'Error', description: 'Please enter your Zapier webhook URL', variant: 'destructive' });
      return;
    }
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ timestamp: new Date().toISOString(), triggered_from: window.location.origin, payload: data }),
      });
      toast({ title: 'Request Sent', description: "Sent to Zapier. Check your Zap's history." });
    } catch (error) {
      console.error('Zapier error', error);
      toast({ title: 'Error', description: 'Failed to trigger Zapier webhook', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Review & Export</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/application/payment')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={() => navigate('/application/confirmation')}>Continue</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Application data preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyJSON}>
                  <Copy className="h-4 w-4" /> Copy JSON
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadJSON}>
                  <Download className="h-4 w-4" /> Download JSON
                </Button>
                <Button className="flex items-center gap-2" onClick={handleDownloadCSV}>
                  <Download className="h-4 w-4" /> Download CSV
                </Button>
              </div>
              <div className="rounded-md border bg-muted/30 p-4 overflow-auto">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap"><code>{JSON.stringify(data, null, 2)}</code></pre>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Send to Zapier (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Input
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.currentTarget.value)}
                  />
                </div>
                <div className="flex md:justify-end">
                  <Button onClick={handleSendZapier} className="w-full md:w-auto flex items-center gap-2">
                    <Send className="h-4 w-4" /> Send
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Tip: Connect your webhook to Google Sheets to auto-fill rows for UK ETA submission.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Review;
