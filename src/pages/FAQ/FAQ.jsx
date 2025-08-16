import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
// import usePageTitle from '../../hooks/usePageTitle';
import { usePageTitle } from './../../hooks/usePageTitle';

const FAQ = () => {
  usePageTitle('Frequently Asked Questions', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });

  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started as a worker?",
      answer: "Simply register as a worker, browse available tasks, and start completing them to earn coins. You'll receive 10 free coins when you sign up to get started.",
      category: "workers"
    },
    {
      question: "What payment methods are accepted for purchasing coins?",
      answer: "We accept all major credit cards through our secure Stripe integration. You can purchase coin packages starting from just $1.",
      category: "payments"
    },
    {
      question: "How long does it take to withdraw my earnings?",
      answer: "Withdrawal requests are processed within 24-48 hours by our admin team. You'll receive a notification once your payment is approved.",
      category: "payments"
    },
    {
      question: "Can I switch between worker and buyer roles?",
      answer: "Yes, but you'll need to contact our support team to change your role. Each role has different permissions and features.",
      category: "account"
    },
    {
      question: "What happens if my task submission gets rejected?",
      answer: "If your submission doesn't meet the buyer's requirements, it will be rejected and the task will become available again for other workers to complete.",
      category: "workers"
    },
    {
      question: "How do I ensure my tasks get completed quickly?",
      answer: "Set clear instructions, offer competitive rewards, and make sure your task requirements are reasonable. Popular tasks get completed faster.",
      category: "buyers"
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 mb-4">
            <HelpCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about EarnSphereX. Can't find what you're looking for? 
            <button 
              onClick={() => navigate('/contact')}
              className="ml-1 text-teal-600 hover:text-teal-700 font-medium"
            >
              Contact our support team.
            </button>
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveCategory('workers')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'workers'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Workers
          </button>
          <button
            onClick={() => setActiveCategory('buyers')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'buyers'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Buyers
          </button>
          <button
            onClick={() => setActiveCategory('payments')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'payments'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveCategory('account')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'account'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Account
          </button>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-teal-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default FAQ;