'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const HeroSection: React.FC = () => {
  const [occupationIndex, setOccupationIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const occupations = ['Web Developer', 'Web Designer', 'Data Protection Officer'];

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

  useEffect(() => {
    const occupation = occupations[occupationIndex];
    let currentIndex = 0;

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (currentIndex < occupation.length) {
          setDisplayText(occupation.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    } else {
      const deleteInterval = setTimeout(() => {
        setOccupationIndex((prev) => (prev + 1) % occupations.length);
        setIsTyping(true);
        setDisplayText('');
      }, 3000);

      return () => clearTimeout(deleteInterval);
    }
  }, [occupationIndex, isTyping]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        {/* Marquee Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 overflow-hidden"
        >
          <motion.p
            animate={{ x: [0, -1000, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="text-lg font-semibold text-blue-600 dark:text-blue-400"
          >
            Welcome to Minto's Portfolio • Welcome to Minto's Portfolio •
          </motion.p>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          I'm Daniel Minto
        </motion.h1>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-6 h-16 flex items-center justify-center"
        >
          <span>{displayText}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-2"
          >
            |
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Crafting stunning, modern web experiences with cutting-edge technology and
          innovative design. Let's build something amazing together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#projects">
            <Button variant="primary" size="lg">
              View Projects
            </Button>
          </a>
          <a href="/order">
            <Button variant="outline" size="lg">
              Order Website
            </Button>
          </a>
          <a href="/contact">
            <Button variant="secondary" size="lg">
              Contact Me
            </Button>
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6 mt-8"
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
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Scroll to explore</p>
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
