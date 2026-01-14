'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function ResumePage() {
  return (
    <main className="w-full">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg"
          >
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              My Resume
            </h1>
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
              Professional experience, education, and skills
            </p>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold">Daniel Minto Resume</h2>
              <a
                href="/images/Daniel Minto Resume .pdf"
                download
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
              >
                Download PDF
              </a>
            </div>

            {/* PDF Display */}
            <div className="w-full bg-gray-100 dark:bg-gray-700">
              <iframe
                src="/images/Daniel Minto Resume .pdf"
                className="w-full h-screen"
                style={{ minHeight: '800px' }}
              />
            </div>
          </motion.div>

          {/* Quick Resume Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl border border-blue-500 dark:border-blue-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                💼 Experience
              </h3>
              <p className="text-white text-sm leading-relaxed">
                <strong className="text-blue-100">Vision DocuCenter — Store Clerk</strong> (Nov 2021 – 2022)<br />
                Resolved 15+ client technical issues weekly, improved workflow efficiency, 
                trained staff in troubleshooting, and delivered excellent customer service.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-900 dark:to-green-800 p-6 rounded-xl border border-green-500 dark:border-green-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                🎓 Education
              </h3>
              <p className="text-white text-sm leading-relaxed">
                <strong className="text-green-100">Amber HEART Academy:</strong> Data Protection Officer, ASP.NET Development Level 3, 
                Web Design Level 3<br />
                <strong className="text-green-100">HEART College:</strong> Business Administration & Customer Service<br />
                <strong className="text-green-100">iCreate:</strong> Software Development Introduction
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl border border-purple-500 dark:border-purple-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                🚀 Skills
              </h3>
              <p className="text-white text-sm leading-relaxed">
                <strong className="text-purple-100">Languages:</strong> ASP.NET, C#, JavaScript, HTML, CSS<br />
                <strong className="text-purple-100">Databases:</strong> Microsoft SQL Server<br />
                <strong className="text-purple-100">Tools:</strong> GitHub, Visual Studio, VS Code<br />
                <strong className="text-purple-100">Strengths:</strong> UI/UX Design, Debugging, Version Control
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
