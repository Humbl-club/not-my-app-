import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LanguageService, Language, SUPPORTED_LANGUAGES } from '@/services/languageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'dropdown' | 'modal' | 'inline';
  showFlag?: boolean;
  showNativeName?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className,
  variant = 'dropdown',
  showFlag = true,
  showNativeName = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLang, setCurrentLang] = useState<Language | undefined>();
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>(SUPPORTED_LANGUAGES);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize language and subscribe to changes
    const lang = LanguageService.initialize();
    setCurrentLang(LanguageService.getCurrentLanguageInfo());
    
    const unsubscribe = LanguageService.subscribe((newLang) => {
      setCurrentLang(SUPPORTED_LANGUAGES.find(l => l.code === newLang));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Filter languages based on search
    if (searchTerm) {
      const filtered = SUPPORTED_LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages(SUPPORTED_LANGUAGES);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (language: Language) => {
    LanguageService.setLanguage(language.code);
    setIsOpen(false);
    setSearchTerm('');
    
    // Reload page to apply new language
    // In a real app, you'd use a context or state management
    window.location.reload();
  };

  const popularLanguages = LanguageService.getPopularLanguages();

  if (variant === 'inline') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-2', className)}>
        {popularLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLang?.code === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLanguageSelect(lang)}
            className="justify-start"
          >
            {showFlag && <span className="mr-2">{lang.flag}</span>}
            <span className="truncate">{lang.nativeName}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 hover:bg-gray-100',
          LanguageService.getDirection() === 'rtl' && 'flex-row-reverse'
        )}
      >
        {showFlag && currentLang && (
          <span className="text-lg">{currentLang.flag}</span>
        )}
        {!showFlag && <Globe className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {showNativeName ? currentLang?.nativeName : currentLang?.name}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200',
              'min-w-[280px] max-w-[320px]',
              LanguageService.getDirection() === 'rtl' ? 'left-0' : 'right-0'
            )}
          >
            {/* Search Box */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Popular Languages */}
            {!searchTerm && (
              <div className="p-3 border-b">
                <p className="text-xs text-gray-500 mb-2 font-medium">Popular Languages</p>
                <div className="grid grid-cols-2 gap-1">
                  {popularLanguages.slice(0, 8).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors',
                        currentLang?.code === lang.code && 'bg-blue-50 text-blue-600'
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.nativeName}</span>
                      {currentLang?.code === lang.code && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Languages */}
            <ScrollArea className="h-[300px]">
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  {searchTerm ? 'Search Results' : 'All Languages'}
                </p>
                <div className="space-y-1">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className={cn(
                        'flex items-center gap-3 w-full px-2 py-2 rounded text-sm hover:bg-gray-100 transition-colors',
                        currentLang?.code === lang.code && 'bg-blue-50 text-blue-600',
                        lang.rtl && 'flex-row-reverse text-right'
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className={cn('flex-1', lang.rtl ? 'text-right' : 'text-left')}>
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      </div>
                      {currentLang?.code === lang.code && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
                
                {filteredLanguages.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No languages found</p>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};