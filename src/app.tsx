import './index.css';
import { RouterProvider } from 'react-router-dom';
import AppRouter from "./router";
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import store, { persistor } from './services/state/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { userApiProtected } from './services/api/axios-http';
import { clearUser } from '~services/state/user.slice';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '~hooks/useReduxHooks';

export const App = (): JSX.Element => {

    return (
        <NextUIProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
                        <Toaster position='top-center' />
                        <AppWrapper />
                    </GoogleOAuthProvider>
                </PersistGate>
            </Provider>
        </NextUIProvider>
    )
}


function AppWrapper(): JSX.Element {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            (async function () {
                try {
                    const response = await userApiProtected.get("/auth/token-refresh");
                    //Logic should check is token is valid
                } catch (error) {
                    if (error instanceof AxiosError) {
                        console.log("From App.jsx", error.message)
                        if (error.response?.data.error === "invalid_refresh") {
                            dispatch(clearUser());
                        }
                    }
                }
            })()

        }

    }, [])

    return <RouterProvider router={AppRouter} />
}
