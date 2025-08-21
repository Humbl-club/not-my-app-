import React from 'react';
import { Globe, Phone, Mail } from 'lucide-react';
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
      <div className="bg-primary text-primary-foreground py-2">
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
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ETAsHub
              </h1>
              <p className="text-sm text-muted-foreground font-medium">{t('header.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/track')} className="border-primary/20 text-primary hover:bg-primary/5">
              {t('header.trackApplication')}
            </Button>
            <Button size="sm" onClick={() => navigate('/application')} className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all duration-200">
              {t('header.startApplication')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
