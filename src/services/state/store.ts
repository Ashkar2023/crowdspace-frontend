import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const _UserReducer = persistReducer({
    key: "user",
    storage,
    stateReconciler: hardSet
}, userReducer)


const store = configureStore({
    reducer: {
        user: _UserReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
            }
        })
});

export const persistor = persistStore(store);
export default store;

