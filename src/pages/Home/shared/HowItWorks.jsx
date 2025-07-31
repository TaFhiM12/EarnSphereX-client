import React from "react";
import { motion } from 'framer-motion';

const HowItWorks = ({role}) => {
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
            How <span className="text-teal-600">EarnSphereX</span> Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: 1,
                color: "bg-teal-500",
                title: "Sign Up",
                description:
                  "Create your account as a Worker or Buyer in just 30 seconds.",
              },
              {
                number: 2,
                color: "bg-emerald-500",
                title: role === "worker" ? "Complete Tasks" : "Post Tasks",
                description:
                  role === "worker"
                    ? "Browse available tasks and submit your work."
                    : "Create tasks and set your budget.",
              },
              {
                number: 3,
                color: "bg-teal-600",
                title: "Get Paid",
                description:
                  role === "worker"
                    ? "Earn coins for approved tasks and withdraw earnings."
                    : "Get quality work done quickly.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4`}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;
