'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { generateProposal, downloadProposal, type ProposalData } from '@/lib/utils/proposalGenerator';

// Helper to format feature labels
const formatFeatureName = (featureId: string): string => {
  const featureMap: Record<string, string> = {
    'responsive': 'Responsive Design',
    '3d': '3D Animations',
    'cms': 'Content Management System',
    'ecommerce': 'E-Commerce Integration',
    'seo': 'SEO Optimization',
    'analytics': 'Analytics Integration',
    'chatbot': 'AI Chatbot',
    'payment': 'Payment Gateway Integration'
  };
  return featureMap[featureId] || featureId;
};

interface OrderSummary {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  packageType: string;
  websiteType?: string;
  numPages?: string;
  features?: string[];
  colorScheme?: string;
  pageTypes?: string[];
  completionDate?: string;
  budgetRange?: string;
  description?: string;
  paymentMethod: string;
  totalAmount: number;
  currency: 'JMD' | 'USD';
  orderNumber: string;
  createdAt: string;
  status?: string;
}

export default function OrderConfirmationContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const orderId = useMemo(() => params.get('orderId') || params.get('orderNumber') || '', [params]);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [proposalUrl, setProposalUrl] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        console.error('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching order with ID:', orderId);
        const res = await fetch(`/api/orders/${orderId}`);
        
        if (!res.ok) {
          console.error('Failed to fetch order:', res.status, res.statusText);
          throw new Error('Failed to fetch order');
        }
        
        const found = await res.json();
        console.log('Order found:', found);

        if (found) {
          setOrder(found);
          const data: ProposalData = {
            orderNumber: found.orderNumber,
            clientName: found.clientName,
            clientEmail: found.clientEmail,
            packageType: found.packageType,
            totalAmount: found.totalAmount,
            currency: found.currency,
            description: found.description,
            websiteType: found.websiteType,
            numPages: found.numPages,
            features: found.features,
            colorScheme: found.colorScheme,
            pageTypes: found.pageTypes,
            completionDate: found.completionDate,
            budgetRange: found.budgetRange,
            createdDate: new Date(found.createdAt),
          };
          setProposalUrl(generateProposal(data));
        } else {
          console.error('Order not found with ID:', orderId);
        }
      } catch (e) {
        console.error('Error fetching order:', e);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && orderId) {
      fetchOrder();
    } else if (status === 'authenticated' && !orderId) {
      setLoading(false);
    }
  }, [orderId, status]);

  const handleCompleteOrder = async () => {
    if (!order) return;
    
    setCompleting(true);
    try {
      if (typeof window === 'undefined') {
        console.error('EmailJS is only available in the browser context.');
        return;
      }
      const emailjs = (await import('@emailjs/browser')).default;
      // Initialize EmailJS
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');

      // Send email to admin using Contact template
      const adminParams = {
        from_name: order.clientName,
        from_email: order.clientEmail,
        phone: order.clientPhone || '',
        subject: `New Order: ${order.packageType} - ${order.orderNumber}`,
        message: `A new order has been received!\n\nClient: ${order.clientName}\nEmail: ${order.clientEmail}\nPhone: ${order.clientPhone}\nPackage: ${order.packageType}\nTotal Amount: ${order.currency} ${order.totalAmount.toLocaleString()}\n50% Deposit: ${order.currency} ${(order.totalAmount / 2).toLocaleString()}\n\n${order.description ? 'Description: ' + order.description : ''}`,
      };

      console.log('Sending admin email with params:', JSON.stringify(adminParams, null, 2));

      try {
        const adminResult = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
          process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || '',
          adminParams
        );
        console.log('Admin email sent:', adminResult);
      } catch (err) {
        console.error('Failed to send admin email:', err);
      }

      // Send confirmation email to client
      const clientParams = {
        from_name: 'Minto\'s Portfolio',
        from_email: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'danielminto13@gmail.com',
        phone: order.clientPhone || '',
        subject: `Order Confirmation - ${order.orderNumber}`,
        message: `Thank you for your order!\n\nYour Order Number: ${order.orderNumber}\nPackage: ${order.packageType}\nTotal Amount: ${order.currency} ${order.totalAmount.toLocaleString()}\n\nWe will be in touch soon to start your project.`,
      };

      try {
        const clientResult = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
          process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || '',
          clientParams
        );
        console.log('Client email sent:', clientResult);
      } catch (err) {
        console.error('Failed to send client email:', err);
      }

      // Mark order as completed in database
      const completeRes = await fetch('/api/orders/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (completeRes.ok) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white">Loading order...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white text-xl">Order not found</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Order completed and emails sent!
        </motion.div>
      )}

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Order Confirmation</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Order Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Order #:</strong> {order.orderNumber}</p>
                    <p><strong>Status:</strong> <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">{order.status || 'Pending'}</span></p>
                    <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Client Information</h3>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Name:</strong> {order.clientName}</p>
                    <p><strong>Email:</strong> {order.clientEmail}</p>
                    <p><strong>Phone:</strong> {order.clientPhone}</p>
                    {order.companyName && <p><strong>Company:</strong> {order.companyName}</p>}
                  </div>
                </div>

                {/* Project Details */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Project Details</h3>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Package:</strong> {order.packageType}</p>
                    {order.websiteType && <p><strong>Website Type:</strong> {order.websiteType}</p>}
                    {order.numPages && <p><strong>Number of Pages:</strong> {order.numPages}</p>}
                    {order.completionDate && <p><strong>Completion Date:</strong> {new Date(order.completionDate).toLocaleDateString()}</p>}
                    {order.budgetRange && <p><strong>Budget Range:</strong> {order.budgetRange}</p>}
                  </div>
                </div>

                {/* Color Scheme & Page Types */}
                {order.colorScheme && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3 bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Color Scheme</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{order.colorScheme}</p>
                  </div>
                )}

                {order.pageTypes && order.pageTypes.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Required Pages</h3>
                    <div className="flex flex-wrap gap-2">
                      {order.pageTypes.map((page) => (
                        <span key={page} className="bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                          {page}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {order.features && order.features.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Features</h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {order.features.map((feature) => (
                        <li key={feature}>✓ {formatFeatureName(feature)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Pricing</h3>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Total Amount:</strong> {order.currency} ${order.totalAmount.toLocaleString()}</p>
                    <p><strong>50% Deposit:</strong> {order.currency} ${(order.totalAmount / 2).toLocaleString()}</p>
                    <p><strong>Balance Due:</strong> {order.currency} ${(order.totalAmount / 2).toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  </div>
                </div>

                {/* Description */}
                {order.description && (
                  <div>
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Project Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{order.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Proposal & Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Proposal Preview */}
              {proposalUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <iframe
                    src={proposalUrl}
                    title="Order Proposal"
                    className="w-full h-96 rounded-xl"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {proposalUrl && (
                  <Button
                    onClick={() => downloadProposal({
                      orderNumber: order.orderNumber,
                      clientName: order.clientName,
                      clientEmail: order.clientEmail,
                      packageType: order.packageType,
                      totalAmount: order.totalAmount,
                      currency: order.currency,
                      description: order.description,
                      websiteType: order.websiteType,
                      numPages: order.numPages,
                      features: order.features,
                      colorScheme: order.colorScheme,
                      pageTypes: order.pageTypes,
                      completionDate: order.completionDate,
                      budgetRange: order.budgetRange,
                      createdDate: new Date(order.createdAt),
                    })}
                    variant="primary"
                    className="w-full"
                  >
                    Download Proposal
                  </Button>
                )}

                <Button
                  onClick={handleCompleteOrder}
                  disabled={completing}
                  variant="secondary"
                  className="w-full"
                >
                  {completing ? 'Sending...' : 'Complete Order & Send Confirmation'}
                </Button>

                <a href="/">
                  <Button variant="outline" className="w-full">
                    Close
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
