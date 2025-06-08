'use client';

import Link from 'next/link';
import { DocumentTextIcon, CurrencyDollarIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Professional Invoices',
      description: 'Create beautiful, professional invoices in seconds with our easy-to-use templates.',
      color: 'from-blue-500 to-blue-600',
      benefits: ['Custom branding', 'Multiple templates', 'PDF export']
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Smart Calculations',
      description: 'Automatic calculations for taxes, totals, and discounts. No more manual math.',
      color: 'from-green-500 to-green-600',
      benefits: ['Tax calculations', 'Discount handling', 'Currency support']
    },
    {
      icon: ClockIcon,
      title: 'Save Time',
      description: 'Generate invoices in seconds instead of hours. Focus on your business, not paperwork.',
      color: 'from-purple-500 to-purple-600',
      benefits: ['Quick generation', 'Auto-fill fields', 'Batch processing']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      content: 'ProDoc has saved me hours of work. I can create professional invoices in minutes instead of hours.',
      company: 'Design Studio',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      content: 'The templates are professional and the interface is so easy to use. Perfect for my business.',
      company: 'Tech Solutions',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Consultant',
      content: 'I love how I can customize my invoices with my branding. My clients are impressed!',
      company: 'Business Consulting',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                InvoiceFlow
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</Link>
              <Button variant="outline" asChild className="hover:bg-gray-50">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Link href="/create">Create Invoice</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Professional Invoice Generator
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Create Professional
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Invoices in Seconds
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your invoicing process with our AI-powered platform. 
              Generate, customize, and send professional invoices effortlessly.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button size="lg" asChild className="group bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Link href="/create">
                  Create Invoice
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:bg-gray-50">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need for perfect invoices</h2>
              <p className="text-xl text-gray-600">Powerful features to streamline your invoicing process</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 shadow-lg`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by freelancers and businesses</h2>
              <p className="text-xl text-gray-600">See what our users have to say about InvoiceFlow</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                          </div>
                        </div>
                    <p className="text-gray-600 mb-4">{testimonial.content}</p>
                    <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to streamline your invoicing?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of freelancers and businesses who trust InvoiceFlow for their invoicing needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="group bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Link href="/create">
                  Create Your First Invoice
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
              <Button size="lg" variant="outline" asChild className="hover:bg-gray-50">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Built with ❤️ by InvoiceFlow Team | © 2025 InvoiceFlow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}



