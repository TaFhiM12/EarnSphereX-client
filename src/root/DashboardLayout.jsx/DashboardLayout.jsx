import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router";
import {
  FiPlus,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiBell,
  FiLogOut,
  FiPieChart,
  FiX,
  FiCheckCircle,
  FiCheckSquare,
  FiUsers,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useUserRole from "./../../hooks/userUserRole";
import Loading from "../../Components/Loading";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ClipboardCheck,
  Coins,
  List,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import NotificationPopup from "../../components/NotificationPopup";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isLoading, refetch } = useUserRole();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading: isNotificationLoading,
    isOpen: isNotificationOpen,
    toggleNotifications,
    closeNotifications,
  } = useNotifications(user?.email);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationButton = document.querySelector(".notification-button");
      const popup = document.querySelector(".notification-popup");

      if (
        isNotificationOpen &&
        notificationButton &&
        popup &&
        !notificationButton.contains(event.target) &&
        !popup.contains(event.target)
      ) {
        closeNotifications();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, closeNotifications]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return <Loading />;
  }
  refetch();
  const role = userInfo?.role || "guest";
  const userCoins = userInfo?.coins || 0;

  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleLogout = () => {
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
            // Show success message
            Swal.fire({
              title: "Logged Out!",
              text: "You have been successfully logged out",
              icon: "success",
              confirmButtonColor: "#0d9488",
              timer: 1500,
              timerProgressBar: true,
              willClose: () => {
                navigate("/auth/login");
              },
            });
          })
          .catch((error) => {
            console.error("Logout error:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to log out. Please try again.",
              icon: "error",
              confirmButtonColor: "#dc2626", // Red color
            });
          });
      }
    });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <FiPieChart className="w-5 h-5" />,
      path: `/dashboard/${role}`,
      badge: null,
    },
  ];

  if (!isLoading && role === "buyer") {
    menuItems.push(
      {
        id: "tasks",
        name: "Tasks",
        icon: <ClipboardCheck className="w-5 h-5" />,
        hasDropdown: true,
        badge: null,
        children: [
          {
            name: "Add New Task",
            path: "/dashboard/add-task",
            icon: <Rocket className="w-4 h-4 mr-2" />,
          },
          {
            name: "My Tasks",
            path: "/dashboard/my-tasks",
            icon: <FiList className="w-4 h-4 mr-2" />,
          },
          {
            name: "Tasks to Review",
            path: "/dashboard/tasks-to-review",
            icon: <FiCheckCircle className="w-4 h-4 mr-2" />,
          },
        ],
      },
      // {
      //   id: "tracking",
      //   name: "Track Tasks",
      //   icon: <ShieldCheck className="w-5 h-5" />,
      //   path: "/dashboard/track",
      //   badge: null,
      // },
      {
        id: "payment",
        name: "Payment History",
        path: "/dashboard/payment-history",
        icon: <TrendingUp className="w-4 h-4 mr-2" />,
      },
      {
        id: "purchase-coins",
        name: "Purchase Coins",
        icon: <Coins className="w-5 h-5" />,
        path: "/dashboard/purchase-coins",
      }
    );
  }
  if (!isLoading && role === "worker") {
    menuItems.push(
      {
        id: "task-list",
        name: "Task List",
        icon: <List className="w-5 h-5" />,
        path: "/dashboard/task-list",
      },
      {
        id: "approved-task",
        name: "Approved Task",
        icon: <CheckCircle className="w-5 h-5" />,
        path: "/dashboard/approved-task",
      },
      {
        id: "my-submission",
        name: "My Submission",
        icon: <Upload className="w-5 h-5" />,
        path: "/dashboard/my-submission",
      },
      {
        id: "withdrawals",
        name: "Withdrawals",
        icon: <Wallet className="w-5 h-5" />,
        path: "/dashboard/withdrawals",
      }
    );
  }

  // password: admin => Admin123@@

  if (!isLoading && role === "admin") {
    menuItems.push(
      {
        id: "manage-tasks",
        name: "Manage Tasks",
        icon: <FiCheckSquare className="w-5 h-5" />,
        path: "/dashboard/manage-tasks",
      },
      {
        id: "manage-users",
        name: "Manage Users",
        icon: <FiUsers className="w-5 h-5" />,
        path: "/dashboard/manage-users",
      },
      {
        id: "withdraw-requests",
        name: "Withdraw Requests",
        icon: <FiPieChart className="w-5 h-5" />,
        path: "/dashboard/withdraw-requests",
      }
    );
  }

  const getPageTitle = () => {
    if (location.pathname === `/dashboard/${role}` && role === "admin")
      return "Admin Dashboard";
    if (location.pathname === `/dashboard/${role}` && role === "buyer")
      return "Buyer Dashboard";
    if (location.pathname === `/dashboard/${role}` && role === "worker")
      return "Worker Dashboard";
    if (location.pathname === "/dashboard/add-task") return "Add New Task";
    if (location.pathname === "/dashboard/my-tasks") return "My Tasks";
    if (location.pathname === "/dashboard/tasks-to-review")
      return "Tasks to Review";
    if (location.pathname === "/dashboard/payment-history")
      return "Payment History";
    if (location.pathname === "/dashboard/track") return "Track Tasks";
    if (location.pathname === "/dashboard/purchase-coins")
      return "Purchase Coins";
    if (location.pathname === "/dashboard/task-list") return "Task List";
    if (location.pathname === "/dashboard/approved-task")
      return "Approved Task";
    if (location.pathname === "/dashboard/my-submission")
      return "My Submission";
    if (location.pathname === "/dashboard/withdrawals") return "Withdrawals";
    if (location.pathname === "/dashboard/manage-tasks") return "Manage Tasks";
    if (location.pathname === "/dashboard/manage-users") return "Manage Users";
    if (location.pathname === "/dashboard/withdraw-requests")
      return "Withdraw Requests";
    if (location.pathname.startsWith("/dashboard/task-details/")) {
      return "Task Details";
    }
    if (location.pathname === `/dashboard/profile`)
      return `${user?.displayName}'s Profile`;
    return "Dashboard";
  };

  const getPageDescription = () => {
    if (location.pathname === "/dashboard/add-task")
      return "Create a new task for workers to complete";
    if (location.pathname === "/dashboard/my-tasks")
      return "View and manage all your created tasks";
    if (location.pathname === "/dashboard/tasks-to-review")
      return "Check worker submissions waiting for approval";
    if (location.pathname === "/dashboard/payment-history")
      return "All your transaction records in one place";

    if (location.pathname === "/dashboard/purchase-coins")
      return "Buy more coins to create new tasks";
    if (location.pathname === "/dashboard/task-list")
      return "View and manage your tasks";
    if (location.pathname === "/dashboard/approved-task")
      return "See your approved work";
    if (location.pathname === "/dashboard/my-submission")
      return " Check your submitted work";
    if (location.pathname.startsWith("/dashboard/task-details/"))
      return "View full task information";
    if (location.pathname === "/dashboard/withdrawals")
      return " Get paid for completed tasks";
    if (location.pathname === "/dashboard/manage-tasks")
      return "Manage all tasks created by buyers";
    if (location.pathname === "/dashboard/manage-users")
      return "Manage all users and their roles";
    if (location.pathname === "/dashboard/withdraw-requests")
      return "Review and process withdrawal requests";
    if (location.pathname === "/dashboard/worker" && role === "worker")
      return "Your tasks, earnings, and submissions at a glance.";
    if (location.pathname === "/dashboard/buyer" && role === "buyer")
      return "Manage tasks, track progress, and review submissions.";
    if (location.pathname === "/dashboard/admin" && role === "admin")
      return "Monitor users, tasks, and payments in one place.";
    return "Dashboard Overview";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 h-22">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <Link
                  to="/"
                  className="relative z-10 flex items-center gap-2 text-2xl font-extrabold"
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

                  <motion.span
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ rotate: [0, 15, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    className="text-emerald-400"
                  >
                    <Sparkles size={24} />
                  </motion.span>
                </Link>

                <div className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-teal-600/20 to-emerald-600/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMenu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                      location.pathname.startsWith(item.path)
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${
                          location.pathname.startsWith(item.path)
                            ? "text-teal-600"
                            : "text-gray-500 group-hover:text-teal-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!isSidebarCollapsed &&
                      (activeDropdown === item.id ? (
                        <FiChevronUp className="w-4 h-4 transition-transform" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 transition-transform" />
                      ))}
                  </button>

                  {!isSidebarCollapsed && activeDropdown === item.id && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child, index) => (
                        <NavLink
                          key={index}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-teal-100 text-teal-700 font-medium border-r-2 border-teal-500"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`
                          }
                        >
                          {child.icon}
                          <span className="ml-2">{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors group w-full text-left ${
                      isActive
                        ? "bg-teal-50 text-teal-700 border-r-4 border-teal-500"
                        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`${
                          isActive
                            ? "text-teal-600"
                            : "text-gray-500 group-hover:text-teal-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSidebarCollapsed ? "mx-auto" : ""
              }`}
            >
              {user?.photoURL ? (
                <Link to="/dashboard/profile">
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <>
                <Link to="/dashboard/profile" >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-600 truncate capitalize">
                      {role}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-md hover:bg-gray-100"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4 text-gray-500 hover:text-teal-600" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileSidebar}
          />
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <NavLink
                  to="/"
                  className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"
                >
                  EarnSphereX
                </NavLink>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                          location.pathname.startsWith(item.path)
                            ? "bg-teal-50 text-teal-700"
                            : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`${
                              location.pathname.startsWith(item.path)
                                ? "text-teal-600"
                                : "text-gray-500 group-hover:text-teal-500"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {activeDropdown === item.id ? (
                          <FiChevronUp className="w-4 h-4 transition-transform" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 transition-transform" />
                        )}
                      </button>

                      {activeDropdown === item.id && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.children.map((child, index) => (
                            <NavLink
                              key={index}
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                  isActive
                                    ? "bg-teal-100 text-teal-700 font-medium border-r-2 border-teal-500"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                }`
                              }
                            >
                              {child.icon}
                              <span className="ml-2">{child.name}</span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-colors group w-full text-left ${
                          isActive
                            ? "bg-teal-50 text-teal-700 border-r-4 border-teal-500"
                            : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`${
                              isActive
                                ? "text-teal-600"
                                : "text-gray-500 group-hover:text-teal-500"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                      {user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <Link to="/dashboard/profile">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-600 truncate capitalize">
                      {role}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-md hover:bg-gray-100"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4 text-gray-500 hover:text-teal-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Fixed Top Bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleMobileSidebar}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-emerald-800">
                  {getPageTitle()}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {getPageDescription()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-teal-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                <span className="text-teal-700 font-medium text-sm sm:text-base">
                  {role !== "admin" ? `${userCoins} coins` : "Admin"}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  {role === "buyer" ? "B" : role === "worker" ? "W" : "A"}
                </div>
              </div>

              <button
                onClick={toggleNotifications}
                className="notification-button relative p-1 sm:p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full"
              >
                <FiBell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {role === "buyer" && (
                <NavLink
                  to="/dashboard/add-task"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Add</span>
                </NavLink>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between sm:hidden">
            <div className="flex items-center gap-2 bg-teal-50 px-3 py-1 rounded-full">
              <span className="text-teal-700 font-medium text-sm">
                {userCoins || 0} coins
              </span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                {role === "buyer" ? "B" : "W"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      {showScrollButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
          aria-label="Scroll to top"
        >
          <FiChevronUp className="w-5 h-5" />
        </motion.button>
      )}
      <NotificationPopup
        className="notification-popup"
        notifications={notifications}
        unreadCount={unreadCount}
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        isLoading={isNotificationLoading}
      />
    </div>
  );
};

export default DashboardLayout;
