import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./guards/protectedRoute";

import { HomeLayout } from "~components/layouts/homeLayout";
import { SettingsLayout } from "~components/layouts/settingsLayout";
import Notifications from "~components/pages/settings/notifications";
import { Privacy } from "~components/pages/settings/privacy";
import { Profile } from "~components/pages/settings/profile";
import { Security } from "~components/pages/settings/security";
import ProfilePage from "~components/pages/home/profile-page/profile.page";


export const privateRouter: RouteObject[] = [
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
            {
                path: "profile/:username",
                element: <ProfilePage />,
            },
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
