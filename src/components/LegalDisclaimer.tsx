import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

export const LegalDisclaimer = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <AlertTriangle className="h-6 w-6 text-orange" />
            <h2 className="text-2xl font-light text-foreground">
              {t('legal.title')}
            </h2>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('legal.content')}
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {t('transparency.title')}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t('transparency.feeBreakdown')}</p>
              <p>{t('transparency.noHidden')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};