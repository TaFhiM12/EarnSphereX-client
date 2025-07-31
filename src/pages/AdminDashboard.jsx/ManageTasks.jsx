import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Trash2,
  ClipboardList,
  User,
  CalendarDays,
  DollarSign,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import Loading from "../../Components/Loading";

const ManageTasks = () => {
  usePageTitle("Manage Tasks", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks");
      return res.data;
    },
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (taskId) => {
      const taskToDelete = tasks.find((task) => task._id === taskId);
      if (!taskToDelete) {
        throw new Error("Task not found");
      }

      const pendingRes = await axiosSecure.get(
        `/pending-submissions/admin?buyerEmail=${taskToDelete.created_by}`
      );
      const pendingSubmissions = pendingRes.data;
      
      const taskPendingSubmissions = pendingSubmissions.filter(
        sub => sub.task_id === taskId
      );
      const pendingCount = taskPendingSubmissions.length;

      const refundAmount = taskToDelete.payable_amount * 
                         (taskToDelete.required_workers + pendingCount);

      await axiosSecure.patch(
        `/users/coins/admin/${taskToDelete.created_by}`,
        { refundAmount }
      );

      const deleteRes = await axiosSecure.delete(`/tasks/admin/${taskId}`);
      
      return {
        ...deleteRes.data,
        refundAmount,
        taskTitle: taskToDelete.task_title
      };
    },
    onSuccess: (data) => {
      Swal.fire({
        title: "Deleted!",
        text: `Task "${data.taskTitle}" deleted. ${data.refundAmount} coins refunded.`,
        icon: "success",
        confirmButtonColor: "#0d9488",
      });
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete task",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    },
  });

  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Delete "${title}"?`,
      text: "This will permanently remove the task and refund coins!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#059669",
      confirmButtonText: "Yes, delete it!",
      background: "#f8fafc",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id);
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">
          Error loading tasks: {error.message}
        </p>
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
              <th>Task</th>
              <th>Created By</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <motion.tr
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td>
                  <div className="flex items-center gap-3">
                    {task.task_image_url && (
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={task.task_image_url}
                            alt={task.task_title}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{task.task_title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {task.task_detail}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    <span>{task.created_by}</span>
                  </div>
                </td>
                <td>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{task.payable_amount} per worker</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>{task.required_workers} workers needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-teal-600" />
                      <span>
                        {new Date(task.completion_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(task._id, task.task_title)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found</p>
        </div>
      )}
    </motion.div>
  );
};

export default ManageTasks;
