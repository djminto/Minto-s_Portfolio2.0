'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface PricingPackage {
  name: string;
  priceJMD: number;
  priceUSD: number;
  features: string[];
  popular?: boolean;
}

const PricingSection: React.FC = () => {
  const [currency, setCurrency] = useState<'JMD' | 'USD'>('JMD');

  const packages: PricingPackage[] = [
    {
      name: 'Basic',
      priceJMD: 50000,
      priceUSD: 333,
      features: [
        'Single Page Website',
        'Basic Responsive Design',
        '3 Revisions',
        'Basic SEO',
        'Contact Form',
      ],
    },
    {
      name: 'Standard',
      priceJMD: 100000,
      priceUSD: 667,
      features: [
        'Multi-Page Website',
        'Advanced Responsive Design',
        '5 Revisions',
        'SEO Optimization',
        'Contact & Booking Forms',
        'Email Integration',
        'Basic Analytics',
      ],
      popular: true,
    },
    {
      name: 'Professional',
      priceJMD: 150000,
      priceUSD: 1000,
      features: [
        'Custom Website Design',
        'Full Responsive Design',
        'Unlimited Revisions',
        'Advanced SEO',
        'Database Integration',
        'Payment Gateway Setup',
        'Email Marketing Integration',
        'Advanced Analytics',
        'SSL Certificate',
      ],
    },
    {
      name: 'Enterprise',
      priceJMD: 250000,
      priceUSD: 1667,
      features: [
        'Custom Web App Development',
        'Fully Responsive & Mobile App',
        'Unlimited Revisions',
        'Enterprise SEO Strategy',
        'Database Architecture',
        'Payment Gateway Integration',
        'Email & SMS Integration',
        'Advanced Analytics & Reporting',
        'SSL & Security Enhancements',
        'Dedicated Support',
        'Maintenance Plan (3 months)',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4"
        >
          Website Packages
        </motion.h2>

        <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-8">
          Choose the perfect package for your needs
        </p>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setCurrency('JMD')}
              className={`px-6 py-2 rounded font-semibold transition ${
                currency === 'JMD'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              JMD
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded font-semibold transition ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-xl shadow-lg overflow-hidden transition ${
                pkg.popular
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-lg">
                  Popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>

                <div className="mb-6">
                  <p className="text-4xl font-bold">
                    {currency === 'JMD' ? `$${pkg.priceJMD.toLocaleString()}` : `$${pkg.priceUSD}`}
                  </p>
                  <p className={`text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                    {currency === 'JMD' ? 'JMD' : 'USD'}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-lg">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href="/order">
                  <Button
                    variant={pkg.popular ? 'secondary' : 'primary'}
                    className="w-full"
                  >
                    Order Now
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-blue-50 dark:bg-gray-800 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-700"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Terms
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Payment is structured as follows: <strong>50% deposit</strong> upon order placement to begin development, and the remaining <strong>50% upon project completion</strong>. This ensures quality and commitment from both parties.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
