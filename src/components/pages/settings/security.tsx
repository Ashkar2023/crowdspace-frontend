import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Input } from "@nextui-org/react";
import { FieldValues, useForm } from "react-hook-form";
import { LuKeySquare, LuLoader } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { passwordSchema } from "~schema/passwordSchema";
import { userApiProtected } from "~services/api/user.api";

export const Security = () => {
    const [errorInfo, setErrorInfo] = useState("");
    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    let timeout: number;
    
    useEffect(() => {

        () => {
            clearTimeout(timeout);
        }
    }, [])

    const onSubmit = async (values : FieldValues) => {

        try {
            const { data } = await userApiProtected.patch("/settings/password", {
                newPassword: values.newPassword,
                oldPassword: values.oldPassword
            })

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
        } catch (error) {
            if(error instanceof AxiosError){
                setErrorInfo(error.response?.data.message ?? "Unknown error from reset password onsubmit");

                timeout = setTimeout(() => {
                    setErrorInfo("")
                }, 4000);
            }
        }
    }

    return (
        <div className="w-full px-20 max-h-screen pt-10">
            <div className="space-y-6">
                <div className="flex items-center justify-between py-2 px-4 bg-gradient-to-r from-red-200 to-orange-100  rounded-xl">
                    <span className="font-semibold">Logout of all devices</span>
                    <Button
                        size="sm"
                        color="danger"
                        variant="shadow"
                        className="font-medium"
                    >
                        Start
                    </Button>
                </div>

                <div className="mt-8 w-1/2">
                    <h2 className="flex gap-2 text-xl font-semibold mb-4">
                        Change password
                        <LuKeySquare size={18} className="self-center" />
                    </h2>
                    {errorInfo &&
                        <Chip
                            className='self-center my-2 animate-appearance-in'
                            color='danger'
                            radius="sm"
                            size='sm'
                            variant='flat'
                        >
                            {errorInfo}
                        </Chip>
                    }
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Old Password
                            </label>
                            <Input
                                id="oldPassword"
                                {...register("oldPassword", {
                                    required: "Field required"
                                })}
                                type="password"
                                variant="flat"
                                isInvalid={!!errors.oldPassword}
                                errorMessage={errors.oldPassword?.message}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <Input
                                id="newPassword"
                                {...register("newPassword")}
                                type="password"
                                variant="flat"
                                isInvalid={!!errors.newPassword}
                                errorMessage={errors.newPassword?.message}
                            />
                        </div>
                        <div>
                            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <Input
                                {...register("confirmPassword")}
                                isInvalid={!!errors.confirmPassword}
                                errorMessage={errors.confirmPassword?.message}
                                id="cpassword"
                                type="password"
                                variant="flat"
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                color="primary"
                                type="submit"
                            >
                                {isSubmitting ?
                                    <LuLoader className='animate-spin' size={18} color='white' />
                                    : "Change Password"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}