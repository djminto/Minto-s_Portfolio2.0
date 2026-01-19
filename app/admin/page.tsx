'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  totalAmount: number;
  currency: string;
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    fullName: string;
    profilePhoto: string | null;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Pending' | 'In Progress' | 'Completed' | 'All'>('All');
  const [activeView, setActiveView] = useState<'dashboard' | 'pending' | 'completed' | 'reviews'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, time: string, read: boolean}>>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'ADMIN') {
      fetchAllOrders();
      fetchAllReviews();
      generateNotifications();
    }
  }, [status, session]);

  useEffect(() => {
    // Update notifications when orders change
    generateNotifications();
  }, [orders]);

  const generateNotifications = () => {
    const newNotifications = [];
    const now = new Date();
    
    // Notification for new pending orders
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    if (pendingOrders.length > 0) {
      newNotifications.push({
        id: 'pending',
        message: `You have ${pendingOrders.length} pending order${pendingOrders.length > 1 ? 's' : ''} awaiting review`,
        time: 'Now',
        read: false
      });
    }

    // Notification for in-progress orders
    const inProgressOrders = orders.filter(o => o.status === 'In Progress');
    if (inProgressOrders.length > 0) {
      newNotifications.push({
        id: 'inprogress',
        message: `${inProgressOrders.length} order${inProgressOrders.length > 1 ? 's are' : ' is'} currently in progress`,
        time: '5 min ago',
        read: false
      });
    }

    // Notification for recent orders (today)
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === now.toDateString();
    });
    if (todayOrders.length > 0) {
      newNotifications.push({
        id: 'today',
        message: `${todayOrders.length} new order${todayOrders.length > 1 ? 's' : ''} received today`,
        time: '1 hour ago',
        read: false
      });
    }

    setNotifications(newNotifications);
  };

  const handleRefresh = () => {
    fetchAllOrders(true);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const fetchAllOrders = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setIsRefreshing(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        if (showRefreshMessage) {
          // Show success toast
          const successDiv = document.createElement('div');
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
          successDiv.textContent = '✓ Orders refreshed successfully';
          document.body.appendChild(successDiv);
          setTimeout(() => successDiv.remove(), 3000);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (showRefreshMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = '✗ Failed to refresh orders';
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
      }
    } finally {
      setLoading(false);
      if (showRefreshMessage) setIsRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
        // Show success toast
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = '✓ Order deleted successfully';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete order';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  };

  const deleteSelectedOrders = async () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select orders to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedOrderIds.length} order(s)?`)) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/orders/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrderIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(orders.filter((order) => !selectedOrderIds.includes(order._id)));
        setSelectedOrderIds([]);
        
        // Show success toast
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = `✓ ${data.deletedCount} order(s) deleted successfully`;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete orders');
      }
    } catch (error) {
      console.error('Failed to delete orders:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete orders';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm(`⚠️ WARNING: This will permanently delete ALL ${orders.length} orders! Are you absolutely sure?`)) return;
    
    if (!confirm('This action CANNOT be undone. Type "DELETE ALL" to confirm (just click OK to proceed)')) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/orders/bulk-delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setOrders([]);
        setSelectedOrderIds([]);
        
        // Show success toast
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = `✓ All ${data.deletedCount} orders deleted successfully`;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete all orders');
      }
    } catch (error) {
      console.error('Failed to delete all orders:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete all orders';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(order => order._id));
    }
  };

  // Review Management Functions
  const fetchAllReviews = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setIsRefreshing(true);
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        if (showRefreshMessage) {
          const successDiv = document.createElement('div');
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
          successDiv.textContent = '✓ Reviews refreshed successfully';
          document.body.appendChild(successDiv);
          setTimeout(() => successDiv.remove(), 3000);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      if (showRefreshMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = '✗ Failed to refresh reviews';
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
      }
    } finally {
      if (showRefreshMessage) setIsRefreshing(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = '✓ Review deleted successfully';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete review';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  };

  const deleteSelectedReviews = async () => {
    if (selectedReviewIds.length === 0) {
      alert('Please select reviews to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedReviewIds.length} review(s)?`)) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/reviews/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds: selectedReviewIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(reviews.filter((review) => !selectedReviewIds.includes(review._id)));
        setSelectedReviewIds([]);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = `✓ ${data.deletedCount} review(s) deleted successfully`;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete reviews');
      }
    } catch (error) {
      console.error('Failed to delete reviews:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete reviews';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllReviews = async () => {
    if (!confirm(`⚠️ WARNING: This will permanently delete ALL ${reviews.length} reviews! Are you absolutely sure?`)) return;
    
    if (!confirm('This action CANNOT be undone. Click OK to proceed')) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/reviews/bulk-delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setReviews([]);
        setSelectedReviewIds([]);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        successDiv.textContent = `✓ All ${data.deletedCount} reviews deleted successfully`;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      } else {
        throw new Error('Failed to delete all reviews');
      }
    } catch (error) {
      console.error('Failed to delete all reviews:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '✗ Failed to delete all reviews';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviewIds(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const toggleSelectAllReviews = () => {
    if (selectedReviewIds.length === reviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(reviews.map(review => review._id));
    }
  };

  const filteredOrders = searchQuery
    ? orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedStatus === 'All'
    ? orders
    : orders.filter((order) => order.status === selectedStatus);

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    inProgress: orders.filter((o) => o.status === 'In Progress').length,
    completed: orders.filter((o) => o.status === 'Completed').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    thisMonthRevenue: orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + o.totalAmount, 0),
    pendingPayments: orders.filter((o) => o.status === 'Pending').reduce((sum, o) => sum + o.totalAmount * 0.5, 0),
  };

  const displayOrders =
    activeView === 'dashboard'
      ? orders.slice(0, 5)
      : activeView === 'pending'
      ? orders.filter((o) => o.status === 'Pending')
      : orders.filter((o) => o.status === 'Completed');

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="md:w-64 bg-gray-900 flex flex-col border-r border-gray-800 overflow-y-auto">
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/Minto's logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
            <h1 className="text-xl md:text-2xl font-bold text-cyan-500">Admin Panel</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeView === 'dashboard'
                ? 'bg-cyan-500 text-gray-900 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => setActiveView('pending')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
              activeView === 'pending'
                ? 'bg-yellow-500 text-gray-900 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Pending
            </div>
            <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {stats.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveView('completed')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
              activeView === 'completed'
                ? 'bg-green-500 text-gray-900 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              Completed
            </div>
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {stats.completed}
            </span>
          </button>

          <button
            onClick={() => setActiveView('reviews')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
              activeView === 'reviews'
                ? 'bg-purple-500 text-gray-900 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
              </svg>
              Reviews
            </div>
            <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {reviews.length}
            </span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Back to Site
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/Minto's logo.png"
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-cyan-500"
            />
            <div>
              <p className="font-semibold text-white">{session?.user?.name}</p>
              <p className="text-xs text-cyan-500">Administrator</p>
            </div>
          </div>

          <Link href="/profile">
            <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-semibold transition">
              Update Profile
            </button>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 bg-gradient-to-r from-gray-800 to-gray-800/50 p-4 sm:p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-500 mb-2">Order Management Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-400">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition text-sm sm:text-base"
                >
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                  <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 sm:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                    </svg>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
                    >
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-white font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-cyan-500 hover:text-cyan-400"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-700">
                          {notifications.map(notification => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`p-4 hover:bg-gray-700/50 cursor-pointer transition ${
                                notification.read ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">{notification.message}</p>
                                  <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="p-3 border-t border-gray-700 text-center">
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-sm text-cyan-500 hover:text-cyan-400"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8"
          >
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cyan-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">{stats.totalOrders}</p>
                  <p className="text-gray-400 text-sm mt-1">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-yellow-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">{stats.pending}</p>
                  <p className="text-gray-400 text-sm mt-1">Pending Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">{stats.inProgress}</p>
                  <p className="text-gray-400 text-sm mt-1">In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">{stats.completed}</p>
                  <p className="text-gray-400 text-sm mt-1">Completed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders / All Orders View */}
          {activeView === 'dashboard' && (
            <>
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => setActiveView('pending')}
                    className="px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-gray-900 rounded-lg font-semibold transition"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {displayOrders.map((order) => (
                    <div key={order._id} className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-cyan-500">{order.orderNumber}</h3>
                          <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            {new Date(order.createdAt).toLocaleString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                            order.status === 'Completed'
                              ? 'bg-green-500 text-gray-900'
                              : order.status === 'In Progress'
                              ? 'bg-blue-500 text-white'
                              : 'bg-yellow-500 text-gray-900'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Client</p>
                          <p className="text-white font-semibold">{order.clientName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Email</p>
                          <p className="text-white font-semibold text-sm">{order.clientEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Package</p>
                          <p className="text-white font-semibold">{order.packageType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Amount</p>
                          <p className="text-white font-bold text-lg">
                            {order.currency} {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsOpen(true);
                          }}
                          className="flex-1 px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-gray-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'In Progress')}
                          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Start Project
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Revenue Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-3 mb-6">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                  Revenue Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-4xl font-bold text-cyan-500">
                      JMD {stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2">This Month</p>
                    <p className="text-4xl font-bold text-blue-500">
                      JMD {stats.thisMonthRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2">Pending Payments</p>
                    <p className="text-4xl font-bold text-yellow-500">
                      JMD {stats.pendingPayments.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* All Orders View with Search */}
          {activeView !== 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    All Orders
                  </h2>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Actions */}
                {filteredOrders.length > 0 && (
                  <div className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                          onChange={toggleSelectAll}
                          className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-white font-semibold">
                          {selectedOrderIds.length > 0
                            ? `${selectedOrderIds.length} selected`
                            : 'Select All'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      {selectedOrderIds.length > 0 && (
                        <button
                          onClick={deleteSelectedOrders}
                          disabled={isDeleting}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          {isDeleting ? 'Deleting...' : `Delete Selected (${selectedOrderIds.length})`}
                        </button>
                      )}
                      
                      <button
                        onClick={deleteAllOrders}
                        disabled={isDeleting || orders.length === 0}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        {isDeleting ? 'Deleting...' : 'Delete All Orders'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order._id)}
                          onChange={() => toggleOrderSelection(order._id)}
                          className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900 cursor-pointer"
                        />
                      </div>

                      {/* Order Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-cyan-500">{order.orderNumber}</h3>
                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                              </svg>
                              {new Date(order.createdAt).toLocaleString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                              order.status === 'Completed'
                                ? 'bg-green-500 text-gray-900'
                                : order.status === 'In Progress'
                                ? 'bg-blue-500 text-white'
                                : 'bg-yellow-500 text-gray-900'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Client</p>
                            <p className="text-white font-semibold">{order.clientName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Email</p>
                            <p className="text-white font-semibold text-sm">{order.clientEmail}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Package</p>
                            <p className="text-white font-semibold">{order.packageType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Amount</p>
                            <p className="text-white font-bold text-lg">
                              {order.currency} {order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Additional Quick Info */}
                        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-700">
                          {(order as any).colorScheme && (
                            <div>
                              <p className="text-gray-500 text-xs mb-1">🎨 Color Scheme</p>
                              <p className="text-white font-semibold text-sm truncate">{(order as any).colorScheme}</p>
                            </div>
                          )}
                          {(order as any).completionDate && (
                            <div>
                              <p className="text-gray-500 text-xs mb-1">📅 Deadline</p>
                              <p className="text-white font-semibold text-sm">{(order as any).completionDate}</p>
                            </div>
                          )}
                          {(order as any).budgetRange && (
                            <div>
                              <p className="text-gray-500 text-xs mb-1">💰 Budget</p>
                              <p className="text-white font-semibold text-sm truncate">{(order as any).budgetRange}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                            className="flex-1 px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-gray-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                            View Details
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'In Progress')}
                            disabled={order.status === 'In Progress' || order.status === 'Completed'}
                            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Start Project
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Completed')}
                            disabled={order.status === 'Completed'}
                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                            </svg>
                            Mark Complete
                          </button>
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-xl">No orders found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Reviews View */}
          {activeView === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-purple-500 flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                    </svg>
                    Customer Reviews ({reviews.length})
                  </h2>
                  <button
                    onClick={() => fetchAllReviews(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                  >
                    <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                {/* Bulk Actions */}
                {reviews.length > 0 && (
                  <div className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedReviewIds.length === reviews.length && reviews.length > 0}
                          onChange={toggleSelectAllReviews}
                          className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-white font-semibold">
                          {selectedReviewIds.length > 0
                            ? `${selectedReviewIds.length} selected`
                            : 'Select All'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      {selectedReviewIds.length > 0 && (
                        <button
                          onClick={deleteSelectedReviews}
                          disabled={isDeleting}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          {isDeleting ? 'Deleting...' : `Delete Selected (${selectedReviewIds.length})`}
                        </button>
                      )}
                      
                      <button
                        onClick={deleteAllReviews}
                        disabled={isDeleting || reviews.length === 0}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        {isDeleting ? 'Deleting...' : 'Delete All Reviews'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedReviewIds.includes(review._id)}
                          onChange={() => toggleReviewSelection(review._id)}
                          className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900 cursor-pointer"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            {review.user.profilePhoto ? (
                              <img
                                src={review.user.profilePhoto}
                                alt={review.user.fullName}
                                className="w-12 h-12 rounded-full border-2 border-purple-500"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                                <span className="text-purple-500 font-bold text-lg">
                                  {review.user.fullName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-bold text-white">{review.user.fullName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-gray-400 text-sm">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {review.comment && (
                          <div className="mb-4">
                            <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => deleteReview(review._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            Delete Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                    </svg>
                    <p className="text-xl">No reviews yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-800/50 p-6 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-cyan-500">{selectedOrder.orderNumber}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase inline-block ${
                    selectedOrder.status === 'Completed'
                      ? 'bg-green-500 text-gray-900'
                      : selectedOrder.status === 'In Progress'
                      ? 'bg-blue-500 text-white'
                      : 'bg-yellow-500 text-gray-900'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Client Information */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-500 mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Client Name</p>
                    <p className="text-white text-lg font-semibold">{selectedOrder.clientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <a href={`mailto:${selectedOrder.clientEmail}`} className="text-cyan-400 text-lg font-semibold hover:underline break-all">
                      {selectedOrder.clientEmail}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                    <a href={`tel:${(selectedOrder as any).clientPhone}`} className="text-cyan-400 text-lg font-semibold hover:underline">
                      {(selectedOrder as any).clientPhone || 'N/A'}
                    </a>
                  </div>
                  {(selectedOrder as any).companyName && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Company Name</p>
                      <p className="text-white text-lg font-semibold">{(selectedOrder as any).companyName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-500 mb-4">📋 Order Summary</h3>
                
                {/* Package & Pricing Section */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Package Type</p>
                    <p className="text-white text-lg font-semibold">{selectedOrder.packageType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                    <p className="text-cyan-400 text-2xl font-bold">
                      {selectedOrder.currency} {selectedOrder.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Currency</p>
                    <p className="text-white text-lg font-semibold">{selectedOrder.currency}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Website Type</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).websiteType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Number of Pages</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).numPages || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Color Scheme</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).colorScheme || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Desired Completion Date</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).completionDate || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Budget Range</p>
                    <p className="text-white text-lg font-semibold">{(selectedOrder as any).budgetRange || 'N/A'}</p>
                  </div>
                </div>

                {/* Features Section */}
                {(selectedOrder as any).features && (selectedOrder as any).features.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <p className="text-gray-400 text-sm mb-3 font-semibold">✨ Requested Features</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedOrder as any).features.map((feature: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Types Section */}
                {(selectedOrder as any).pageTypes && (selectedOrder as any).pageTypes.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <p className="text-gray-400 text-sm mb-3 font-semibold">📄 Required Pages</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedOrder as any).pageTypes.map((page: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-full text-sm font-medium">
                          {page}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Description Section */}
                {(selectedOrder as any).description && (
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <p className="text-gray-400 text-sm mb-2 font-semibold">📝 Project Description</p>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{(selectedOrder as any).description}</p>
                    </div>
                  </div>
                )}

                {/* Proposal Sign Status */}
                <div>
                  <p className="text-gray-400 text-sm mb-3 font-semibold">📜 Proposal Status</p>
                  <div className="flex items-center gap-3">
                    <p className={`text-lg font-semibold ${(selectedOrder as any).proposalSigned ? 'text-green-500' : 'text-yellow-500'}`}>
                      {(selectedOrder as any).proposalSigned ? '✓ Signed' : '✗ Not Signed'}
                    </p>
                    <button
                      onClick={() => {
                        const newSignedStatus = !(selectedOrder as any).proposalSigned;
                        fetch(`/api/orders/${selectedOrder._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            proposalSigned: newSignedStatus,
                            signedAt: newSignedStatus ? new Date() : null
                          }),
                        }).then(() => {
                          setSelectedOrder({ ...selectedOrder, proposalSigned: newSignedStatus } as any);
                          fetchAllOrders();
                        });
                      }}
                      className="px-3 py-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition"
                    >
                      {(selectedOrder as any).proposalSigned ? 'Mark Unsigned' : 'Mark Signed'}
                    </button>
                  </div>
                  {(selectedOrder as any).signedAt && (
                    <p className="text-gray-400 text-xs mt-2">
                      Signed on: {new Date((selectedOrder as any).signedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-500 mb-4">Manage Order</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, 'Pending');
                      setIsDetailsOpen(false);
                    }}
                    disabled={selectedOrder.status === 'Pending'}
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-gray-900 disabled:text-gray-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, 'In Progress');
                      setIsDetailsOpen(false);
                    }}
                    disabled={selectedOrder.status === 'In Progress'}
                    className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white disabled:text-gray-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    In Progress
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, 'Completed');
                      setIsDetailsOpen(false);
                    }}
                    disabled={selectedOrder.status === 'Completed'}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-gray-900 disabled:text-gray-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                    Completed
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/10 border border-red-500 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this order?')) {
                      deleteOrder(selectedOrder._id);
                      setIsDetailsOpen(false);
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  Delete Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
