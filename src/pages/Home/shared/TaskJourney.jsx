import React from "react";
import { motion } from "framer-motion";
import {
  FiPlusCircle,
  FiSearch,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiUserCheck,
  FiAward,
} from "react-icons/fi";
import { Link } from "react-router";

const TaskJourney = ({ role }) => {
  let link = "";
  if (role === "buyer") {
    link = "/dashboard/add-task";
  } else if (role === "worker") {
    link = "/dashboard/task-list";
  } else if (role === "admin") {
    link = "/dashboard/manage-tasks";
  } else if (role === "guest") {
    link = "/auth/login";
  }

  const steps = [
    {
      icon: <FiPlusCircle className="w-6 h-6" />,
      title: "Task Posted",
      description: "Buyer creates and publishes a new task",
      color: "bg-blue-500",
      borderColor: "border-blue-500",
    },
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: "Worker Accepts",
      description: "Skilled worker claims the task",
      color: "bg-purple-500",
      borderColor: "border-purple-500",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Work In Progress",
      description: "Worker completes the task requirements",
      color: "bg-amber-500",
      borderColor: "border-amber-500",
    },
    {
      icon: <FiUserCheck className="w-6 h-6" />,
      title: "Submission Review",
      description: "Buyer evaluates the completed work",
      color: "bg-teal-500",
      borderColor: "border-teal-500",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Approval",
      description: "Buyer approves the submission",
      color: "bg-green-500",
      borderColor: "border-green-500",
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: "Payment Released",
      description: "Worker receives coins instantly",
      color: "bg-emerald-500",
      borderColor: "border-emerald-500",
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Reputation Boost",
      description: "Both parties earn trust points",
      color: "bg-indigo-500",
      borderColor: "border-indigo-500",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-30"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The <span className="text-teal-600">EarnSphereX</span> Workflow
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A seamless, transparent process from task creation to payment
            completion
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline bar */}
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-indigo-500 transform -translate-x-1/2"></div>

          {/* Mobile progress bar */}
          <div className="lg:hidden absolute left-1/2 top-0 h-1 w-full bg-gradient-to-r from-teal-400 to-indigo-500 transform -translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-1/2 -top-4 lg:top-1/2 lg:-left-3 w-12 h-12 rounded-full flex items-center justify-center ${step.color} text-white transform -translate-x-1/2 lg:-translate-y-1/2 z-20 shadow-lg border-4 ${step.borderColor} border-opacity-20`}
                >
                  {step.icon}
                </div>

                {/* Content card */}
                <div className="mt-12 lg:mt-0 pt-2 lg:pt-0 lg:px-2">
                  <div
                    className={`lg:absolute lg:top-1/2 lg:left-0 lg:right-0 ${
                      index % 2 === 0
                        ? "lg:transform lg:-translate-y-20"
                        : "lg:transform lg:translate-y-12"
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full ${step.color} mr-2`}
                        ></span>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 md:mt-50"
          >
            <Link to={`${link}`}>
              {role === "guest"
                ? "Start Earning Today"
                : role === "worker"
                ? "Find Tasks Now"
                : role === "admin"
                ? "Manage Tasks"
                : role === "buyer"
                ? "Post a Task"
                : ""}
            </Link>
          </motion.button>
          <p className="text-gray-500 mt-4 text-sm">
            {role === "guest"
              ? "Join thousands of workers and buyers in our trusted platform"
              : role === "worker"
              ? "Find your next task and start earning"
              : role === "admin"
              ? "Manage tasks and oversee the platform"
              : role === "buyer"
              ? "Post a task and find the right worker"
              : ""}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TaskJourney;
