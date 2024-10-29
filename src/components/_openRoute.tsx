import { FC, ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '~hooks/useReduxHooks';

type Props = {
    children: ReactNode
}

export const OpenRoute : FC<Props> = ({ children }) => {
    const userLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

    useEffect(() => {

    }, [userLoggedIn])

    return userLoggedIn ?
        <Navigate to="/" replace /> :
        children;
}
