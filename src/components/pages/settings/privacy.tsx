import { Switch } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import toast from "react-hot-toast";
import { LuGlobe, LuLock } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "~hooks/useReduxHooks";
import { updatePrivacySetting } from "~services/query/settings.queries";
import { updatePrivacyState } from "~services/state/user.slice";

export const Privacy: FC = () => {
    const { privateAccount } = useAppSelector(state => state.user.configuration!);
    const dispatch = useAppDispatch();

    const { mutate } = useMutation({
        mutationFn: updatePrivacySetting,
        mutationKey: ["updatePrivacyStatus"],
        onSuccess(data, variables, context) {
            dispatch(updatePrivacyState({ state: data.body.privateAccount }));
            toast.success(data.message)
        },
    })

    return (
        <div className="w-full px-20 max-h-screen pt-10 space-y-2">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 from-65% to-slate-100 p-2 px-4 rounded-xl">
                <label htmlFor="private-account" className="text-sm font-semibold">
                    Private Account
                </label>
                <Switch
                    color="success"
                    id="private-account"
                    isSelected={privateAccount}
                    thumbIcon={(iconProps) => {
                        return iconProps.isSelected ? <LuLock className="text-gray-500" /> : <LuGlobe className="text-blue-700" />
                    }}
                    onValueChange={(isSelected) => { mutate(isSelected) }}
                />
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