import React from 'react';
import { Link } from 'react-router';
import { FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Forbidden = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-teal-600 mb-6"
        >
          <FiLock className="mx-auto text-6xl" />
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold text-gray-800 mb-2"
        >
          403
        </motion.h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
        
        <p className="text-gray-500 mb-6">
          You don't have permission to access this page.
          Please contact the administrator if you believe this is a mistake.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-block px-6 py-2 text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-lg transition duration-200 shadow-md"
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Forbidden;