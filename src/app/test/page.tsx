"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Logo } from '@/components/logo';

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Clear form and show success message
      setEmail("");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl shadow-xl transform transition-all duration-500 ease-in-out z-50 flex items-center space-x-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="font-medium">Thanks for joining! We'll notify you when we launch.</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl shadow-xl transform transition-all duration-500 ease-in-out z-50 flex items-center space-x-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Create Beautiful Invoices in Seconds
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            InvoiceFlow helps freelancers and small businesses generate professional PDF invoices instantly — with no design skills.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Get Early Access"}
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why InvoiceFlow?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Instant PDF Creation</h3>
              <p className="text-gray-600">Generate professional PDF invoices in seconds</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="text-lg font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">Add clients, line items, and taxes easily</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Custom Branding</h3>
              <p className="text-gray-600">Upload logo & customize fonts, colors</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">🔢</div>
              <h3 className="text-lg font-semibold mb-2">Auto Numbering</h3>
              <p className="text-gray-600">Automatic invoice numbering system</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">📄</div>
              <h3 className="text-lg font-semibold mb-2">High-Quality PDF</h3>
              <p className="text-gray-600">Download professional PDF invoices</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-3">💼</div>
              <h3 className="text-lg font-semibold mb-2">Business Ready</h3>
              <p className="text-gray-600">Perfect for freelancers and small businesses</p>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Freelancers</h3>
              <p className="text-gray-600">Send professional invoices to your clients</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Small Businesses</h3>
              <p className="text-gray-600">Manage client invoices efficiently</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Consultants</h3>
              <p className="text-gray-600">Perfect for solo founders and consultants</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <p>Built with ❤️ by InvoiceFlow | © 2025</p>
        </footer>
      </main>
    </div>
  );
} 