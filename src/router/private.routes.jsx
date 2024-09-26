import { ProtectedRoute } from "../components/protectedRoute";
import { HomeLayout } from "../layouts/homeLayout";

/** @type {import("react-router-dom").RouteObject[]} */
export const privateRouter = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <HomeLayout>
                    
                </HomeLayout>
            </ProtectedRoute>
        ),
        // children: [
        //     // {
        //     //     index: true,
        //     //     element: ,
        //     // },
        // ]
    }
]
