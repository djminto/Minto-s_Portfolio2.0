import React, { Suspense } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderConfirmationContent from './OrderConfirmationContent';

export const metadata = {
  title: 'Order Confirmation - Minto\'s Portfolio',
  description: 'Your order confirmation and proposal',
};

function LoadingFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-900 dark:text-white">Loading order confirmation...</p>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </>
  );
}
