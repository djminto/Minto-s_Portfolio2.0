'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [time, setTime] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  // Fetch user profile photo
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/users/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.profilePhoto) {
              setProfilePhoto(data.profilePhoto);
            }
          }
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      }
    };

    fetchProfilePhoto();

    // Listen for profile photo updates
    const handleProfilePhotoUpdate = () => {
      fetchProfilePhoto();
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, [session]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
    { href: '/contact', label: 'Contact' },
    { href: '/reviews', label: 'Reviews' },
    ...(session ? [] : [{ href: '/login', label: 'Login' }]),
    { href: '/order', label: 'Order' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/images/Minto's logo.png" alt="Minto's Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
            Minto's Portfolio
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Digital Clock, Profile & Theme Toggle */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 hidden lg:block whitespace-nowrap">
            {time}
          </div>
          
          {/* Profile Menu - Show when authenticated */}
          {session && (
            <div className="flex items-center gap-4">
              {/* Welcome Message */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Welcome, {session.user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                  title="Profile Menu"
                >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FontAwesomeIcon icon={faCog} className="w-4" />
                      Profile Settings
                    </Link>

                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 dark:text-white"
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Profile Link in Mobile Menu */}
            {session && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faCog} className="w-4" />
                  Profile Settings
                </Link>

                {(session.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
