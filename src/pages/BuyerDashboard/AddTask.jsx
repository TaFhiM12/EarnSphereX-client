import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { PlusCircle, Upload, AlertCircle } from "lucide-react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../Components/Loading";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";

const AddTask = () => {
  usePageTitle("Add New Task", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  // const uploadImage = async (imageFile) => {
  //   const formData = new FormData();
  //   formData.append("image", imageFile);
  //   try {
  //     const response = await axios.post(
  //       `https://api.imgbb.com/1/upload?key=${
  //         import.meta.env.VITE_IMAGE_UPLOAD_KEY
  //       }`,
  //       formData
  //     );
  //     return response.data.data.url;
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     return null;
  //   }
  // };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", `${import.meta.env.VITE_upload_preset}`); 
    formData.append("cloud_name", `${import.meta.env.VITE_cloud_name}`);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloud_name}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    const totalPayable = data.required_workers * data.payable_amount;

    if (totalPayable > userData.coins) {
      Swal.fire({
        title: "Insufficient Coins",
        text: `You need ${totalPayable} but only have ${userData.coins}.`,
        icon: "error",
      });
      navigate("/dashboard/purchase-coins");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (data.task_image[0]) {
        imageUrl = await uploadImage(data.task_image[0]);
      }

      const { task_image, ...restData } = data;
      const taskData = {
        ...restData,
        payable_amount: parseInt(data.payable_amount),
        no_of_completed: 0,
        task_image_url: imageUrl,
        buyer_name: user.displayName,
        created_by: user.email,
        created_at: new Date().toISOString(),
        total_payable: totalPayable,
      };
      const response = await axiosSecure.post("/tasks", taskData);
      Swal.fire({
        title: "Task Created Successfully!",
        text: `Task ID: ${response.data._id}`,
        icon: "success",
      });

      // Deduct coins from user
      await axiosSecure.patch(`/users/${user.email}`, {
        coins: userData.coins - totalPayable,
      });
      await refetch();
      navigate("/dashboard/my-tasks");
    } catch (error) {
      Swal.fire({
        title: "Error Creating Task",
        text: error.response?.data?.message || "Failed to create task",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md "
    >
     

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-emerald-800">
              Task Title
            </span>
          </label>
          <input
            type="text"
            {...register("task_title", { required: "Task title is required" })}
            placeholder="e.g., Watch my YouTube video and comment"
            className="input input-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.task_title && (
            <div className="flex items-center mt-1 text-red-500">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">{errors.task_title.message}</span>
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-emerald-800">
              Task Details
            </span>
          </label>
          <textarea
            {...register("task_detail", {
              required: "Task details are required",
            })}
            rows={4}
            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Detailed description of the task..."
          />
          {errors.task_detail && (
            <div className="flex items-center mt-1 text-red-500">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">{errors.task_detail.message}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Required Workers
              </span>
            </label>
            <input
              type="number"
              {...register("required_workers", {
                required: "Number of workers is required",
                min: {
                  value: 1,
                  message: "Minimum 1 worker required",
                },
                valueAsNumber: true, // This ensures the value is treated as a number
                validate: {
                  isInteger: (v) =>
                    Number.isInteger(v) || "Must be a whole number",
                  positive: (v) => v > 0 || "Must be greater than 0",
                },
              })}
              min="1"
              step="1"
              className="input input-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.required_workers && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm">
                  {errors.required_workers.message}
                </span>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Payable Amount (per worker)
              </span>
            </label>
            <input
              type="number"
              {...register("payable_amount", {
                required: "Payable amount is required",
                min: { value: 1, message: "Minimum amount is 1" },
              })}
              className="input input-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.payable_amount && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm">{errors.payable_amount.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Completion Date
              </span>
            </label>
            <input
              type="date"
              {...register("completion_date", {
                required: "Completion date is required",
                validate: (value) =>
                  new Date(value) > new Date() || "Date must be in the future",
              })}
              className="input input-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.completion_date && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm">
                  {errors.completion_date.message}
                </span>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Submission Info
              </span>
            </label>
            <input
              type="text"
              {...register("submission_info", {
                required: "Submission info is required",
              })}
              placeholder="e.g., Screenshot of comment"
              className="input input-bordered w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.submission_info && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm">
                  {errors.submission_info.message}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-emerald-800">
              Task Image (Optional)
            </span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-emerald-500" />
                <p className="mb-2 text-sm text-emerald-600">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-emerald-500">PNG, JPG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                {...register("task_image")}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-teal-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-teal-800 mb-2">
              Payment Summary
            </h3>
            <p className="text-sm text-teal-700">
              Required Workers: {watch("required_workers") || 0} × Payable
              Amount: {watch("payable_amount") || 0} =
              <span className="font-bold ml-1">
                Total:{" "}
                {(watch("required_workers") || 0) *
                  (watch("payable_amount") || 0)}{" "}
                coins
              </span>
            </p>
            <p
              className={`text-sm mt-1 ${
                (watch("required_workers") || 0) *
                  (watch("payable_amount") || 0) >
                userData?.coins
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              Your balance: {userData?.coins || 0} coins
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary w-full bg-gradient-to-r from-teal-600 to-emerald-600 border-none text-white shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Task
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddTask;
