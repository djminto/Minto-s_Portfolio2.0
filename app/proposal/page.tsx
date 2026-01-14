import React, { Suspense } from 'react';
import ProposalContent from './ProposalContent';

// Force dynamic rendering for this page due to useSearchParams
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: 'Project Proposal - Minto\'s Portfolio',
  description: 'Review and sign your project proposal',
};

function LoadingFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-900 dark:text-white">Loading proposal...</p>
      </div>
    </main>
  );
}

export default function ProposalPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProposalContent />
    </Suspense>
  );
}
