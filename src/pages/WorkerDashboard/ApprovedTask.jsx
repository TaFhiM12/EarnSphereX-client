import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { usePageTitle } from "../../hooks/usePageTitle";

const ApprovedTask = () => {

  usePageTitle("Approved Tasks", {
    suffix: " | EarnSphereX",
    maxLength: 60
  });

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: approvedTasks, isLoading } = useQuery({
    queryKey: ["approvedTasks", user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/approved-tasks?workerEmail=${user?.email}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

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

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th>Task Title</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Approval Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedTasks?.submissions?.map((task) => (
              <motion.tr
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="font-medium">{task.task_title}</td>
                <td>{task.Buyer_name}</td>
                <td className="gap-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>${task.payable_amount}</span>
                  </div>
                </td>
                <td className=" gap-1">
                    <div className="flex items-center  gap-1">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>{new Date(task.current_date).toLocaleDateString()}</span>
                    </div>
                </td>
                <td>
                  <span className="badge badge-success gap-1 text-white">
                    <CheckCircle className="w-3 h-3" />
                    Approved
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {approvedTasks?.submissions?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No approved tasks found</p>
        </div>
      )}

      {/* Pagination - unchanged from previous implementation */}
      {approvedTasks?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="join-item btn btn-sm bg-white border border-teal-200 hover:bg-teal-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from(
              { length: Math.min(5, approvedTasks.totalPages) },
              (_, i) => {
                let pageNum;
                if (approvedTasks.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= approvedTasks.totalPages - 2) {
                  pageNum = approvedTasks.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`join-item btn btn-sm ${
                      page === pageNum
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-teal-200 hover:bg-teal-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, approvedTasks.totalPages))
              }
              disabled={page === approvedTasks.totalPages}
              className="join-item btn btn-sm bg-white border border-teal-200 hover:bg-teal-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ApprovedTask;
