import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  ClipboardList 
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const COLORS = ['#008080', '#10B981', '#EF4444', '#6B7280'];

const WorkerDashboard = () => {
    usePageTitle('Worker Dashboard', {
        suffix: ' | EarnSphereX',
        maxLength: 60
    });

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['workerStats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks/states/worker/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading dashboard data</div>;

    const chartData = [
        { name: 'Pending', value: stats?.pendingTasks || 0 },
        { name: 'Approved', value: stats?.approvedTasks || 0 },
        { name: 'Rejected', value: stats?.rejectedTasks || 0 },
    ];

    const totalTasks = stats?.totalTasks || 0;

    return (
        <div className="container mx-auto px-4 pb-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    icon={<ClipboardList className="w-8 h-8 text-teal-600" />}
                    title="Total Submissions"
                    value={stats?.totalTasks || 0}
                    color="bg-teal-50"
                    textColor="text-teal-800"
                />
                <StatCard 
                    icon={<Clock className="w-8 h-8 text-amber-600" />}
                    title="Pending"
                    value={stats?.pendingTasks || 0}
                    color="bg-amber-50"
                    textColor="text-amber-800"
                />
                <StatCard 
                    icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
                    title="Approved"
                    value={stats?.approvedTasks || 0}
                    color="bg-emerald-50"
                    textColor="text-emerald-800"
                />
                <StatCard 
                    icon={<DollarSign className="w-8 h-8 text-teal-600" />}
                    title="Total Earnings"
                    value={`$${(stats?.totalPayableAmount || 0).toFixed(2)}`}
                    color="bg-teal-50"
                    textColor="text-teal-800"
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks Overview</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartData.map((entry, index) => (
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Approval Rate</span>
                            <span className="font-semibold text-emerald-700">
                                {totalTasks > 0 
                                    ? `${((stats?.approvedTasks / totalTasks) * 100).toFixed(1)}%` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rejection Rate</span>
                            <span className="font-semibold text-red-700">
                                {totalTasks > 0 
                                    ? `${((stats?.rejectedTasks / totalTasks) * 100).toFixed(1)}%` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Average Earnings per Approved Task</span>
                            <span className="font-semibold text-teal-700">
                                {stats?.approvedTasks > 0 
                                    ? `$${(stats?.totalPayableAmount / stats?.approvedTasks).toFixed(2)}` 
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

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

export default WorkerDashboard;