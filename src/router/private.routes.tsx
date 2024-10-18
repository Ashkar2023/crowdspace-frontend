import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/_protectedRoute";
import { Profile } from "../components/settings/profile";
import { HomeLayout } from "../layouts/homeLayout";
import { SettingsLayout } from "../layouts/settingsLayout";
import { Privacy } from "../components/settings/privacy";
import Notifications from "../components/settings/notifications";
import { Security } from "../components/settings/security";


export const privateRouter = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <HomeLayout>
                </HomeLayout>
            </ProtectedRoute>
        ),
        children: [
            // {
            //     index: true,
            //     element: <></>,
            // },
            // {
            //     path: "profile",
            //     element: <Profile />,
            // },
        ]
    },
    {
        path: "settings",
        element: (
            <ProtectedRoute>
                <SettingsLayout>
                </SettingsLayout>
            </ProtectedRoute>

        ),
        children: [
            {
                index: true,
                element: (<Navigate to="/settings/profile" replace />)
            },
            {
                path: "profile",
                element: (<Profile />)
            },
            {
                path: "privacy",
                element: (<Privacy />)
            },
            {
                path: "notifications",
                element: (<Notifications />)
            },
            {
                path: "security",
                element: (<Security />)
            }
        ]
    }

]
