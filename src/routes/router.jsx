import { createBrowserRouter } from "react-router";
import MainLayout from "../root/MainLayout.jsx/MainLayout";
import Home from "../pages/Home/Home";
import AuthPage from "../pages/Authentication/AuthPage";
import PrivateRoute from './PrivateRoute';
import DashboardLayout from "../root/DashboardLayout.jsx/DashboardLayout";
import AddTask from "../pages/BuyerDashboard/AddTask";
import PurchaseCoins from "../pages/BuyerDashboard/PurchaseCoins";
import MyTask from "../pages/BuyerDashboard/MyTask";
import Payment from "../pages/BuyerDashboard/Payment";
import PaymentHistory from "../pages/BuyerDashboard/PaymentHistory";
import TrackTask from "../pages/BuyerDashboard/TrackTask";
import TaskList from './../pages/WorkerDashboard/TaskList';
import ApprovedTask from './../pages/WorkerDashboard/ApprovedTask';
import MySubmission from './../pages/WorkerDashboard/MySubmission';
import WithDrawals from './../pages/WorkerDashboard/WithDrawals';
import TaskDetails from './../pages/WorkerDashboard/TaskDetails';
import TaskToReview from "../pages/BuyerDashboard/TaskToReview";
import Forbidden from "../pages/Forbidden/Forbidden";
import BuyerRoute from "./BuyerRoute";
import WorkerRoute from "./WorkerRoute";
import AdminRoute from "./AdminRoute";
import ManageTasks from "../pages/AdminDashboard.jsx/ManageTasks";
import ManageUsers from "../pages/AdminDashboard.jsx/ManageUsers";
import WithDrawRequests from './../pages/AdminDashboard.jsx/WithDrawRequests';
import Dashboard from "../Dashboard/Dashboard";
import ErrorPage from "../components/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true , element: <Home/>
      },
      {
        path: 'forbidden',
        element: <Forbidden/>
      }
    ]
  },
  {
    path:'/auth/:id',
    element: <AuthPage/>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout/>
    </PrivateRoute>,
    errorElement : <ErrorPage/>,
    children: [
      {
        path: ':dashboard',
        element: <Dashboard/>,
      },
      {
        path: 'add-task',
        element: <BuyerRoute>
          <AddTask/>
        </BuyerRoute>
      },
      {
        path: 'tasks-to-review',
        element: <BuyerRoute>
          <TaskToReview/>
        </BuyerRoute>
      },
      {
        path: 'purchase-coins',
        element: <BuyerRoute>
          <PurchaseCoins/>
        </BuyerRoute>
      },
      {
        path: 'my-tasks',
        element: <BuyerRoute>
          <MyTask/>
        </BuyerRoute>
      },
      {
        path: 'payment/:id',
        element: <BuyerRoute>
          <Payment/>
        </BuyerRoute>
      },
      {
        path: 'payment-history',
        element: <BuyerRoute>
          <PaymentHistory/>
        </BuyerRoute>
      },
      // {
      //   path: 'track',
      //   element: <BuyerRoute>
      //     <TrackTask/>
      //   </BuyerRoute>
      // },
      {
        path: 'task-list',
        element: <WorkerRoute>
          <TaskList/>
        </WorkerRoute>
      },
      {
        path: 'task-details/:id',
        element: <WorkerRoute>
          <TaskDetails/>
        </WorkerRoute>
      },
      {
        path: 'approved-task',
        element: <WorkerRoute>
          <ApprovedTask/>
        </WorkerRoute>
      },
      {
        path: 'my-submission',
        element: <WorkerRoute>
          <MySubmission/>
        </WorkerRoute>
      },
      {
        path: 'withdrawals',
        element: <WorkerRoute>
          <WithDrawals/>
        </WorkerRoute>
      },
      {
        path: 'manage-tasks',
        element: <AdminRoute>
          <ManageTasks/>
        </AdminRoute>
      },
      {
        path: 'manage-users',
        element: <AdminRoute>
          <ManageUsers/>
        </AdminRoute>
      },
      {
        path: 'withdraw-requests',
        element: <AdminRoute>
          <WithDrawRequests/>
        </AdminRoute>
      },
      // {
      //   path : '*',
      //   element: <ErrorPage/>
      // }
    ]
  },
  {
    path: '*',
    element: <ErrorPage/>,
  }
]);