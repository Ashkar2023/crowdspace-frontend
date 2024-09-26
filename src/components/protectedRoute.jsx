import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({children}) => {
    const userLoggedIn = useSelector((state)=>state.user.isLoggedIn); //TODO-add email check when possible
    
    useEffect(()=>{

        if(!userLoggedIn){
            <Navigate to="/auth/signup" replace/>
        }
    },[userLoggedIn])

    return children
}
