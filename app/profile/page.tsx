'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import LoadingAnimation3D from '@/components/LoadingAnimation3D';

interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    profilePhoto: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated') {
      setShowLoadingAnimation(false);
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          fullName: data.fullName,
          phone: data.phone || '',
          address: data.address || '',
          profilePhoto: data.profilePhoto || '',
        });
        if (data.profilePhoto) {
          setPhotoPreview(data.profilePhoto);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData((prev) => ({ ...prev, profilePhoto: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Trigger navbar refresh by dispatching custom event
        window.dispatchEvent(new Event('profilePhotoUpdated'));
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrorMessage('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated' || !profile) {
    return null;
  }

  return (
    <>
      <LoadingAnimation3D isVisible={showLoadingAnimation} />
      <main className="w-full">
        <Navbar />
        <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                User Profile
              </h1>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg"
              >
                {successMessage}
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-500">
                      {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={!isEditing}
                    className="hidden"
                    id="profilePhotoInput"
                  />
                  <label
                    htmlFor="profilePhotoInput"
                    className={`inline-block px-4 py-2 rounded-lg border transition ${
                      isEditing
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isEditing ? 'Change Photo' : 'Edit to Change'}
                  </label>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-600'
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-600'
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-600'
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Type
                </label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>

            {/* Admin Dashboard Link */}
            {profile.role === 'ADMIN' && (
              <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-purple-900 dark:text-purple-200 mb-4">
                  You have admin privileges. Access the admin dashboard to manage orders and users.
                </p>
                <Button variant="primary" onClick={() => router.push('/admin')}>
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
    </>
  );
}
