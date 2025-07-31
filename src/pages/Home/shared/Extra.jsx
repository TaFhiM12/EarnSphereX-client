import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router';

const Extra = ({ role }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto text-center"
      >
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-teal-600 uppercase rounded-full bg-teal-50">
            {role === "worker" ? "For Workers" : "For Clients"}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Ready to{" "}
          <span className="relative inline-block">
            <span className="relative z-10">
              {role === "worker" ? "Start Earning?" : "Get Work Done?"}
            </span>
            <span
              className="absolute bottom-0 left-0 w-full h-3 bg-teal-100/70 -z-0"
              style={{ bottom: "5px" }}
            />
          </span>
        </h2>

        <p className="text-sm md:text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join our growing community of{" "}
          {role === "worker" ? "skilled professionals" : "satisfied clients"}{" "}
          who are achieving their goals faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {role === "guest" ? (
              <Link to='/auth/login' className="block w-full h-full">
              "Get Started — It's Free"
              </Link>
            ) : (
              <Link to={`/dashboard/${role}`} className="block w-full h-full">
                Go to Dashboard
              </Link>
            )}
          </motion.button>
        </div>

        {role === "guest" && (
          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Cancel anytime
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default Extra;
