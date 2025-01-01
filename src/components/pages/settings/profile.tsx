
import { Avatar, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { LuBan, LuCheckCircle, LuLoader, LuPencilLine, LuSave, LuX, LuXCircle } from "react-icons/lu";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "~hooks/useReduxHooks";
import { Gender, ProfileReducerAction, ProfileReducerState } from "~types/components/profile-reducer.types";
import { CheckStatus } from "~constants/api.constants";
import { AxiosError } from "axios";
import { userApiProtected, userApiPublic } from "~services/api/user.api";
import { setStoreUsername, updateUserProfile } from "~services/state/user.slice";
import { debounce } from "~utils/debounce";

function settingsReducer(state: ProfileReducerState, action: ProfileReducerAction): ProfileReducerState {
    switch (action.type) {
        case "hydrate-links": {
            const newLinks = action.value;
            return {
                ...state,
                links: [...newLinks]
            }
        }
        case "add-link": {
            const newLinks = state.links;
            newLinks.push(action.value);
            return {
                ...state,
                links: [...newLinks]
            }
        }
        case "remove-link": {
            return {
                ...state,
                links: state.links.filter((v: string, index: number) => index !== action.index)
            }
        }
        case "update-bio": {
            return {
                ...state,
                bio: action.value
            }
        }
        case "update-gender": {
            return {
                ...state,
                gender: action.value
            }
        }
        case "update-username": {
            return {
                ...state,
                username: action.value
            }
        }
        default:
            throw new Error("Unknown action");
    }
}


export const Profile = () => {
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameDisabled, setUsernameDisabled] = useState(true);

    const [usernameAvailable, setUsernameAvailable] = useState<CheckStatus>(CheckStatus.IDLE);
    const [username, setUsername] = useState<string>(userState.username as string);

    const [selectedGender, setSelectedGender] = useState<Gender>(undefined);
    const [linkInvalid, setLinkInvalid] = useState(false);

    // Reducer
    const [settingsState, settingDispatch] = useReducer(settingsReducer, {
        username: userState.username as string,
        bio: userState.bio || "",
        gender: selectedGender,
        links: []
    });

    useEffect(() => {// intial gender
        if (userState.gender) {
            setSelectedGender(userState.gender);
        }

        if (userState.links.length !== 0) {
            settingDispatch({ type: "hydrate-links", value: userState.links })
        }
    }, [])

    const showToast = (message: string, type: 'success' | "error") => {
        toast[type](message, {
            position: "top-center",
            duration: 1700,
            // style: {
            //     marginRight: "20px"
            // },
            iconTheme: {
                primary: "#fff",
                secondary: type === "success" ? "#23BE78" : "#D12335",
            }
        })
    }


    const checkUsernameAvailable = async (value: string) => {
        if (value === userState.username) {
            setUsernameAvailable(CheckStatus.FOUND);
            return;
        } else if (value === "") return;

        setUsernameAvailable(CheckStatus.LOADING);

        try {
            const { data } = await userApiPublic.post("/auth/check-username", { username: value });
            if (data.success) {
                setUsernameAvailable(CheckStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof AxiosError) { //type guarding
                if (error.response?.status === 409) {
                    setUsernameAvailable(CheckStatus.FOUND);
                } else if (error.response?.status === 400) {
                    setUsernameAvailable(CheckStatus.IDLE);
                    toast.error("Username format error",{duration:1000})
                }
            }
        }
    }

    const deb_checkUsernameAvailable = useCallback( // For memoizing debounced function
        debounce(checkUsernameAvailable, 400),
        []
    )

    async function updateUsername() {
        try {
            const { data } = await userApiProtected.patch("/settings/username", {
                username: username.toLowerCase().trim()
            })

            dispatch(setStoreUsername({ username: data.body.username }))
            settingDispatch({ type: "update-username", value: data.body.username })

            showToast(data.message, "success")
            setUsernameDisabled(true)
            setUsernameAvailable(CheckStatus.IDLE);

        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data.message, "error")
            }
        }
    }

    const bioDispatch = (bioValue: string) => {
        settingDispatch({ type: "update-bio", value: bioValue })
    };
    const deb_bioDispatch = debounce(bioDispatch, 500);


    const handleSubmit = async () => {

        try {
            setIsSubmitting(true);
            const { data } = await userApiProtected.patch("/settings/profile", settingsState);

            showToast(data.message, "success");

            if (data.success) {
                dispatch(updateUserProfile(data.body));
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data.message, "success");
            }

            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full px-20 max-h-screen pt-10" spellCheck={false}>
            <div className="flex items-center justify-between space-x-4 mb-6">
                <Avatar size="lg"
                    src={userState.avatar}
                    name={userState.displayname!}
                    showFallback
                    classNames={{
                        base: ["h-20", "w-20"]
                    }}
                />
                <Button
                    size="sm"
                    color="primary"
                    variant="ghost"
                    className=""
                    radius="sm"
                >
                    Change Photo
                </Button>
            </div>

            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-3/5">
                        <label htmlFor="username" className="font-semibold">Username</label>
                        <div className="flex">
                            <Input
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value)
                                    deb_checkUsernameAvailable(e.target.value)
                                }}

                                isDisabled={usernameDisabled}
                                variant="flat"
                                classNames={{
                                    inputWrapper: ["rounded-r-none"],
                                    input: ["lowercase"]
                                }}
                                id="username"

                                endContent={
                                    usernameAvailable === CheckStatus.IDLE ? undefined :
                                        usernameAvailable === CheckStatus.LOADING ? <LuLoader className='self-center animate-spin' size={20} color='grey' /> :
                                            usernameAvailable === CheckStatus.FOUND ?
                                                <LuX className='self-center animate-appearance-in' size={20} color='red' /> :
                                                <LuCheckCircle className='self-center animate-appearance-in' size={20} color='limeGreen' />
                                }
                            >
                            </Input>

                            {/* // cancel button */}
                            {
                                usernameDisabled ?
                                    null :
                                    <div className="px-2 bg-red-200 cursor-pointer animate-appearance-in"
                                        onClick={e => {
                                            setUsername(userState.username as string)
                                            setUsernameDisabled(true);
                                            setUsernameAvailable(CheckStatus.IDLE);
                                        }}
                                    >
                                        <LuBan size={20} color="red" className="self-center h-full" />
                                    </div>
                            }

                            {/* save/Edit button */}
                            <Button
                                radius="none"
                                color="primary"
                                variant="flat"
                                className="rounded-r-xl animate-appearance-in"
                                onClick={e => {
                                    if (usernameDisabled) {
                                        setUsernameDisabled(false)
                                    } else {
                                        updateUsername();
                                    }
                                }}
                            >
                                {
                                    usernameDisabled ?
                                        (
                                            <>
                                                <LuPencilLine />
                                                Edit
                                            </>
                                        ) :
                                        (
                                            <>
                                                <LuSave />
                                                Save
                                            </>
                                        )
                                }
                            </Button>
                        </div>
                    </div>

                    <div className="w-2/5">
                        <label htmlFor="gender" className="font-semibold">Gender</label>
                        <Select
                            isRequired={true}
                            placeholder="Select Gender"
                            selectionMode="single"
                            selectedKeys={selectedGender === undefined ? undefined : [selectedGender]}
                            onChange={(e) => {

                                /* CHANGE selection to correct key prop types from NextUI */
                                setSelectedGender(e.target.value as Gender);
                                settingDispatch({ type: "update-gender", value: e.target.value as Gender })
                            }}
                            aria-label="select gender"
                        >
                            <SelectItem key="M">Male</SelectItem>
                            <SelectItem key="F">Female</SelectItem>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-xl bg-gray-200">
                    <Input
                        id="links"
                        type="url"
                        variant="faded"
                        isClearable={true}
                        description="click Enter to add link"
                        classNames={{
                            description: ["text-gray-700", "self-end", "pe-2"],
                            helperWrapper: ["pb-0.5"],
                        }}
                        onChange={e => setLinkInvalid(false)}
                        isInvalid={linkInvalid}
                        onKeyUp={(e) => {
                            const INPUT = e.target as HTMLInputElement; // type cast for TS to understand
                            const regex = new RegExp(/^(https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+)(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/, "gm");

                            if (e.key === "Enter" && INPUT.value !== "") {
                                if (settingsState.links.some((v, i) => INPUT.value === v)) {
                                    setLinkInvalid(true)
                                    return
                                }

                                if (!regex.test(INPUT.value)) {
                                    setLinkInvalid(true)
                                    return
                                }
                                settingDispatch({ type: "add-link", value: INPUT.value })
                            }
                        }}
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-base font-light">https://</span>
                            </div>
                        }
                    />
                    <div className={`${settingsState.links.length ? "p-2 pt-0" : ""} 
                        max-h-24 overflow-y-auto text-gray-500 text-sm flex flex-wrap`}>
                        {settingsState.links.map((value, index) => (
                            <p className="flex mr-2" key={value}>
                                {value}
                                <LuXCircle className="self-center ms-1 cursor-pointer"
                                    onClick={e => {
                                        settingDispatch({ type: "remove-link", index })
                                    }}
                                />
                            </p>
                        ))}
                    </div>

                </div>

                <Textarea
                    id="bio"
                    placeholder="Add bio"
                    variant="faded"
                    className=""
                    onChange={e => {
                        deb_bioDispatch(e.target.value)
                    }}
                    defaultValue={userState.bio}
                />

            </div>

            <div className="flex justify-end">
                <Button
                    color="primary"
                    variant="ghost"
                    className="w-1/4 mt-6"
                    onPress={e => handleSubmit()}
                >
                    {isSubmitting ?
                        <LuLoader className='animate-spin' size={18} />
                        : "Update"}
                </Button>
            </div>
        </div>
    )
}