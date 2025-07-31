import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { Pencil, Trash2, FileText } from "lucide-react";
import Loading from "../../Components/Loading";
import { usePageTitle } from "../../hooks/usePageTitle";

const MyTask = () => {
  usePageTitle("My Tasks", {
    suffix: " | EarnSphereX",
    maxLength: 60
  });
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);


  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${user.email}`);
      return res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await axiosSecure.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: async (data, taskId) => {
      const deletedTask = tasks.find((task) => task._id === taskId);
      const res = await axiosSecure.get(`/pendingTasksCount?email=${user.email}`);
      const pendingTasksCount = res.data.count;
      
      const refundAmount = deletedTask.payable_amount * (deletedTask.required_workers + pendingTasksCount);
      const response = await axiosSecure.patch(`/users/coins/${user.email}`, {
        refundAmount: refundAmount,
      });
      if (response.data.message === "User coins updated successfully") {
        Swal.fire({
          title: "Deleted!",
          text: `Task deleted. ${refundAmount} coins refunded.`,
          icon: "success",
          confirmButtonColor: "#0d9488",
        });
      }
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const res = await axiosSecure.patch(
        `/tasks/${updatedTask._id}`,
        updatedTask
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Task updated successfully",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });
      queryClient.invalidateQueries(["tasks", user?.email]);
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update task",
        icon: "error",
      });
    },
  });

  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedTask = {
      ...selectedTask,
      task_title: form.taskTitle.value,
      task_detail: form.taskDetail.value,
      submission_info: form.submissionInfo.value,
    };
    updateTaskMutation.mutate(updatedTask);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4">
      
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-teal-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new task
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
          <table className="table w-full">
            <thead className="">
              <tr className="bg-teal-50 text-teal-700">
                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                  Details
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                  Workers
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider ">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider ">
                  Deadline
                </th>

                <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                    {task.task_title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500  whitespace-wrap">
                    {task.task_detail}
                  </td>
                  
                  <td className="px-6 py-4 text-center whitespace-wrap text-sm text-gray-500">
                    {task.required_workers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {task.payable_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {new Date(task.completion_date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleUpdate(task)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Task Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  <FiEdit className="inline mr-2 text-teal-600" />
                  Update Task
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      name="taskTitle"
                      defaultValue={selectedTask.task_title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Description
                    </label>
                    <textarea
                      name="taskDetail"
                      defaultValue={selectedTask.task_detail}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submission Info
                    </label>
                    <input
                      type="text"
                      name="submissionInfo"
                      defaultValue={selectedTask.submission_info}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    disabled={updateTaskMutation.isLoading}
                  >
                    {updateTaskMutation.isLoading
                      ? "Updating..."
                      : "Update Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTask;
