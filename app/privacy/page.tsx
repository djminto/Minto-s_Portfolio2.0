'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faDatabase, 
  faHandshake, 
  faLock, 
  faFileAlt, 
  faUser, 
  faBaby,
  faGlobe,
  faLink,
  faBell,
  faSync,
  faPhone,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground3D from '@/components/sections/AnimatedBackground3D';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const LAST_UPDATED = 'January 7, 2026';

export default function PrivacyPage() {
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
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h1 className="text-5xl font-bold text-cyan-500">
                Privacy Policy
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
                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  1. Introduction
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                At Minto's Web Development, we are committed to protecting your privacy and personal data. As a certified Data Protection Officer, I take data security seriously. This Privacy Policy explains how we collect, use, store, and protect your information.
              </p>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Your Privacy Matters: We comply with international data protection standards and Jamaica's data privacy laws.
                </p>
              </div>
            </div>

            {/* 2. Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faDatabase} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  2. Information We Collect
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    2.1 Personal Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">We collect the following personal information when you use our services:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Contact Details:</strong> Name, email address, phone number, company name</li>
                    <li><strong>Account Information:</strong> Username, password (encrypted), profile picture</li>
                    <li><strong>Project Details:</strong> Website requirements, business information, project descriptions</li>
                    <li><strong>Payment Information:</strong> Billing address, payment method (processed securely through third-party providers)</li>
                    <li><strong>Communications:</strong> Messages sent through contact forms, emails, or chatbot</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    2.2 Automatically Collected Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited</li>
                    <li><strong>Cookies:</strong> Session data, preferences, analytics information</li>
                    <li><strong>Local Storage:</strong> User preferences, login sessions, form data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. How We Use Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  3. How We Use Your Information
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We use your personal information for the following purposes:</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li>• <strong>Service Delivery:</strong> To provide web development services and fulfill project requirements</li>
                <li>• <strong>Communication:</strong> To respond to inquiries, send project updates, and provide customer support</li>
                <li>• <strong>Payment Processing:</strong> To process payments and manage invoicing</li>
                <li>• <strong>Account Management:</strong> To create and manage user accounts and profiles</li>
                <li>• <strong>Service Improvement:</strong> To analyze usage patterns and improve our website and services</li>
                <li>• <strong>Marketing:</strong> To send promotional materials (with your consent, which you can withdraw anytime)</li>
                <li>• <strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              </ul>
            </div>

            {/* 4. Cookies and Tracking Technologies */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faDatabase} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  4. Cookies and Tracking Technologies
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    4.1 What We Use
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Essential Cookies:</strong> Required for website functionality (login sessions, form data)</li>
                    <li><strong>Analytics Cookies:</strong> Google Analytics to understand website usage</li>
                    <li><strong>Local Storage:</strong> Browser storage for user preferences and temporary data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    4.2 Your Control
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">You can control cookies through your browser settings. Note that disabling essential cookies may affect website functionality.</p>
                </div>
              </div>
            </div>

            {/* 5. Information Sharing and Disclosure */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  5. Information Sharing and Disclosure
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    5.1 We DO NOT Sell Your Data
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">We never sell, rent, or trade your personal information to third parties for marketing purposes.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    5.2 When We Share Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">We may share your information only in these limited circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Service Providers:</strong> Hosting providers, email services (EmailJS), payment processors - all under strict confidentiality agreements</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (with notice to you)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. Data Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faLock} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  6. Data Security
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We implement industry-standard security measures to protect your data:</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-4">
                <li>• <strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
                <li>• <strong>Password Protection:</strong> Encrypted password storage with hashing</li>
                <li>• <strong>Secure Storage:</strong> Data stored on secure servers with access controls</li>
                <li>• <strong>Regular Updates:</strong> Security patches and system updates</li>
                <li>• <strong>Access Control:</strong> Limited employee access on need-to-know basis</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
                <p className="text-gray-700 dark:text-gray-300"><strong>Important:</strong> No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
              </div>
            </div>

            {/* 7. Data Retention */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  7. Data Retention
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We retain your personal information for as long as necessary:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Active Projects:</strong> Throughout the project duration and support period</li>
                <li><strong>Completed Projects:</strong> Up to 7 years for legal and accounting purposes</li>
                <li><strong>Marketing Data:</strong> Until you withdraw consent or request deletion</li>
                <li><strong>Inactive Accounts:</strong> Deleted after 2 years of inactivity with prior notice</li>
              </ul>
            </div>

            {/* 8. Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faUser} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  8. Your Rights
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You have the following rights regarding your personal data:</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-4">
                <li>• <strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li>• <strong>Objection:</strong> Object to processing of your data for specific purposes</li>
                <li>• <strong>Portability:</strong> Request your data in a portable format</li>
                <li>• <strong>Withdraw Consent:</strong> Withdraw consent for marketing communications anytime</li>
                <li>• <strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700 dark:text-gray-300">To exercise these rights, contact us at danielminto13@gmail.com. We will respond within 30 days.</p>
              </div>
            </div>

            {/* 9. Children's Privacy */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faBaby} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  9. Children's Privacy
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we discover we have collected information from a child, we will delete it immediately.</p>
            </div>

            {/* 10. International Data Transfers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faGlobe} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  10. International Data Transfers
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Your data may be transferred to and processed in countries outside Jamaica, including the United States (for cloud hosting and email services). We ensure adequate safeguards are in place for such transfers.</p>
            </div>

            {/* 11. Third-Party Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faLink} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  11. Third-Party Links
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Our website may contain links to third-party websites (social media, hosting providers). We are not responsible for their privacy practices. We recommend reviewing their privacy policies.</p>
            </div>

            {/* 12. Data Breach Notification */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faBell} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  12. Data Breach Notification
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">In the unlikely event of a data breach that poses a risk to your rights and freedoms, we will notify you within 72 hours and report to relevant authorities as required by law.</p>
            </div>

            {/* 13. Changes to This Policy */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faSync} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  13. Changes to This Policy
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">We may update this Privacy Policy periodically. We will notify you of significant changes by:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Posting the updated policy on our website with a new "Last Updated" date</li>
                <li>Sending an email notification for material changes</li>
                <li>Requiring acceptance for changes that affect your rights</li>
              </ul>
            </div>

            {/* 14. Contact Us */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faPhone} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  14. Contact Us
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">For any privacy-related questions, concerns, or requests, please contact:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Data Protection Officer:</strong> Daniel Minto</p>
                <p><strong>Email:</strong> danielminto13@gmail.com</p>
                <p><strong>Phone:</strong> +1 (876) 386-4417</p>
                <p><strong>Location:</strong> Jamaica</p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-4">We are committed to resolving any privacy concerns you may have.</p>
            </div>

            {/* 15. Compliance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-cyan-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  15. Compliance
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">This Privacy Policy complies with:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Jamaica Data Protection Act</li>
                <li>General Data Protection Regulation (GDPR) principles</li>
                <li>International data protection best practices</li>
              </ul>
            </div>
          </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}


