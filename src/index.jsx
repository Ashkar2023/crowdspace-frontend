import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AppRouter from "./router"
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import store from './services/store';


createRoot(document.getElementById('root')).render(
    <NextUIProvider>
        <Provider store={store}>
            <RouterProvider router={AppRouter} />
        </Provider>
    </NextUIProvider>
);