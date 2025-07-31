import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { 
  FaUsers, 
  FaUserTie, 
  FaCoins, 
  FaMoneyBillWave, 
  FaChartPie,
  FaChartLine
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    usePageTitle('Admin Dashboard', {
        suffix: ' | EarnSphereX',
        maxLength: 60
    });

    const axiosSecure = useAxiosSecure();
    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/stats');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-teal-500"></span>
        </div>
    );

    if (isError) return (
        <div className="flex justify-center items-center h-64 text-red-500">
            Error loading admin dashboard data
        </div>
    );

    // Data for charts
    const userDistributionData = [
        { name: 'Workers', value: stats.totalWorkers || 0 },
        { name: 'Buyers', value: stats.totalBuyers || 0 }
    ];

    const paymentActivityData = [
        { name: 'Payments', count: stats.totalPayments || 0 }
    ];

    const COLORS = ['#10B981', '#3B82F6'];

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
                    icon={<FaUserTie className="w-6 h-6 text-blue-600" />}
                    title="Total Workers"
                    value={stats.totalWorkers || 0}
                    color="bg-blue-50"
                    textColor="text-blue-800"
                />
                <StatCard 
                    icon={<FaUsers className="w-6 h-6 text-teal-600" />}
                    title="Total Buyers"
                    value={stats.totalBuyers || 0}
                    color="bg-teal-50"
                    textColor="text-teal-800"
                />
                <StatCard 
                    icon={<FaCoins className="w-6 h-6 text-amber-600" />}
                    title="Available Coins"
                    value={stats.totalAvailableCoins || 0}
                    color="bg-amber-50"
                    textColor="text-amber-800"
                />
                <StatCard 
                    icon={<FaMoneyBillWave className="w-6 h-6 text-purple-600" />}
                    title="Total Payments"
                    value={stats.totalPayments || 0}
                    color="bg-purple-50"
                    textColor="text-purple-800"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartPie className="mr-2 text-teal-500" /> User Distribution
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {userDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [`${value} users`, 'Count']}
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-500" /> Payment Activity
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={paymentActivityData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Total Payments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* System Overview */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Worker to Buyer Ratio</span>
                            <span className="font-semibold text-teal-700">
                                {stats.totalBuyers > 0 
                                    ? `${(stats.totalWorkers / stats.totalBuyers).toFixed(2)}:1` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Coins per User</span>
                            <span className="font-semibold text-blue-700">
                                {stats.totalWorkers + stats.totalBuyers > 0 
                                    ? `${(stats.totalAvailableCoins / (stats.totalWorkers + stats.totalBuyers)).toFixed(2)}` 
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Payments per Buyer</span>
                            <span className="font-semibold text-purple-700">
                                {stats.totalBuyers > 0 
                                    ? `${(stats.totalPayments / stats.totalBuyers).toFixed(2)}` 
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">System Health</span>
                            <span className="font-semibold text-emerald-700">
                                {stats.totalWorkers > 0 && stats.totalBuyers > 0 ? 'Good' : 'Needs Attention'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;