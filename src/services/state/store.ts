import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import appReducer from "./app.slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const _UserReducer = persistReducer({
    key: "user",
    storage,
    stateReconciler: hardSet
}, userReducer)

const _AppReducer = persistReducer({
    key:"app",
    storage,
    stateReconciler:hardSet
}, appReducer)

const store = configureStore({
    reducer: {
        user: _UserReducer,
        app: _AppReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
            }
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type storeDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;

