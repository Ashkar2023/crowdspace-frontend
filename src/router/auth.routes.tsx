import { Signup } from "../components/auth/signup"
import { Login } from "../components/auth/login"
import { CreateAccount } from "../components/auth/createAccount"
import { AuthLayout } from "../layouts/authLayout"
import { OtpVerify } from "../components/auth/otpVerify"
import { Navigate, RouteObject } from "react-router-dom"
import { OpenRoute } from "../components/_openRoute"
// import { ForgotPassword } from "../components/auth/forgotPassword"



export const authRouter : RouteObject[] = [
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
            }
        ]
    },
    // {
    //     path: "/flow/reset-pwd",
    //     element: <ForgotPassword/>
    // },
]
