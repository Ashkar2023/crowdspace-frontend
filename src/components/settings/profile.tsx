import { Avatar, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userApiProtected, userApiPublic } from "../../services/api/axios-http";
import { LuBan, LuCheckCircle, LuLoader, LuPencilLine, LuSave, LuX, LuXCircle } from "react-icons/lu";
import { debounce } from "../../utils/debounce";
import { setStoreUsername, updateUserProfile } from "../../services/state/user.slice";
import toast from "react-hot-toast";

export const Profile = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uDisabled, setUDisabled] = useState(true);

    const [username, setUsername] = useState(userState.username);
    const [usernameAvailable, setUsernameAvailable] = useState(undefined);

    const [selectedGender, setSelectedGender] = useState(null);
    const [linkInvalid, setLinkInvalid] = useState(false);
    const [settingsState, settingDispatch] = useReducer(settingsReducer, {
        username: userState.username,
        bio: userState.bio || "",
        gender: selectedGender,
        links: []
    });

    const showToast = (message, type) => {
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

    function settingsReducer(state, action) {
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
                    links: state.links.filter((v, index) => index !== action.index)
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

    const checkUsernameAvailable = async (value) => {
        if (value === userState.username) {
            setUsernameAvailable(false);
            return;
        } else if (value === "") return;

        setUsernameAvailable("LOADING");

        try {
            const { data } = await userApiPublic.post("/auth/check-username", { username: value });
            if (data.success) {
                setUsernameAvailable(true);
            }
        } catch (error) {
            console.log(error.message)
            if (error.response.status === 409) {
                setUsernameAvailable(false);
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
                username: username.toLowerCase()
            })

            dispatch(setStoreUsername({ username: data.body.username }))
            settingDispatch({ type: "update-username", value: data.body.username })

            showToast(data.message, "success")
            setUDisabled(true)
            setUsernameAvailable(undefined);

        } catch (error) {
            showToast(error.response.data.message, "error")
        }
    }

    const bioDispatch = (e) => {
        settingDispatch({ type: "update-bio", value: e.target.value })
    };
    const deb_bioDispatch = debounce(bioDispatch, 500);

    useEffect(() => {// intial gender
        if (userState.gender) {
            setSelectedGender(userState.gender);
        }

        if (userState.links.length !== 0) {
            settingDispatch({ type: "hydrate-links", value: userState.links })
        }
    }, [])


    const handleSubmit = async (e) => {

        try {
            setIsSubmitting(true);
            const { data } = await userApiProtected.patch("/settings/profile", settingsState);

            showToast(data.message, "success")

            if (data.success) {
                dispatch(updateUserProfile(data.body));
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full px-20 max-h-screen pt-10" spellCheck={false}>
            <div className="flex items-center justify-between space-x-4 mb-6">
                <Avatar size="lg"
                    src={userState.avatar}
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

                                isDisabled={uDisabled}
                                variant="flat"
                                classNames={{
                                    inputWrapper: ["rounded-r-none"],
                                    input: ["lowercase"]
                                }}
                                id="username"

                                endContent={
                                    usernameAvailable === undefined ? undefined :
                                        usernameAvailable === "LOADING" ? <LuLoader className='self-center animate-spin' size={20} color='grey' /> :
                                            usernameAvailable === false ?
                                                <LuX className='self-center animate-appearance-in' size={20} color='red' /> :
                                                <LuCheckCircle className='self-center animate-appearance-in' size={20} color='limeGreen' />
                                }
                            >
                            </Input>

                            {/* // cancel button */}
                            {
                                uDisabled ?
                                    null :
                                    <div className="px-2 bg-red-200 cursor-pointer animate-appearance-in"
                                        onClick={e => {
                                            setUsername(userState.username)
                                            setUDisabled(true);
                                            setUsernameAvailable(undefined);
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
                                    if (uDisabled) {
                                        setUDisabled(false)
                                    } else {
                                        updateUsername();
                                    }
                                }}
                            >
                                {
                                    uDisabled ?
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
                            selectedKeys={[selectedGender]}
                            onChange={(e) => {
                                setSelectedGender(e.target.value);
                                settingDispatch({ type: "update-gender", value: e.target.value })
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
                        placeholder="Add links"
                        variant="faded"
                        className=""
                        isClearable={true}
                        description="click Enter to add link"
                        classNames={{
                            description: ["text-gray-700", "self-end", "pe-2"],
                            helperWrapper: ["pb-0.5"]
                        }}
                        onChange={e => setLinkInvalid(false)}
                        isInvalid={linkInvalid}
                        onKeyUp={e => {
                            const regex = new RegExp(/^(https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+)(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/, "gm");

                            if (e.key === "Enter" && e.target.value !== "") {
                                if (settingsState.links.some((v, i) => e.target.value === v)) {
                                    setLinkInvalid(true)
                                    return
                                }

                                if (!regex.test(e.target.value)) {
                                    setLinkInvalid(true)
                                    return
                                }
                                settingDispatch({ type: "add-link", value: e.target.value })
                            }
                        }}
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
                        deb_bioDispatch(e)
                    }}
                    defaultValue={userState.bio}
                />

            </div>

            <div className="flex justify-end">
                <Button
                    color="primary"
                    variant="ghost"
                    className="w-1/4 mt-6"
                    onClick={e => handleSubmit(e)}
                >
                    {isSubmitting ?
                        <LuLoader className='animate-spin' size={18} />
                        : "Update"}
                </Button>
            </div>
        </div>
    )
}