import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";
import { usePageTitle } from "../../hooks/usePageTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AuthPage = () => {
  const { id } = useParams();
  const [isLogin, setIsLogin] = useState(id === "login");
  const [profilePic, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // const from = location.state?.from?.pathname || "/dashboard";

  usePageTitle(isLogin ? "Login" : "Register", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "worker",
    },
  });

  useEffect(() => {
    reset();
  }, [isLogin, reset]);

  const {
    signInUser,
    signInWithGoogle,
    createUser,
    updateProfileUser,
    setUser,
    setLoading: setAuthLoading,
  } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxiosSecure();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setProfile("");
  };

  // const handleImageUpload = async (e) => {
  //   const image = e.target.files[0];
  //   if (!image) return;

  //   setLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", image);
  //     formData.append('upload preset' , 'MyImages');
  //     formData.append('cloud_name' , 'dpqzx4wqk');
  //     const { data } = await axios.post("https://api.cloudinary.com/v1_1/dpqzx4wqk/image/upload" , formData);
  //     // const response = await axios.post(
  //     //   `https://api.imgbb.com/1/upload?key=${
  //     //     import.meta.env.VITE_IMAGE_UPLOAD_KEY
  //     //   }`,
  //     //   formData
  //     // );
  //     setProfile(data.secure_url);
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Image Upload Failed",
  //       text: error.message,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // admin pass : Admin1234

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", `${import.meta.env.VITE_upload_preset}`);
      formData.append("cloud_name", `${import.meta.env.VITE_cloud_name}`);

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloud_name}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(data.secure_url);
    } catch (error) {
      Swal.fire({
        title: "Image Upload Failed",
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
      console.error("Upload error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInUser(data.email, data.password);
        const res = await axiosInstance.get(`/users/role/${data.email}`);
        navigate(`/dashboard/${res.data.role}`, { replace: true });
        Swal.fire({
          title: "Login Successful",
          text: "You have successfully logged in.",
          icon: "success",   
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        const userCredential = await createUser(data.email, data.password);

        await updateProfileUser({
          displayName: data.name,
          photoURL: profilePic,
        });

        const userInfo = {
          email: data.email,
          role: data.role,
          name: data.name,
          photoURL: profilePic,
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
          coins: data.role === "worker" ? 10 : 50,
        };

        await axiosInstance.post("/users", userInfo);

        setUser({
          ...userCredential.user,
          displayName: data.name,
          photoURL: profilePic,
        });
        navigate(`/dashboard/${data.role}`, { replace: true });
        Swal.fire({
          title: "Registration Successful",
          text: "You have successfully registered.",
          icon: "success",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: isLogin ? "Login Failed" : "Registration Failed",
        text: error.message,
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await signInWithGoogle();
  //     const info = result.user;

  //     const userInfo = {
  //       email: info.email,
  //       role: "worker",
  //       name: info.displayName || "User",
  //       photoURL:
  //         info.photoURL || "https://i.ibb.co/4Y8xJyD/default-avatar.png",
  //       created_at: new Date().toISOString(),
  //       last_log_in: new Date().toISOString(),
  //       coins: 10,
  //     };

  //     await axiosInstance.post("/users", userInfo);
  //     navigate(`/dashboard/${userInfo.role}`, { replace: true });

  //     Swal.fire({
  //       title: "Login Successful",
  //       text: "You have successfully logged in with Google.",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Login Failed",
  //       text: error.message,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const info = result.user;

      const userInfo = {
        email: info.email,
        role: "worker",
        name: info.displayName || "User",
        photoURL:
          info.photoURL || "https://i.ibb.co/4Y8xJyD/default-avatar.png",
        last_log_in: new Date().toISOString(),
        coins: 10, // Initial coins for new users
      };

      try {
        await axiosInstance.post("/users", {
          ...userInfo,
          created_at: new Date().toISOString(), 
        });
      } catch (error) {
        if (error.response?.status === 409) {
          await axiosInstance.patch(`/users/${userInfo.email}`, {
            last_log_in: new Date().toISOString(),
          });
        } else {
          throw error; // Re-throw other errors
        }
      }

      navigate(`/dashboard/${userInfo.role}`, { replace: true });

      Swal.fire({
        title: "Login Successful",
        text: "You have successfully logged in with Google.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block w-1/2 max-h-screen z-10 sticky top-0">
        <div className="h-full bg-gradient-to-br from-teal-600 via-emerald-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8 backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl max-w-md mx-auto">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back!" : "Join EarnSphereX"}
              </h2>
              <button
                onClick={toggleAuthMode}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {isLogin ? "✨ Create New Account" : "🚀 Sign In Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-20 flex items-center justify-center relative z-10">
        <div className="absolute top-4 right-4">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex justify-center">
            <button
              onClick={toggleAuthMode}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-600 transition-all duration-300"
            >
              {isLogin ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:bg-white transition-all duration-300 text-gray-700"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:bg-white transition-all duration-300 text-gray-700"
                  />
                  {profilePic && (
                    <img
                      src={profilePic}
                      alt="Preview"
                      className="mt-2 w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:bg-white transition-all duration-300 text-gray-700"
                  >
                    <option value="worker">Worker</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:bg-white transition-all duration-300 text-gray-700"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:bg-white transition-all duration-300 text-gray-700"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-300"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 font-medium">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
