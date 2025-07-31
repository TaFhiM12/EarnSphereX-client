import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Components/Loading';
import { usePageTitle } from '../../hooks/usePageTitle';

const PurchaseCoins = () => {
  usePageTitle('Purchase Coins', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });
  
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const { data : coinPackages=[] , isLoading } = useQuery({
    queryKey: ['coinPackages'],
    queryFn: async () => {
      const response = await axiosSecure.get('/pay');
      return response.data;
    }
  })
  if(isLoading){
    return <Loading/>
  }

  const handlePurchase = async(id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  return (
    <div className=" bg-gray-50 pb-12  px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coinPackages.map((pkg, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`relative rounded-xl overflow-hidden shadow-lg ${pkg.popular ? 'ring-2 ring-emerald-500' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 transform rotate-12 translate-x-2 -translate-y-1">
                  POPULAR
                </div>
              )}
              
              <div className="bg-white p-6 h-full flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.coins.toLocaleString()} Coins
                  </h3>
                  {pkg.bonus && (
                    <p className="text-emerald-500 text-sm font-medium mb-4">
                      {pkg.bonus}
                    </p>
                  )}
                  <div className="flex items-end mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-500 ml-1 mb-1">USD</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {pkg.coins === 10 && 'Perfect for trying out the platform'}
                    {pkg.coins === 150 && 'Great for small tasks and testing'}
                    {pkg.coins === 500 && 'Ideal for regular task creators'}
                    {pkg.coins === 1000 && 'Best value for power users'}
                  </p>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePurchase(pkg._id)}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                  }`}
                >
                  Buy Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        
      </motion.div>
    </div>
  );
};

export default PurchaseCoins;