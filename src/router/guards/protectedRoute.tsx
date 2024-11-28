import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '~hooks/useReduxHooks';

type Props = {
    children: ReactNode
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn); //TODO-add email check when possible

    return isLoggedIn ? children : <Navigate to="/auth/login" replace />
}