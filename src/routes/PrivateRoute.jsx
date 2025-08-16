import React from 'react';
import Loading from '../Components/Loading';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user , loading} = useAuth()
    const location = useLocation();

    if(loading) {
        return <Loading/>
    }

    if(!user){
        return <Navigate state={{from: location.pathname}} to='/auth/login' replace/>
    }
    return children;
};

export default PrivateRoute;