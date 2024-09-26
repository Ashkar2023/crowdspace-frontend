import { Button } from "@nextui-org/react"
import { Link, Outlet } from "react-router-dom"


export const HomeLayout = () => {
    return (
        <div className="grid grid-cols-[5fr_8fr_7fr] min-h-screen">
            <div className="flex flex-col border-2 border-red-500 items-center h-full">
                <div className="flex flex-col h-full w-full px-auto">
                    <p className="m-4">CROWDSPACE</p>
                    <nav className="flex flex-col flex-grow overflow-hidden">
                        <Link to="/">Home</Link>
                        <Link to="/explore">explore</Link>
                        <Link to="/messages">messages</Link>
                        <Link to="/profile">profile</Link>
                        <Link to="/settings">settings</Link>
                    </nav>
                    <div>
                        <Button color="primary"
                            className="block text-lg align-middle h-10"
                            radius="full"
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-2 border-yellow-500  justify-center items-center">
                <Outlet />
            </div>
            <div className="flex flex-col border-2 border-blue-500  justify-center items-center">
                recommendations
            </div>
        </div>
    )
}
