import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Search, 
  HelpCircle, 
  Menu,
  X,
  ChevronRight,
  User,
  Globe,
  Settings,
  LogOut,
  Bell,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/LanguageSelector';
import { t } from '@/i18n/translations';
import { LanguageService } from '@/services/languageService';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lang = LanguageService.getCurrentLanguage();
    setCurrentLang(lang);
    
    const unsubscribe = LanguageService.subscribe((newLang) => {
      setCurrentLang(newLang);
    });

    return unsubscribe;
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems: NavItem[] = [
    { 
      label: t('nav.home', currentLang), 
      path: '/', 
      icon: Home 
    },
    { 
      label: t('nav.apply', currentLang), 
      path: '/application', 
      icon: FileText,
      highlight: true 
    },
    { 
      label: t('nav.track', currentLang), 
      path: '/track', 
      icon: Search 
    },
    { 
      label: t('nav.requirements', currentLang), 
      path: '/requirements', 
      icon: Shield 
    },
    { 
      label: t('nav.help', currentLang), 
      path: '/help', 
      icon: HelpCircle 
    },
  ];

  const accountItems = [
    { 
      label: 'My Applications', 
      path: '/account', 
      icon: User 
    },
    { 
      label: 'Notifications', 
      path: '/notifications', 
      icon: Bell,
      badge: 3 
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: Settings 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    closed: {
      x: 50,
      opacity: 0
    },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-40 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">UK ETA Gateway</h2>
                    <p className="text-sm text-gray-600">Official Service</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Language Selector */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Language
                  </h3>
                  <LanguageSelector variant="inline" />
                </div>

                {/* Main Navigation */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.path}
                          custom={index}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          onClick={() => navigate(item.path)}
                          className={cn(
                            'w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200',
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700',
                            item.highlight && !isActive(item.path) && 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          {item.highlight && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                              New
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Account Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Account
                  </h3>
                  <div className="space-y-1">
                    {accountItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.path}
                          custom={navItems.length + index}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          onClick={() => navigate(item.path)}
                          className={cn(
                            'w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200',
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>© 2025 UK ETA Gateway</span>
                    <span>v1.0.0</span>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar (Alternative for Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30"
      >
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};