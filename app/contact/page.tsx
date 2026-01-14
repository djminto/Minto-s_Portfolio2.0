'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Have a project in mind? Let's discuss how I can help you.
            </p>
          </motion.div>

          {/* Contact Info & Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Get in touch via email</p>
                  </div>
                </div>
                <a
                  href="mailto:danielminto13@gmail.com"
                  className="text-blue-600 hover:underline font-semibold break-all"
                >
                  danielminto13@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <FontAwesomeIcon icon={faPhone} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Call or text me</p>
                  </div>
                </div>
                <a
                  href="tel:+18763864417"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  +1 (876) 386-4417
                </a>
              </div>

              {/* Location */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Based in Jamaica</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Jamaica, WI</p>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Me</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/djminto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 p-3 rounded-lg transition"
                    title="GitHub"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-lg" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/daniel-minto-ba80a9271/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
                    title="LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
                  </a>
                  <a
                    href="https://www.instagram.com/minto_web_design/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg transition"
                    title="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                  </a>
                  <a
                    href="https://wa.me/18763864417"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition"
                    title="WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
            >
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600 transition"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600 transition"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600 transition"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600 transition"
                    placeholder="Project Inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600 transition resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded">
                    ✓ Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                    ✗ Error sending message. Please try again.
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
