import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DollarSign, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal  from 'sweetalert2';
import { usePageTitle } from "../../hooks/usePageTitle";

const WithDrawals = () => {

  usePageTitle("Withdraw Earnings", {
    suffix: " | EarnSphereX",
    maxLength: 60
  });

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [insufficient, setInsufficient] = useState(false);

  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Calculate withdrawal amount
  const coins = watch("withdrawal_coin") || 0;
  const dollarAmount = (coins / 20).toFixed(2);

  // Handle coin input change
  const handleCoinChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > userData?.coins) {
      setInsufficient(true);
    } else {
      setInsufficient(false);
    }
    setValue("withdrawal_coin", value);
    setValue("withdraw_amount", (value / 20).toFixed(2));
  };

  // Create withdrawal mutation
  const { mutate: createWithdrawal, isPending } = useMutation({
    mutationFn: async (data) => {
      const withdrawalData = {
        worker_email: user.email,
        worker_name: user.displayName,
        withdrawal_coin: parseInt(data.withdrawal_coin),
        withdraw_amount: parseFloat(data.withdraw_amount),
        payment_system: data.payment_system,
        account_number: data.account_number,
        withdrawal_request_status: "pending",
      };
      const res = await axiosSecure.post("/withdrawals", withdrawalData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Withdrawal request submitted successfully!",
        icon: "success",
        confirmButtonColor: '#0d9488',
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Error submitting withdrawal request",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    },
  });

  const onSubmit = (data) => {
    createWithdrawal(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 pb-8"
    >
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-teal-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Balance
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Coins:</span>
              <span className="font-bold text-emerald-600">
                {userData?.coins || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Withdrawable Amount:</span>
              <span className="font-bold text-teal-600">
                ${((userData?.coins || 0) / 20).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <p className="text-sm text-teal-700">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Minimum withdrawal: 200 coins (10$)
            </p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-teal-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Withdrawal Request
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Coins to Withdraw
                </span>
              </label>
              <input
                type="number"
                {...register("withdrawal_coin", {
                  required: "Coin amount is required",
                  min: { value: 200, message: "Minimum 200 coins required" },
                  max: {
                    value: userData?.coins,
                    message: "Cannot exceed your balance",
                  },
                })}
                onChange={handleCoinChange}
                className="input input-bordered w-full focus:ring-2 focus:ring-teal-500"
                placeholder="Enter coin amount"
              />
              {errors.withdrawal_coin && (
                <div className="flex items-center mt-1 text-red-500">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">
                    {errors.withdrawal_coin.message}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Withdrawal Amount ($)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("withdraw_amount")}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                  value={dollarAmount}
                />
                <div className="absolute right-3 top-3 text-gray-500">
                  = {dollarAmount}$
                </div>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <ArrowRight className="w-4 h-4 mr-1" />
                20 coins = 1$
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Payment System
                </span>
              </label>
              <select
                {...register("payment_system", {
                  required: "Payment system is required",
                })}
                className="select select-bordered w-full focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select payment method</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
                <option value="Other">Other</option>
              </select>
              {errors.payment_system && (
                <div className="flex items-center mt-1 text-red-500">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">
                    {errors.payment_system.message}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Account Number
                </span>
              </label>
              <input
                type="text"
                {...register("account_number", {
                  required: "Account number is required",
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your account number"
              />
              {errors.account_number && (
                <div className="flex items-center mt-1 text-red-500">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">
                    {errors.account_number.message}
                  </span>
                </div>
              )}
            </div>

            {insufficient || (userData?.coins || 0) < 200 ? (
              <div className="p-4 bg-red-50 rounded-lg text-red-600">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                {insufficient
                  ? "Amount exceeds your balance"
                  : "Minimum 200 coins required for withdrawal"}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Request Withdrawal"
                )}
              </motion.button>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default WithDrawals;
