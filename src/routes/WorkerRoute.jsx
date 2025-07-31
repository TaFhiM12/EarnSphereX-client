import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/userUserRole';
import Loading from '../Components/Loading';

const WorkerRoute = ({children}) => {
    const {user , loading} = useAuth(); 
    const {userInfo , isLoading} = useUserRole();
    const location = useLocation();
    
    const role = userInfo?.role;
    
    // console.log(loading , isLoading , 'from worker route');

    if(loading || isLoading){
        return <Loading/>
    }

    if(!user || role !== 'worker'){
        return <Navigate state={ {from : location.pathname}}  to='/forbidden'/>
    }

    return children;
};

export default WorkerRoute;