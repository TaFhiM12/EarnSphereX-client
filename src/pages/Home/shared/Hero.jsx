import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCoins, 
  FaTasks, 
  FaUsers, 
  FaArrowRight, 
  FaStar,
  FaCheckCircle,
  FaGlobe
} from 'react-icons/fa';
import useUserRole from './../../../hooks/userUserRole';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Shield,
  Play,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router';

const Hero = () => {
  const { userInfo } = useUserRole();
  const role = userInfo?.role || 'guest';
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, delay: 0.4 }
  };

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Dynamic CTA based on user role
  const getCTAData = () => {
    switch(role) {
      case 'guest':
        return {
          text: "Start Earning Now",
          link: "/auth/register",
          icon: <FaArrowRight className="mr-2" />
        };
      case 'worker':
        return {
          text: "Browse Available Tasks",
          link: "/dashboard/task-list",
          icon: <FaTasks className="mr-2" />
        };
      case 'buyer':
        return {
          text: "Post a New Task",
          link: "/dashboard/add-task",
          icon: <FaTasks className="mr-2" />
        };
      case 'admin':
        return {
          text: "View Dashboard",
          link: "/dashboard/manage-users",
          icon: <FaUsers className="mr-2" />
        };
      default:
        return {
          text: "Get Started",
          link: "/auth/register",
          icon: <FaArrowRight className="mr-2" />
        };
    }
  };

  const ctaData = getCTAData();

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-teal-900 to-blue-900 bg-white overflow-hidden rounded-2xl mt-1">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 text-teal-300 text-2xl"
          animate={floatingAnimation}
        >
          <FaCoins />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/3 text-blue-300 text-3xl"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
        >
          <FaTasks />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/5 text-cyan-300 text-2xl"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
        >
          <Zap />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-teal-300 text-2xl"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
        >
          <Target />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left lg:pr-12">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Micro-Task Revolution
              </span>
            </motion.div>

            <motion.h1 
              className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight"
              {...fadeInUp}
            >
              Earn Money
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Complete Tasks
              </span>
            </motion.h1>

            <motion.p 
              className="text-sm md:text-lg text-teal-200 mb-8 leading-relaxed max-w-2xl"
              {...fadeInLeft}
            >
              {role === 'guest' && "Join thousands of workers and buyers in the ultimate micro-tasking platform. Complete simple tasks, earn real money, or post your own tasks to get work done."}
              {role === 'worker' && "Continue your earning journey! Browse new tasks, submit your work, and grow your income with our platform."}
              {role === 'buyer' && "Get your tasks completed efficiently! Post new tasks, review submissions, and manage your projects all in one place."}
              {role === 'admin' && "Manage the platform efficiently. Monitor users, tasks, and withdrawals to ensure smooth operations."}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              {...fadeInRight}
            >
              <Link 
                to={ctaData.link}
                className="btn btn-primary bg-gradient-to-r from-teal-600 to-blue-600 border-none text-white px-8 py-4 text-sm hover:from-teal-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                {ctaData.icon}
                {ctaData.text}
              </Link>
              <button className="btn btn-outline border-teal-400 text-teal-200 hover:bg-teal-600 hover:border-teal-600 px-8 py-4 text-sm">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-teal-300 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">$500K+</div>
                <div className="text-teal-300 text-sm">Paid Out</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-teal-300 text-sm">Tasks Done</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="flex-1 mt-12 lg:mt-0">
            <motion.div 
              className="relative max-w-lg mx-auto"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              
              {/* Main Feature Card */}
              <div className="card bg-white/10 backdrop-blur-lg border border-white/20 p-8 mb-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-teal-500/20 rounded-full mr-4">
                    <FaCoins className="text-2xl text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Instant Earnings</h3>
                    <p className="text-teal-200 text-sm">Get paid for every completed task</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-teal-300">Average Task</span>
                  <span className="text-xl font-bold text-white">$5-$50</span>
                </div>
              </div>

              {/* Secondary Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="card bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-500/20 rounded-full mb-3">
                      <Shield className="text-xl text-blue-300" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Secure Platform</h4>
                    <p className="text-teal-200 text-sm">Protected payments & data</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="card bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-cyan-500/20 rounded-full mb-3">
                      <TrendingUp className="text-xl text-cyan-300" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Growth Focused</h4>
                    <p className="text-teal-200 text-sm">Build your earning potential</p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Achievement Badge */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaStar className="inline mr-1" />
                Top Rated
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-teal-200">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2 text-green-400" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center">
              <FaGlobe className="mr-2 text-blue-400" />
              <span>Global Community</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="mr-2 text-yellow-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronRight className="w-6 h-6 text-teal-300 rotate-90" />
      </motion.div>
    </div>
  );
};

export default Hero;