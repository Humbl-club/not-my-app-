import React, { useState } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  MessageCircle, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  Shield,
  CreditCard,
  Globe,
  HelpCircle,
  Book,
  Video,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { t } from '@/i18n/translations';
import { LanguageService } from '@/services/languageService';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const currentLang = LanguageService.getCurrentLanguage();

  const faqItems: FAQItem[] = [
    // Application Process
    {
      category: 'application',
      question: 'How long does the ETA application take to complete?',
      answer: 'The online application typically takes 10-15 minutes to complete. You will need your passport, travel details, and a valid payment card.'
    },
    {
      category: 'application',
      question: 'What documents do I need for the application?',
      answer: 'You need a valid passport, a recent passport-style photograph, travel dates, accommodation details in the UK, and a payment card for the application fee.'
    },
    {
      category: 'application',
      question: 'Can I apply for multiple people at once?',
      answer: 'Yes, you can apply for up to 50 people in a single group application. Each person will need their individual documents and information.'
    },
    {
      category: 'application',
      question: 'How far in advance should I apply?',
      answer: 'We recommend applying at least 3 working days before your travel date. However, you can apply up to 3 months in advance.'
    },
    
    // Payment
    {
      category: 'payment',
      question: 'How much does the UK ETA cost?',
      answer: 'The UK ETA costs £39 per person. This is a one-time fee that covers your authorization for 2 years or until your passport expires.'
    },
    {
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover. Payment is processed securely through Stripe.'
    },
    {
      category: 'payment',
      question: 'Can I get a refund if my application is rejected?',
      answer: 'The application fee is non-refundable once submitted. However, if there is a technical error on our side, we will process a full refund.'
    },
    
    // Processing
    {
      category: 'processing',
      question: 'How long does it take to get my ETA approved?',
      answer: 'Most applications are processed within 3 working days. During peak periods, it may take up to 5 working days. You will receive email updates on your application status.'
    },
    {
      category: 'processing',
      question: 'How will I receive my ETA?',
      answer: 'Once approved, your ETA will be electronically linked to your passport. You will also receive a confirmation email with a PDF document that you can print and carry with you.'
    },
    {
      category: 'processing',
      question: 'What happens if my application is rejected?',
      answer: 'If your application is rejected, you will receive an email explaining the reason. You may be able to reapply or may need to apply for a different type of visa depending on the rejection reason.'
    },
    
    // Travel
    {
      category: 'travel',
      question: 'How long is the ETA valid?',
      answer: 'The UK ETA is valid for 2 years from the date of approval or until your passport expires, whichever comes first. You can enter the UK multiple times during this period.'
    },
    {
      category: 'travel',
      question: 'How long can I stay in the UK with an ETA?',
      answer: 'With an ETA, you can stay in the UK for up to 6 months per visit. You cannot work or study for more than 30 days.'
    },
    {
      category: 'travel',
      question: 'Do children need their own ETA?',
      answer: 'Yes, every traveler including infants and children need their own ETA. Each person must have their own application linked to their passport.'
    },
    
    // Technical
    {
      category: 'technical',
      question: 'I made a mistake on my application. Can I correct it?',
      answer: 'Once submitted, applications cannot be edited. If you made a critical error, you may need to submit a new application. Contact our support team for guidance.'
    },
    {
      category: 'technical',
      question: 'How do I track my application?',
      answer: 'You can track your application using the reference number and security code provided after submission. Visit the Track Application page and enter your details.'
    },
    {
      category: 'technical',
      question: 'Is my personal information secure?',
      answer: 'Yes, we use bank-level encryption to protect your data. All information is transmitted securely and stored in compliance with GDPR and UK data protection laws.'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'application', label: 'Application Process', icon: FileText },
    { id: 'payment', label: 'Payment & Fees', icon: CreditCard },
    { id: 'processing', label: 'Processing & Approval', icon: Clock },
    { id: 'travel', label: 'Travel Information', icon: Globe },
    { id: 'technical', label: 'Technical Support', icon: Shield },
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const guides = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to start your UK ETA application',
      icon: Book,
      link: '#',
      type: 'PDF'
    },
    {
      title: 'Photo Requirements',
      description: 'Detailed guide on photo specifications',
      icon: FileText,
      link: '#',
      type: 'PDF'
    },
    {
      title: 'Video Tutorial',
      description: 'Step-by-step application walkthrough',
      icon: Video,
      link: '#',
      type: 'Video'
    },
    {
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions',
      icon: HelpCircle,
      link: '#',
      type: 'PDF'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderPro />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('help.title', currentLang)}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find answers to your questions and get help with your UK ETA application
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('help.searchPlaceholder', currentLang)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-lg border-0"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Chat with our support team</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Call us for immediate help</p>
                <p className="text-sm font-semibold">+44 20 1234 5678</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Send us your questions</p>
                <p className="text-sm font-semibold">support@uketa.gov.uk</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('help.faq', currentLang)}
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            {/* FAQ Items */}
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 pl-8">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('help.guides', currentLang)}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <Icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{guide.type}</Badge>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              {guide.type === 'Video' ? (
                                <>Watch <ExternalLink className="w-4 h-4 ml-1" /></>
                              ) : (
                                <>Download <Download className="w-4 h-4 ml-1" /></>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Our support team is available 24/7 to assist you with your application
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Live Chat
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                <Phone className="w-5 h-5 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default Help;