import React from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaCrown, FaMedal } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiTrendingUp } from 'react-icons/fi';

const BestWorker = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  const { data: bestWorkers = [], isLoading, isError } = useQuery({
    queryKey: ['best-worker'],
    queryFn: async () => {
      const res = await axiosSecure.get('/best-worker');
      return res.data.slice(0, 6); // Get top 6 workers
    }
  });

  if (isLoading) return <div className="text-center py-12">Loading top workers...</div>;
  
  if (isError) return <div className="text-center py-12 text-red-500">Error loading top workers</div>;
  
  if (!bestWorkers || bestWorkers.length === 0) {
    return <div className="text-center py-12 text-gray-500">No top workers data available</div>;
  }

  return (
    <div className="py-16 px-2 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-teal-600">Top Workers</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These dedicated professionals have earned the most coins by completing tasks with excellence.
          </p>
        </motion.div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestWorkers.map((worker, index) => {
            // Safely handle earnings data
            const earnings = worker.earnings || 0;
            const formattedEarnings = typeof earnings === 'number' 
              ? earnings.toFixed(2) 
              : '0.00';

            return (
              <motion.div
                key={worker._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img 
                      src={worker.photoURL || 'https://i.ibb.co/qM7xWkkZ/admin.jpg'} 
                      alt={worker.name || 'Worker'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
                    />
                    {index < 3 && (
                      <div className={`absolute -top-2 -right-2 rounded-full p-1 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                        {index === 0 ? (
                          <FaCrown className="text-white text-xs" />
                        ) : (
                          <FaMedal className="text-white text-xs" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {worker.name || 'Anonymous Worker'}
                    </h3>
                    <div className="flex items-center mt-1">
                      <FaCoins className="text-yellow-500 mr-2" />
                      <span className="text-yellow-600 font-medium">
                        {worker.coins || 0} coins
                      </span>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-teal-600">
                        {index === 0 ? 'Top Earner' : index === 1 ? 'Runner Up' : index === 2 ? 'Third Place' : 'Skilled Worker'}
                      </span>
                      <div className="bg-teal-50 rounded-lg p-2 text-center">
                        <FiTrendingUp className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                        <p className="text-xs text-teal-600">Earnings</p>
                        <p className="text-teal-800 font-bold">${formattedEarnings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        {user?.role === 'buyer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Want to hire these top performers?</p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg transition-all font-medium">
              Post a Task Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BestWorker;