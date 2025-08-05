import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      {/* Legal disclaimer */}
      <div className="bg-warning/20 border-t border-warning/40 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-warning-foreground">
            ⚠️ {t('footer.disclaimer')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary-light rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">{t('footer.brand.title')}</h3>
                <p className="text-xs opacity-80">{t('footer.brand.subtitle')}</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              {t('footer.brand.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.quickLinks.startApplication')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.quickLinks.trackApplication')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.quickLinks.requirements')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.quickLinks.processingTimes')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.legal.title')}</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.legal.privacy')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.legal.terms')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.legal.refund')}</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">{t('footer.legal.cookies')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support.title')}</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="opacity-80">{t('footer.support.phoneLabel')}</p>
                <p className="font-medium">{t('footer.support.phone')}</p>
              </div>
              <div className="text-sm">
                <p className="opacity-80">{t('footer.support.emailLabel')}</p>
                <p className="font-medium">{t('footer.support.email')}</p>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                {t('footer.support.contactButton')}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-80">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6 text-xs opacity-80">
              <span>🔒 {t('footer.security.ssl')}</span>
              <span>🛡️ {t('footer.security.gdpr')}</span>
              <span>💳 {t('footer.security.pci')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};