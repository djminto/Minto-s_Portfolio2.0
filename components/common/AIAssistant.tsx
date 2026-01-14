'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faTimes,
  faPaperPlane,
  faVolumeUp,
  faRobot,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function AIAssistant() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const userName = session?.user?.name || null;

  // Fetch user profile photo
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/users/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.profilePhoto) {
              setUserProfilePhoto(data.profilePhoto);
            }
          }
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      }
    };

    if (session) {
      fetchProfilePhoto();
    }
  }, [session]);

  // Quick action buttons
  const quickActions = [
    { label: '📦 View Packages', message: 'What packages do you offer?' },
    { label: '💰 Pricing Info', message: 'How much does it cost?' },
    { label: '🚀 How to Order', message: 'How do I place an order?' },
    { label: '📧 Contact Info', message: 'How can I contact you?' },
    { label: '⭐ View Reviews', message: 'Can I see client reviews?' },
    { label: '💻 Your Skills', message: 'What technologies do you use?' },
  ];

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        text: `Hey ${userName || 'there'}! I'm Daniel's assistant, and I'm here to help you with anything you need. Whether you're looking for info on packages, pricing, or just want to chat about your project ideas, I've got you covered. What can I help you with today?`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen, userName]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-Speech function
  const speak = (text: string) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Remove markdown formatting for speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Send message to AI
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userName: userName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment! 😊",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-2xl transition"
          >
            <FontAwesomeIcon icon={faComment} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                  <img src="/images/Minto's logo.png" alt="Daniel's Assistant" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Daniel's Assistant</h3>
                  <p className="text-blue-100 text-xs">Always here to help!</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 p-1">
                      <img src="/images/Minto's logo.png" alt="Daniel's Assistant" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 ${
                      message.isBot
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.isBot && (
                      <button
                        onClick={() => speak(message.text)}
                        className={`mt-2 text-xs ${
                          isSpeaking
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        } hover:text-blue-600 dark:hover:text-blue-400 transition`}
                      >
                        <FontAwesomeIcon icon={faVolumeUp} className="mr-1" />
                        {isSpeaking ? 'Stop' : 'Listen'}
                      </button>
                    )}
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {userProfilePhoto ? (
                        <img src={userProfilePhoto} alt="You" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                    <img src="/images/Minto's logo.png" alt="Daniel's Assistant" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.message)}
                      className="text-xs px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
