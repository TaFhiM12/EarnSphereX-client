import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../Components/Loading";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { LuPackageCheck } from "react-icons/lu";
import { usePageTitle } from "../../hooks/usePageTitle";

const PaymentHistory = () => {
  usePageTitle("Payment History", {
    suffix: " | EarnSphereX",
    maxLength: 60
  });
  const { user } = useAuth();
  const email = user?.email;
  const axiosSecure = useAxiosSecure();

  const { data: paymentData = [], isLoading } = useQuery({
    queryKey: ["payments", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (amount) => {
    return amount !== null ? "text-emerald-500" : "text-amber-500";
  };

  const getStatusText = (amount) => {
    return amount !== null ? "Completed" : "Pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" bg-gray-50 p-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center bg-teal-50 px-4  rounded-full">
            <FiDollarSign className="text-teal-600 mr-2" />
            <span className="font-medium text-teal-700">
              {paymentData.length}{" "}
              {paymentData.length === 1 ? "Transaction" : "Transactions"}
            </span>
          </div>
        </div>

        {paymentData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <LuPackageCheck className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No payment history found
            </h3>
            <p className="text-gray-500 mt-1">
              Your transaction records will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
              <table className="table w-full">
                <thead className="">
                  <tr className="bg-teal-50 text-teal-700">
                    <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider hidden sm:table-cell">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentData.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      className="hover:bg-teal-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <FiCreditCard className="h-5 w-5 text-teal-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.transactionId.substring(0, 8)}...
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.paymentId.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900 capitalize">
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.amount !== null
                            ? `$${payment.amount}`
                            : "--"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          {formatDate(payment.paidAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            payment.amount
                          )}`}
                        >
                          <div className="flex items-center">
                            <FiCheckCircle className="mr-1.5 h-4 w-4" />
                            {getStatusText(payment.amount)}
                          </div>
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentHistory;
