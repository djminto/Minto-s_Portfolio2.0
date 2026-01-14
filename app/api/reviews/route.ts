import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Review from '@/lib/models/Review';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();

    // Get all reviews with user details
    const reviews = await Review.find().sort({ createdAt: -1 });

    // Enrich reviews with user data
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findById(review.userId);
        return {
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          user: {
            fullName: user?.fullName || 'Anonymous',
            profilePhoto: user?.profilePhoto || null,
          },
        };
      })
    );

    return NextResponse.json({ success: true, reviews: enrichedReviews });
  } catch (error) {
    console.error('[GET Reviews] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, orderId, rating, comment } = body;

    // Validate required fields
    if (!userId || !orderId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId, userId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this order' },
        { status: 400 }
      );
    }

    // Create new review
    const review = new Review({
      userId,
      orderId,
      rating,
      comment,
    });

    await review.save();

    // Get user details
    const user = await User.findById(userId);

    return NextResponse.json(
      {
        success: true,
        review: {
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          user: {
            fullName: user?.fullName || 'Anonymous',
            profilePhoto: user?.profilePhoto || null,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST Review] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
