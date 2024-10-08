import { Avatar, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosProtected } from "../../services/api/axios-http";
import { LuLoader, LuPencilLine, LuXCircle } from "react-icons/lu";
import { debounce } from "../../utils/debounce";
import { updateUserProfile } from "../../services/store/user.slice";
import toast from "react-hot-toast";

export const Profile = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uDisabled, setUDisabled] = useState(true);

    const [selectedGender, setSelectedGender] = useState(null);
    const [linkInvalid, setLinkInvalid] = useState(false);
    const [settingsState, SDispatch] = useReducer(settingsReducer, {
        username: userState.username,
        bio: userState.bio || "",
        gender: selectedGender,
        links: []
    });

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
            default:
                throw new Error("Unknown action");
        }
    }

    const bioDispatch = (e) => {
        SDispatch({ type: "update-bio", value: e.target.value })
    };
    const debouncedBioDispatch = debounce(bioDispatch, 500);

    useEffect(() => {// intial gender
        if (userState.gender) {
            setSelectedGender(userState.gender);
        }

        if (userState.links.length !== 0) {
            SDispatch({ type: "hydrate-links", value: userState.links })
        }
    }, [])

    const handleSubmit = async (e) => {

        try {
            setIsSubmitting(true);
            const { data } = await axiosProtected.patch("/settings/profile", settingsState);

            toast.success(data.message, {
                position: "top-right",
                duration: 1700,
                style: {
                    marginRight: "20px"
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#000"
                }
            })

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
                                defaultValue={userState.username}
                                isDisabled={uDisabled}
                                variant="flat"
                                classNames={{
                                    inputWrapper: ["rounded-r-none"],
                                }}
                                onBlur={e=> setUDisabled(true)}
                                id="username">
                            </Input>
                            <Button
                                radius="none"
                                color="primary"
                                variant="flat"
                                className="rounded-r-xl"
                                onClick={e => {
                                    if (uDisabled) {
                                        setUDisabled(false)
                                    } else {

                                    }
                                }}
                            >
                                {
                                    uDisabled ?
                                        [<LuPencilLine />, "Edit"] :
                                        "Update"
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
                                SDispatch({ type: "update-gender", value: e.target.value })
                            }}
                            aria-label="select gender"
                        >
                            <SelectItem key="M">Male</SelectItem>
                            <SelectItem key="F">Female</SelectItem>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-xl rounded-t-2xl bg-gray-400">
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
                                SDispatch({ type: "add-link", value: e.target.value })
                            }
                        }}
                    />
                    <div className={`${settingsState.links.length ? "p-2 pt-0" : ""} 
                        max-h-24 overflow-y-auto text-white text-sm`}>
                        {settingsState.links.map((value, index) => (
                            <p className="flex" key={value}>
                                {value}
                                <LuXCircle className="self-center ms-1 cursor-pointer"
                                    onClick={e => {
                                        SDispatch({ type: "remove-link", index })
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
                        debouncedBioDispatch(e)
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