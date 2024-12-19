import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./guards/protectedRoute";

import { HomeLayout } from "~components/layouts/homeLayout";
import { SettingsLayout } from "~components/layouts/settingsLayout";
import Notifications from "~components/pages/settings/notifications";
import { Privacy } from "~components/pages/settings/privacy";
import { Profile } from "~components/pages/settings/profile";
import { Security } from "~components/pages/settings/security";
import ProfilePage from "~components/pages/profile/profile.page";
import { MessagesPage } from "~components/pages/chat/messages.page";
import { SocketEventsMounter } from "~components/socketEventsMounter";


export const privateRouter: RouteObject[] = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <SocketEventsMounter />
                <HomeLayout />
            </ProtectedRoute>
        ),
        children: [
            // {
            //     index: true,
            //     element: <Feed/>,
            // },
            {
                path: "profile/:username",
                element: <ProfilePage />,
            },
            {
                path: "messages/:chat_id?",
                element: <MessagesPage />
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
