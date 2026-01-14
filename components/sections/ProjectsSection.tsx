'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ProjectCardProps {
  name: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  technologies,
  imageUrl,
  liveUrl,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-gradient-to-br ${
        index === 0 ? 'from-gray-800 to-gray-900' : 
        index === 1 ? 'from-blue-900 to-indigo-900' : 
        'from-purple-900 to-pink-900'
      } rounded-2xl overflow-hidden shadow-2xl`}
    >
      <div className={`grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
        {/* Laptop Mockup with MacBook frame */}
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className="relative">
            {/* MacBook Frame as background */}
            <div className="relative">
              <img 
                src="/images/macbook.webp" 
                alt="MacBook Frame" 
                className="w-full h-auto"
              />
              
              {/* Screen content overlay - positioned to fit within the MacBook screen */}
              <div className="absolute top-[3.5%] left-[13%] w-[74%] h-[75%] overflow-hidden rounded-t-md bg-black">
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <motion.iframe
                      key="iframe"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={liveUrl}
                      className="w-full h-full border-0"
                      title={name}
                      style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                    />
                  ) : (
                    <motion.img
                      key="image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Hover Indicator */}
          {!isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-gray-900 font-semibold shadow-lg">
                Hover to preview live site
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Project Info */}
        <div className={`text-white ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-blue-400 font-semibold mb-2">Next.js Website</p>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">{name}</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-3 mb-8">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* View Live Button */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all hover:scale-105 group"
            >
              <span>View Live</span>
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection: React.FC = () => {
  const projects = [
    {
      name: 'Zoe Accessories',
      description: 'A beautiful e-commerce platform for fashion accessories with modern UI and smooth shopping experience.',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Stripe'],
      imageUrl: '/images/Zoie\'s Accessories.png',
      liveUrl: 'https://zoes-accessories1.vercel.app/',
    },
    {
      name: 'The Giver Foundation',
      description: 'A nonprofit website showcasing charitable initiatives and impact stories with community engagement features.',
      technologies: ['Next.js', 'MongoDB', 'Tailwind CSS'],
      imageUrl: '/images/TheGiverfoundationsite.png',
      liveUrl: 'https://giver-foundation-site1.vercel.app/index.html',
    },
    {
      name: 'Gentlecare Ambulance Services',
      description: 'Emergency medical services platform with appointment booking and real-time tracking capabilities.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      imageUrl: '/images/Gentlecare Ambulance service.png',
      liveUrl: 'https://gentlecareambulance-services1.vercel.app/index.html',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
        >
          Featured Projects
        </motion.h2>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              technologies={project.technologies}
              imageUrl={project.imageUrl}
              liveUrl={project.liveUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
