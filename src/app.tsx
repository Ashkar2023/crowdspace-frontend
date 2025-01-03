import { RouterProvider } from 'react-router-dom';
import AppRouter from "./router";
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import store, { persistor } from './services/state/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
// import { userApiProtected } from './services/api/user.api';
// import { clearUser } from '~services/state/user.slice';
// import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '~hooks/useReduxHooks';
import { ThemeProvider } from './context/themeProvider';
import { SocketContextProvider } from './context/socketProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatContextProvider } from './context/chatProvider';

export default function App() {

    return (
        <NextUIProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={new QueryClient}>
                        <ThemeProvider>
                            {/* research and change this(GoogleAuthProvider) into the auth routes */}
                            <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
                                <Toaster position='top-center' />

                                <SocketContextProvider>
                                    <ChatContextProvider>

                                        <AppWrapper />

                                    </ChatContextProvider>
                                </SocketContextProvider>
                            
                            </GoogleOAuthProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </NextUIProvider>
    )
}


function AppWrapper() {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

    useEffect(() => { //change this to the App component
        if (isLoggedIn) {
            // (async function () { // THIS is not needed as it calls whenever the page refreshes, should only run on the initial page window load
            //     try {
            //         const response = await userApiProtected.get("/auth/token-refresh");
            //         //Logic should check is token is valid
            //     } catch (error) {
            //         if (error instanceof AxiosError) {
            //             console.log("From App.jsx", error.message)
            //             if (error.response?.data.error === "invalid_refresh") {
            //                 dispatch(clearUser());
            //             }
            //         }
            //     }
            // })()
        }

    }, [])

    return <RouterProvider router={AppRouter} />
}
