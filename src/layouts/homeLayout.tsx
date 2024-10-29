import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import { FC } from "react"



export const HomeLayout: FC = () => {

    return (
        <div className="md:grid md:grid-cols-[3fr_9fr] min-h-screen bg-app-primary text-app-t-primary">
            <Navbar />
            <div className="flex flex-col items-center mx-32 bg-fuchsia-700">
                <Outlet />
            </div>
        </div>
    )
}
