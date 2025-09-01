import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/LanguageSelector';
import { t } from '@/i18n/translations';
import { LanguageService } from '@/services/languageService';

export const HeaderPro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize language
    const lang = LanguageService.getCurrentLanguage();
    setCurrentLang(lang);
    
    // Subscribe to language changes
    const unsubscribe = LanguageService.subscribe((newLang) => {
      setCurrentLang(newLang);
    });

    return unsubscribe;
  }, []);


  const navItems = [
    { label: t('nav.apply', currentLang), path: '/application', highlight: true },
    { label: t('nav.track', currentLang), path: '/track' },
    { label: t('nav.requirements', currentLang), path: '/requirements' },
    { label: t('nav.help', currentLang), path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Official UK ETA Service</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector showFlag showNativeName />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 bg-white border-b transition-all duration-300',
          isScrolled ? 'shadow-lg border-gray-200' : 'border-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-xl">UK</span>
                </div>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">ETA Gateway</div>
                <div className="text-xs text-gray-600 -mt-1">Official Travel Authorization</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'relative px-5 py-2.5 rounded-lg font-medium transition-all duration-200',
                    item.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : isActive(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.label}
                  {item.highlight && (
                    <span className="absolute -top-2 -right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/account')}
                className="font-medium border-2"
              >
                My Applications
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-30 bg-white shadow-2xl transition-transform duration-300 lg:hidden',
          isMobileMenuOpen ? 'translate-y-[108px]' : '-translate-y-full'
        )}
      >
        <nav className="container mx-auto px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200',
                item.highlight
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : isActive(item.path)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigate('/account');
                setIsMobileMenuOpen(false);
              }}
              className="w-full font-medium border-2"
            >
              My Applications
            </Button>
          </div>
        </nav>
      </div>

    </>
  );
};