/**
 * Language Service
 * Handles multi-language support with automatic detection
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // Major World Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  
  // European Languages
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
];

export class LanguageService {
  private static STORAGE_KEY = 'uk-eta-language';
  private static currentLanguage: string = 'en';
  private static listeners: ((lang: string) => void)[] = [];

  /**
   * Initialize language service with automatic detection
   */
  static initialize(): string {
    // Check stored preference first
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored && this.isSupported(stored)) {
      this.currentLanguage = stored;
      return stored;
    }

    // Detect language
    const detected = this.detectLanguage();
    this.setLanguage(detected);
    return detected;
  }

  /**
   * Detect user's language from browser and location
   */
  static detectLanguage(): string {
    // 1. Try browser language setting
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      const code = browserLang.split('-')[0].toLowerCase();
      if (this.isSupported(code)) {
        return code;
      }
    }

    // 2. Try alternative browser languages
    if (navigator.languages) {
      for (const lang of navigator.languages) {
        const code = lang.split('-')[0].toLowerCase();
        if (this.isSupported(code)) {
          return code;
        }
      }
    }

    // 3. Try to detect from timezone (rough geographical detection)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const regionLanguageMap: { [key: string]: string } = {
      'Europe/London': 'en',
      'Europe/Paris': 'fr',
      'Europe/Berlin': 'de',
      'Europe/Madrid': 'es',
      'Europe/Rome': 'it',
      'Europe/Amsterdam': 'nl',
      'Europe/Warsaw': 'pl',
      'Europe/Moscow': 'ru',
      'Europe/Stockholm': 'sv',
      'Europe/Copenhagen': 'da',
      'Europe/Athens': 'el',
      'Europe/Istanbul': 'tr',
      'Asia/Shanghai': 'zh',
      'Asia/Tokyo': 'ja',
      'Asia/Seoul': 'ko',
      'Asia/Kolkata': 'hi',
      'Asia/Dubai': 'ar',
      'America/New_York': 'en',
      'America/Mexico_City': 'es',
      'America/Sao_Paulo': 'pt',
    };

    for (const [tz, lang] of Object.entries(regionLanguageMap)) {
      if (timezone.includes(tz.split('/')[0])) {
        return lang;
      }
    }

    // Default to English
    return 'en';
  }

  /**
   * Get current language
   */
  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get current language object
   */
  static getCurrentLanguageInfo(): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === this.currentLanguage);
  }

  /**
   * Set language
   */
  static setLanguage(code: string): boolean {
    if (!this.isSupported(code)) {
      return false;
    }

    this.currentLanguage = code;
    localStorage.setItem(this.STORAGE_KEY, code);
    
    // Set document direction for RTL languages
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (langInfo?.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.remove('rtl');
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(code));
    
    return true;
  }

  /**
   * Check if language is supported
   */
  static isSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }

  /**
   * Subscribe to language changes
   */
  static subscribe(listener: (lang: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get all supported languages
   */
  static getLanguages(): Language[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Get popular languages for quick selection
   */
  static getPopularLanguages(): Language[] {
    const popularCodes = ['en', 'es', 'fr', 'de', 'zh', 'ar', 'pt', 'it'];
    return SUPPORTED_LANGUAGES.filter(lang => popularCodes.includes(lang.code));
  }

  /**
   * Format date according to language
   */
  static formatDate(date: Date, lang?: string): string {
    const locale = lang || this.currentLanguage;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  /**
   * Format currency according to language
   */
  static formatCurrency(amount: number, currency: string = 'GBP', lang?: string): string {
    const locale = lang || this.currentLanguage;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Get text direction for current language
   */
  static getDirection(): 'ltr' | 'rtl' {
    const langInfo = this.getCurrentLanguageInfo();
    return langInfo?.rtl ? 'rtl' : 'ltr';
  }
}