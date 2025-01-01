import { Outlet } from "react-router-dom"
import CrowdspaceLightIcon from "~assets/crowdspace-logo-light-theme.svg"
import CrowdspaceDarkIcon from "~assets/crowdspace-logo-dark-theme.svg"
import { FC, useContext } from "react"
import { ThemeContext } from "~/context/themeContext"
import { cn } from "@nextui-org/react"

export const AuthLayout: FC = () => {
    const theme = useContext(ThemeContext)?.theme;

    return (
        <>
            <div
                className={`grid grid-cols-1 md:h-screen md:grid-cols-2 h-dvh overflow-hidden bg-app-primary text-app-t-primary bg-[size:6rem_4rem] 
                    ${theme === "light" ?
                        "bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]" :
                        "bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"
                    }`}
            >
                <div className="md:flex flex-col hidden h-full w-full justify-center items-center my-auto">
                    <img src={theme === "dark" ? CrowdspaceDarkIcon : CrowdspaceLightIcon} alt="" className="h-52" draggable="false" />
                </div>
                <div className="flex flex-col h-full w-full justify-center items-center overflow-hidden text-app-t-primary">
                    <Outlet />
                </div>
            </div >
        </>
    )
}