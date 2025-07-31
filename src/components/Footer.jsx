import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Zap, Sparkles, Linkedin, Github, Facebook, ArrowRight } from "lucide-react";
import useUserRole from "../hooks/userUserRole";

const Footer = () => {
  const { userInfo } = useUserRole();
  const role = userInfo?.role || "guest";

  // Role-based quick links
  const getQuickLinks = () => {
    switch (role) {
      case "worker":
        return [
          { label: "Task List", url: "/dashboard/task-list" },
          { label: "My Submissions", url: "/dashboard/my-submission" },
          { label: "Approved Tasks", url: "/dashboard/approved-task" },
          { label: "Withdrawals", url: "/dashboard/withdrawals" },
        ];
      case "buyer":
        return [
          { label: "My Tasks", url: "/dashboard/my-tasks" },
          { label: "Add Task", url: "/dashboard/add-task" },
          { label: "Tasks to Review", url: "/dashboard/tasks-to-review" },
          { label: "Payment History", url: "/dashboard/payment-history" },
        ];
      case "admin":
        return [
          { label: "Manage Tasks", url: "/dashboard/manage-tasks" },
          { label: "Manage Users", url: "/dashboard/manage-users" },
          { label: "Withdraw Requests", url: "/dashboard/withdraw-requests" },
        ];
      default: // guest
        return [
          { label: "Home", url: "/" },
          { label: "Features", url: "/#features" },
        ];
    }
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-200 pt-16 pb-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Decorative gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-600 rounded-full opacity-8 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-600 rounded-full opacity-8 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link to="/" className="inline-block">
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500 bg-[length:200%_auto] bg-clip-text text-transparent text-3xl font-bold flex items-center gap-2 mb-3"
                >
                  EarnSphereX
                  <Sparkles size={24} className="text-emerald-400" />
                </motion.span>
              </Link>
              
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                Earn Smart, Work Smart – Your premium micro-task platform connecting skilled professionals with meaningful opportunities worldwide.
              </p>
            </motion.div>

            {/* Developer CTA */}
            <motion.div
              whileHover={{ x: 4 }}
              className="inline-block"
            >
              <a
                href="https://github.com/TaFhiM12"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-all duration-300 px-4 py-2 border border-slate-700 hover:border-emerald-500/50 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm group"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">Join as Developer</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1">
            <h3 className="text-emerald-400 text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Access
            </h3>
            <div className="space-y-3">
              {getQuickLinks().map((link, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="group"
                >
                  <Link
                    to={link.url}
                    className="flex items-center gap-3 text-slate-400 hover:text-teal-400 transition-colors duration-200 py-1"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="lg:col-span-1">
            <h3 className="text-emerald-400 text-lg font-semibold mb-6">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Follow our journey and stay updated with the latest features and opportunities.
              </p>
              
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: <Linkedin className="w-5 h-5" />,
                    url: "https://www.linkedin.com/in/tanvir-mahtab-tafhim",
                    label: "LinkedIn"
                  },
                  {
                    icon: <Github className="w-5 h-5" />,
                    url: "https://github.com/TaFhiM12",
                    label: "GitHub"
                  },
                  {
                    icon: <Facebook className="w-5 h-5" />,
                    url: "https://www.facebook.com/tafhim4748",
                    label: "Facebook"
                  },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-emerald-400 transition-all duration-300 bg-slate-800/50 hover:bg-slate-800/80 rounded-lg border border-slate-700/50 hover:border-emerald-500/50 backdrop-blur-sm"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} EarnSphereX. All rights reserved.
            </div>
            
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;