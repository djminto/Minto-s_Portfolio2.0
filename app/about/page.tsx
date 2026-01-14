'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBriefcase, faCode, faAward } from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Junior Web Developer | Spanish Town, St. Catherine JA
            </p>
            <div className="flex justify-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
              <span>📞 (876) 341-6014 | (876) 386-4417</span>
              <span>✉️ Danielminto13@gmail.com</span>
            </div>
          </motion.div>

          {/* Professional Photo & Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-52 h-52 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 blur-xl opacity-70 animate-pulse" aria-hidden="true"></div>
                <img
                  src="/images/daniel-portrait.jpg"
                  alt="Daniel Minto"
                  className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Daniel Minto
              </h2>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Junior Web Developer</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Junior Web Developer with hands-on experience building responsive web applications using 
                ASP.NET, C#, JavaScript, HTML, CSS, and Microsoft SQL Server. Skilled in front-end 
                optimization, debugging, and database integration. Demonstrates strong problem-solving and 
                teamwork abilities, capable of managing independent projects or collaborating effectively 
                in group environments.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Passionate about clean code, user experience, and continuous learning. Seeking opportunities 
                to deliver efficient, scalable solutions that solve real-world problems and exceed client 
                expectations.
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600" />
              Education
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <img src="/images/Amberacademy-logo.png" alt="Amber HEART Academy" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Job Certification: Data Protection Officer
                  </h4>
                  <p className="text-blue-600 font-semibold">Amber HEART Academy</p>
                  <p className="text-gray-600 dark:text-gray-400">Apr – Jul 2024</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/Amberacademy-logo.png" alt="Amber HEART Academy" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Diploma in ASP.NET Development Level 3
                  </h4>
                  <p className="text-blue-600 font-semibold">Amber HEART Academy</p>
                  <p className="text-gray-600 dark:text-gray-400">Oct 2022 – 2023</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/Amberacademy-logo.png" alt="Amber HEART Academy" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Diploma in Web Design Level 3
                  </h4>
                  <p className="text-blue-600 font-semibold">Amber HEART Academy</p>
                  <p className="text-gray-600 dark:text-gray-400">Oct 2022 – 2023</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/HCCS logo.png" alt="HEART College of Construction" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Certificate: Business Administration (Secretarial Skills) Level 2
                  </h4>
                  <p className="text-blue-600 font-semibold">HEART College of Construction (RAP)</p>
                  <p className="text-gray-600 dark:text-gray-400">Nov 2021 – 2022</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/HCCS logo.png" alt="HEART College of Construction" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Certificate: Customer Service Representative (Admin Assistant) Level 2
                  </h4>
                  <p className="text-blue-600 font-semibold">HEART College of Construction (RAP)</p>
                  <p className="text-gray-600 dark:text-gray-400">Nov 2021 – 2022</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/Icreate logo.jpg" alt="iCreate Learning Institution" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Certificate: Code-101 Introduction to Software Development
                  </h4>
                  <p className="text-blue-600 font-semibold">iCreate Learning Institution</p>
                  <p className="text-gray-600 dark:text-gray-400">Aug 2021</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/pcc logo.png" alt="Portmore Community College" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pre-College
                  </h4>
                  <p className="text-blue-600 font-semibold">Portmore Community College</p>
                  <p className="text-gray-600 dark:text-gray-400">Aug 2020 – 2021</p>
                  <p className="text-gray-600 dark:text-gray-400">CSEC: English Language – Grade 3</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img src="/images/EHS logo.jpg" alt="Eltham High School" className="w-16 h-16 object-contain flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Secondary Education
                  </h4>
                  <p className="text-blue-600 font-semibold">Eltham High School</p>
                  <p className="text-gray-600 dark:text-gray-400">Sept 2014 – Jul 2019</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    CSEC: Information Technology 2, Social Studies 3, Agricultural Science 2, English A (City & Guilds, Merit)
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Professional Experience */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faBriefcase} className="text-blue-600" />
              Professional Experience
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Store Clerk
                </h4>
                <p className="text-blue-600 font-semibold">Vision DocuCenter</p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">November 2021 – 2022</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Resolved 15+ client technical issues weekly, including email and computer troubleshooting</li>
                  <li>Improved customer workflow efficiency by providing clear IT support and solutions</li>
                  <li>Trained staff in basic troubleshooting, reducing downtime by 20%</li>
                  <li>Delivered excellent customer service and maintained accurate documentation</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Projects */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faCode} className="text-blue-600" />
              Projects
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Portfolio Website
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Designed and developed a personal portfolio using HTML, CSS and Javascript which allows 
                  users to see my projects and get in touch with me.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  E-Commerce Mockup
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Built a front-end shopping site using HTML, CSS, and JavaScript to demonstrate 
                  responsive design principles and interactive product filtering.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Business Landing Page
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Designed a mobile-friendly landing page for a small business client, enhancing user 
                  engagement and accessibility.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Technical Skills */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faCode} className="text-blue-600" />
              Technical Skills
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Languages & Frameworks</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ ASP.NET</li>
                  <li>✓ C#</li>
                  <li>✓ JavaScript</li>
                  <li>✓ HTML & CSS</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Databases</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Microsoft SQL Server</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tools & Platforms</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ GitHub</li>
                  <li>✓ Visual Studio</li>
                  <li>✓ VS Code</li>
                  <li>✓ Microsoft Office Suite</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Core Strengths</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ UI/UX Design</li>
                  <li>✓ Performance Optimization</li>
                  <li>✓ Debugging</li>
                  <li>✓ Version Control</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Soft Skills</h4>
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
                  Problem-solving
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
                  Adaptability
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
                  Teamwork
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
                  Time Management
                </span>
              </div>
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faAward} className="text-blue-600" />
              Certifications
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Job Readiness</p>
                  <p className="text-gray-600 dark:text-gray-400">HEART Trust NSTA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Data Protection Officer</p>
                  <p className="text-gray-600 dark:text-gray-400">Amber HEART Academy</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">ASP.NET Development</p>
                  <p className="text-gray-600 dark:text-gray-400">Amber HEART Academy</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Web Design</p>
                  <p className="text-gray-600 dark:text-gray-400">Amber HEART Academy</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Additional Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Portfolio</h4>
                <a 
                  href="https://minto-portfolio-website.vercel.app/index.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://minto-portfolio-website.vercel.app/index.html
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">LinkedIn</h4>
                <a 
                  href="https://www.linkedin.com/in/daniel-minto-ba80a9271/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.linkedin.com/in/daniel-minto-ba80a9271/
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Github</h4>
                <a 
                  href="https://github.com/djminto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://github.com/djminto
                </a>
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Let's discuss how I can help bring your vision to life.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/resume"
                className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                View Resume
              </a>
              <a
                href="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
