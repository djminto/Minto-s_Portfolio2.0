'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';

const PACKAGE_PRICES: Record<string, { jmd: number; usd: number }> = {
  Basic: { jmd: 50000, usd: 333 },
  Standard: { jmd: 100000, usd: 667 },
  Professional: { jmd: 150000, usd: 1000 },
  Enterprise: { jmd: 250000, usd: 1667 },
};

export default function OrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currency, setCurrency] = useState<'JMD' | 'USD'>('JMD');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    packageType: 'Standard',
    websiteType: '',
    numPages: '',
    features: [] as string[],
    colorScheme: '',
    pageTypes: [] as string[],
    completionDate: '',
    budgetRange: '',
    description: '',
    paymentMethod: 'Bank Transfer',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [cardPaymentDisabled, setCardPaymentDisabled] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const email = (session.user as any)?.email || '';
      const name = (session.user as any)?.name || '';
      setFormData((prev) => ({
        ...prev,
        clientEmail: email,
        clientName: name,
      }));
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    return (
      formData.packageType && formData.websiteType && formData.numPages && formData.description
    );
  };

  const validateStep2 = () => {
    return (
      formData.clientName && formData.clientEmail && formData.clientPhone
    );
  };

  const validateStep3 = () => {
    return formData.paymentMethod;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) {
      alert('Please complete all required fields in Step 1.');
      return;
    }
    if (step === 2 && !validateStep2()) {
      alert('Please complete all required fields in Step 2.');
      return;
    }
    if (step === 3 && !validateStep3()) {
      alert('Please select a payment method.');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const packagePrice = PACKAGE_PRICES[formData.packageType];
  const totalAmount = packagePrice[currency === 'JMD' ? 'jmd' : 'usd'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      alert('Please complete all steps before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount,
          currency,
          userEmail: session?.user?.email,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        console.log('Order created successfully:', order);
        console.log('Order ID:', order._id);
        
        if (!order._id) {
          console.error('No order ID in response!');
          alert('Order was created but no ID was returned. Please contact support.');
          return;
        }
        
        router.push(`/order/confirmation?orderId=${order._id}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to create order:', errorData);
        alert(`Failed to place order: ${errorData.error || 'Please try again.'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Order Website Project
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              {/* Step Indicator */}
              <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition text-sm sm:text-base ${
                        step >= stepNum
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {step > stepNum ? (
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </div>
                    {stepNum < 4 && (
                      <div
                        className={`w-8 sm:w-12 h-1 ${
                          step > stepNum ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Project Information */}
              {step === 1 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7zM2 15a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-cyan-500">
                      Project Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Package Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Package *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.keys(PACKAGE_PRICES).map((pkg) => (
                          <button
                            key={pkg}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, packageType: pkg }))}
                            className={`p-3 sm:p-4 border-2 rounded-lg font-medium transition text-sm sm:text-base ${
                              formData.packageType === pkg
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-cyan-400'
                            }`}
                          >
                            {pkg}
                            <div className="text-xs mt-1">
                              {currency === 'JMD'
                                ? `$${PACKAGE_PRICES[pkg].jmd.toLocaleString()}`
                                : `$${PACKAGE_PRICES[pkg].usd}`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Website Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website Type *
                      </label>
                      <select
                        name="websiteType"
                        value={formData.websiteType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select type...</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Business">Business</option>
                        <option value="Blog">Blog</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Number of Pages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Pages *
                      </label>
                      <input
                        type="number"
                        name="numPages"
                        value={formData.numPages}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Desired Features (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: 'responsive', label: 'Responsive Design' },
                          { id: '3d', label: '3D Animations' },
                          { id: 'cms', label: 'Content Management' },
                          { id: 'ecommerce', label: 'E-Commerce' },
                          { id: 'seo', label: 'SEO Optimization' },
                          { id: 'analytics', label: 'Analytics' },
                          { id: 'chatbot', label: 'AI Chatbot' },
                          { id: 'payment', label: 'Payment Gateway' },
                        ].map((feature) => (
                          <label
                            key={feature.id}
                            className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <input
                              type="checkbox"
                              checked={formData.features.includes(feature.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    features: [...prev.features, feature.id],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    features: prev.features.filter((f) => f !== feature.id),
                                  }));
                                }
                              }}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Color Scheme
                      </label>
                      <select
                        name="colorScheme"
                        value={formData.colorScheme}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select color scheme...</option>
                        <option value="Modern Blue">Modern Blue</option>
                        <option value="Professional Gray">Professional Gray</option>
                        <option value="Vibrant Green">Vibrant Green</option>
                        <option value="Elegant Purple">Elegant Purple</option>
                        <option value="Warm Orange">Warm Orange</option>
                        <option value="Cool Teal">Cool Teal</option>
                        <option value="Bold Red">Bold Red</option>
                        <option value="Minimalist Black & White">Minimalist Black & White</option>
                        <option value="Custom (Specify in description)">Custom (Specify in description)</option>
                      </select>
                    </div>

                    {/* Page Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Types of Pages Needed (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: 'Home', label: 'Home Page' },
                          { id: 'About', label: 'About Us' },
                          { id: 'Services', label: 'Services' },
                          { id: 'Products', label: 'Products' },
                          { id: 'Portfolio', label: 'Portfolio/Gallery' },
                          { id: 'Blog', label: 'Blog' },
                          { id: 'Contact', label: 'Contact' },
                          { id: 'FAQ', label: 'FAQ' },
                          { id: 'Testimonials', label: 'Testimonials' },
                          { id: 'Team', label: 'Team' },
                          { id: 'Pricing', label: 'Pricing' },
                          { id: 'Login', label: 'Login/Register' },
                        ].map((page) => (
                          <label
                            key={page.id}
                            className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <input
                              type="checkbox"
                              checked={formData.pageTypes.includes(page.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    pageTypes: [...prev.pageTypes, page.id],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    pageTypes: prev.pageTypes.filter((p) => p !== page.id),
                                  }));
                                }
                              }}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{page.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Description/Requirements *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      ></textarea>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Currency Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setCurrency('JMD')}
                          className={`px-6 py-2 rounded-lg font-medium transition ${
                            currency === 'JMD'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          JMD (Jamaican Dollar)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency('USD')}
                          className={`px-6 py-2 rounded-lg font-medium transition ${
                            currency === 'USD'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          USD (US Dollar)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Completion Date
                        </label>
                        <input
                          type="date"
                          name="completionDate"
                          value={formData.completionDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Budget Range (JMD)
                        </label>
                        <input
                          type="text"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleChange}
                          placeholder="e.g., 100,000 - 200,000"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-cyan-500">
                      Contact Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-cyan-500">
                      Payment Information
                    </h2>
                  </div>

                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Select your payment method below and click "Next" to review your order.</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {formData.paymentMethod && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg"
                      >
                        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span><strong>Selected:</strong> {formData.paymentMethod}</span>
                        </p>
                      </motion.div>
                    )}

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'Bank Transfer' }))}
                      className={`p-6 border-2 rounded-lg transition ${
                        formData.paymentMethod === 'Bank Transfer'
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                      }`}
                    >
                      <svg className="w-12 h-12 mx-auto mb-2 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"/>
                      </svg>
                      <div className="font-semibold text-gray-900 dark:text-white">Bank Transfer</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'Cash' }))}
                      className={`p-6 border-2 rounded-lg transition ${
                        formData.paymentMethod === 'Cash'
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                      }`}
                    >
                      <svg className="w-12 h-12 mx-auto mb-2 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                      </svg>
                      <div className="font-semibold text-gray-900 dark:text-white">Cash</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => !cardPaymentDisabled && setFormData((prev) => ({ ...prev, paymentMethod: 'Card' }))}
                      className={`p-6 border-2 rounded-lg transition ${
                        formData.paymentMethod === 'Card'
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                          : cardPaymentDisabled
                          ? 'border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed'
                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                      }`}
                      disabled={cardPaymentDisabled}
                    >
                      <svg className="w-12 h-12 mx-auto mb-2 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8H4V6h16m0 10H4v-6h16m0-4H2c-1.11 0-1.99.89-1.99 2L0 19c0 1.11.89 2 2 2h20c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2z"/>
                      </svg>
                      <div className="font-semibold text-gray-900 dark:text-white">Card</div>
                    </button>
                  </div>

                  {/* Card Payment Unavailable Warning */}
                  {cardPaymentDisabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-6 bg-red-900/10 border-l-4 border-red-500 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
                            Credit/Debit Card Payment Temporarily Unavailable
                          </h3>
                          <p className="text-red-600 dark:text-red-400 mb-3">
                            We're currently experiencing technical difficulties with our card payment processor. 
                            Please use <span className="font-semibold text-cyan-400">Bank Transfer</span> as your payment method for now.
                          </p>
                          <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            We apologize for the inconvenience and are working to restore card payments as soon as possible.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Card Payment Form (when enabled) */}
                  {formData.paymentMethod === 'Card' && !cardPaymentDisabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 mb-6"
                    >
                      {/* 3D Card Visualization */}
                      <div className="perspective-1000">
                        <div className="relative w-full max-w-md mx-auto h-52 transform-style-3d transition-transform duration-500 hover:rotate-y-12">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white">
                            {/* Card Chip */}
                            <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-4 mt-2"></div>
                            
                            {/* Card Number */}
                            <div className="text-xl font-mono tracking-widest mb-6">
                              {formData.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                            
                            {/* Card Details */}
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-xs text-gray-200 mb-1">CARD HOLDER</div>
                                <div className="font-semibold uppercase">
                                  {formData.cardHolder || 'YOUR NAME'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-200 mb-1">EXPIRES</div>
                                <div className="font-semibold">
                                  {formData.expiryDate || 'MM/YY'}
                                </div>
                              </div>
                              {/* Visa Logo */}
                              <div className="bg-white text-blue-600 px-3 py-1 rounded font-bold text-lg">
                                VISA
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Input Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                              setFormData((prev) => ({ ...prev, cardNumber: formatted }));
                            }}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                            required={formData.paymentMethod === 'Card'}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cardHolder: e.target.value.toUpperCase() }))}
                            placeholder="JOHN DOE"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                            required={formData.paymentMethod === 'Card'}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setFormData((prev) => ({ ...prev, expiryDate: value }));
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                              required={formData.paymentMethod === 'Card'}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                                setFormData((prev) => ({ ...prev, cvv: value }));
                              }}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                              required={formData.paymentMethod === 'Card'}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Bank Transfer Details */}
                  {formData.paymentMethod === 'Bank Transfer' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-6 bg-gray-800 dark:bg-gray-900 border border-cyan-500 rounded-lg"
                    >
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                        Scotiabank
                      </div>
                      <h3 className="text-xl font-bold text-cyan-400 mb-4">Bank Transfer Details</h3>
                      <div className="space-y-3 text-white">
                        <div className="border-b border-gray-700 pb-2">
                          <span className="text-gray-400">Bank Name:</span>
                          <span className="ml-2 font-semibold text-cyan-400">Scotiabank</span>
                        </div>
                        <div className="border-b border-gray-700 pb-2">
                          <span className="text-gray-400">Account Name:</span>
                          <span className="ml-2 font-semibold">Daniel Minto</span>
                        </div>
                        <div className="border-b border-gray-700 pb-2">
                          <span className="text-gray-400">Account Number:</span>
                          <span className="ml-2 font-mono text-xl font-bold text-cyan-400">000-8060-154</span>
                        </div>
                        <div className="border-b border-gray-700 pb-2">
                          <span className="text-gray-400">Branch:</span>
                          <span className="ml-2 font-semibold">Spanish Town</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-cyan-900/30 rounded-lg flex items-start gap-2">
                        <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-cyan-300 italic">
                          Please use your order number as reference when making transfer
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Cash Payment Instructions */}
                  {formData.paymentMethod === 'Cash' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-6 bg-green-900/10 border border-green-500 rounded-lg"
                    >
                      <h3 className="text-xl font-bold text-green-500 dark:text-green-400 mb-4">Cash Payment</h3>
                      <div className="text-gray-700 dark:text-gray-300 space-y-3">
                        <p>
                          We can arrange a convenient meeting location for cash payment of the 50% deposit.
                        </p>
                        <p className="text-sm">
                          After placing your order, we'll contact you to schedule a meeting time and location that works for both parties.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Instructions Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                    className="mt-4 text-cyan-500 dark:text-cyan-400 hover:underline text-sm font-medium flex items-center gap-2"
                  >
                    {showPaymentDetails ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {showPaymentDetails ? 'Hide' : 'Show'} Payment Instructions
                  </button>

                  {showPaymentDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                    >
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3">
                        50% Deposit Required to Start Project
                      </h4>
                      <div className="space-y-4 text-sm text-blue-800 dark:text-blue-300">
                        {formData.paymentMethod === 'Bank Transfer' && (
                          <div>
                            <p className="font-semibold mb-2">Bank Transfer Instructions:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Transfer 50% of total amount to the account details shown above</li>
                              <li>Use your order number as the payment reference</li>
                              <li>Send proof of payment to danielminto13@gmail.com</li>
                              <li>Project starts once payment is confirmed (usually within 24 hours)</li>
                            </ul>
                          </div>
                        )}
                        {formData.paymentMethod === 'Cash' && (
                          <div>
                            <p className="font-semibold mb-2">Cash Payment Instructions:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>We'll contact you via phone/email to arrange a meeting</li>
                              <li>Bring 50% of the total amount in cash</li>
                              <li>You'll receive a signed receipt upon payment</li>
                              <li>Project starts immediately after cash is received</li>
                            </ul>
                          </div>
                        )}
                        <div className="pt-3 border-t border-blue-300 dark:border-blue-700">
                          <p className="font-semibold">Payment Terms:</p>
                          <p>50% deposit now, remaining 50% due upon project completion.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 4: Review & Confirmation */}
              {step === 4 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-cyan-500">
                      Review & Confirm Order
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Project Details Review */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Package</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.packageType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Website Type</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.websiteType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Number of Pages</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.numPages}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completion Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.completionDate || 'Not specified'}</p>
                        </div>
                      </div>
                      {formData.features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Features</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature) => (
                              <span key={feature} className="inline-block bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-3 py-1 rounded-full text-xs font-semibold">
                                {feature === 'responsive' && 'Responsive Design'}
                                {feature === '3d' && '3D Animations'}
                                {feature === 'cms' && 'Content Management'}
                                {feature === 'ecommerce' && 'E-Commerce'}
                                {feature === 'seo' && 'SEO Optimization'}
                                {feature === 'analytics' && 'Analytics'}
                                {feature === 'chatbot' && 'AI Chatbot'}
                                {feature === 'payment' && 'Payment Gateway'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Contact Details Review */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-semibold text-gray-900 dark:text-white break-all">{formData.clientEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.clientPhone}</p>
                        </div>
                        {formData.companyName && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formData.companyName}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Payment Method Review */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"
                    >
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-200 mb-4">Payment Method</h3>
                      <p className="font-semibold text-green-900 dark:text-green-100 text-lg">{formData.paymentMethod}</p>
                      <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/40 rounded text-sm text-green-800 dark:text-green-200">
                        <p><strong>50% Deposit:</strong> {currency === 'JMD' ? `$${(PACKAGE_PRICES[formData.packageType].jmd / 2).toLocaleString()}` : `$${(PACKAGE_PRICES[formData.packageType].usd / 2).toFixed(2)}`}</p>
                        <p className="mt-1"><strong>Balance on Completion:</strong> {currency === 'JMD' ? `$${(PACKAGE_PRICES[formData.packageType].jmd / 2).toLocaleString()}` : `$${(PACKAGE_PRICES[formData.packageType].usd / 2).toFixed(2)}`}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                    >
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>✓ Everything looks good?</strong> Click "Continue to Proposal" below to generate your proposal and proceed with your order.
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                {step > 1 && (
                  <Button type="button" variant="secondary" onClick={goBack} className="w-full sm:w-auto order-2 sm:order-1">
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button type="button" variant="primary" onClick={goNext} className="ml-auto w-full sm:w-auto order-1 sm:order-2">
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="ml-auto w-full sm:w-auto order-1 sm:order-2"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Continue to Proposal'}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-24">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order Summary</h3>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Package:</span>
                  <span className="font-semibold">{formData.packageType}</span>
                </div>
                
                {formData.websiteType && (
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="font-semibold">{formData.websiteType}</span>
                  </div>
                )}
                
                {formData.numPages && (
                  <div className="flex justify-between text-sm">
                    <span>Pages:</span>
                    <span className="font-semibold">{formData.numPages}</span>
                  </div>
                )}
                
                {formData.colorScheme && (
                  <div className="flex justify-between text-sm">
                    <span>Color Scheme:</span>
                    <span className="font-semibold">{formData.colorScheme}</span>
                  </div>
                )}
                
                {formData.features.length > 0 && (
                  <div className="text-sm border-t border-blue-500 pt-3">
                    <div className="font-semibold mb-2">Selected Features:</div>
                    <ul className="list-disc list-inside space-y-1 text-blue-100">
                      {formData.features.map((feature) => (
                        <li key={feature} className="text-xs">
                          {feature === 'responsive' && 'Responsive Design'}
                          {feature === '3d' && '3D Animations'}
                          {feature === 'cms' && 'Content Management'}
                          {feature === 'ecommerce' && 'E-Commerce'}
                          {feature === 'seo' && 'SEO Optimization'}
                          {feature === 'analytics' && 'Analytics'}
                          {feature === 'chatbot' && 'AI Chatbot'}
                          {feature === 'payment' && 'Payment Gateway'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.pageTypes.length > 0 && (
                  <div className="text-sm border-t border-blue-500 pt-3">
                    <div className="font-semibold mb-2">Required Pages:</div>
                    <ul className="list-disc list-inside space-y-1 text-blue-100">
                      {formData.pageTypes.map((page) => (
                        <li key={page} className="text-xs">
                          {page}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="border-t border-blue-500 pt-3">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span className="font-semibold">
                      {currency === 'JMD' ? `$${packagePrice.jmd.toLocaleString()}` : `$${packagePrice.usd}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-100 mt-2">
                    <span>Deposit (50%):</span>
                    <span className="font-semibold">{currency === 'JMD' ? `$${(packagePrice.jmd / 2).toLocaleString()}` : `$${(packagePrice.usd / 2).toFixed(2)}`}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-400 pt-6 mb-6">
                <div className="flex justify-between text-lg">
                  <span>Total:</span>
                  <span className="font-bold">
                    {currency === 'JMD' ? `$${totalAmount.toLocaleString()}` : `$${totalAmount.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="bg-blue-500/30 p-4 rounded-lg text-sm">
                <p>
                  Payment terms: 50% deposit now, 50% upon completion. A detailed proposal will be generated after order submission.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
