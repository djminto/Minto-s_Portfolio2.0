'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

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

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    orderId: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setMessage({ type: 'error', text: 'You must be logged in to leave a review' });
      return;
    }

    if (!formData.orderId.trim()) {
      setMessage({ type: 'error', text: 'Please enter an order ID' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (session.user as any).id,
          orderId: formData.orderId,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Review posted successfully!' });
        setFormData({ orderId: '', rating: 5, comment: '' });
        fetchReviews();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to post review' });
      }
    } catch (error) {
      console.error('Error posting review:', error);
      setMessage({ type: 'error', text: 'An error occurred while posting your review' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">Client Reviews</h1>
            <p className="text-gray-400 text-lg">Read what our satisfied clients have to say</p>
          </div>

          {/* Review Form */}
          {session?.user && (
            <div className="bg-gray-800 rounded-lg p-8 mb-16 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Leave Your Review</h2>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="Enter your order ID"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-4xl transition ${
                          star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Share your experience... (optional)"
                    rows={5}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            </div>
          )}

          {!session?.user && (
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6 mb-16 text-center">
              <p className="text-blue-300">
                Please log in to leave a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">All Reviews</h2>

            {loading ? (
              <div className="text-center text-gray-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No reviews yet. Be the first to leave one!
              </div>
            ) : (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Photo */}
                      {review.user.profilePhoto ? (
                        <img
                          src={review.user.profilePhoto}
                          alt={review.user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {review.user.fullName.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1">
                        {/* Username and Rating */}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {review.user.fullName}
                          </h3>
                          {renderStars(review.rating)}
                        </div>

                        {/* Date */}
                        <p className="text-sm text-gray-400 mb-3">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>

                        {/* Comment */}
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
