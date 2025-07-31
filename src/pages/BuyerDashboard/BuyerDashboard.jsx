import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useQuery } from '@tanstack/react-query';
import { 
  FaTasks, 
  FaUserClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMoneyBillWave, 
  FaUsers 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from './../../hooks/useAxiosSecure';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BuyerDashBoard = () => {
    usePageTitle('Buyer Dashboard', {
        suffix: ' | EarnSphereX',
        maxLength: 60
    });

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ['buyer-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks/states/buyer/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-teal-500"></span>
        </div>
    );

    if (isError) return (
        <div className="flex justify-center items-center h-64 text-red-500">
            Error loading dashboard data
        </div>
    );

    // Data for charts
    const taskStatusData = [
        { name: 'Approved', value: stats.approvedCount || 0 },
        { name: 'Pending', value: stats.pendingCount || 0 },
        { name: 'Rejected', value: stats.rejectedCount || 0 },
    ];

    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    const StatCard = ({ icon, title, value, color, textColor }) => {
        return (
            <motion.div 
                whileHover={{ y: -5 }}
                className={`${color} rounded-lg shadow-sm p-6 flex flex-col items-start`}
            >
                <div className="mb-4 p-3 rounded-full bg-white shadow-xs">
                    {icon}
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
                <p className={`${textColor} text-2xl font-bold`}>{value}</p>
            </motion.div>
        );
    };

    return (
        <div className="container mx-auto px-4 pb-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    icon={<FaTasks className="w-6 h-6 text-teal-600" />}
                    title="Total Tasks"
                    value={stats.count || 0}
                    color="bg-teal-50"
                    textColor="text-teal-800"
                />
                <StatCard 
                    icon={<FaUserClock className="w-6 h-6 text-amber-600" />}
                    title="Pending Workers"
                    value={stats.pendingCount || 0}
                    color="bg-amber-50"
                    textColor="text-amber-800"
                />
                <StatCard 
                    icon={<FaUsers className="w-6 h-6 text-blue-600" />}
                    title="Required Workers"
                    value={stats.totalRequiredWorkers || 0}
                    color="bg-blue-50"
                    textColor="text-blue-800"
                />
                <StatCard 
                    icon={<FaCheckCircle className="w-6 h-6 text-emerald-600" />}
                    title="Approved Tasks"
                    value={stats.approvedCount || 0}
                    color="bg-emerald-50"
                    textColor="text-emerald-800"
                />
                <StatCard 
                    icon={<FaTimesCircle className="w-6 h-6 text-red-600" />}
                    title="Rejected Tasks"
                    value={stats.rejectedCount || 0}
                    color="bg-red-50"
                    textColor="text-red-800"
                />
                <StatCard 
                    icon={<FaMoneyBillWave className="w-6 h-6 text-green-600" />}
                    title="Total Paid"
                    value={`$${(stats.totalPayable || 0).toFixed(2)}`}
                    color="bg-green-50"
                    textColor="text-green-800"
                />
                <StatCard 
                    icon={<FaMoneyBillWave className="w-6 h-6 text-purple-600" />}
                    title="Total Budget"
                    value={`$${(stats.totalAmount || 0).toFixed(2)}`}
                    color="bg-purple-50"
                    textColor="text-purple-800"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks Status Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [`${value} tasks`, 'Count']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Budget Utilization</span>
                            <span className="font-semibold text-teal-700">
                                {stats.totalAmount > 0 
                                    ? `${((stats.totalPayable / stats.totalAmount) * 100).toFixed(1)}%` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Approval Rate</span>
                            <span className="font-semibold text-emerald-700">
                                {stats.count > 0 
                                    ? `${((stats.approvedCount / (stats.pendingCount + stats.approvedCount + stats.rejectedCount)) * 100).toFixed(1)}%` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Average Cost per Task</span>
                            <span className="font-semibold text-purple-700">
                                {stats.count > 0 
                                    ? `$${(stats.totalAmount / stats.count).toFixed(2)}` 
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <p className="text-gray-600">Your recent tasks and worker interactions will appear here.</p>
                {/* You can add actual activity feed components here */}
            </motion.div>
        </div>
    );
};

export default BuyerDashBoard;