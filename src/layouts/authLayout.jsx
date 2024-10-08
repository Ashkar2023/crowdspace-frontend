import { Outlet } from "react-router-dom"
import CrowdspaceIcon from "../assets/crowdspace-logo-light-theme.svg"
import { useEffect, useState } from "react"

export const AuthLayout = () => {

    useEffect(() => {
        console.log("Layout rendered");

        return () => {
            console.log("layout Unmounted")
        }
    }, [])

    return (
        <>
            <div className="grid grid-flow-col grid-cols-2 h-screen overflow-hidden">
                <div className="flex flex-col h-full w-full justify-center items-center my-auto">
                    <img src={CrowdspaceIcon} alt="" className="h-52" />
                </div>
                <div className="flex flex-col h-full w-full justify-center items-center overflow-hidden">
                    <Outlet/>
                </div>
            </div>

        </>
    )
}
