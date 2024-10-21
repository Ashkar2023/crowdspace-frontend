import { Outlet } from "react-router-dom"
import CrowdspaceIcon from "../assets/crowdspace-logo-light-theme.svg"

export const AuthLayout = () => {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden">
                <div className="md:flex flex-col hidden h-full w-full justify-center items-center my-auto">
                    <img src={CrowdspaceIcon} alt="" className="h-52" />
                </div>
                <div className="flex flex-col h-full w-full justify-center items-center overflow-hidden">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
