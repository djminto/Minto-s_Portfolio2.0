'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface Order {
  _id: string;
  orderNumber: string;
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
  totalAmount: number;
  currency: string;
  proposalSigned: boolean;
  signatureData?: string;
  signedAt?: string;
  createdAt: string;
}

export default function ProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (orderId && status === 'authenticated') {
      fetchOrder();
    }
  }, [orderId, status]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        alert('Failed to load proposal');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setSignatureEmpty(false);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureEmpty(true);
  };

  const handleSign = async () => {
    if (signatureEmpty) {
      alert('Please provide your signature before submitting');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setSigning(true);

    try {
      const signatureData = canvas.toDataURL();
      const response = await fetch(`/api/orders/${orderId}/sign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureData }),
      });

      if (response.ok) {
        alert('Proposal signed successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to sign proposal');
      }
    } catch (error) {
      console.error('Error signing proposal:', error);
      alert('An error occurred');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Proposal Not Found
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8"
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Project Proposal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Proposal #{order.orderNumber}
                </p>
              </div>
              {order.proposalSigned && (
                <div className="text-right">
                  <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
                    ✓ Signed
                  </span>
                  {order.signedAt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Signed on: {new Date(order.signedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Client Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-cyan-500 mb-3">Client Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Name:</p>
                <p className="font-semibold text-gray-800 dark:text-white">{order.clientName}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email:</p>
                <p className="font-semibold text-gray-800 dark:text-white">{order.clientEmail}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Phone:</p>
                <p className="font-semibold text-gray-800 dark:text-white">{order.clientPhone}</p>
              </div>
              {order.companyName && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Company:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{order.companyName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-cyan-500 mb-3">Project Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Package:</p>
                <p className="font-semibold text-gray-800 dark:text-white">{order.packageType}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Amount:</p>
                <p className="font-bold text-xl text-cyan-500">
                  {order.currency} {order.totalAmount.toLocaleString()}
                </p>
              </div>
              {order.websiteType && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Website Type:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{order.websiteType}</p>
                </div>
              )}
              {order.numPages && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Number of Pages:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{order.numPages}</p>
                </div>
              )}
              {order.colorScheme && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Color Scheme:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{order.colorScheme}</p>
                </div>
              )}
              {order.completionDate && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Completion Date:</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{order.completionDate}</p>
                </div>
              )}
            </div>

            {/* Features */}
            {order.features && order.features.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {order.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Page Types */}
            {order.pageTypes && order.pageTypes.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Required Pages:</p>
                <div className="flex flex-wrap gap-2">
                  {order.pageTypes.map((page, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {order.description && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Project Description:</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{order.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Signature Section */}
          {!order.proposalSigned && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h2 className="text-xl font-bold text-cyan-500 mb-4">Electronic Signature</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please sign below to accept this proposal
              </p>

              <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clearSignature}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Clear Signature
                </button>
                <button
                  onClick={handleSign}
                  disabled={signing || signatureEmpty}
                  className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition disabled:cursor-not-allowed"
                >
                  {signing ? 'Signing...' : 'Sign & Accept Proposal'}
                </button>
              </div>
            </div>
          )}

          {/* Already Signed */}
          {order.proposalSigned && order.signatureData && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h2 className="text-xl font-bold text-cyan-500 mb-4">Signature</h2>
              <div className="border-2 border-green-500 rounded-lg overflow-hidden">
                <img src={order.signatureData} alt="Signature" className="w-full bg-white" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
