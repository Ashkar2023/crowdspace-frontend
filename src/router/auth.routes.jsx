import { Signup } from "../components/signup"
import { Login } from "../components/login"
import { CreateAccount } from "../components/createAccount"
import { AuthLayout } from "../layouts/authLayout"
import { OtpVerify } from "../components/otpVerify"
import { Navigate } from "react-router-dom"



/** @type {import("react-router-dom").RouteObject[]} */
export const authRouter = [
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                index:true,
                element:<Navigate to="signup" replace/>
            },
            {
                path:"signup",
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
                path:"verify",
                element: <OtpVerify/>
            }
        ]
    },
    // {
    //     path: "/login",
    //     element: <AuthLayout><Login /></AuthLayout>
    // },
    // {
    //     path: "/signup",
    //     element: <AuthLayout><Signup /></AuthLayout>
    // },
]
