import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import {
  FiLogOut,
  FiUser,
  FiGithub,
  FiHome,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import useUserRole from "../hooks/userUserRole";
import { useState } from "react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { userInfo } = useUserRole();
  const coins = userInfo?.coins || 0;
  const role = userInfo?.role || "user";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1 ${
              isActive ? "text-teal-600 font-medium" : "hover:text-teal-500"
            }`
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          <FiHome className="text-lg" />
          Home
        </NavLink>
      </li>
      <li>
        <a
          href="https://github.com/TaFhiM12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-teal-500"
          onClick={() => setMobileMenuOpen(false)}
        >
          <FiGithub className="text-lg" />
          Join as Developer
        </a>
      </li>
      {user && (
        <li>
          <NavLink
            to={`/dashboard/${role}`}
            className={({ isActive }) =>
              `flex items-center gap-1 ${
                isActive ? "text-teal-600 font-medium" : "hover:text-teal-500"
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiGrid className="text-lg" />
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488", // Teal color
      cancelButtonColor: "#6b7280", // Gray color
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Cancel",
      background: "#ffffff", // White background
      backdrop: `
      rgba(5, 148, 136, 0.1)
    `,
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Logged Out!",
              text: "You have been successfully logged out",
              icon: "success",
              confirmButtonColor: "#0d9488",
              timer: 1500,
              timerProgressBar: true,
              willClose: () => {
                navigate("/auth/login");
                setMobileMenuOpen(false);
              },
            });
          })
          .catch((error) => {
            console.error("Logout error:", error);
            Swal.fire({
              title: "Error!",
              text: error.message || "Failed to log out. Please try again.",
              icon: "error",
              confirmButtonColor: "#dc2626", // Red color
            });
          });
      }
    });
  };

  return (
    <nav className="bg-white shadow-sm px-4 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-600 hover:text-teal-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <Link
              to="/"
              className="relative z-10 flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-extrabold"
            >
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                className="bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-400 bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                EarnSphereX
              </motion.span>
              <Sparkles className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-6">{NavItems}</ul>
        </div>

        {/* Auth Buttons/User Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-full">
                <span className="text-teal-700 font-medium text-sm md:text-base">
                  {role !== "admin" ? `${coins} coins` : "Admin"}
                </span>
              </div>

              <div className="hidden md:block">
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-teal-100"
                  />
                ) : (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                Login
              </Link>
              {!mobileMenuOpen && (
                <Link
                  to="/auth/register"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-b-lg">
          <ul className="px-4 py-3 space-y-3">
            {NavItems}
            {user && (
              <>
                <li className="flex items-center gap-2 px-2 py-1.5 text-gray-700">
                  <span className="font-medium">Coins:</span>
                  <span className="text-teal-600">{coins}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogOut}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-gray-700 hover:text-teal-600"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
