import React from 'react';
import useUserRole from '../hooks/userUserRole';
import BuyerDashBoard from '../pages/BuyerDashboard/BuyerDashBoard';
import AdminDashboard from '../pages/AdminDashboard.jsx/AdminDashboard';
import WorkerDashboard from '../pages/WorkerDashboard/WorkerDashboard';
import BuyerRoute from '../routes/BuyerRoute';
import AdminRoute from '../routes/AdminRoute';
import WorkerRoute from '../routes/WorkerRoute';
import Forbidden from '../pages/Forbidden/Forbidden';

const Dashboard = () => {
    const { userInfo } = useUserRole();
    const role = userInfo?.role;

    if( role === 'buyer' ) {
        return <BuyerRoute>
            <BuyerDashBoard />
        </BuyerRoute>
    }
    else if( role === 'admin' ) {
        return <AdminRoute>
            <AdminDashboard />
        </AdminRoute>
    }
    else if(role === 'worker') {
        return <WorkerRoute>
            <WorkerDashboard />
        </WorkerRoute>
    }
    else {
        return <Forbidden />;
    }
    // return (
    //     <div>
    //         {role === 'buyer' && <BuyerDashBoard />}
    //         {role === 'admin' && <AdminDashboard />}
    //         {role === 'worker' && <WorkerDashboard />}
    //     </div>
    // );
};

export default Dashboard;