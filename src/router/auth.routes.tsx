import { RouteObject, Navigate } from "react-router-dom";
import { AuthLayout } from "~components/layouts/authLayout";
import { CreateAccount } from "~components/pages/auth/createAccount";
import { Login } from "~components/pages/auth/login";
import { OtpVerify } from "~components/pages/auth/otpVerify";
import { Signup } from "~components/pages/auth/signup";
import { OpenRoute } from "./guards/openRoute";
import { ForgotPassword } from "~components/pages/auth/forgotPassword";
import { ResetPassword } from "~components/pages/auth/resetPassword";



export const authRouter: RouteObject[] = [
    {
        path: "/auth",
        element: (
            <OpenRoute>
                <AuthLayout>

                </AuthLayout>
            </OpenRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="signup" replace />
            },
            {
                path: "signup",
                element: <Signup />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "create",
                element: <CreateAccount />
            },
            {
                path: "verify",
                element: <OtpVerify />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            }
        ]
    },
    // {
    //     path: "/flow/reset-pwd",
    //     element: <ForgotPassword/>
    // },
]
