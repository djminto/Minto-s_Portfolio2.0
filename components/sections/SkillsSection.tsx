'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHtml5,
  faCss3Alt,
  faJs,
  faReact,
  faNode,
  faBootstrap,
  faFigma,
} from '@fortawesome/free-brands-svg-icons';
import { faGears, faServer, faDatabase } from '@fortawesome/free-solid-svg-icons';

const SkillsSection: React.FC = () => {
  const skills = [
    { name: 'HTML', icon: faHtml5, color: '#E34F26' },
    { name: 'CSS', icon: faCss3Alt, color: '#1572B6' },
    { name: 'JavaScript', icon: faJs, color: '#F7DF1E' },
    { name: 'TypeScript', icon: faJs, color: '#3178C6' },
    { name: 'React', icon: faReact, color: '#61DAFB' },
    { name: 'Node.js', icon: faNode, color: '#339933' },
    { name: 'Bootstrap', icon: faBootstrap, color: '#7952B3' },
    { name: 'Tailwind CSS', icon: faGears, color: '#06B6D4' },
    { name: 'ASP.NET Core', icon: faServer, color: '#512BD4' },
    { name: 'MongoDB', icon: faDatabase, color: '#47A248' },
    { name: 'SQL Server', icon: faDatabase, color: '#CC2927' },
    { name: 'Figma', icon: faFigma, color: '#F24E1E' },
    { name: 'Canva', icon: faGears, color: '#00C4CC' },
  ];

  return (
    <section id="skills" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-12"
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 text-center cursor-pointer transform transition-all hover:shadow-2xl hover:border-gray-600"
            >
              <div className="text-6xl mb-4" style={{ color: skill.color }}>
                <FontAwesomeIcon icon={skill.icon} />
              </div>
              <p className="font-semibold text-base text-white">{skill.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Expertise Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Full-Stack Expertise
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            With expertise spanning from front-end frameworks like React and Vue to back-end technologies including Node.js and ASP.NET Core, combined with database proficiency in both SQL and NoSQL systems, I deliver comprehensive, scalable solutions. My skills in responsive design, API development, and modern development practices ensure production-ready applications optimized for performance and user experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
