import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/sidebar"



export const HomeLayout = () => {


    return (
        <div className="grid grid-cols-[3fr_9fr] min-h-screen">
            <Sidebar/>
            <div className="flex flex-col items-center mx-32 bg-fuchsia-700">
                <Outlet />
            </div>
        </div>
    )
}
