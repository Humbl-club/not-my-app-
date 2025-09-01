import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Shield, Award, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  country: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  applicationTime: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial; featured?: boolean }> = ({ 
  testimonial, 
  featured = false 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-8 transition-all duration-300",
      featured 
        ? "shadow-2xl border-2 border-blue-200 transform scale-105" 
        : "shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1"
    )}>
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full">
            FEATURED REVIEW
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-5 h-5",
                i < testimonial.rating 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
        </div>
        {testimonial.verified && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
            <BadgeCheck className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-700">Verified</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">"{testimonial.title}"</h3>

      {/* Content */}
      <p className="text-gray-600 leading-relaxed mb-6">{testimonial.content}</p>

      {/* Author Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-500">{testimonial.country}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{testimonial.date}</div>
          <div className="text-xs text-green-600 font-medium">{testimonial.applicationTime}</div>
        </div>
      </div>
    </div>
  );
};

// Commenting out testimonials section until we have real reviews
export const TestimonialsSection: React.FC = () => {
  return null; // Remove testimonials section for now
  const [currentIndex, setCurrentIndex] = useState(1);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Mitchell",
      country: "United States",
      rating: 5,
      date: "2 weeks ago",
      title: "Seamless and Professional Service",
      content: "The application process was incredibly smooth. The photo verification system worked perfectly on the first try, and I received my ETA approval in just 36 hours. Highly recommend!",
      verified: true,
      applicationTime: "Completed in 8 minutes"
    },
    {
      id: 2,
      name: "Jean-Pierre Dubois",
      country: "France",
      rating: 5,
      date: "1 week ago",
      title: "Outstanding Support in Multiple Languages",
      content: "As a French speaker, I appreciated the full language support. The interface was intuitive, and when I had a question, customer service responded in perfect French within minutes. My entire family's applications were approved quickly.",
      verified: true,
      applicationTime: "Completed in 12 minutes"
    },
    {
      id: 3,
      name: "Yuki Tanaka",
      country: "Japan",
      rating: 5,
      date: "3 days ago",
      title: "Efficient and Secure",
      content: "The security measures gave me confidence in sharing my information. The save and resume feature was perfect when I needed to gather additional documents. Everything was processed faster than expected.",
      verified: true,
      applicationTime: "Completed in 10 minutes"
    }
  ];

  const trustLogos = [
    { name: "SSL Secured", icon: Shield },
    { name: "ISO Certified", icon: Award },
    { name: "GDPR Compliant", icon: BadgeCheck }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333EA' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Quote className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Customer Reviews</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Travelers
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Around the World
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See what our customers say about their experience 
            with our UK ETA application service.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Testimonials Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "transition-all duration-500",
                    index === currentIndex 
                      ? "lg:col-span-1 opacity-100" 
                      : index === (currentIndex + 1) % testimonials.length || index === (currentIndex - 1 + testimonials.length) % testimonials.length
                      ? "lg:col-span-1 opacity-60 scale-95 blur-[1px]"
                      : "hidden lg:block lg:col-span-1 opacity-40 scale-90 blur-[2px]"
                  )}
                >
                  <TestimonialCard 
                    testimonial={testimonial} 
                    featured={index === currentIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "transition-all duration-300",
                  index === currentIndex
                    ? "w-8 h-2 bg-blue-600 rounded-full"
                    : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Security is Our Priority
            </h3>
            <p className="text-gray-600">
              We maintain the highest standards of data protection and security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustLogos.map((logo, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
                  <logo.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{logo.name}</h4>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">4.9/5</span>
                <span>Average Rating</span>
              </div>
              <div className="w-px h-5 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">250,000+</span>
                <span>Happy Customers</span>
              </div>
              <div className="w-px h-5 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">99.8%</span>
                <span>Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};