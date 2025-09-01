import React from 'react';
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram,
  Lock,
  CreditCard,
  Globe,
  ChevronRight,
  Award,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const FooterPro: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'UK ETA Application', path: '/application' },
      { label: 'Track Application', path: '/track' },
      { label: 'Group Applications', path: '/application' },
      { label: 'Document Requirements', path: '/requirements' },
      { label: 'Photo Guidelines', path: '/photo-guide' }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQs', path: '/faqs' },
      { label: 'Processing Times', path: '/processing' },
      { label: 'Refund Policy', path: '/refunds' }
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Security', path: '/security' }
    ],
    resources: [
      { label: 'Travel Guide', path: '/guide' },
      { label: 'UK Immigration Info', path: '/immigration' },
      { label: 'Embassy Contacts', path: '/embassies' },
      { label: 'Travel Insurance', path: '/insurance' },
      { label: 'Blog', path: '/blog' }
    ]
  };

  const certifications = [
    { icon: Shield, label: 'SSL Secured' },
    { icon: Lock, label: 'Data Encrypted' },
    { icon: Award, label: 'ISO Certified' },
    { icon: CheckCircle, label: 'GDPR Compliant' }
  ];

  const paymentMethods = [
    'Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                  <p className="opacity-90">
                    Get travel tips, visa updates, and exclusive offers delivered to your inbox
                  </p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
                  />
                  <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 mb-6 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">UK</span>
              </div>
              <div>
                <div className="font-bold text-xl text-white">ETA Gateway</div>
                <div className="text-xs text-gray-400">Official Travel Authorization</div>
              </div>
            </div>
            
            <p className="mb-6 text-gray-400 leading-relaxed">
              Your trusted partner for UK Electronic Travel Authorization. 
              Fast, secure, and professional visa services with industry-leading approval rates.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+44-800-123-4567" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+44 800 123 4567</span>
              </a>
              <a href="mailto:support@etagateway.uk" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@etagateway.uk</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>24/7 Online Support</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(link.path);
                      }}
                      className="flex items-center gap-1 hover:text-white transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-12 pt-12 border-t border-gray-800">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Security Badges */}
            <div>
              <h4 className="font-semibold text-white mb-4">Security & Compliance</h4>
              <div className="flex flex-wrap gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <cert.icon className="w-4 h-4 text-green-500" />
                    <span>{cert.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-semibold text-white mb-4">Accepted Payments</h4>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold text-white mb-4">Available Languages</h4>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Support in 9+ languages worldwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} UK ETA Gateway. All rights reserved. Not affiliated with UK Government.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};