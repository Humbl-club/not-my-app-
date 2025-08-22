import React from 'react';
import { Globe } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <header className="bg-white border-b border-border/50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-turquoise rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-foreground">
                ETAsHub
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button 
              size="sm" 
              onClick={() => navigate('/application')} 
              className="bg-primary hover:bg-primary/90 text-white px-6 rounded-full"
            >
              {t('header.startApplication')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
