import { Outlet } from "react-router-dom"
import { SettingsNav } from "~components/settingsBar"
import { FC } from "react"
import Navbar from "~components/navbar"

export const SettingsLayout: FC = () => {
    return (
        <div className="md:grid md:grid-cols-[3fr_9fr] min-h-screen">
            <Navbar
                togglePostModal={() => { }} //Void intentionally as the navbar requires this field
                postDisabled={true}
            />
            <div className="grid grid-flow-col grid-cols-[2fr_8fr] min-h-screen w-full pb-14">
                <div className="p-4 border-x-2">
                    <SettingsNav />
                </div>
                <div className="p-6 max-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
