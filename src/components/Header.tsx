import React from 'react';
import { Shield, Phone, Mail } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-border">
      {/* Top bar with contact info */}
      <div className="bg-primary-dark text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+44 20 7946 0958</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>support@uketaapplication.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Available 24/7</span>
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
              <h1 className="text-xl font-bold text-primary">UK ETA Application</h1>
              <p className="text-xs text-muted-foreground">Official Electronic Travel Authorization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Track Application
            </Button>
            <Button variant="default" size="sm">
              Start Application
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};