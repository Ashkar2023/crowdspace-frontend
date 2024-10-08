import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); //TODO-add email check when possible


    useEffect(() => {
        console.log("isLoggedIn :", isLoggedIn)

    }, [isLoggedIn])

    return isLoggedIn ? children : <Navigate to="/auth/login" replace />
}