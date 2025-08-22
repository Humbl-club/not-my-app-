import React from 'react';
import { Shield, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          {/* Minimal brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-8 w-8 bg-turquoise rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-light">{t('footer.brand.title')}</h3>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-8 text-xs opacity-70">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {t('footer.security.ssl')}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {t('footer.security.gdpr')}
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {t('footer.security.pci')}
            </span>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-xs opacity-60">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};