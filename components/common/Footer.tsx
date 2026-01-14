'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: faEnvelope,
      href: 'mailto:danielminto13@gmail.com',
      label: 'Email',
      color: 'hover:text-red-600',
    },
    {
      icon: faInstagram,
      href: 'https://www.instagram.com/minto_web_design/',
      label: 'Instagram',
      color: 'hover:text-pink-600',
    },
    {
      icon: faWhatsapp,
      href: 'https://wa.me/18763864417',
      label: 'WhatsApp',
      color: 'hover:text-green-600',
    },
    {
      icon: faGithub,
      href: 'https://github.com/djminto',
      label: 'GitHub',
      color: 'hover:text-gray-800 dark:hover:text-gray-200',
    },
    {
      icon: faLinkedin,
      href: 'https://www.linkedin.com/in/daniel-minto-ba80a9271/',
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-12 border-t border-gray-300 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4">Minto's Portfolio</h3>
            <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
              Full-stack web developer creating beautiful, functional digital solutions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Order Services
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  Resume
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-blue-600" />
                <a href="tel:+18763864417" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition">
                  +1 (876) 386-4417
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-600" />
                <a href="mailto:danielminto13@gmail.com" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 transition break-all">
                  danielminto13@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600" />
                <span className="text-gray-700 dark:text-gray-400">Jamaica, WI</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-6 mb-8 py-8 border-y border-gray-300 dark:border-gray-700"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`text-gray-600 dark:text-gray-400 text-2xl transition ${social.color}`}
              title={social.label}
            >
              <FontAwesomeIcon icon={social.icon} />
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <p>
            &copy; {currentYear} Daniel Minto. All rights reserved.
          </p>
          <p className="mt-2">
            Made by Minto's Web Design{' '}
            <a 
              href="https://minto-portfolio-website.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-blue-600 transition"
            >
              <FontAwesomeIcon icon={faLaptopCode} className="text-blue-500 ml-1" />
            </a>
            {' '}| All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
