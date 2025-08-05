import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      {/* Legal disclaimer */}
      <div className="bg-warning/20 border-t border-warning/40 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-warning-foreground">
            ⚠️ This website is operated by an independent third-party and is not affiliated with the UK Government or UK Visas and Immigration (UKVI).
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
                <h3 className="font-bold">UK ETA Application</h3>
                <p className="text-xs opacity-80">Third-party service provider</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Professional UK ETA application assistance with expert support and secure processing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary-light transition-colors">Start Application</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Track Application</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">ETA Requirements</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Processing Times</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="opacity-80">Phone Support</p>
                <p className="font-medium">+44 20 7946 0958</p>
              </div>
              <div className="text-sm">
                <p className="opacity-80">Email Support</p>
                <p className="font-medium">support@uketaapplication.com</p>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-80">
              © 2024 UK ETA Application Service. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs opacity-80">
              <span>🔒 SSL Secured</span>
              <span>🛡️ GDPR Compliant</span>
              <span>💳 PCI DSS Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};