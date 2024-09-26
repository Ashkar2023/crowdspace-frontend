import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.routes"
import { privateRouter } from "./private.routes"

export default createBrowserRouter([
    ...privateRouter,
    ...authRouter,
    {
        path: "*",
        element: (<h1>404 not found</h1>)
    }
]) 