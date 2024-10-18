import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/sidebar"
import { SettingsNav } from "../components/settingsBar"

export const SettingsLayout = () => {
    return (
        <div className="grid grid-cols-[3fr_9fr] min-h-screen">
            <Sidebar />
            <div className="grid grid-flow-col grid-cols-[2fr_8fr] min-h-screen w-full">
                <div className="p-4 border border-x-2">
                    <SettingsNav />
                </div>
                <div className="p-6 max-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
