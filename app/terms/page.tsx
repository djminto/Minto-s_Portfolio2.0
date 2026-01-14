'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faCog, 
  faCreditCard, 
  faCalendar, 
  faPencilAlt, 
  faFileContract,
  faTimesCircle,
  faTools,
  faShieldAlt,
  faLock,
  faScaleBalanced,
  faSync,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground3D from '@/components/sections/AnimatedBackground3D';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const LAST_UPDATED = 'January 7, 2026';

export default function TermsPage() {
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900 relative">
      <AnimatedBackground3D />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
          {/* Styled Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl text-cyan-500">
                <FontAwesomeIcon icon={faFileAlt} />
              </div>
              <h1 className="text-5xl font-bold text-cyan-500">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Last updated: {LAST_UPDATED}
            </p>
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-transparent mt-4 w-full"></div>
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* 1. Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  1. Introduction
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to Minto's Web Development ("we," "us," or "our"). These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.
              </p>
            </div>

            {/* 2. Services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faCog} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  2. Services
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We provide web development, web design, digital marketing, and mentorship services. Our services include but are not limited to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Custom website development and design</li>
                <li>E-commerce platform development</li>
                <li>Website maintenance and support</li>
                <li>SEO optimization and digital marketing</li>
                <li>Technical mentorship and consultation</li>
              </ul>
            </div>

            {/* 3. Order and Payment Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  3. Order and Payment Terms
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    3.1 Project Quotes
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">All project quotes are valid for 30 days from the date of issue. Prices are subject to change based on project scope modifications.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    3.2 Payment Schedule
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Deposit:</strong> 50% upfront payment required before project commencement</li>
                    <li><strong>Progress Payment:</strong> 25% upon completion of design phase</li>
                    <li><strong>Final Payment:</strong> 25% upon project completion and client approval</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    3.3 Accepted Payment Methods
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">We accept payments via bank transfer, credit/debit cards, and mobile payment platforms. All payments are in Jamaican Dollars (JMD) unless otherwise specified.</p>
                </div>
              </div>
            </div>

            {/* 4. Project Timeline and Delivery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faCalendar} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  4. Project Timeline and Delivery
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Project timelines are estimates and may vary based on:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>Client responsiveness and feedback</li>
                <li>Scope changes or additional requirements</li>
                <li>Technical complexities</li>
                <li>Third-party dependencies</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">We commit to communicating any delays promptly and working to minimize project timeline extensions.</p>
            </div>

            {/* 5. Revisions and Modifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faPencilAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  5. Revisions and Modifications
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    5.1 Included Revisions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Each project package includes a specific number of revision rounds:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Basic Package:</strong> 2 revision rounds</li>
                    <li><strong>Professional Package:</strong> 3 revision rounds</li>
                    <li><strong>Enterprise Package:</strong> Unlimited revisions within project scope</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    5.2 Additional Revisions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">Revisions beyond the included rounds will be charged at our hourly rate. Major scope changes may require a new project quote.</p>
                </div>
              </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faFileContract} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  6. Intellectual Property
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    6.1 Client Content
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">You retain all rights to content you provide (text, images, logos, etc.). You grant us a license to use this content for the duration of the project.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    6.2 Developed Work
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">Upon full payment, all rights to the final website design and custom code are transferred to you. We retain the right to display the work in our portfolio unless otherwise agreed.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    6.3 Third-Party Assets
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">Any third-party assets (stock images, plugins, frameworks) used are subject to their respective licenses. We will inform you of any ongoing licensing requirements.</p>
                </div>
              </div>
            </div>

            {/* 7. Cancellation and Refund Policy */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faTimesCircle} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  7. Cancellation and Refund Policy
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    7.1 Client Cancellation
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Before project start: Full refund minus 10% administrative fee</li>
                    <li>After project start: Refund based on work completed, minimum 50% deposit retained</li>
                    <li>After design approval: No refund available</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    7.2 Our Right to Terminate
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">We reserve the right to terminate projects due to non-payment, scope creep, or unprofessional conduct. Partial refunds may apply based on work completed.</p>
                </div>
              </div>
            </div>

            {/* 8. Website Maintenance and Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faTools} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  8. Website Maintenance and Support
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">All packages include post-launch support:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Basic:</strong> 1 month free support</li>
                <li><strong>Professional:</strong> 3 months free support</li>
                <li><strong>Enterprise:</strong> 6 months free support</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">Extended maintenance packages are available for purchase separately.</p>
            </div>

            {/* 9. Warranties and Disclaimers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  9. Warranties and Disclaimers
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    9.1 Our Warranty
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">We warrant that services will be performed professionally and in accordance with industry standards. We guarantee bug-free functionality for 30 days post-launch.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    9.2 Disclaimer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">We are not responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Issues arising from third-party services or hosting</li>
                    <li>Damages from client modifications to the delivered work</li>
                    <li>SEO rankings or traffic guarantees</li>
                    <li>Content accuracy provided by the client</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 10. Confidentiality */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faLock} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  10. Confidentiality
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">We treat all client information as confidential. We will not disclose your business information, login credentials, or proprietary data to third parties without your consent.</p>
            </div>

            {/* 11. Limitation of Liability */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faScaleBalanced} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  11. Limitation of Liability
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Our total liability for any claims arising from our services is limited to the amount paid by you for the specific service in question. We are not liable for indirect, incidental, or consequential damages.</p>
            </div>

            {/* 12. Governing Law */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  12. Governing Law
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">These terms are governed by the laws of Jamaica. Any disputes will be resolved in Jamaican courts.</p>
            </div>

            {/* 13. Changes to Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faSync} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  13. Changes to Terms
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.</p>
            </div>

            {/* 14. Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faPhone} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  14. Contact Information
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">For questions about these terms, please contact us:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Email:</strong> danielminto13@gmail.com</p>
                <p><strong>Phone:</strong> +1 (876) 386-4417</p>
                <p><strong>Location:</strong> Jamaica</p>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}


