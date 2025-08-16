import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { User, CalendarDays, DollarSign, Users } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { usePageTitle } from "../../hooks/usePageTitle";

const TaskList = () => {
  usePageTitle("Available Tasks", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });

  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const limit = 6; // Items per page

  const { data: taskData = {}, isLoading } = useQuery({
    queryKey: ["tasks", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const { tasks = [], totalTasks = 0, totalPages = 1, currentPage = 1 } = taskData;

  if (isLoading)
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg text-emerald-500"></span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="card bg-white shadow-lg rounded-lg overflow-hidden border border-teal-100 flex flex-col h-full"
          >
            <figure>
              <img
                src={task.task_image_url}
                alt={task.task_title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Task+Image';
                }}
              />
            </figure>
            <div className="card-body p-6 flex flex-col flex-grow">
              <h2 className="card-title text-xl font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
                {task.task_title}
              </h2>

              <div className="space-y-3 mt-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-500" />
                  <span>Buyer: {task.buyer_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-teal-500" />
                  <span>Complete by: {new Date(task.completion_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-500" />
                  <span>Pay: {task.payable_amount} coins</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  <span>Workers needed: {task.required_workers}</span>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <div className="card-actions justify-end">
                  <Link
                    to={`/dashboard/task-details/${task._id}`}
                    className="btn btn-sm bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No available tasks at the moment. Please check back later.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalTasks > limit && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="join-item btn btn-sm"
            >
              «
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show limited page numbers with current page in middle
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`join-item btn btn-sm ${page === pageNum ? 'btn-active bg-teal-500 text-white' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
              disabled={page === totalPages}
              className="join-item btn btn-sm"
            >
              »
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-2 text-sm text-gray-500">
        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalTasks)} of {totalTasks} tasks
      </div>
    </div>
  );
};

export default TaskList;