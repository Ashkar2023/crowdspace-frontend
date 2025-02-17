import { Outlet } from "react-router-dom"
import CrowdspaceLightIcon from "~assets/crowdspace-logo-light-theme.svg"
import CrowdspaceDarkIcon from "~assets/crowdspace-logo-dark-theme.svg"
import { FC, useContext } from "react"
import { ThemeContext } from "~/context/themeContext"
import { Link } from "@nextui-org/react"
import { LuGithub } from "react-icons/lu"
if (import.meta.env.MODE === "dev") {
    import("~/dev.css");
}

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
                {
                    import.meta.env.MODE === "dev" && (
                        <div className="development-warning">
                            <div className="warning-message-container flex-1 bg-red-500 bg-opacity-40 h-full overflow-hidden">
                                <div className="warning-message">
                                    This app is in development. Unexpected bugs or crashes might occur. Any information you save could
                                    be lost during development.
                                </div>
                            </div>
                            <div className="bg-gray-700 h-full px-4 flex items-center">
                                <LuGithub className="m-1"/>
                                <a
                                    href="https://github.com/Ashkar2023/crowdspace"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-300 hover:text-green-200 transition-colors duration-200"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    )
                }

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