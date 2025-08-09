import React from 'react';
import { Shield, Phone, Mail } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <header className="bg-white shadow-sm border-b border-border">
      {/* Top bar with contact info */}
      <div className="bg-primary-dark text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{t('header.phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>{t('header.email')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">{t('header.available247')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">{t('header.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/track')}>
              {t('header.trackApplication')}
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate('/application')}>
              {t('header.startApplication')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
