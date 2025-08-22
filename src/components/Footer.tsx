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
          {/* Footer links */}
          <div className="flex justify-center items-center gap-6 text-sm">
            <a href="/terms" className="hover:text-turquoise transition-colors">{t('footer.links.terms')}</a>
            <span className="text-white/30">|</span>
            <a href="/privacy" className="hover:text-turquoise transition-colors">{t('footer.links.privacy')}</a>
            <span className="text-white/30">|</span>
            <a href="/cookies" className="hover:text-turquoise transition-colors">{t('footer.links.cookies')}</a>
            <span className="text-white/30">|</span>
            <a href="/refund" className="hover:text-turquoise transition-colors">{t('footer.links.refund')}</a>
          </div>

          {/* Contact info placeholder */}
          <div className="text-sm opacity-70">
            <p>Contact: [Email] | [Company Registration Details]</p>
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