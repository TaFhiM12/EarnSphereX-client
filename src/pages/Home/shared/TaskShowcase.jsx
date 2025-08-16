import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiDollarSign, FiUsers, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router";
import Loading from "../../../Components/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TaskShowcase = ({ role }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const axiosSecure = useAxiosSecure();

  const { data: trendingTasks = [], isLoading } = useQuery({
    queryKey: ["trending-task"],
    queryFn: async () => {
      const res = await axiosSecure.get("/trendingTask");
      return res.data
        .sort((a, b) => b.payable_amount - a.payable_amount)
        .slice(0, 4)
        .map((task) => ({
          ...task,
          id: task._id,
          reward: task.payable_amount,
          workersNeeded: task.required_workers - (task.no_of_completed || 0),
          timeLeft: getTimeRemaining(task.completion_date),
          category: getCategoryFromTask(task.task_title),
        }));
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  function getTimeRemaining(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? "s" : ""} remaining`;
  }

  function getCategoryFromTask(title) {
    if (/image|photo|picture/i.test(title)) return "Images";
    if (/video|youtube/i.test(title)) return "Video";
    if (/survey|research/i.test(title)) return "Research";
    if (/app|software/i.test(title)) return "Tech";
    if (/write|content|blog/i.test(title)) return "Writing";
    return "General";
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Highest Paying Tasks
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Top earning opportunities with the best rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingTasks.map((task) => (
            <motion.div
              key={task._id}
              className="relative h-64 perspective-1000"
              onHoverStart={() => setHoveredCard(task._id)}
              onHoverEnd={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Front of Card */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl p-6 shadow-md flex flex-col justify-between backface-hidden ${
                  hoveredCard === task._id
                    ? "rotate-y-180 opacity-0"
                    : "rotate-y-0 opacity-100"
                }`}
                animate={{
                  rotateY: hoveredCard === task._id ? 180 : 0,
                  opacity: hoveredCard === task._id ? 0 : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-full">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-600 text-white rounded-full mb-3">
                    {task.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {task.task_title}
                  </h3>
                  <p className="text-gray-700 line-clamp-3 text-sm">
                    {task.task_detail}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-emerald-700 font-medium">
                        <FiDollarSign className="mr-1" />
                        {task.payable_amount} coins
                      </div>
                      <FiArrowRight className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Back of Card */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl p-6 shadow-lg flex flex-col justify-between backface-hidden text-white ${
                  hoveredCard === task._id
                    ? "rotate-y-0 opacity-100"
                    : "rotate-y-180 opacity-0"
                }`}
                animate={{
                  rotateY: hoveredCard === task._id ? 0 : 180,
                  opacity: hoveredCard === task._id ? 1 : 0,
                }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2">
                    {task.task_title}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2" />
                      <span>{task.payable_amount} coins per completion</span>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-2" />
                      <span>
                        {task.workersNeeded > 0 ? task.workersNeeded : "No"}{" "}
                        more workers needed
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      <span>{task.timeLeft}</span>
                    </div>
                    {task.task_image_url && (
                      <div className="pt-2">
                        <div className="w-full h-20 bg-teal-700 rounded-md overflow-hidden">
                          <img
                            src={task.task_image_url}
                            alt="Task preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {role === "worker" && (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/task-details/${task._id}`)
                    }
                    className="x-3 py-1.5 mt-2 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    View Details
                  </button>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          {role === "worker" && (
            <motion.button
              onClick={() => navigate("/dashboard/task-list")}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-8  py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-center items-center">
                <span>View All Available Tasks</span>
                <FiArrowRight className="ml-2" />
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TaskShowcase;
