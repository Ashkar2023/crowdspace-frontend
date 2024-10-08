import './index.css';
import { RouterProvider } from 'react-router-dom';
import AppRouter from "./router";
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import store, { persistor } from './services/store/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { axiosProtected } from './services/api/axios-http';


export const App = () => {

    useEffect(() => {
        (async function(){
            try{
                const response = await axiosProtected.get("/auth/token-refresh");
            }catch(error){
                console.log("From App.jsx",error.message)
            }

        })()
    })

    return (
        <NextUIProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
                        <Toaster position='top-center' />
                        <RouterProvider router={AppRouter} />
                    </GoogleOAuthProvider>
                </PersistGate>
            </Provider>
        </NextUIProvider>
    )
}
