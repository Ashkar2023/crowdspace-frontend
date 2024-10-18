import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const OpenRoute = ({ children }) => {
    const userLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(()=>{
        
    },[userLoggedIn])

    return userLoggedIn ?
        <Navigate to="/" replace /> :
        children;
}
