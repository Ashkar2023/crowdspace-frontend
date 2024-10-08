import { Switch } from "@nextui-org/react";
import { useSelector } from "react-redux";

export const Privacy = () => {
    const userState = useSelector((state) => state.user);

    return (
        <div className="w-full px-20 max-h-screen pt-10 space-y-2">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 from-65% to-slate-100 p-2 px-4 rounded-xl">
                <label htmlFor="private-account" className="text-sm font-semibold">
                    Private Account
                </label>
                <Switch
                    color="success"
                    id="private-account" />
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 from-65% to-slate-100 p-2 px-4 rounded-xl">
                <label htmlFor="friend-suggestions" className="text-sm font-semibold ">
                    Friend Suggestions in Profiles
                </label>
                <Switch color="success" id="friend-suggestions" isSelected={true} />
            </div>
        </div>
    )
}