import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';
import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();
  const is404 = error?.status === 404 || 
                window.location.pathname.includes('invalid-route');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`p-6 text-center ${is404 ? 'bg-gradient-to-r from-teal-500 to-emerald-600' : 'bg-gradient-to-r from-rose-500 to-pink-600'}`}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="inline-block"
          >
            <FiAlertTriangle className="text-white w-16 h-16 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mt-4">
            {is404 ? '404' : 'Error'}
          </h1>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {is404 ? 'Page Not Found' : 'Something Went Wrong'}
          </h2>
          <p className="text-gray-600 mb-6">
            {is404 
              ? "The page you're looking for doesn't exist or has been moved."
              : "We're working to fix the issue. Please try again later."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span onClick={() => window.location.reload()}>Try Again</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              <FiHome className="w-5 h-5" />
              <Link to="/">Go Home</Link>
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-teal-100 opacity-20"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-20 right-20 w-24 h-24 rounded-full bg-pink-100 opacity-20"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
};

export default ErrorPage;