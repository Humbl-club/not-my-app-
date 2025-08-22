import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

export const LegalDisclaimer = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-foreground/80 mb-6">
              {t('legal.title')}
            </h2>
          </div>
          
          <div className="bg-white/50 rounded-2xl p-8 border border-border/30 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              {t('legal.content')}
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium text-foreground/80 mb-4">
              {t('transparency.title')}
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>{t('transparency.feeBreakdown')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>{t('transparency.noHidden')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};