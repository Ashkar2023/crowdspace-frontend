import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.routes";
import { privateRouter } from "./private.routes";
import { LuAlertTriangle } from "react-icons/lu";

export default createBrowserRouter([
    ...privateRouter,
    ...authRouter,
    {
        path: "*",
        element: (
            <div className="h-screen grid place-items-center">
                <h1 className="text-4xl flex gap-2 border rounded-lg p-4 border-red-600">
                    <LuAlertTriangle className="self-center" color="gold"/>
                    404 NOT FOUND
                </h1>
            </div>
        )
    }
])