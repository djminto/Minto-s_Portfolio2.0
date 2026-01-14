'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { generateProposal, downloadProposal, type ProposalData } from '@/lib/utils/proposalGenerator';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Load EmailJS only in the browser to avoid SSR/runtime issues

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

export default function OrderConfirmationPage() {
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
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN || '',
          adminParams
        );
        console.log('Admin email sent successfully:', adminResult);
      } catch (adminError: any) {
        console.error('Admin email error details:', {
          status: adminError?.status,
          text: adminError?.text,
          message: adminError?.message,
          full: adminError
        });
      }

      // Send email to client using Order Confirmation template
      const clientParams = {
        to_email: order.clientEmail,
        to_name: order.clientName,
        from_name: "Minto's Portfolio",
        order_number: order.orderNumber,
        client_name: order.clientName,
        client_email: order.clientEmail,
        client_phone: order.clientPhone || '',
        client_company: order.companyName || 'N/A',
        package_type: order.packageType,
        website_type: order.websiteType || 'N/A',
        num_pages: order.numPages || 'N/A',
        features: order.features?.join(', ') || 'N/A',
        budget: order.budgetRange || `${order.currency} ${order.totalAmount.toLocaleString()}`,
        deadline: order.completionDate || 'To be discussed',
        amount: `${order.currency} ${order.totalAmount.toLocaleString()}`,
        payment_method: order.paymentMethod || '',
        description: order.description || 'No description provided',
        date: new Date().toLocaleDateString(),
        message: `Thank you for choosing Minto's Portfolio! Your order #${order.orderNumber} for the ${order.packageType} package has been received.\n\nTotal Amount: ${order.currency} ${order.totalAmount.toLocaleString()}\n50% Deposit Required: ${order.currency} ${(order.totalAmount / 2).toLocaleString()}\n\nWe will be in touch shortly.`,
      };

      console.log('Sending client email with params:', JSON.stringify(clientParams, null, 2));

      try {
        const clientResult = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT || '',
          clientParams
        );
        console.log('Client email sent successfully:', clientResult);
      } catch (clientError: any) {
        console.error('Client email error details:', {
          status: clientError?.status,
          text: clientError?.text,
          message: clientError?.message,
          full: clientError
        });
      }

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Error completing order:', {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        full: error
      });
      alert('Error: ' + (error?.text || error?.message || 'Unknown error'));
    } finally {
      setCompleting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white">Loading confirmation...</p>
        </div>
      </main>
    );
  }

  if (!orderId) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-200">Missing Order Number</h1>
            <p className="mt-2 text-red-800 dark:text-red-300">No order number was provided. Please return to the order page.</p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => router.push('/order')}>Back to Order</Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-200">Order not found</h1>
            <p className="mt-2 text-red-800 dark:text-red-300">We couldn't locate this order. Please return to the order page and try again.</p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => router.push('/order')}>Back to Order</Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full">
      <Navbar />
      
      {/* Enhanced Success Notification Popup */}
      {showNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border-2 border-cyan-500 rounded-2xl p-8 max-w-lg mx-4 text-center"
          >
            {/* Success Checkmark */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">
              Order Placed Successfully!
            </h2>

            {/* Order Number */}
            <p className="text-white mb-4">
              Your order number is: <span className="font-mono font-bold text-cyan-400">{order?.orderNumber}</span>
            </p>

            {/* Confirmation Email */}
            <p className="text-gray-300 mb-2">
              We've sent a confirmation email to
            </p>
            <p className="text-cyan-400 font-semibold mb-6">
              {order?.clientEmail}
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-full mb-6">
              <span className="text-gray-300">Status:</span>
              <span className="text-yellow-400 font-bold uppercase tracking-wide">Pending Review</span>
            </div>

            {/* Follow-up Message */}
            <p className="text-gray-300 text-sm mb-8">
              You'll receive another email once your project is confirmed and started.
            </p>

            {/* Close Button */}
            <Button
              variant="primary"
              onClick={() => {
                setShowNotification(false);
                router.push('/dashboard');
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-3 rounded-lg"
            >
              Close
            </Button>
          </motion.div>
        </div>
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
                    {order.completionDate && <p><strong>Desired Completion:</strong> {order.completionDate}</p>}
                    {order.budgetRange && <p><strong>Budget Range:</strong> {order.budgetRange}</p>}
                  </div>
                </div>

                {/* Color Scheme - Highlighted */}
                {order.colorScheme && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">🎨 Color Scheme</h3>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.colorScheme}</p>
                    </div>
                  </div>
                )}

                {/* Features */}
                {order.features && order.features.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Requested Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {order.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-xs">
                          {formatFeatureName(feature)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Types */}
                {order.pageTypes && order.pageTypes.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">📄 Required Pages</h3>
                    <div className="flex flex-wrap gap-2">
                      {order.pageTypes.map((page, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md text-sm font-medium border border-purple-300 dark:border-purple-700">
                          {page}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {order.description && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Project Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{order.description}</p>
                  </div>
                )}

                {/* Payment Information */}
                <div>
                  <h3 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Total Amount:</strong> <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{order.currency} {order.totalAmount.toLocaleString()}</span></p>
                    <p><strong>50% Deposit:</strong> <span className="font-semibold">{order.currency} {(order.totalAmount / 2).toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Proposal</h2>
              <div className="border rounded-lg overflow-hidden h-[420px] mb-4">
                {proposalUrl ? (
                  <iframe src={proposalUrl} className="w-full h-full" />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">Generating proposal...</div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const data: ProposalData = {
                      orderNumber: order.orderNumber,
                      clientName: order.clientName,
                      clientEmail: order.clientEmail,
                      packageType: order.packageType,
                      totalAmount: order.totalAmount,
                      currency: order.currency,
                      description: order.description,
                      createdDate: new Date(order.createdAt),
                    };
                    downloadProposal(data);
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/proposal?orderId=${orderId}`)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  View & Sign Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
