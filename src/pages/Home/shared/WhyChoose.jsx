import React from "react";
import { motion } from 'framer-motion';

const WhyChoose = () => {
  return (
    <div>
      <section className="py-16 px-2 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose <span className="text-teal-600">EarnSphereX</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "⚡",
                title: "Fast Payments",
                desc: "Get paid instantly upon task approval",
              },
              {
                icon: "🛡️",
                title: "Secure Platform",
                desc: "Encrypted transactions and data protection",
              },
              {
                icon: "📈",
                title: "Growth Opportunities",
                desc: "Build your portfolio and reputation",
              },
              {
                icon: "🌐",
                title: "Global Community",
                desc: "Connect with buyers and workers worldwide",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default WhyChoose;
